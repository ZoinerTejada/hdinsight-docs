---
title: Read and Write Phoenix Data from a Spark cluster - Azure HDInsight | Microsoft Docs
description: ''
services: hdinsight
documentationcenter: ''

tags: azure-portal
keywords: spark, Apache Phoenix
---
# Read and Write Phoenix Data from a Spark cluster

Apache HBase data can be queried either with its low level API of scans, gets and puts or with a SQL syntax using Apache Phoenix. Phoenix is an API for HBase which uses a JDBC driver (rather than Hadoop MapReduce) to extend the HBase key-value store to enable features that make it similiar to a relational database.  These features include adding a SQL query engine, metadata repository and an embedded JDBC driver.  Phoenix was originially developed at Salesforce, and it was subsequently open-sourced as an Apache project.  It is important to note that Phoenix is desinged to work only with HBase data.

Apache Spark can be used as a convenient and performant alternative way to query and modify data stored by HBase. This method of cross-cluster access is enabled by the use of the Spark-HBase Connector (also called the `SHC`). See [Using Spark to Query HBase](hdinsight-using-spark-to-query-hbase.md) for details on this approach.

* **IMPORTANT** As of this writing (June 2017) HDInsight does not support the open source [Apache Spark plugin for Phoenix](https://phoenix.apache.org/phoenix_spark.html). You are advised to use the Spark-HBase connector to support querying HBase from Spark at this time. 

## See Also

* [Using Spark to Query HBase](hdinsight-using-spark-to-query-hbase.md)
* [Spark HBase Connector](https://github.com/hortonworks-spark/shc)
* [Phoenix Spark depenency list](https://mvnrepository.com/artifact/org.apache.phoenix/phoenix-spark/4.9.0-HBase-1.2)
* [Apache Phoenix and HBase Past Present and Future of SQL over HBase](https://www.youtube.com/watch?v=0NmgmeX_HUM)
* [New Features in Apache Phoenix](https://www.youtube.com/watch?v=-qCCMuWYpls)
* [Apache Spark Plugin for Apache Phoenix](https://phoenix.apache.org/phoenix_spark.html)

----


