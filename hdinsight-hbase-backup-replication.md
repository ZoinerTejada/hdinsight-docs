# Setting up Backup and Replication for HBase on HDInsight

HBase supports a few different approaches for guarding against data loss. These approaches are:

* Copying the hbase folder 
* Export then Import
* Copy table
* Snapshots
* Replication

This article covers each of these approaches, providing guidance one when to use which and how to setup that form of backup.

## Copying the hbase folder
HDInsight on HBase stores its data in the default storage selected when provisioning the cluster, which can be either Azure Storage blobs or Azure Data Lake store. In either case, hbase stores all of its data and metadata files under the following path:

    /hbase

If you are using Azure Storage blobs, the external view of this same path is as follows, where the hbase folder sits at the root of the blob container in your Azure Storage account: 

    wasbs://<containername>@<accountname>.blob.core.windows.net/hbase


In Azure Data Lakes Store, the hbase folder simple sits under the root path you specified during cluster provisioning, typically underneath a clusters folder, with a subfolder named after your HDInsight cluster:

    /clusters/<clusterName>/hbase

This folder contains all of the data that hbase has flushed to disk, but it may not contain all off the data HBase is managing in-memory. Therefore, it is important to shut down your cluster first before relying on this folder as an accurate representation of your HBase data. Once you have done so, however, you can use this approach to restore HBase in two different ways. 

