# HDInsight Developer's Guide

This guide is intended to provided a curated set of documentation useful to any developer, data scientist or big data engineer getting started or growing their experience with Azure HDInsight.

The intent of this guide is to package this online format into the format of a digital book. 

The table of contents follows, links to new content will open in the same window, while links to existing content that will soon be merged with this repo will open the Azure Docs.

# Overview
## [What is Azure HDInsight?](https://docs.microsoft.com/azure/hdinsight/hdinsight-hadoop-introduction)
### [Iterative data exploration](hdinsight-iterative-data-exploration.md) 
### [Data Warehouse on demand](hdinsight-data-warehouse-on-demand.md) 
### [ETL at scale](hdinsight-etl-at-scale.md)
### [Streaming at scale](hdinsight-streaming-at-scale-overview.md)
### [Machine learning](hdinsight-machine-learning-overview.md) 
### [Batch & Interactive Processing](hdinsight-achieving-batch-and-interactive-with-hadoop-spark.md)
### [Run Custom Programs](hdinsight-run-custom-programs.md)
### [Upload Data to HDInsight](https://docs.microsoft.com/azure/hdinsight/hdinsight-upload-data)




# Azure HDInsight and Hadoop Architecture
## [HDInsight Architecture](hdinsight-architecture.md)
## [Hadoop Architecture](hdinsight-hadoop-architecture.md)
## [Lifecycle of an HDInsight Cluster](hdinsight-lifecycle-of-an-hdinsight-cluster.md) 
## [High availability model](https://docs.microsoft.com/azure/hdinsight/hdinsight-high-availability-linux.md)
## [Capacity planning](hdinsight-capacity-planning.md)



# Configuring the Cluster
## [Use SSH with HDInsight](https://docs.microsoft.com/azure/hdinsight/hdinsight-hadoop-linux-use-ssh-unix)
## [Use SSH tunneling](https://docs.microsoft.com/azure/hdinsight/hdinsight-linux-ambari-ssh-tunnel)
## [Use HDInsight in a Virtual Network](hdinsight-extend-hadoop-virtual-network.md)
## [Scaling best practices](hdinsight-scaling-best-practices.md)
## [Configuring Hive and Oozie Metadata Storage](hdinsight-using-external-metadata-stores.md)
## Configuring Identity and Access Controls
### [Manage authorized Ambari users](hdinsight-authorize-users-to-ambari.md)
### [Authorize user access to Ranger](https://docs.microsoft.com/azure/hdinsight/hdinsight-domain-joined-manage) 
### [Add ACLs at the file and folder levels](hdinsight-add-acls-at-file-folder-levels.md)
### [Sync users from Azure Active Directory to cluster](hdinsight-sync-aad-users-to-cluster.md)
## [Use on-demand HDInsight clusters from Data Factory](hdinsight-hadoop-create-linux-clusters-adf.md)


# Monitoring and managing the HDInsight cluster
## [Key scenarios to monitor](hdinsight-key-scenarios-to-monitor.md)
## [Monitoring and managing with Ambari](https://docs.microsoft.com/azure/hdinsight/hdinsight-hadoop-manage-ambari) 
## [Monitoring with the Ambari REST API](https://docs.microsoft.com/azure/hdinsight/hdinsight-hadoop-manage-ambari-rest-api)
## [Administering HDInsight using the Azure Portal](hdinsight-administer-use-portal-linux.md)
## [Manage configurations with Ambari](hdinsight-changing-configs-via-ambari.md)
## [Manage cluster logs](hdinsight-log-management.md)
## [Adding storage accounts to a running cluster](https://docs.microsoft.com/azure/hdinsight/hdinsight-hadoop-add-storage)
## [Use script actions to customize cluster setup](https://docs.microsoft.com/azure/hdinsight/hdinsight-hadoop-customize-cluster-linux)
## [Develop script actions](https://docs.microsoft.com/azure/hdinsight/hdinsight-hadoop-script-actions-linux)
## [OS patching for HDInsight cluster](https://docs.microsoft.com/azure/hdinsight/hdinsight-os-patching)



