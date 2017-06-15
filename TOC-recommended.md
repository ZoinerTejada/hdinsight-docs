# Overview   
## [About HDInsight and Hadoop](hdinsight-hadoop-introduction.md)
### [Iterative data exploration](hdinsight-tbd.md) 
> ACTION: MIGRATE. Migrate content for this from P&P site at https://msdn.microsoft.com/en-us/library/dn749842.aspx
### [Data Warehouse on demand](hdinsight-tbd.md) 
> ACTION: MIGRATE. Migrate content for this from P&P site at  
https://msdn.microsoft.com/en-us/library/dn749783.aspx) 
### [ETL at scale](hdinsight-tbd.md)
> ACTION: NEW
### [Streaming at scale](hdinsight-streaming-at-scale-overview.md)
> ACTION: NEW
### [Machine learning](hdinsight-machine-learning-overview.md) 
> ACTION: NEW
### [Hadoop, Spark Programming](hdinsight-tbd.md)
> ACTION: NEW
### [Run Custom Programs](hdinsight-tbd.md)
> ACTION: NEW 

## [Hadoop components on HDInsight](hdinsight-component-versioning.md)
### [R Server](hdinsight-hadoop-r-server-overview.md)
### [Apache Hive](hdinsight-use-hive)
### [Apache Spark](hdinsight-apache-spark-overview.md)
### [HBase](hdinsight-hbase-overview.md)
> ACTION: RETITLE. Change to "Apache HBase"
### [Apache Storm](hdinsight-storm-overview.md)
### [Kafka (Preview)](hdinsight-apache-kafka-introduction.md)
> ACTION: RETITLE. Change to "Apache Kafka (Preview)".
### [Domain-joined HDInsight clusters (Preview)](hdinsight-domain-joined-introduction.md)

## Azure HDInsight and Hadoop Architecture
### [HDInsight Architecture](hdinsight-architecture.md)
> ACTION: NEW
### [Hadoop Architecture](hdinsight-architecture.md)
> ACTION: NEW
### [Lifecycle of an HDInsight Cluster](hdinsight-lifecycle-of-an-hdinsight-cluster.md) 
> ACTION: NEW
### [High availability](hdinsight-high-availability-linux.md)
> ACTION: POINTTO existing article hdinsight-high-availability-linux 
### [Capacity planning](hdinsight-capacity-planning.md)
> ACTION: NEW
## Release notes
### [Recent](hdinsight-release-notes.md)
### [Archive](hdinsight-release-notes-archive.md)

# Get Started
## [Start with Hadoop](hdinsight-hadoop-linux-tutorial-get-started.md)
> ACTION: RETITLE. Change to "Start with Hadoop and Hive".
## [Start with Spark](hdinsight-apache-spark-jupyter-spark-sql.md)
## [Start with R Server](hdinsight-hadoop-r-server-get-started.md)
## [Start with HBase & NoSQL](hdinsight-hbase-tutorial-get-started-linux.md)
## [Start with Storm](hdinsight-apache-storm-tutorial-get-started-linux.md)
## [Start with Interactive Hive (Preview)](hdinsight-hadoop-use-interactive-hive.md)
## [Start with Kafka (Preview)](hdinsight-apache-kafka-get-started.md)
## [Hadoop sandbox](hdinsight-hadoop-emulator-get-started.md)
## [Data Lake Tools with Hortonworks Sandbox](hdinsight-hadoop-emulator-visual-studio.md)
## [Tools for Visual Studio](hdinsight-hadoop-visual-studio-tools-get-started.md)
## [HDInsight storage options](hdinsight-hadoop-use-blob-storage.md)

# How To

## Import and export data
> ACTION: ADD ENTRY. Suggest adding this grouping.
### [Upload data for Hadoop jobs](hdinsight-upload-data.md)
### [Import and export tabular data with Sqoop](hdinsight-use-sqoop.md)
#### [Connect with SSH](hdinsight-use-sqoop-mac-linux.md)
> ACTION: RETITLE to "Run Sqoop using SSH"
#### [Run using cURL](hdinsight-hadoop-use-sqoop-curl.md)
> ACTION: RETITLE to "Run Sqoop using cURL"
#### [Run using .NET SDK](hdinsight-hadoop-use-sqoop-dotnet-sdk.md)
> ACTION: RETITLE to "Run Sqoop using the .NET SDK"
#### [Run using PowerShell](hdinsight-hadoop-use-sqoop-powershell.md)
> ACTION: RETITLE to "Run Sqoop using PowerShell"