1. Without moving the data at all, you can create a new HDInsight instance and have it point to this same storage location. The new instance will therefore be provisioned with all of the existing data.
2. You can use [AzCopy](https://docs.microsoft.com/azure/storage/storage-use-azcopy) (for Azure Storage) or [AdlCopy](https://docs.microsoft.com/azure/data-lake-store/data-lake-store-copy-data-azure-storage-blob) (for Data Lake Store) to copy the hbase folder to another Azure Storage blobs container or Data Lake Store location, and then start a new cluster with that data.

Note that this approach is very course-grained, you have to copy all of the HBase data and have no mechanisms for selecting a subset of Tables or Column Families to copy. 

## Export then Import
In this approach, from the source HDInsight cluster, you use the Export utility (included with HBase) to export data from a source Table that you indicate and the data is written to the default attached storage. You can then copy the export folder to the destination storage location, and run the Import utility in the context of the destination HDInsight cluster. 

To export a table, you need to first SSH into the head node of your source HDInsight cluster and then run the following hbase command providing the name of your table and the location to export to in the default storage.

    hbase org.apache.hadoop.hbase.mapreduce.Export "<tableName>" "/<path>/<to>/<export>"

To import the table, you need to SSH into the head node of your destination HDInsight cluster and then run the following bhase command. 

    hbase org.apache.hadoop.hbase.mapreduce.Import "<tableName>" "/<path>/<to>/<export>"

When specifying the export path, you supply paths that refer to the default storage or to any of the attached storage options, so long as you adjust to use the full path syntax. For example, in Azure Storage, this has the following form:

    wasbs://<containername>@<accountname>.blob.core.windows.net/<path>

In Azure Data Lake Store, the expanded syntax has the form:

    adl://<accountName>.azuredatalakestore.net:443/<path>

As illustrated, this approach offers table level granularity. You can get even more granular with the process by specifying a date range (in the form of start and end times in milliseconds since the Unix epoch) for the rows to include, which allows you to perform the process incrementally:

    hbase org.apache.hadoop.hbase.mapreduce.Export "<tableName>" "/<path>/<to>/<export>" <numberOfVersions> <startTimeInMS> <endTimeInMS>

Note that you have to specify the number of versions of each row to include, so if you want all version in the data range, for <numberOfVersions> specify an arbitrarily large number like 1000 that your data is not likely to exceed.

## Copy Table
The CopyTable utility copies data directly from a source Table in a row by row fashion to an existing destination table with the same schema as the source, where the destination table can be on the same cluster or a different HBase cluster. 

To use CopyTable, you need to SSH into the head node of your HDInsight cluster which will act as the source. Then you run the hbase command with the following syntax:

    hbase org.apache.hadoop.hbase.mapreduce.CopyTable --new.name=<destTableName> --peer.adr=<destinationAddress> <srcTableName> 

If you are using CopyTable to copy to a table on the same cluster, then you can omit the peer switch. Otherwise, you need to provide the destinationAddress, which has the following form:

    <destAddress>  = <ZooKeeperQuorum>:<Port>:<ZnodeParent>

The ```<ZooKeeperQuorum>``` needs to be the comma separated list of ZooKeeper nodes, for example:

    zk0-hdizc2.54o2oqawzlwevlfxgay2500xtg.dx.internal.cloudapp.net,zk4-hdizc2.54o2oqawzlwevlfxgay2500xtg.dx.internal.cloudapp.net,zk3-hdizc2.54o2oqawzlwevlfxgay2500xtg.dx.internal.cloudapp.net

The ```<Port>``` on HDInsight defaults to 2181, and the ```<ZnodeParent>``` is /hbase-unsecure. So the complete <destAddress> using our example qurom would be

    zk0-hdizc2.54o2oqawzlwevlfxgay2500xtg.dx.internal.cloudapp.net,zk4-hdizc2.54o2oqawzlwevlfxgay2500xtg.dx.internal.cloudapp.net,zk3-hdizc2.54o2oqawzlwevlfxgay2500xtg.dx.internal.cloudapp.net:2181:/hbase-unsecure

See the section Manually Collecting the ZooKeeper Quorum List in this article for details on how to retrieve these values for your HDInsight cluster.

The CopyTable utility supports additional parameters that let you specify the timerange of rows to copy, as well as the subset of column families in a table to copy. To view the complete list of parameters supported by CopyTable, run CopyTable without any parameters:

    hbase org.apache.hadoop.hbase.mapreduce.CopyTable

When using CopyTable, it is important to recognize that it places a processing burden on the source table as it does a scan of the content to copy over to the destination table. This may reduce your HBase cluster's performance as it executes.

    [!NOTE]
    For a robust script you can use to automate the copying of data between tables, see hdi_copy_table.sh in the [Azure HBase Utils](https://github.com/Azure/hbase-utils/tree/master/replication) repository on GitHub. 

### Manually Collecting the ZooKeeper Quorum List
When both HDInsight clusters are in the same Virtual Network the above resolution using the internal host names just works. If you are trying to use CopyTable for HDInsight clusters in two separate Virtual Networks (that are connected by a VPN Gateway), then you will need to instead provide the host IP addresses of the Zookeeper nodes in the quorum. The following section describes how to build the ZooKeeper quorum list for either situation.

To acquire the quorum host names you can run the following curl command:

    curl -u admin:<password> -X GET -H "X-Requested-By: ambari" "https://<clusterName>.azurehdinsight.net/api/v1/clusters/<clusterName>/configurations?type=hbase-site&tag=TOPOLOGY_RESOLVED" | grep "hbase.zookeeper.quorum"

The curl command retrieves a JSON document with hbase configuration and the grep call filters the listing to just the line referring to the "hbase.zookeeper.quorom" key and value pair. The output of this command looks similar to the following:

    "hbase.zookeeper.quorum" : "zk0-hdizc2.54o2oqawzlwevlfxgay2500xtg.dx.internal.cloudapp.net,zk4-hdizc2.54o2oqawzlwevlfxgay2500xtg.dx.internal.cloudapp.net,zk3-hdizc2.54o2oqawzlwevlfxgay2500xtg.dx.internal.cloudapp.net"

The value you need is the entire string on the right of the colon. 

If you need to retrieve the IP addresses for these hosts, you can use the following curl command against each host in the previous list.

    curl -u admin:<password> -X GET -H "X-Requested-By: ambari" "https://<clusterName>.azurehdinsight.net/api/v1/clusters/<clusterName>/hosts/<zookeeperHostFullName>" | grep "ip"

Where ```<zookeeperHostFullName>``` is the full DNS name of the ZooKeeper host, such as zk0-hdizc2.54o2oqawzlwevlfxgay2500xtg.dx.internal.cloudapp.net.

The output of the above command contains the IP address for the specified host and looks similar to:

    100    "ip" : "10.0.0.9",

Remember that you will need to collect the IP addresses for all ZooKeeper nodes in your quorum, and then rebuild destAddress as follows:

    <destAddress>  = <Host_1_IP>,<Host_2_IP>,<Host_3_IP>:<Port>:<ZnodeParent>

For example:

    <destAddress> = 10.0.0.9,10.0.0.8,10.0.0.12:2181:/hbase-unsecure



## Snapshots
Snapshots enable you to take a point-in-time backup of data in your HBase datastore. They have minimal overhead and complete within  seconds because a snapshot operation is effectively a metadata operation that captures the names of the files in storage relevant to that point in time. At the time of a snapshot, no actual data is copied. Snapshots take advantage of the immutable nature of the data stored in HDFS (e.g., where updates, deletes and inserts are actually represented as new data) to provide this point in time capability. You can restore the snapshot (a process referred to as cloning) on the same cluster. You can also export a snaphot to another cluster.

To create a snapshot, SSH in to the head node of your HDInsight HBase cluster and run the hbase shell. 

    hbase shell

Within the hbase shell, run the snapshot command providing the of the table to snapshot and a name for the snapshot:

    snapshot '<tableName>', '<snapshotName>'

You can restore a snapshot by name within the hbase shell by first disabling the table, restoring the snapshot and then re-enabling the table:

    disable '<tableName>'
    restore_snapshot '<snapshotName>' 
    enable '<tableName>'

If you wish to restore a snapshot to a new table, you can do with clone_snapshot:  

    clone_snapshot '<snapshotName>', '<newTableName>'

To export a snapshot to HDFS for use by another cluster, first make sure you have created the snapshot as described previously. Then you will need to use the ExportSnapshot utility. This is run from within the SSH session to the head node, but not within the hbase shell:

     hbase org.apache.hadoop.hbase.snapshot.ExportSnapshot -snapshot <snapshotName> -copy-to <hdfsHBaseLocation>

In the command the <hdfsHBaseLocation> specified must refer to any of the storage locations accessible to your source cluster, and should point to the hbase folder used by your destination cluster. For example, if you had a secondary Azure Storage account attached to your source cluster that provides access to the container used by the default storage of the destination cluster, you could use a command similar to the following:

    hbase org.apache.hadoop.hbase.snapshot.ExportSnapshot -snapshot 'Snapshot1' -copy-to 'wasbs://secondcluster@myaccount.blob.core.windows.net/hbase'

Once the snapshot has been exported in this way, you should SSH into the head node of the destination cluster and restore the snapshot using the restore_snapshot command within the hbase shell as previously described.

Note that snapshots provide a complete backup of a table at the time the snapshot command is taken. They do not provide the ability to perform incremental snapshots by windows of time, nor to specify subsets of columns families to include in the snapshot.


## Replication
HBase replication enables you to automatically push transactions from a source cluster to a destination cluster, using an asynchronous mechanism that has minimal overhead on the source cluster. In HDInsight, you can setup replication between clusters where:

* The source and destination clusters are in the same virtual network
* The source and destinations clusters are in different virtual networks connected by a VPN gateway, but both clusters exist in the same geographic location
* The source cluster and destinations clusters are in different virtual networks connected by a VPN gateway and each cluster exists in a different geographic location

Irrespective of the deployment topology, the general setup for replication is as follows:
1. Create the tables and populate data in the source cluster.
2. Create empty destination tables in the destination cluster that follow the same schema as the tables used in the source.
3. Register the destination cluster as a peer to the source cluster.
4. Enable replication on the desired source tables.
5. Copy existing data from the source tables to the destination tables.
6. Replication will automatically copy new data modifications as they happen on the source tables to the destination tables.

Enabling replication in this way on HDInsight is accomplished by applying a Script Action to your running source HDInsight cluster. 

For a step by step walkthru of enabling replication in your cluster, or to experiment with replication on sample clusters provisoned in Virtual Networks using ARM templates, see [Configure HBase replication](https://docs.microsoft.com/azure/hdinsight/hdinsight-hbase-replication). 


## See also
* [Configure HBase replication](https://docs.microsoft.com/azure/hdinsight/hdinsight-hbase-replication)