---
title: HDInsight Cluster Lifecycle | Microsoft Docs
description: ''
services: hdinsight
documentationcenter: ''

tags: azure-portal
keywords: HDInsight, Clusters

---
# HDInsight Dynamic Lifecycle

You can create HDInsight clusters that are either temporary, permenant, or scheduled scale.  

## On-Demand Clusters

Since you only pay for HDInsight when a cluster is up and running, deleting a cluster when it is not in use provides a big opportunity for cost savings.  In order to stop the charges, you have to delete the cluster.  There is no concept of pausing a cluster.  

HDInsight can be primarily used for executing scripts and using compute resources.  Storage of all data can be done in less expensive products like Azure SQL Database, Azure Blob Storage, or Azure Data Lake Store.

Most Hadoop jobs are batch jobs.  Batch jobs can be used to do a wide variety of things including data aggregation, data cleaning, data organization, or batch analytics that run at night and automatically populate Power BI visualizations or Excel spreadsheets.   When implementing a workload like this you would create an HDInsight cluster, run some jobs, save the data, and then completly delete the HDInsight cluster. The process usually resembles the following steps:

**1.  Create the HDInsight cluster.**  Clusters that are temporary are typically created in HDInsight using an Azure Resource Manager template.   Clusters can be created using [PowerShell](https://docs.microsoft.com/en-us/powershell/module/azurerm.hdinsight/New-AzureRmHDInsightCluster?view=azurermps-4.0.0), the Azure Management Portal, or [Azure CLI](https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-hadoop-create-linux-clusters-azure-cli).  If jobs will be running on a reguarly basis, you would want to schedule cluster creation using PowerShell or Azure CLI.  PowerShell scripts and Azure CLI can be scheduled using [Azure Automation.](https://azure.microsoft.com/en-us/services/automation/) 

**2.  Schedule the batch jobs.** Batch jobs in HDInsight are popularly run in Apache Hive, but they can be created using several different tools. If you choose to use Apache Hive, there are many ways to run those jobs in HDInsight.  There are several ways to schedule a hive job including using [Azure Scheduler with PowerShell](https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-hadoop-use-hive-powershell), using [Oozie](https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-use-oozie-coordinator-time), or using an HDInsight Hive activity in Azure Data Factory. 

**3.  Pipe your data to a permenant storage location.**  Costs of storage in Azure are significantly cheaper than the cost of keeping an HDInsight cluster up and running.  After you have completed a Hive job, you can export the results to permenant location like Azure SQL database, Azure SQL Data Warehouse,  Azure Blob Storage, or Azure Data Lake Store.  

Hadoop supports a notion of the default file system. The default file system implies a default scheme and authority. It can also be used to resolve relative paths. During step 1, you can specify a blob container in Azure Storage as the default file system, or with HDInsight 3.5, you can select either Azure Storage or Azure Data Lake Store as the default files system with a few exceptions.   For the supportability of using Data Lake Store as both the default and linked storage, see Availabilities for HDInsight cluster.

Since the charges for the cluster are many times more than the charges for storage, it makes economic sense to delete clusters when they are not in use.

**4.  Tear down the cluster using PowerShell.**  This can be done automatically using the methods mentioned above, or it can be done manually in the morning after confirmation that the jobs have all completed successfully.  See [Manage Hadoop clusters in HDInsight by using Azure PowerShell](https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-administer-use-powershell)

## Long-Running Clusters

If all you want to do is submit a job and get results, then you will want to have an on-demand cluster. For all other scenarios, you'll tend to use long-running clusters.

If HDInsight will be used in a more interactive fashion, then it makes sense to keep the HDInsight cluster up and running permenantly.  Some of these workloads include:

1) Using Spark, Kafka or Storm for stream analytics.

2) Using Apache Hive, Storm, and Pig for interactive querying and analytics.

3) Using ETL and data cleaning tools permentantly for real-time data processing.


        ![NOTE]
        When you create an HDInsight cluster, the processing can begin as soon as the nodes become available. You do not need to wait for all nodes in the cluster to be ready before using it to process jobs.



## Scheduled Scale  
The cost of HDInsight clusters is determined by the number of nodes and the virtual machines sizes for the nodes.

You can use PowerShell to select the number of nodes and virtual machine sizes for those nodes.  You can scale them up during heavy usage and scale them down for light usage.  Scheduling the scaling of nodes and virtual machine size can represent a significant cost savings.