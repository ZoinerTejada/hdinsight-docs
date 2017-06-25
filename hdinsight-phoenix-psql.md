---
title: Introduction: Bulk Loading with Phoenix via psql in HDInsight  - Azure HDInsight | Microsoft Docs
description: ''
services: hdinsight
documentationcenter: ''

tags: azure-portal
keywords: HBase,phoenix,sql

---
# Bulk Loading with Phoenix via psql in HDInsight

[Apache Phoenix](http://phoenix.apache.org/) is an open source, massively parallel relational database layer over [HBase](hdinsight-hbase-overview). It allows you to use SQL-like queries over HBase. It uses JDBC drivers underneath to enable users to create, delete, alter SQL tables, indexes, views and sequences, upsert rows individually and in bulk. It uses noSQL native compilation instead of using MapReduce to compile queries enabling the creation of low latency applications on top of HBase. To do this, Phoenix adds co-processors to support running client-supplied code in the address space of the server, executing the code colocated with the data. This minimizes client/server data transfer.  In order to work with data using Phoenix in HDInsight, you must first create tables and load data into them.  The next section addresses some of the methods available for you to do this.

## Methods available for performing Bulk Load with Pheonix 

There are multiple ways to get data into HBase including using client API’s, a MapReduce job with TableOutputFormat or inputting the data manually via the HBase shell. Many customers are interested in using Apache Phoenix – a SQL layer over HBase for its ease of use.   Phoenix provides two methods for loading CSV data into Phoenix tables – a client loading tool via the `psql` command line utility, and a MapReduce-based bulk load tool.

The `pql` tool is a single-threaded client loading tool and it is best suited for loading megabytes or, possibly, gigabytes of data. Note that all CSV files to be loaded must have the ‘.csv’ file extension (this is because arbitrary SQL scripts with the ‘.sql’ file extension can also be supplied on the PSQL command line). 

Bulk loading via MapReduce is used for much larger data volumes because it does have the restrictions of `psql` (i.e. single-threaded exectuion).  Bulk loading via Map Reduce is preferred for production scenarios.

Before you start loading data using methods supported by Apache Phoenix you may want to verify that Phoenix is enabled and query timeout settings are as expected in your HDInsight cluster instance.  A quick way to do this is to access your HDInsight cluster Ambari dashboard, click on HBase and then the Configuration tab.  Scroll down on the page to verify that Apache Phoenix is set to `enabled` as in the example screen shot below.

![Apache Phoenix HDInsight Cluster Settings](./media/hdinsight-phoenix-psql/ambari-phoenix.png)

---

### Using psql to bulk load tables

1. Create a new table using standard SQL syntax.  Save your query as a `createCustomersTable.sql` file.  For example:

 ```sql
    CREATE TABLE Customers (
		ID varchar NOT NULL PRIMARY KEY,
		Name varchar,
		Income decimal,
		Age INTEGER,
		Country varchar);
```

2. Copy your CSV file (such as `customers.csv` shown below) into a `/tmp/` directory for loading into your newly-created table.  Use the `hdfs` command (shown below) to copy your CSV file to your desired source location.

```
    1,Samantha,260000.0,18,US
    2,Sam,10000.5,56,US
    3,Anton,550150.0,Norway
    ... 4997 more rows 
```

```bash
    hdfs dfs -copyToLocal /example/data/customers.csv /tmp/
```
3. Create a SQL SELECT query to verify the input data loaded properly using standard SQL syntax.  Save your query as a `listCustomers.sql` file.
Query to execute on the data: You can put any SQL query which you would like to run on the data (let’s say Query.sql). A Sample query:
 ```sql
    SELECT Name, Income from Customers group by Country;
```

4. Bulk Load the data by opening a *new** Hadoop command line window and running the `cd...` and Bulk Load `psql.py` commands shown below, to first change to the execution directory location and to exectute the bulk load using the `psql` tool.
Note: The example shown below assumes that you have copied the `customers.csv` file from our storage acount via `hdfs` to your local temp directory.

```bash
    cd /usr/hdp/current/phoenix-client/bin
    python psql.py ZookeeperQuorum createCustomersTable.sql /tmp/customers.csv listCustomers.sql
```

Tip: To determine the `ZookeeperQuorum` name you'll need to locate the zookeeper quorum string. The zookeeper string is present in file `/etc/hbase/conf/hbase-site.xml`. The name of property is `hbase.zookeeper.quorum`.

 After the `psql` operation has completed, you should see an output on your command window similar to the one below:

```
CSV Upsert complete. 5000 rows upserted
Time: 4.548 sec(s)
```
---

## Using MapReduce to bulk load tables

For higher-throughput loading distributed over the cluster, you can use the MapReduce load tool. This loader first converts all data into HFiles, and then provides the created HFiles to HBase after the HFile creation is complete.

Launch the CSV MapReduce loader by using the hadoop command with the Phoenix client jar, as shown below:
```bash
    hadoop jar phoenix-<version>-client.jar org.apache.phoenix.mapreduce.CsvBulkLoadTool --table CUSTOMERS --input /data/customers.csv
```

Follow these steps to use the MapReduce bulk load command

* Locate your `ZookeeperQuorum` string value. See the previous section (Step 4) to get the location of the value for your cluster instance.
* Create a new table: Write a SQL statement to create table in a file (as with `CreateCustomersTable.sql`) in Step 1 above.
* Verify the schema of your new table, go to `/usr/hdp/current/phoenix-client/bin`and run the command below:

```bash
    python psql.py ZookeeperQuorum
```

* Verify the schema of your table, run !describe inputTable

* Get the path (location) of your input data (or `customers.csv` file): Figure out the path of your input data. The input files may be in your WASB/ADLS storage account. Let’s say the input files are present in inputFolderBulkLoad under the parent directory of your storage account.
* Change to the execution directory for the MapReduce bulk load command, which is at `/usr/hdp/current/phoenix-client/bin`, using the command below:

```bash
    cd /usr/hdp/current/phoenix-client/bin
```

* Bulk Load via the command shown below

```bash
    /usr/hdp/current/phoenix-client$ HADOOP_CLASSPATH=/usr/hdp/current/hbase-client/lib/hbase-protocol.jar:/etc/hbase/conf hadoop jar \
    /usr/hdp/2.4.2.0-258/phoenix/phoenix-4.4.0.2.4.2.0-258-client.jar org.apache.phoenix.mapreduce.CsvBulkLoadTool --table Customers --input \
    /inputFolderBulkLoad/customers.csv –zookeeper ZookeeperQuorum:2181:/hbase-unsecure
```

Note: If you are bulk-loading via MapReduce from ADLS Storage, then you need to locate the root directory for ADLS. In order to find root directory, locate the entry for `hbase.rootdir` in `hbase-site.xml`. 			
In the command below, `adl://hdinsightconf1.azuredatalakestore.net:443/hbase1` is the ADLS root directory.
In order to run bulk load command, cd to `/usr/hdp/current/phoenix-client` and pass ADLS input and output folders as parameters as shown below:

```bash
    $ HADOOP_CLASSPATH=$(hbase mapredcp):/etc/hbase/conf  hadoop jar /usr/hdp/2.4.2.0-258/phoenix/phoenix-4.4.0.2.4.2.0-258-client.jar \
    org.apache.phoenix.mapreduce.CsvBulkLoadTool --table Customers --input \
    adl://hdinsightconf1.azuredatalakestore.net:443/hbase1/data/hbase/temp/input/customers.csv \
        –zookeeper ZookeeperQuorum:2181:/hbase-unsecure --output \
    adl://hdinsightconf1.azuredatalakestore.net:443/hbase1/data/hbase/output1
```


---

## Recommendations

1. Use the same storage medium:
Use same storage medium for both input and output folders. This means that both the input and output folders should be either in WASB or in ADLS.
If you want to transfer data from WASB to ADLS, you can use the `distcp` command. An example command is shown below.

```bash
    hadoop distcp wasb://@.blob.core.windows.net/example/data/gutenberg adl://.azuredatalakestore.net:443/myfolder
```

2. Use larger-size worker nodes:
The map processes of the MapReduce bulk copy produce large amounts of temporary output which fill up the available non-DFS space. Use a larger sized worker node VM if you intend to perform a large amount of bulk loading. The number of worker nodes you allocate to your cluster will directly affect the processing speed of the bulk load activity.

3. Split input files:
Because the bulk load is a storage-intensive operation, splitting your input files into multiple chunks(~10GB each) and then perform bulk load on them will result in better performance.

4. Avoid Region Server hotspots:
HBase sequential write may suffer from region server hotspotting if your row key is monotonically increasing. Salting the row key provides a way to mitigate this problem. Phoenix provides a way to transparently salt the row key with a salting byte for a particular table. See link in the 'next steps' section for more detail.

## Next steps
In this article, you have learned how to use bulk load data using psql and the MapReduce command from Apache Phoenix in HDInsight.  To learn more, see:

* [Bulk Data Loading with Apache Pheonix](http://phoenix.apache.org/bulk_dataload.html)
* [Use Apache Phoenix with Linux-based HBase clusters in HDInsight](hdinsight-hbase-phoenix-squirrel-linux)
* [Salted Tables](https://phoenix.apache.org/salted.html)
* [Phoenix Grammar](http://phoenix.apache.org/language/index.html)

----













