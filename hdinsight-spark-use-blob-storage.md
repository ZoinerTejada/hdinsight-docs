# Use Spark on HDInsight to process data in Azure Storage blobs

To analyze data using Spark with an HDInsight cluster, you can store the data either in Azure Storage, Azure Data Lake Store, or both. Both storage options enable you to safely delete HDInsight clusters that are used for computation without losing user data.

Hadoop supports a notion of the default file system, which implies a default scheme and authority and can also be used to resolve relative paths. During the creation HDInsight Spark cluster, you can specify a blob container in Azure Storage as the default file system. After cluster creation, you can also attach other blob containers. When processing the data with Spark, the primary difference is in the syntax used to define the path to the container.   

In this article, you learn how to process data stored in Azure Storage blob containers with HDInsight Spark clusters. For more information about creating an HDInsight cluster and to learn how to attach additional Storage Accounts see [Create HDInsight clusters](hdinsight-hadoop-provision-linux-clusters.md).

## Using Azure storage with HDInsight Spark clusters

Azure Storage is a robust, general-purpose storage solution that integrates seamlessly with HDInsight. HDInsight can use a blob container in Azure Storage as the default file system for the cluster. Through a Hadoop distributed file system (HDFS) interface, the full set of components in HDInsight, including Spark, can operate directly on structured or unstructured data stored as blobs in Azure Storage.

> [!WARNING]
> There are several options available when creating an Azure Storage account. Only General-purpose Storage Accounts are supported with HDInsight. 

### HDInsight storage architecture
The following diagram provides an abstract view of the HDInsight storage architecture:

![Hadoop clusters use the HDFS API to access and store structured and unstructured data in Blob storage.](./media/hdinsight-spark-use-blob-storage/HDI.WASB.Arch.png "HDInsight Storage Architecture")

Typically when processing data with Spark in on-premises against data stored in HDFS you would use a fully qualified URI to access the distributed file system:

    hdfs://<namenodehost>/<path>

When using Azure Storage, you no longer have an HDFS cluster namenode to address and so the URI used is different. 

### Address files in Azure storage with Spark
To access data stored in Azure Storage from an HDInsight Spark cluster, you need to instead uses the WASBS scheme (short for Windows Azure Storage Blobs Secure), and build a URI that includes the blob container name, Azure Storage account name and the path to the blob below the container root:

    wasb[s]://<containername>@<accountname>.blob.core.windows.net/<path>

* &lt;containername&gt; identifies the name of the blob container in Azure storage.
* &lt;accountname&gt; identifies the Azure Storage account name. The account name combined with the suffix .blob.core.windows.net creates a fully qualified domain name (FQDN) that uniquely identifies that storage account. 
* &lt;path&gt; is the file or directory HDFS path name. Because containers in Azure storage are simply key-value stores, there is no true hierarchical file system. A slash character ( / ) inside a blob name is interpreted as a directory separator. The path segment identifes either the complete name of the blob or a partial name that leads up to the blob, which is interpreted like a folder path.

The use of the WASBS scheme insures that the HDFS compatible interface to Azure Storage is used instead of the native HDFS interface. It is strongly recommended to use the Secure variant of WASB (WASBS instead of WASB) to guarantee that all data read from Azure Storage is read across a TLS encrypted channel, even when accessing data that lives inside the same region in Azure. In addition, it is possible to create Azure Storage accounts that require TLS access, making the WASBS scheme required before a connection to Azure Storage can be established.

If neither &lt;containername&gt; nor &lt;accountname&gt; has been specified, the default file system is used. To access the files on the default file system, you can use a relative path or an absolute path. 

Let us look at some examples of how to build these paths. Assume you have a Storage Account named "flights". In that account you have a blob container called "delays", and underneath that you have a folder structure by year and month that ultimately has one or more CSV files in it. The hierarchy would appear similar to the following:

    flights.blob.core.windows.net
        delays
            2017
                01
                    delays01.csv
                    delays02.csv
                    delays03.csv
                02  
                    delays01.csv
                    delays02.csv
                03
                    delays01.csv

#### Address a single file
To address a single file, for example delays01.csv underneath 2017/01, you could always use the following syntax to access the data irrespective if it is in the default Storage Account or an additional Storage Account:

    wasbs://delays@flights.blob.core.windows.net/2017/01/delays01.csv

If the Storage Account and container used is the default file system for HDInsight Spark cluster, you could instead use:

    /2017/01/delays01.csv

When addressing files in the default file system in this way, note how the root of the path effectively maps to the blob container, and you do not need to specify Storage Account name or the blob container name.

#### Address multiple files in a folder
To address a folder containing one or more files or folders, for example to read all three CSV files underneath 2017/01, you could always use the following syntax to access the data irrespective if it is in the default Storage Account or an additional Storage Account:

    wasbs://delays@flights.blob.core.windows.net/2017/01/

If the Storage Account used is the default file system for HDInsight Spark cluster, you could instead use:

    /2017/01/

### Creating RDDs from files in Azure Storage blobs
Once you understand how files and folders are addressed from HDInsight to Azure Storage, accessing them to create RDDs using Spark is straightforward. 

Continuing with the previous example of the flight delays data, the following shows how to use Spark's textFile method.

    singleFileOfDelays = sc.textFile("wasbs://delays@flights.blob.core.windows.net/2017/01/delays01.csv")
    allDelaysInFolder = sc.textFile("wasbs://delays@flights.blob.core.windows.net/2017/01/")
    allDelaysIn2017 = sc.textFile("wasbs://delays@flights.blob.core.windows.net/2017/*/")