## Batch process data

### Use Hadoop for batch processing
#### [Use MapReduce with Hadoop](hdinsight-use-mapreduce.md)
> ACTION: RETITLE to "Use MapReduce with HDInsight"
##### [Use SSH](hdinsight-hadoop-use-mapreduce-ssh.md)
##### [Use cURL](hdinsight-hadoop-use-mapreduce-curl.md)
##### [Use the .NET SDK](hdinsight-hadoop-use-mapreduce-dotnet-sdk)
> ACTION: ADD ENTRY. This entry is missing from the TOC.
##### [Use PowerShell](hdinsight-hadoop-use-mapreduce-powershell.md)
##### [Use Remote Desktop](hdinsight-hadoop-use-mapreduce-remote-desktop.md)
##### [Run the MapReduce samples](hdinsight-hadoop-run-samples-linux.md)

### Use Hive for batch queries
##### [Use Hive with Hadoop](hdinsight-use-hive.md)
> ACTION: RETITLE to "Use Hive with HDInsight"
##### [Use the Hive View](hdinsight-hadoop-use-hive-ambari-view.md)
##### [Use Beeline](hdinsight-hadoop-use-hive-beeline.md)
##### [Use cURL](hdinsight-hadoop-use-hive-curl.md)
##### [Use PowerShell](hdinsight-hadoop-use-hive-powershell.md)
##### [Use .NET SDK](hdinsight-hadoop-use-hive-dotnet-sdk.md)
> ACTION: RETITLE to "Use the .NET SDK"
##### [Use the HDInsight tools for Visual Studio](hdinsight-hadoop-use-hive-visual-studio.md)
> ACTION: RETITLE to "Use the Data Lake Tools for Visual Studio"
##### [Use a Java UDF with Hive](hdinsight-hadoop-hive-java-udf.md)
> ACTION: RETITLE to "Create and deploy a User Defined Function"
##### [Use Remote Desktop](hdinsight-hadoop-use-hive-remote-desktop.md)
##### [Use the Query Console](hdinsight-hadoop-use-hive-query-console.md)

### Use Pig for batch processing
#### [Use Pig with Hadoop](hdinsight-use-pig.md)
> ACTION: RETITLE to "Use Pig with HDInsight"
##### [Use SSH and Pig](hdinsight-hadoop-use-pig-ssh.md)
> ACTION: RETITLE to "Use SSH"
##### [Use PowerShell](hdinsight-hadoop-use-pig-powershell.md)
##### [Use the .NET SDK](hdinsight-hadoop-use-pig-dotnet-sdk.md)
##### [Use cURL](hdinsight-hadoop-use-pig-curl.md)
##### [Use Remote Desktop](hdinsight-hadoop-use-pig-remote-desktop.md)
##### [Use DataFu](hdinsight-hadoop-use-pig-datafu-udf.md)

### Use Spark for batch processing
#### [Use Spark with HDInsight](hdinsight-spark-with-hdinsight.md)
> ACTION: NEW
#### [With Data Lake Store](hdinsight-apache-spark-use-with-data-lake-store.md)
> ACTION: RETITLE. Change to "Use Spark to process data in Data Lake Store"
#### [Use Spark to process data in Azure Storage blobs](hdinsight-tbd.md)
> ACTION: NEW
#### [Remote jobs with Livy](hdinsight-apache-spark-livy-rest-interface.md)
> ACTION: RETITLE: Submit Spark batch jobs using Livy

### Use Spark SQL for batch queries
#### [Use Spark SQL with HDInsight](hdinsight-spark-sql-with-hdinsight.md)
> ACTION: NEW

## Interactively query data