# Developing Hive applications
## [Hive and ETL Overview](hdinsight-using-apache-hive-as-an-etl-tool.md)
## [Connect to Hive with JDBC or ODBC](hdinsight-connect-hive-jdbc-driver.md)
## [Writing Hive applications using Java](https://docs.microsoft.com/azure/hdinsight/hdinsight-hadoop-hive-java-udf)
## [Writing Hive applications using Python](https://docs.microsoft.com/azure/hdinsight/hdinsight-python)
## [Creating user defined functions](https://docs.microsoft.com/azure/hdinsight/hdinsight-hadoop-hive-pig-udf-dotnet-csharp)
## [Process and analyze JSON documents with Hive](hdinsight-using-json-in-hive.md) 
## Hive samples
### [Query Hive using Excel](hdinsight-connect-excel-hive-odbc-driver.md)
### [Analyze stored sensor data using Hive](hdinsight-hive-analyze-sensor-data.md)
### [Analyze stored tweets using beeline and Hive](hdinsight-analyze-twitter-data-linux.md)
### [Analyze flight delay data with Hive](hdinsight-analyze-flight-delay-data-linux.md)
### [Analyze website logs with Hive](https://docs.microsoft.com/azure/hdinsight/hdinsight-hive-analyze-website-log)



# Developing Spark applications
## [Spark Scenarios](hdinsight-spark-scenarios.md)
## [Use Spark with HDInsight](hdinsight-spark-with-hdinsight.md)
## [Use Spark SQL with HDInsight](hdinsight-spark-sql-with-hdinsight.md)
## [Run Spark from the Shell](hdinsight-spark-shell.md) 
## Use Spark with notebooks
### [Use Zeppelin notebooks with Spark](https://docs.microsoft.com/azure/hdinsight/hdinsight-apache-spark-zeppelin-notebook)
### [Use Jupyter notebook with Spark](https://docs.microsoft.com/azure/hdinsight/hdinsight-apache-spark-jupyter-notebook-kernels)
### [Use external packages with Jupyter using cell magic](https://docs.microsoft.com/azure/hdinsight/hdinsight-apache-spark-jupyter-notebook-use-external-packages)
### [Use external packages with Jupyter using script action](https://docs.microsoft.com/azure/hdinsight/hdinsight-apache-spark-python-package-installation)
## Use Spark with IntelliJ
### [Create apps using the Azure Toolkit for IntelliJ](https://docs.microsoft.com/azure/hdinsight/hdinsight-apache-spark-intellij-tool-plugin)
### [Debug jobs remotely with IntelliJ](https://docs.microsoft.com/azure/hdinsight/hdinsight-apache-spark-intellij-tool-plugin-debug-jobs-remotely)
## Spark samples
### [Analyze Application Insights telemetry with Spark](https://docs.microsoft.com/azure/hdinsight/hdinsight-spark-analyze-application-insight-logs)
### [Analyze website logs with Spark SQL](https://docs.microsoft.com/azure/hdinsight/hdinsight-apache-spark-custom-library-website-log-analysis)



# Developing Spark ML applications
## [Creating Spark ML Pipelines](hdinsight-creating-spark-ml-pipelines.md)
## [Creating Spark ML models in notebooks](https://docs.microsoft.com/azure/machine-learning/machine-learning-data-science-process-scala-walkthrough)



#  Deep Learning with Spark
## [Use Caffe for deep learning with Spark](https://docs.microsoft.com/azure/hdinsight/hdinsight-deep-learning-caffe-spark)



# Developing R scripts on HDInsight
## [What is R Server?](https://docs.microsoft.com/azure/hdinsight/hdinsight-hadoop-r-server-overview.md)
## [Selecting a compute context](hdinsight-hadoop-r-server-compute-contexts.md)
## [Analyze data from Azure Storage and Data Lake Store using R](https://docs.microsoft.com/azure/hdinsight/hdinsight-hadoop-r-server-storage.md)
## [Submit jobs from Visual Studio Tools for R](hdinsight-submit-jobs-from-r-tools-for-vs.md)
## [Submit R jobs from R Studio Server](hdinsight-submit-jobs-from-r-studio-server.md)



