---
title: Common Problems FAQ - Azure HDInsight | Microsoft Docs
description: ''
services: hdinsight
documentationcenter: ''

tags: azure-portal
keywords: domain-joined clusters,Azure Active Directory

---
# Common Problems FAQ

This guide serves to address common frequently asked questions (FAQs) pertaining to common issues when using and provisioning HDInsight clusters.

## Capacity planning

There are several aspects about your chosen cluster type you must consider when [planning your cluster's capacity](hdinsight-capacity-planning.md). Ultimately, you need to consider cost optimization, as well as the performance and usability of your cluster. Below are some common pitfalls when it comes to capacity planning.

### How do I ensure my cluster can handle the rate of growth of my data set? We don't know what the upper limit will be.
HDInsight separates compute from data storage by using either Azure Blob Storage or Azure Data Lake Store. This provides many benefits, including scaling out less expensive storage separate from compute. When you provision a new HDInsight cluster, you have the choice between Azure Storage and Azure Data Lake Store as your default data container. Azure Storage has certain [capacity limits](azure-subscription-service-limits.md#storage-limits) that you must consider, whereas Data Lake Store is virtually unlimited. However, since your cluster's default storage must be located in the same location as your cluster, you are limited by locations in which you can provision your cluster when using Data Lake Store. Data Lake Store is currently only available in three locations globally (Central US, East US 2 and North Europe).

Alternately, it is possible to use a combination of different storage accounts with an HDInsight
cluster. You might want to use more than one storage account in the following circumstances:

* When the amount of data is likely to exceed the storage capacity of a single blob storage
container.
* When the rate of access to the blob container might exceed the threshold where throttling will
occur.
* When you want to make data you have already uploaded to a blob container available to the
cluster.
* When you want to isolate different parts of the storage for reasons of security, or to simplify
administration.

As a general rule, for a 48 node cluster, it is recommended that you have 4-8 storage accounts. This is not due to storage space requirements, per se, but due to the fact that each storage account provides additional networking bandwidth that opens up the pipe as wide as possible for the compute nodes to finish their jobs faster. When you use multiple storage accounts, make the naming convention of the storage account as random as possible, with no prefix. This is to reduce the chance of hitting storage bottlenecks or common mode failures in storage across all accounts at the same time. This type of storage partitioning in Azure Storage meant to avoid storage throttling. Lastly, make sure to only have one container per storage account. This yields better performance.

### We've selected large VMs and enough nodes to support our batch processing needs, but cost of running the cluster is much higher than we'd like. How do we minimize our cost while meeting our compute needs?
HDInsight gives you the flexibility to [scale your cluster](hdinsight-scaling-best-practices.md) at will by adjusting the number of worker nodes at any time. A common practice is to scale out your cluster to meet peak load demands, then scale it back down when those extra nodes are no longer needed.

Another option, particularly if there are specific times during the day/week/month that you need your cluster up and running, is to [create on-demand clusters using Azure Data Factory](hdinsight-hadoop-create-linux-clusters-adf.md). Since you are charged for your cluster for its lifetime, this is one effective way in which you can manage its lifecycle, netting significant cost savings. Since your data is stored on low-cost storage, independent of your cluster, then you don't need to worry about losing valuable data when you delete your cluster. An alternative to using Data Factory is to create PowerShell scripts to provision and delete your cluster, then schedule running those scripts with [Azure Automation](https://azure.microsoft.com/en-us/services/automation/).

One thing to look out for when deleting and re-creating your clusters, is that the Hive metastore that is created by default with a cluster is transient. When the cluster is deleted, the metastore gets deleted as well. [Use an external database like Azure Database or Oozie to persist the metastore](hdinsight-using-external-metadata-stores.md) if your cluster lifecycle management process is to run it on-demand, deleting it when not needed.

### My code works fine when running locally, but tends to fail when deploying to a multi-node cluster. How do I isolate the problem to determine if the issue is with my multi-node cluster or something else?
Sometimes errors can occur due to the parallel execution of multiple map and reduce components on a
multi-node cluster. Consider emulating distributed testing by running multiple jobs on a single node
cluster at the same time to detect errors, then expand this approach to run multiple jobs concurrently
on clusters containing more than one node in order to help isolate the issue.

You can create a single-node HDInsight cluster in Azure by specifying the advanced option when creating
the cluster. Alternatively, you can install a single-node development environment on your local computer
and execute the solution there. A single-node local development environment for Hadoop-based
solutions that is useful for initial development, proof of concept, and testing is available from
Hortonworks. For more details, see [Hortonworks Sandbox](http://hortonworks.com/products/hortonworks-sandbox/).

By using a single-node local cluster you can rerun failed jobs and adjust the input data, or use smaller
datasets, to help you isolate the problem. How you go about rerunning jobs depends on the type of application and on which platform it is running.


## Next steps

Check this FAQ periodically, as we add additional questions and answers to common problems.
