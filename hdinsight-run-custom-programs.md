---
title: Run Custom Programs - Azure HDInsight | Microsoft Docs
description: ''
services: hdinsight
documentationcenter: ''

tags: azure-portal

---
# Run Custom Programs

Hadoop-based big data systems such as HDInsight enable data processing using a wide range of tools and technologies. This article provides comparisons between the commonly used tools and technologies to help you choose the most appropriate for your own scenarios, then goes into detail on how to run custom map/reduce programs.

The following table shows the main advantages and considerations for each one.

## Tools and technologies
| Query mechanism | Advantages | Considerations |
| --- | --- | --- |
| **Hive using HiveQL** | <ul><li>An excellent solution for batch processing and analysis of large amounts of immutable data, for data summarization, and for ad hoc querying. It uses a familiar SQL-like syntax.</li><li>It can be used to produce persistent tables of data that can be easily partitioned and indexed.</li><li>Multiple external tables and views can be created over the same data.</li><li>It supports a simple data warehouse implementation that provides massive scale out and fault tolerance capabilities for data storage and processing.</li></ul> | <ul><li>It requires the source data to have at least some identifiable structure.</li><li>It is not suitable for real-time queries and row level updates. It is best used for batch jobs over large sets of data.</li><li>It might not be able to carry out some types of complex processing tasks.</li></ul> |
| **Pig using Pig Latin** | <ul><li>An excellent solution for manipulating data as sets, merging and filtering datasets, applying functions to records or groups of records, and for restructuring data by defining columns, by grouping values, or by converting columns to rows.</li><li>It can use a workflow-based approach as a sequence of operations on data.</li></ul> | <ul><li>SQL users may find Pig Latin is less familiar and more difficult to use than HiveQL.</li><li>The default output is usually a text file and so it is more difficult to use with visualization tools such as Excel. Typically you will layer a Hive table over the output.</li></ul> |
| **Custom map/reduce** | <ul><li>It provides full control over the map and reduce phases and execution.</li><li>It allows queries to be optimized to achieve maximum performance from the cluster, or to minimize the load on the servers and the network.</li><li>The components can be written in a range of widely known languages that most developers are likely to be familiar with.</li></ul> | <ul><li>It is more difficult than using Pig or Hive because you must create your own map and reduce components.</li><li>Processes that require the joining of sets of data are more difficult to implement.</li><li>Even though there are test frameworks available, debugging code is more complex than a normal application because they run as a batch job under the control of the Hadoop job scheduler.</li></ul> |
| **HCatalog** | <ul><li>It abstracts the path details of storage, making administration easier and removing the need for users to know where the data is stored.</li><li>It enables notification of events such as data availability, allowing other tools such as Oozie to detect when operations have occurred.</li><li>It exposes a relational view of data, including partitioning by key, and makes the data easy to access.</li></ul> | <ul><li>It supports RCFile, CSV text, JSON text, SequenceFile and ORC file formats by default, but you may need to write a custom SerDe if you use other formats.</li><li>HCatalog is not thread-safe.</li><li>There are some restrictions on the data types for columns when using the HCatalog loader in Pig scripts. See [HCatLoader Data Types](http://cwiki.apache.org/confluence/display/Hive/HCatalog%20LoadStore#HCatalogLoadStore-HCatLoaderDataTypes) in the Apache HCatalog documentation for more details.</li></ul> |
| **Apache Spark** | <ul><li>One execution model for multiple tasks: Apache Spark leverages a common execution model for doing multiple tasks like ETL, batch queries, interactive queries, real-time streaming, machine learning, and graph processing on data stored in Azure Storage.</li><li>In-memory processing for interactive scenarios: Apache Spark persists data in-memory and disk if needed to achieve up to 100x faster queries while processing large datasets in Hadoop. This makes Spark for Azure HDInsight ideal to speed up intensive big data applications.</li><li>Developer friendly: Spark supports a variety of development languages like Java, Python, and Scala APIs to ease development. You can write sophisticated parallel applications with a collection of over 80 operators, allowing developers to rapidly iterate over data.</li></ul> | <ul><li>Does not handle a large number of small files well.</li><li>Requires more compute power compared to some other options, due to in-memory processing. The need for extra RAM could cause Spark solutions to be more costly, depending upon the nature of your data.</li></ul> |

Typically, you will use the simplest of these approaches that can provide the results you require. For example, it may be that you can achieve these results by using just Hive, but for more complex scenarios you may need to use Pig or even write your own map and reduce components. You may also decide, after experimenting with Hive or Pig, that custom map and reduce components can provide better performance by allowing you to fine tune and optimize the processing.

## More about custom map/reduce components
Map/reduce code consists of two separate functions implemented as **map** and **reduce** components. The **map** component is run in parallel on multiple cluster nodes, each node applying it to its own subset of the data. The **reduce** component collates and summarizes the results from all of the map functions (see [Use MapReduce in Hadoop on HDInsight](hdinsight-use-mapreduce.md) for more details on these two components).

In most HDInsight processing scenarios it is simpler and more efficient to use a higher-level abstraction such as Pig or Hive, although you can create custom map and reduce components for use within Hive scripts in order to perform more sophisticated processing.

Custom map/reduce components are typically written in Java. However, Hadoop provides a streaming interface that allows components to be used that are developed in other languages such as C#, F#, Visual Basic, Python, JavaScript, and more.

* See [Develop Java MapReduce programs for Hadoop on HDInsight](hdinsight-develop-deploy-java-mapreduce-linux.md) for a walkthrough on developing custom Java MapReduce programs.
* To see an example using Python, read [Develop Python streaming MapReduce programs for HDInsight](hdinsight-hadoop-streaming-python.md).

You might consider creating your own map and reduce components when:

* You want to process data that is completely unstructured by parsing it and using custom logic in order to obtain structured information from it.
* You want to perform complex tasks that are difficult (or impossible) to express in Pig or Hive without resorting to creating a UDF. For example, you might need to use an external geocoding service to convert latitude and longitude coordinates or IP addresses in the source data to geographical location names.
* You want to reuse your existing .NET, Python, or JavaScript code in map/reduce components. You can do this using the Hadoop streaming interface.

## Uploading and running your custom MapReduce program
The most common MapReduce programs are written in Java and compiled to a jar file. The steps to upload and run your custom MapReduce program are simple.

Once you have developed, compiled, and tested your MapReduce program, execute the following command to upload your jar file to the headnode using the `scp` command:

```bash
scp mycustomprogram.jar USERNAME@CLUSTERNAME-ssh.azurehdinsight.net
```

Replace **USERNAME** with the SSH user account for your cluster. Replace **CLUSTERNAME** with the cluster name. If you used a password to secure the SSH account, you are prompted to enter the password. If you used a
certificate, you may need to use the `-i` parameter to specify the private key file.

Next, connect to the cluster using [SSH](hdinsight-hadoop-linux-use-ssh-unix.md).

```bash
ssh USERNAME@CLUSTERNAME-ssh.azurehdinsight.net
```

From the SSH session, execute your MapReduce program through YARN.

```bash
yarn jar mycustomprogram.jar mynamespace.myclass /example/data/sample.log /example/data/logoutput
```

This command submits the MapReduce job to YARN. The input file is `/example/data/sample.log`, and the output directory is `/example/data/logoutput`. Both the input file and the output file(s) are stored to the default storage for the cluster.

## Next steps

This article introduced the landscape of commonly used tools that can be used to process your data, ending off with detailing how to run custom MapReduce programs. Learn more about the various available data processing tools, and methods to create and run custom programs that use them, by following the links below.

* [Use C# with MapReduce streaming on Hadoop in HDInsight](hdinsight-hadoop-dotnet-csharp-mapreduce-streaming.md)
* [Develop Java MapReduce programs for Hadoop on HDInsight](hdinsight-develop-deploy-java-mapreduce-linux.md)
* [Develop Python streaming MapReduce programs for HDInsight](hdinsight-hadoop-streaming-python.md)
* [Use Azure Toolkit for Eclipse to create Spark applications for an HDInsight cluster](hdinsight-apache-spark-eclipse-tool-plugin.md)
* [Use Python User Defined Functions (UDF) with Hive and Pig in HDInsight](hdinsight-python.md)