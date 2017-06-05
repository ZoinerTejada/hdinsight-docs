# Overview
## [What is Azure HDInsight?](hdinsight-tbd.md) [**<- exists on Docs site**](https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-hadoop-introduction)
## [Iterative data exploration](hdinsight-tbd.md) [**<- exists on patterns & practices site (4 articles)**](https://msdn.microsoft.com/en-us/library/dn749842.aspx)
## [Data Warehouse on demand](hdinsight-tbd.md) [**<- exists on patterns & practices site (3 articles)**](https://msdn.microsoft.com/en-us/library/dn749783.aspx)
## [Streaming at scale](hdinsight-tbd.md) **<- storm, kafka, ?**
## [Machine learning](hdinsight-tbd.md)
## [Programming with Hadoop and Spark](hdinsight-tbd.md)
## [Running custom programs](hdinsight-tbd.md)
## [Moving data with HDInsight](hdinsight-tbd.md)

# Azure HDInsight and Hadoop Architecture
## [The Architecture of Hadoop](hdinsight-tbd.md)
## [HDInsight Architecture](hdinsight-tbd.md)
## [Lifecycle of an HDInsight Cluster](hdinsight-tbd.md)  **<- where can we find detailed info on this?**
## [The Hadoop File System](hdinsight-tbd.md)
## [Nodes in an HDInsight Cluster](hdinsight-tbd.md)
## [Zookeeper](hdinsight-tbd.md)
## [High availability](hdinsight-tbd.md)
## [Cluster lifecycle (duplicate?)](hdinsight-tbd.md)
## [Separation of Compute and Storage](hdinsight-tbd.md)

# Capacity Planning
## [Choosing a region](hdinsight-tbd.md)
## [Choosing a cluster type](hdinsight-tbd.md)
## [Choosing the VM size and type](hdinsight-tbd.md)  **<- I've not found concrete guidance on size selection**
## [Choosing the cluster scale](hdinsight-tbd.md)
## [Common problems](hdinsight-tbd.md)

# Configuring the Cluster
## [Creating Hive and Ooze databases](hdinsight-tbd.md)
## [Enabling Management with Ambari](hdinsight-tbd.md)
## [ARM Templates for 3rd party applications](hdinsight-tbd.md) - different from https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-apps-install-applications?
## [Authorize user acces to Ranger](hdinsight-tbd.md) - different from topics including https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-domain-joined-configure ?
## [Add ACLs for users in Ranger](hdinsight-tbd.md)
## [Add ACLs for users at the file and folder levels](hdinsight-tbd.md)
## [Advanced configuration](hdinsight-tbd.md)
## [Cluster creation using Azure Data Factory](hdinsight-tbd.md)

# Monitoring and managing the HDInsight cluster
## [Key scenarios to monitor](hdinsight-tbd.md)
## [Monitoring with Ambari](hdinsight-tbd.md) - different from https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-hadoop-manage-ambari?
## [Administering HDInsight using the Azure Portal](hdinsight-tbd.md)
## [Changing configurations via Ambari](hdinsight-tbd.md)
## [Adding additional storage accounts after cluster creation](hdinsight-tbd.md)
## [Use Script Actions to automate cluster setup](hdinsight-tbd.md) - Different from https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-hadoop-customize-cluster-linux

# Developing Hive applications
## [Hive and ETL Overview](hdinsight-tbd.md)
## [Configuring Hive, JDBC and ODBC](hdinsight-tbd.md)
## [Using external metadata stores](hdinsight-tbd.md)
## [Writing Hive application using Java and Python](hdinsight-tbd.md)
## [Creating User Defined Functions](hdinsight-tbd.md)
## [Using the JSON SerDe](hdinsight-tbd.md)
## [Hive examples](hdinsight-tbd.md)

# Developing Spark applications
## [ML or Streaming Scenario](hdinsight-tbd.md) - Need clarification.
## [Running Spark from the Shell](hdinsight-tbd.md) - Via SSH to primary headnode? Different than https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-hadoop-linux-use-ssh-unix?
## [Running Spark from a Jupyter or Zeppelin Notebook](hdinsight-tbd.md)
## [Running Spark from IntelliJ IDEA](hdinsight-tbd.md) - Different then this https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-apache-spark-intellij-tool-plugin?
## [Debug Spark apps by setting up VPNs](hdinsight-tbd.md) - Refers to using a Site-to-Site or Point-to-Site VPN? 
## [Configure Spark settings](hdinsight-tbd.md)
## [Spark samples](hdinsight-tbd.md)

# Developing Spark ML applications
## [Creating SparkML pipelines](hdinsight-tbd.md)
## [Creating SparkML models in notebooks](hdinsight-tbd.md)
## [Spark ML samples](hdinsight-tbd.md)

# Spark SQL and Spark GraphX - should we retitle this section or combine with previous section into  "Machine Learning with Spark"?
## [Deep learning with Spark on HDInsight](hdinsight-tbd.md) With Caffe? Different to https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-deep-learning-caffe-spark?

# Developing R scripts on HDInsight
## [ML and deep learning](hdinsight-tbd.md) - is this different from the previous content on deep learning?
## [What is R Server?](hdinsight-tbd.md) - is this different from https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-hadoop-r-server-overview?
## [Configuring R Server on Spark](hdinsight-tbd.md)
## [Benefits of R Server on Spark vs. R Server on Hadoop](hdinsight-tbd.md) - more detail than https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-hadoop-r-server-compute-contexts#guidelines-for-deciding-on-a-compute-context?
## [Analyzing your R data from Azure Storage and Data Lake Store](hdinsight-tbd.md) - different from https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-hadoop-r-server-storage?
## [Submitting jobs from Visual Studio Tools for R*](hdinsight-tbd.md)
## [Submitting R jobs from R Studio Server*](hdinsight-tbd.md)

# Developing Spark Streaming applications using R Server
## [What is Spark Streaming?](hdinsight-tbd.md)
## [What is Spark Structured Streaming?](hdinsight-tbd.md)
## [Creating highly available Spark Streaming jobs in YARN](hdinsight-tbd.md)
## [Creating Spark Streaming jobs with exactly once event processing guarantees](hdinsight-tbd.md)
## [Connecting Spark Streaming and Structured Streaming Jobs to Kafka*](hdinsight-tbd.md) - Different from https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-apache-spark-with-kafka?
## [Connecting Spark Streaming and Structured Streaming Jobs to EventHubs*](hdinsight-tbd.md) - Different from https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-apache-spark-eventhub-streaming?
## [Connecting Spark Streaming and Structured Streaming jobs to Power BI*](hdinsight-tbd.md) - Different from https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-apache-spark-use-bi-tools
## [Publishing real-time updates to Power BI](hdinsight-tbd.md) - Via the Power BI streaming API?