### Use Spark with notebooks
#### [Use Zeppelin notebooks](hdinsight-apache-spark-zeppelin-notebook.md)
> ACTION: RETITLE. Change to "User Zeppelin notebooks with Spark".
#### [Jupyter notebook kernels](hdinsight-apache-spark-jupyter-notebook-kernels.md)
> ACTION: RETITLE. Change to "User Jupyter notebooks with Spark".
#### [Use external packages with Jupyter using cell magic](hdinsight-apache-spark-jupyter-notebook-use-external-packages.md)
#### [Use external packages with Jupyter using script action](hdinsight-apache-spark-python-package-installation.md)
#### [Use a local Jupyter notebook](hdinsight-apache-spark-jupyter-notebook-install-locally.md)

## Process data in real-time

### Use Spark for stream processing
#### [What is Spark Streaming?](hdinsight-spark-streaming-overview.md)
> ACTION: NEW
#### [What is Spark Structured Streaming?](hdinsight-spark-structured-streaming-overview.md)
> ACTION: NEW
#### [Use with Spark](hdinsight-apache-spark-with-kafka.md)
> ACTION: RETITLE. Change to "Use Spark to process events from Kafka"

> ACTION: UPDATE. Update to include coverage of both Spark Streaming and Stuctured Streaming
#### [Process streaming events](hdinsight-apache-spark-eventhub-streaming.md)
> ACTION: RETITLE. Change to "Use Spark to process events from Event Hubs"

> ACTION: UPDATE. Update to include coverage of both Spark Streaming and Stuctured Streaming
#### [Creating highly available Spark Streaming jobs in YARN](hdinsight-tbd.md)
> ACTION: NEW
#### [Creating Spark Streaming jobs with exactly once event processing guarantees](hdinsight-spark-streaming-exactly-once.md)
> ACTION: NEW
#### [Publishing real-time updates from Spark to Power BI](hdinsight-tbd.md)
> ACTION: NEW

## Use BI tools with HDInsight
### [With BI tools](hdinsight-apache-spark-use-bi-tools.md)
> ACTION: RETITLE. Change to "Use Spark from Power BI and Tableau"

## Build data processing pipelines
### Use Azure Data Factory
#### [On-demand clusters](hdinsight-hadoop-create-linux-clusters-adf.md)
> ACTION: RETITLE. Change to "Use on-demand clusters from Data Factory"
### Use Oozie
#### [Use Oozie for workflows](hdinsight-use-oozie-linux-mac.md)
#### [Use time-based Oozie coordinators](hdinsight-use-oozie-coordinator-time.md)


## Perform Machine Learning

### Use R Server
#### [R Server](hdinsight-hadoop-r-server-overview.md)
> ACTION: RETITLE. Change to "What is R server?"
#### [Submit jobs from Visual Studio Tools for R](hdinsight-submit-jobs-from-r-tools-for-vs.md)
> ACTION: NEW
#### [Submit R jobs from R Studio Server](hdinsight-submit-jobs-from-r-studio-server.md)
> ACTION: NEW
#### [Storage options](hdinsight-hadoop-r-server-storage.md)
> ACTION: RETITLE. Change to "Analyze data from Azure Storage and Data Lake Store using R"
#### [Compute contexts](hdinsight-hadoop-r-server-compute-contexts.md)
> ACTION: UPDATE. Add additional guidance on benefits of Spark vs. R Server on Hadoop

> ACTION: RETITLE. Change to "Selecting a compute context"