# Developing Spark Streaming applications
## [What is Spark Streaming (DStreams)?](hdinsight-spark-streaming-overview.md)
## [What is Spark Structured Streaming?](hdinsight-spark-structured-streaming-overview.md)
## [Use Spark DStreams to process events from Kafka](https://docs.microsoft.com/azure/hdinsight/hdinsight-apache-spark-with-kafka)
## [Use Spark DStreams to process events from Event Hubs](https://docs.microsoft.com/azure/hdinsight/hdinsight-apache-spark-eventhub-streaming)
## [Use Spark Structured Streaming to process events from Kafka](https://docs.microsoft.com/azure/hdinsight/hdinsight-apache-kafka-spark-structured-streaming)
## [Use Spark Structured Streaming to process events from Event Hubs](hdinsight-spark-structured-streaming-from-event-hubs.md)
## [Creating highly available Spark Streaming jobs in YARN](hdinsight-spark-streaming-high-availability.md)
## [Creating Spark Streaming jobs with exactly once event processing guarantees](hdinsight-spark-streaming-exactly-once.md)



# Optimizing Spark Performance
## [Optimizing and configuring Spark jobs for performance](hdinsight-spark-perf.md)
## [Configuring Spark settings](hdinsight-spark-settings.md)
## [Choosing between Spark RDD, dataframe and dataset](hdinsight-spark-rdd-vs-dataframe-vs-dataset.md)



# Use HBase
## [What is HBase?](https://docs.microsoft.com/azure/hdinsight/hdinsight-hbase-overview)
## [Understanding the HBase storage options](hdinsight-hbase-storage-options.md)
## [Using the HBase shell](https://docs.microsoft.com/azure/hdinsight/hdinsight-hbase-tutorial-get-started-linux)
## [Using the HBase REST SDK](hdinsight-using-hbase-rest-sdk.md)
## [Configure HBase backup and replication](hdinsight-hbase-backup-replication.md)
## [Using Spark with HBase](hdinsight-using-spark-to-query-hbase.md)
## [Monitor HBase with OMS](hdinsight-hbase-monitoring-with-oms.md)



# Use Phoenix with HBase on HDInsight
## [Phoenix in HDInsight](hdinsight-phoenix-in-hdinsight.md)
## [Get started using Phoenix with SQLLine](hdinsight-hbase-phoenix-squirrel-linux.md)
## [Bulk Loading with Phoenix with psql](hdinsight-phoenix-psql.md)
## [Using Spark with Phoenix](hdinsight-phoenix-read-write-spark.md)
## [Using the Phoenix Query Server REST SDK](hdinsight-using-phoenix-query-server-rest-sdk.md)
## [Phoenix performance monitoring](hdinsight-hbase-phoenix-performance.md)



# Apache Open Source Ecosystem 
## [Install HDInsight apps](hdinsight-apps-install-applications.md)
## [Install and use Dataiku](hdinsight-install-published-app-dataiku.md)
## [Install and use Datameer](hdinsight-install-published-app-datameer.md)
## [Install and use H2O](hdinsight-install-published-app-h2o.md)
## [Install and use Streamsets](hdinsight-install-published-app-streamsets.md)
## [Install and use Cask](https://blogs.msdn.microsoft.com/azuredatalake/2016/10/17/using-cask-data-application-platform-on-azure-hdinsight/)



# Advanced Scenarios and Deep Dives
## [Advanced Analytics Deep Dive](hdinsight-deep-dive-advanced-analytics.md)
## [ETL Deep Dive](hdinsight-etl-deep-dive.md)
## [Operationalize Data Pipelines with Oozie](hdinsight-operationalize-data-pipeline.md)



# Troubleshooting
## [Troubleshooting a failed or slow HDInsight cluster](hdinsight-troubleshoot-failed-cluster.md)
## [Debug jobs by analyzing HDInsight logs](hdinsight-debug-jobs.md)
## [Debug Tez jobs using Hive views in Ambari](https://docs.microsoft.com/azure/hdinsight/hdinsight-debug-ambari-tez-view)
## [Common problems FAQ](hdinsight-common-problems-faq.md)
