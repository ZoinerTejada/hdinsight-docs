---
title: Introduction: Bulk Loading with Phoenix via psql in HDInsight  - Azure HDInsight | Microsoft Docs
description: ''
services: hdinsight
documentationcenter: ''

tags: azure-portal
keywords: HBase,phoenix,sql

---
# Bulk Loading with Phoenix via psql in HDInsight

[Apache Phoenix](http://phoenix.apache.org/) is an open source, massively parallel relational database layer over [HBase](hdinsight-hbase-overview). It allows you to use SQL-like queries over HBase. It uses JDBC drivers underneath to enable users to create, delete, alter SQL tables, indexes, views and sequences, upsert rows individually and in bulk. It uses noSQL native compilation instead of using MapReduce to compile queries enabling the creation of low latency applications on top of HBase. To do this, Phoenix adds coprocessors to support running client-supplied code in the address space of the server, executing the code colocated with the data. This minimizes client/server data transfer.

## Methods for performing Bulk Load with Pheonix 

Apache HBase is an open Source No SQL Hadoop database, a distributed, scalable, big data store. It provides real-time read/write access to large datasets. HDInsight HBase is offered as a managed cluster that is integrated into the Azure environment. HBase provides many features as a big data store. But in order to use HBase, the customers have to first load their data into HBase.

There are multiple ways to get data into HBase such as – using client API’s, Map Reduce job with TableOutputFormat or inputting the data manually on HBase shell. Many customers are interested in using Apache Phoenix – a SQL layer over HBase for its ease of use.   Phoenix provides two methods for loading CSV data into Phoenix tables – a single-threaded client loading tool via the `psql` command line utility, and a MapReduce-based bulk load tool.

The `pql` tool is a single-threaded client loading tool and is suited for megabytes or, possibly, gigabytes of data. Note that all CSV files to be loaded must have the ‘.csv’ file extension (this is because arbitrary SQL scripts with the ‘.sql’ file extension can also be supplied on the PSQL command line). 

Bulk loading via MapReduce is used for much larger data volumes.  Bulk loading via Map Reduce is preferred for production scenarios.

Tip: Verify that Apache Phoenix is enabled and query timeout settings are as expected before running any bulk insert operations.  A quick way to do this is to access your HDInsight cluster Ambari dashboard, click on HBase and then Configuration.  Scroll down to verify that Apache Phoenix is set to enabled as per the screen shot below.

![Apache Phoenix HDInsight Cluster Settings](./media/hdinsight-phoenix-psql/ambari-phoenix.png)

---

### Using psql to bulk load tables

1. Create a new table using standard SQL DDL.  Save your query as a `createCustomersTable.sql` file.  For example:

 ```sql
    CREATE TABLE Customers (
		ID varchar NOT NULL PRIMARY KEY,
		Name varchar,
		Income decimal,
		Age INTEGER,
		Country varchar);
```

2. Copy your CSV file (such as `customers.csv` shown below) into a /tmp/ directory for loading into the new table.  Use the command below to copy this file to your desired source location.

```
    1,Samantha,260000.0,18,US
    2,Sam,10000.5,56,US
    3,Anton,550150.0,Norway
    ... 4997 more rows 
```

```bash
    hdfs dfs -copyToLocal /example/data/customers.csv /tmp/
```
3. Create a sql query to verify the input data using standard SQL DML.  Save your query as a `listCustomers.sql` file. This file contains the input data for bulk load (let’s say input.csv).
Query to execute on the data: You can put any SQL query which you would like to run on the data (let’s say Query.sql). A Sample query:
 ```sql
    SELECT Name, Income from Customers group by Country;
```

4. Load the data by opening *new** Hadoop command line window and running the `cd...` and Bulk Load `psql.py` commands shown below
Copy the customers.csv file from our storage acount via `hdfs` to our local temp directory.

```bash
    cd /usr/hdp/current/phoenix-client/bin
    python psql.py ZookeeperQuorum createCustomersTable.sql /tmp/customers.csv listCustomers.sql
```

Note: To determine the ZookeeperQuorum name you'll need to locate the zookeeper quorum string. The zookeeper string is present in file `/etc/hbase/conf/hbase-site.xml`. The name of property is `hbase.zookeeper.quorum`.

 Once the PSQL operation is complete, you should have an output on your command window similar to the following:

```
CSV Upsert complete. 5000 rows upserted
Time: 4.548 sec(s)
```
---

## Using MapReduce to bulk load tables

For higher-throughput loading distributed over the cluster, the MapReduce loader can be used. This loader first converts all data into HFiles, and then provides the created HFiles to HBase after the HFile creation is complete.

The CSV MapReduce loader is launched using the hadoop command with the Phoenix client jar, as follows:
```bash
    hadoop jar phoenix-<version>-client.jar org.apache.phoenix.mapreduce.CsvBulkLoadTool --table EXAMPLE --input /data/example.csv
```

Following are the steps to use this method.

* Zookeeper Quorum: Figure out zookeeper quorum string. The zookeeper string is present in file /etc/hbase/conf/hbase-site.xml. The name of property is hbase.zookeeper.quorum.
* Create Table: Put command to create table in a file(let’s say CreateTable.sql) based on the schema of your table.
* Verification of schema of the table, go to /usr/hdp/current/phoenix-client/bin and run following command:

```bash
    python psql.py ZookeeperQuorum
```

Now, in order to check schema of your table, run !describe inputTable

* Input data: Figure out the path of your input data. The input files may be in your WASB/ADLS storage account. Let’s say the input files are present in inputFolderBulkLoad under the parent directory of your storage account.
* Bulk Load command: Go to /usr/hdp/current/phoenix-client/bin and run following command.

```bash
    /usr/hdp/current/phoenix-client$ HADOOP_CLASSPATH=/usr/hdp/current/hbase-client/lib/hbase-protocol.jar:/etc/hbase/conf hadoop jar \
    /usr/hdp/2.4.2.0-258/phoenix/phoenix-4.4.0.2.4.2.0-258-client.jar org.apache.phoenix.mapreduce.CsvBulkLoadTool --table inputTable --input \
    /inputFolderBulkLoad/*.csv –zookeeper ZookeeperQuorum:2181:/hbase-unsecure
```

* Bulk load with ADLS Storage:
If you have an ADLS cluster then following are the changes in the above steps.

* ADLS root directory
Figure out the root directory for ADLS. In order to find root directory, look for hbase.rootdir entry in hbase-site.xml.

### Bulk Load command
 
In order to run bulk load command, please go to /usr/hdp/current/phoenix-client and pass ADLS input and output folders as parameters. Example query.

```bash
    $ HADOOP_CLASSPATH=$(hbase mapredcp):/etc/hbase/conf  hadoop jar /usr/hdp/2.4.2.0-258/phoenix/phoenix-4.4.0.2.4.2.0-258-client.jar \
    org.apache.phoenix.mapreduce.CsvBulkLoadTool --table InputTable --input \
    adl://hdinsightconf1.azuredatalakestore.net:443/hbase1/data/hbase/temp/input/*.csv \
        –zookeeper ZookeeperQuorum:2181:/hbase-unsecure --output \
    adl://hdinsightconf1.azuredatalakestore.net:443/hbase1/data/hbase/output1
```
			
In the above command, adl://hdinsightconf1.azuredatalakestore.net:443/hbase1 is the ADLS root directory.

---

## Recommendations

1. Storage medium:
We recommend to use same storage medium for both input and output folders. It means that both the input and output folders should be either in WASB or in ADLS.
In case you want to transfer data from WASB to ADLS, you can use distcp command. Example:

```bash
    hadoop distcp wasb://@.blob.core.windows.net/example/data/gutenberg adl://.azuredatalakestore.net:443/myfolder
```

2. Cluster configuration:
The map processes of Map Reduce based method produce large amounts of temporary output which fill up the available non-DFS space. Please pick larger worker node VM for large amount of bulk load. The number of worker nodes will directly affect the processing speed.

3. Bulk data input:
As the bulk load is a storage intensive operation, it is recommended to split your input into multiple chunks(~10GB each) and then perform bulk load on them.

4. Avoiding Region Server hotspotting:
HBase sequential write may suffer from region server hotspotting if your row key is monotonically increasing. Salting the row key provides a way to mitigate the problem. Phoenix provides a way to transparently salt the row key with a salting byte for a particular table. Please find more details here.


## Next steps
In this article, you have learned how to use bulk load data using psql from Apache Phoenix in HDInsight.  To learn more, see:

* [Bulk Data Loading with Apache Pheonix](http://phoenix.apache.org/bulk_dataload.html)
* [Use Apache Phoenix with Linux-based HBase clusters in HDInsight](hdinsight-hbase-phoenix-squirrel-linux)
* [Salted Tables](https://phoenix.apache.org/salted.html)
* [Phoenix Grammar](http://phoenix.apache.org/language/index.html)

----