### Use Spark for Machine Learning
#### [Use Spark for Machine Learning](https://docs.microsoft.com/azure/machine-learning/machine-learning-data-science-spark-overview)
> ACTION: POINTTO suggest linking to content [here](https://docs.microsoft.com/azure/machine-learning/machine-learning-data-science-spark-overview)
#### [Configuring R Server on Spark](https://msdn.microsoft.com/microsoft-r/rserver-install-hadoop-yarnqueueusage)
> ACTION: MIGRATE suggest migrating content from [here](https://msdn.microsoft.com/microsoft-r/rserver-install-hadoop-yarnqueueusage)
#### [Creating SparkML pipelines](hdinsight-creating-spark-ml-pipelines.md)
> ACTION: NEW
#### [Creating SparkML models in notebooks](https://docs.microsoft.com/azure/machine-learning/machine-learning-data-science-process-scala-walkthrough)
> ACTION: POINTO suggest linking to content [here](https://docs.microsoft.com/azure/machine-learning/machine-learning-data-science-process-scala-walkthrough)
#### [Use the Microsoft Cognitive Toolkit](hdinsight-apache-spark-microsoft-cognitive-toolkit.md)
> ACTION: RETITLE. Change title to "Use the Microsoft Cognitive Toolkit from Spark"

## Perform Deep Learning
### [Use Caffe for deep learning](hdinsight-deep-learning-caffe-spark.md)
> Action: RETITLE. Change title to "Use Caffe for deep learning with Spark"


## Use HBase
### [Use Phoenix and SQLLine](hdinsight-hbase-phoenix-squirrel-linux.md)
### [Analyze real-time tweets](hdinsight-hbase-analyze-twitter-sentiment.md)
### [Create clusters on a virtual network](hdinsight-hbase-provision-vnet.md)
### [Configure HBase replication](hdinsight-hbase-replication.md)
### [Develop an app with Java](hdinsight-hbase-build-java-maven-linux.md)

## Use Storm
### [Deploy and manage topologies](hdinsight-storm-deploy-monitor-topology-linux.md)
### [Develop data processing apps in SCP](hdinsight-storm-scp-programming-guide.md)
### [Storm examples](hdinsight-storm-example-topology.md)
#### [Write to Data Lake Store](hdinsight-storm-write-data-lake-store.md)
#### [Develop Java-based topologies with Maven](hdinsight-storm-develop-java-topology.md)
#### [Develop C# topologies with Hadoop tools](hdinsight-storm-develop-csharp-visual-studio-topology.md)
#### [Determine Twitter trending topics](hdinsight-storm-twitter-trending.md)
#### [Process events with C# topologies](hdinsight-storm-develop-csharp-event-hub-topology.md)
#### [Process events with Java topologies](hdinsight-storm-develop-java-event-hub-topology.md)
#### [Use Power BI with a topology](hdinsight-storm-power-bi-topology.md)
#### [Analyze real-time sensor data](hdinsight-storm-sensor-data-analysis.md)
#### [Process vehicle sensor data](hdinsight-storm-iot-eventhub-documentdb.md)
#### [Correlate events over time](hdinsight-storm-correlation-topology.md)
#### [Develop topologies using Python](hdinsight-storm-develop-python-topology.md)

## Use domain-joined HDInsight (Preview)
### [Configure](hdinsight-domain-joined-configure.md)
### [Manage](hdinsight-domain-joined-manage.md)
### [Configure Hive policies](hdinsight-domain-joined-run-hive.md)

## Use Kafka (Preview)
### [Replicate Kafka data](hdinsight-apache-kafka-mirroring.md)
### [Use with Virtual Networks](hdinsight-apache-kafka-connect-vpn-gateway.md)
### [Use with Spark](hdinsight-apache-spark-with-kafka.md)
### [Use with Storm](hdinsight-apache-storm-with-kafka.md)

## Develop

### Develop MapReduce programs
#### [Develop C# streaming MapReduce programs](hdinsight-hadoop-dotnet-csharp-mapreduce-streaming.md)
#### [Develop Java MapReduce programs](hdinsight-develop-deploy-java-mapreduce-linux.md)
#### [Develop Scalding MapReduce jobs](hdinsight-hadoop-mapreduce-scalding.md)
> ACTION: REMOVE. Live site redirects to hdinsight-use-mapreduce
#### [Develop Python streaming programs](hdinsight-hadoop-streaming-python.md)
#### [Use Python with Hive and Pig](hdinsight-python.md)

### Develop Hive applications
#### [Hive and ETL Overview](hdinsight-using-apache-hive-as-an-etl-tool.md)
> ACTION: NEW. Create content for this
#### [Connect using the Hive JDBC driver](hdinsight-connect-hive-jdbc-driver.md)
> ACTION: RETITLE. Change title to "Connect to Hive with JDBC or ODBC".
#### [Using external metadata stores](hdinsight-using-external-metadata-stores.md)
> ACTION: NEW. Pull content for this from MSDN blog at https://blogs.msdn.microsoft.com/azuredatalake/2017/03/24/hive-metastore-in-hdinsight-tips-tricks-best-practices/
#### [Writing Hive applications using Java and Python](hdinsight-tbd.md)
> ACTION: POINTTO. Link to [Java article](https://docs.microsoft.com/azure/hdinsight/hdinsight-hadoop-hive-java-udf) and [Python article](https://docs.microsoft.com/azure/hdinsight/hdinsight-python)
#### [Use C# user-defined functions](hdinsight-hadoop-hive-pig-udf-dotnet-csharp.md)
> ACTION: RETITLE. Change title to "Creating user defined functions".
#### [Process and analyze JSON documents](hdinsight-using-json-in-hive.md)
> ACTION: RETITLE. Change title to "Process and analyze JSON documents with Hive".
#### Hive samples
##### [Connect Excel to Hadoop](hdinsight-connect-excel-hive-odbc-driver.md)
> ACTION: RETITLE. Change title to "Query Hive using Excel"
##### [Analyze stored sensor data](hdinsight-hive-analyze-sensor-data.md)
> ACTION: RETITLE. Change title to "Query sensor data using the Hive console"
> ACTION: UPDATE. Content is written for a Windows cluster, update for Linux.
##### [Analyze stored tweets](hdinsight-analyze-twitter-data-linux.md)
> ACTION: RETITLE. Change title to "Analyze tweets using beeline against Hive".
##### [Analyze flight delay data](hdinsight-analyze-flight-delay-data-linux.md)
> ACTION: RETITLE. Change title to "Analyze flight delays with Hive and export to SQL Database using Sqoop"
> ACTION: RETEST. Document has strange references to mobiledata which is not used in the scripts- cleanup and retest.
##### [Analyze website logs with Hive](hdinsight-hive-analyze-website-log.md)
> ACTION: UPDATE. Content is written for a Windows cluster, update for Linux.

### Develop Spark applications
#### [Run Spark from the Shell](hdinsight-spark-shell.md)
> ACTION: NEW. Create content for this. 
#### [Create standalone app](hdinsight-apache-spark-create-standalone-application.md)
#### [Create apps using Eclipse](hdinsight-apache-spark-eclipse-tool-plugin.md)
#### [Use HDInsight Tools to create Spark apps](hdinsight-apache-spark-eclipse-tool-plugin.md)
> ACTION: RETITLE. Change to "Use the HDInsight Tools for Eclipse"
#### [Create apps using IntelliJ](hdinsight-apache-spark-intellij-tool-plugin.md)
#### [Debug jobs remotely with IntelliJ](hdinsight-apache-spark-intellij-tool-plugin-debug-jobs-remotely.md)
#### [Debug Spark apps by setting up VPNs](hdinsight-apache-spark-intellij-tool-plugin-debug-jobs-remotely)
> ACTION: POINTTO. VPN debugging is already covered in hdinsight-apache-spark-intellij-tool-plugin-debug-jobs-remotely
#### Spark samples
##### [Analyze Application Insights telemetry logs](hdinsight-spark-analyze-application-insight-logs.md)
> ACTION: RETITLE. Change to "Analyze Application Insights telemetry with Spark"
##### [Analyze website logs](hdinsight-apache-spark-custom-library-website-log-analysis.md)
> ACTION: RETITLE. Change to "Analyze website logs with Spark SQL"


### Developing Machine Learning solutions with HDInsight

#### SparkML samples
##### [NEW Sample using SparkML](hdinsight-tbd.md)
> ACTION: NEW
#### Spark MLLib samples
##### [Predict HVAC performance](hdinsight-apache-spark-ipython-notebook-machine-learning.md)
##### [Predict food inspection results](hdinsight-apache-spark-machine-learning-mllib-ipython.md)

#### R Server on HDInsight samples
##### [ScaleR and SparkR](hdinsight-hadoop-r-scaler-sparkr.md)
> ACTION: RETITLE. Change to "Predicting flight delays using R Server on Spark"

###  Serialize and deserialize data
#### [Serialize data with Avro Library](hdinsight-dotnet-avro-serialization.md)

## Analyze big data
### [Analyze using Power Query](hdinsight-connect-excel-power-query.md)
### [Generate recommendations with Mahout](hdinsight-hadoop-mahout-linux-mac.md)

## Extend clusters
### [Customize clusters using Bootstrap](hdinsight-hadoop-customize-cluster-bootstrap.md)
### [Customize clusters using Script Action](hdinsight-hadoop-customize-cluster-linux.md)
### [Develop script actions](hdinsight-hadoop-script-actions-linux.md)
### [Install and use Presto](hdinsight-hadoop-install-presto.md)
### [Install or update Mono](hdinsight-hadoop-install-mono.md)
### [Add Hive libraries](hdinsight-hadoop-add-hive-libraries.md)
### [Use Giraph](hdinsight-hadoop-giraph-install-linux.md)
### [Use Hue](hdinsight-hadoop-hue-linux.md)
### [Use R](hdinsight-hadoop-r-scripts-linux.md)
### [Use Solr](hdinsight-hadoop-solr-install-linux.md)
### [Use Virtual Network](hdinsight-extend-hadoop-virtual-network.md)
### [Use Zeppelin](hdinsight-apache-spark-use-zeppelin-notebook.md)
### Build HDInsight applications
#### [Install HDInsight apps](hdinsight-apps-install-applications.md)
#### [Install custom apps](hdinsight-apps-install-custom-applications.md)
#### [Use REST to install apps](https://msdn.microsoft.com/library/mt706515.aspx)
#### [Publish HDInsight apps to Azure Marketplace](hdinsight-apps-publish-applications.md)

## Secure
### [Use SSH with HDInsight](hdinsight-hadoop-linux-use-ssh-unix.md)
### [Use SSH tunneling](hdinsight-linux-ambari-ssh-tunnel.md)
### [Restrict access to data](hdinsight-storage-sharedaccesssignature-permissions.md)
#### [Add ACLs for users at the file and folder levels](hdinsight-tbd.md) 
> ACTION: NEW. Confirm if this is supposed to be about Ranger.
### [Create .NET applications that run with a non-interactive identity](hdinsight-create-non-interactive-authentication-dotnet-applications.md)
> ACTION: ADD ENTRY. This entry is missing from the TOC.

## Manage

### Manage Clusters
#### [Key scenarios to monitor](hdinsight-tbd.md)
> ACTION: NEW
#### [Administering HDInsight using the Azure Portal](hdinsight-tbd.md)
> ACTION: NEW

#### [Cluster and service ports and URIs](hdinsight-hadoop-port-settings-for-services.md)
> ACTION: RETITLE. Change to "Ports used by Hadoop services on HDInsight"
#### [Upgrade HDInsight cluster to newer version](hdinsight-upgrade-cluster.md)
#### [OS patching for HDInsight cluster](hdinsight-os-patching.md)

### Manage Linux Clusters
#### [Create Linux clusters](hdinsight-hadoop-provision-linux-clusters.md)
#### [Manage Linux clusters using the Ambari web UI](hdinsight-hadoop-manage-ambari.md)
#### [Use Ambari REST API](hdinsight-hadoop-manage-ambari-rest-api.md)
#### [Use Azure PowerShell](hdinsight-hadoop-create-linux-clusters-azure-powershell.md)
#### [Use cURL and the Azure REST API](hdinsight-hadoop-create-linux-clusters-curl-rest.md)
#### [Use the .NET SDK](hdinsight-hadoop-create-linux-clusters-dotnet-sdk.md)
#### [Use the Azure CLI](hdinsight-hadoop-create-linux-clusters-azure-cli.md)
#### [Use the Azure portal](hdinsight-hadoop-create-linux-clusters-portal.md)
#### [Use Azure Resource Manager templates](hdinsight-hadoop-create-linux-clusters-arm-templates.md)
#### [Migrate to Resource Manager development tools](hdinsight-hadoop-development-using-azure-resource-manager.md)
### [Availability and reliability ](hdinsight-high-availability-linux.md)
#### [Use empty edge nodes](hdinsight-apps-use-edge-node.md)
#### [Multiple HDInsight clusters with Data Lake Store](hdinsight-multiple-clusters-data-lake-store.md)
> ACTION: RETITLE. Change to "Using a single Data Lake Store from multiple HDInsight clusters"
#### [Install RStudio](hdinsight-hadoop-r-server-install-r-studio.md)
> ACTION: RETITLE. Change to "Install R Studio Server on HDInsight"

### [Manage Hadoop clusters](hdinsight-administer-use-portal-linux.md)
#### [Use .NET SDK](hdinsight-administer-use-dotnet-sdk.md)
#### [Use Azure PowerShell](hdinsight-administer-use-powershell.md)
#### [Use the Azure CLI](hdinsight-administer-use-command-line.md)
#### [Add storage accounts](hdinsight-hadoop-add-storage.md)
> ACTION: RETITLE. Add storage accounts to a running cluster

### [Manage resources](hdinsight-apache-spark-resource-manager.md)
> ACTION: RETITLE. Change to "Manage Spark cluster settings" 


## Troubleshoot
### [Tips for Linux](hdinsight-hadoop-linux-information.md)
### [Analyze HDInsight logs](hdinsight-debug-jobs.md)
### [Debug apps with YARN logs](hdinsight-hadoop-access-yarn-app-logs-linux.md)
### [Enable heap dumps](hdinsight-hadoop-collect-debug-heap-dump-linux.md)
### [Fix errors from WebHCat](hdinsight-hadoop-templeton-webhcat-debug-errors.md)
### [Use Ambari Views to debug Tez Jobs](hdinsight-debug-ambari-tez-view.md)
### [More troubleshooting](hdinsight-hadoop-stack-trace-error-messages.md)
#### [Hive settings fix Out of Memory error](hdinsight-hadoop-hive-out-of-memory-error-oom.md)
#### [Optimize Hive queries](hdinsight-hadoop-optimize-hive-query.md)
#### [Hive query performance](https://blogs.msdn.microsoft.com/bigdatasupport/2015/08/13/troubleshooting-hive-query-performance-in-hdinsight-hadoop-cluster/)

### Troubleshooting Spark on HDInsight
#### [Track and debug jobs](hdinsight-apache-spark-job-debugging.md)
#### [Known issues](hdinsight-apache-spark-known-issues.md)

# Reference
## [PowerShell](/powershell/module/azurerm.hdinsight)
## [.NET (Hadoop)](https://msdn.microsoft.com/library/mt271028.aspx)
## [.NET (HBase)](https://www.nuget.org/packages/Microsoft.HBase.Client/)
## [.NET (Avro)](https://hadoopsdk.codeplex.com/wikipage?title=Avro%20Library)
## [REST](/rest/api/hdinsight/)
## [REST (Spark)](/rest/api/hdinsightspark/)

# Related
## Windows clusters
### [Migrate Windows clusters to Linux clusters](hdinsight-migrate-from-windows-to-linux.md)
### [Migrate .NET solutions to Linux clusters](hdinsight-hadoop-migrate-dotnet-to-linux.md)
### [Run Hadoop MapReduce samples](hdinsight-run-samples.md)
### [Use Solr on clusters](hdinsight-hadoop-solr-install-linux.md)
### [Use Giraph to process large-scale graphs](hdinsight-hadoop-giraph-install.md)
### [Use Oozie for workflows](hdinsight-use-oozie.md)
### [Deploy and manage Storm topologies](hdinsight-storm-deploy-monitor-topology.md)
### [Use Maven to build Java applications](hdinsight-hbase-build-java-maven.md)
### [Use the Tez UI to debug Tez Jobs](hdinsight-debug-tez-ui.md)
### [Customize using Script Action](hdinsight-hadoop-customize-cluster.md)
### [Access YARN application logs](hdinsight-hadoop-access-yarn-app-logs.md)
### [Use Apache Phoenix and SQuirreL](hdinsight-hbase-phoenix-squirrel.md)
### [Generate movie recommendations using Mahout](hdinsight-mahout.md)
### [Analyze flight delay data](hdinsight-analyze-flight-delay-data.md)
### [Develop script actions](hdinsight-hadoop-script-actions.md)
### [Analyze Twitter data](hdinsight-analyze-twitter-data.md)
### [Manage clusters with Azure portal](hdinsight-administer-use-management-portal.md)
### [Monitor clusters using the Ambari API](hdinsight-monitor-use-ambari-api.md)

# Resources
## [Windows tools for HDInsight](hdinsight-hadoop-windows-tools.md)
## [Get help on the forum](https://social.msdn.microsoft.com/forums/azure/en-US/home?forum=hdinsight)
## [Learning path](https://azure.microsoft.com/documentation/learning-paths/hdinsight-self-guided-hadoop-training/)