If we are targeting files on our default file system, then these paths could be shortened as follows:

    singleFileOfDelays = sc.textFile("/2017/01/delays01.csv")
    allDelaysInFolder = sc.textFile("/2017/01/")
    allDelaysIn2017 = sc.textFile("/2017/*/")

With these references in hand, you could proceed to process the data using Spark RDD methods as desired. For example:

    allDelaysIn2017 = sc.textFile("/2017/*/")
    allDelaysIn2017.count()

The above would provide the count of the number of lines across all of the delay CSV files in the 2017 folder.

### Creating DataFrames from files in Azure Storage blobs
To create a DataFrame from the flight delay data, you follow the same pattern for addressing files as was shown previously. 

In the following example, we use the SparkSession object that is avalailable by default as the context variable spark to parse the CSV files, remove the header row present in each CSV file and infer the schema from the file. 
 
    val flightDelays2017 = spark.read.format("com.databricks.spark.csv").
    option("header","true").
    option("inferSchema","true").
    load("/delays/2017/*/")


### Processing DataFrames  
This gives us a DataFrame object we can manipulate. For example, we can use the following to pick out a few of the columns and view the first 20 rows in the DataFrame.

    flightDelays2017.select("Carrier","OriginCityName", "DestCityName", "DepDelay").show()

By way of exmaple, the output of this command yields something like:

    +-------+--------------+---------------+--------+
    |Carrier|OriginCityName|   DestCityName|DepDelay|
    +-------+--------------+---------------+--------+
    |     AA|  New York, NY|Los Angeles, CA|    14.0|
    |     AA|  New York, NY|Los Angeles, CA|    -3.0|
    |     AA|  New York, NY|Los Angeles, CA|    null|
    |     AA|  New York, NY|Los Angeles, CA|    65.0|
    |     AA|  New York, NY|Los Angeles, CA|   110.0|
    |     AA|  New York, NY|Los Angeles, CA|    17.0|
    |     AA|  New York, NY|Los Angeles, CA|    10.0|
    |     AA|  New York, NY|Los Angeles, CA|    23.0|
    |     AA|  New York, NY|Los Angeles, CA|    -1.0|
    |     AA|  New York, NY|Los Angeles, CA|    29.0|
    |     AA|  New York, NY|Los Angeles, CA|    15.0|
    |     AA|  New York, NY|Los Angeles, CA|    -6.0|
    |     AA|  New York, NY|Los Angeles, CA|    -5.0|
    |     AA|  New York, NY|Los Angeles, CA|    -7.0|
    |     AA|  New York, NY|Los Angeles, CA|    -9.0|
    |     AA|  New York, NY|Los Angeles, CA|    -4.0|
    |     AA|  New York, NY|Los Angeles, CA|    -5.0|
    |     AA|  New York, NY|Los Angeles, CA|    -6.0|
    |     AA|  New York, NY|Los Angeles, CA|    -2.0|
    |     AA|  New York, NY|Los Angeles, CA|    -5.0|
    +-------+--------------+---------------+--------+
    only showing top 20 rows

### Querying DataFrames with SQL
With a DataFrame in hand, we can register a temporary table to enable processing using SQL syntax by using the createOrReplaceTempView method on the DataFrame.

    flightDelays2017.createOrReplaceTempView("flightDelays2017")

This creates a temporary view we can query using SQL. The data remains unmoved in Azure Storage and we can query it using SQL by passing the SQL string into the SQL method of the Spark context object.

    val queryResults = spark.sql("SELECT Carrier, AVG(DepDelay) as AverageDelayInMinutes FROM flightDelays2017 GROUP BY Carrier")
    queryResults.show()

    +-------+---------------------+
    |Carrier|AverageDelayInMinutes|
    +-------+---------------------+
    |     UA|   15.537012593200386|
    |     AA|   10.576727124515998|
    |     EV|   20.201003678611126|
    |     B6|    19.65400598856728|
    |     DL|   12.818760862111771|
    |     OO|    9.543563147181166|
    |     F9|   16.710274486275686|
    |     US|    6.330032650275312|
    |     MQ|   13.501807232250101|
    |     HA|   -1.239636082739679|
    |     AS|   1.0873045601476117|
    |     FL|    11.10149446928689|
    |     VX|   11.005969049373618|
    |     WN|   18.496117482081054|
    +-------+---------------------+

### Writing Query Results to Azure Storage  
You can also save a DataFrame back to Azure Storage blobs using same file path syntax you used when reading. For example, if you wanted to save the results of the previous query to Parquet files in Azure Storage, you would run the following:

    queryResults.write.format("parquet").save("/delaySummary/")

The creates a new subfolder named "delaySummary" under the container root that contains the Parquet files generated. 


## Next steps
In this article, you learned how to use HDFS-compatible Azure storage and process the data it contains with Spark running on HDInsight. This allows you to build scalable, long-term, archiving data acquisition solutions and use HDInsight to unlock the information inside the stored structured and unstructured data.

For more information, see:

* [Get started with Azure HDInsight][hdinsight-get-started]
* [Upload data to HDInsight][hdinsight-upload-data]
* [Use Azure Storage Shared Access Signatures to restrict access to data with HDInsight][hdinsight-use-sas]



[hdinsight-use-sas]: hdinsight-storage-sharedaccesssignature-permissions.md
[powershell-install]: /powershell/azureps-cmdlets-docs
[hdinsight-get-started]: hdinsight-hadoop-linux-tutorial-get-started.md
[hdinsight-upload-data]: hdinsight-upload-data.md

