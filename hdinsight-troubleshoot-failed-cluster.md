---
title: Troubleshooting a Failed HDInsight Cluster - Azure HDInsight | Microsoft Docs
description: ''
services: hdinsight
documentationcenter: ''

tags: azure-portal
keywords: hadoop, hdinsight, configuration
---
# Troubleshooting a Failed HDInsight Cluster

This article walks you through the process of troubleshooting a failed HDInsight cluster. A 'Failed Cluster' is defined as one that has terminated with an error code.  
If a cluster is still running, but is taking a long time to return results, then it is defined as a 'Slow Cluster'.  Troubleshooting a 'Slow Cluster' is outside of scope of this article.

There are a set of general steps to take when diagnosing a failed cluster.  They include getting information about all aspects of the environment.  This includes, but is not limited to,  
all associated Azure Services, cluster configuration, job execution information and reproducability of error state.  The most common steps taken in this process are listed below.

### Troubleshooting Steps to Diagnose a Failed HDInsight Cluster
* Step 1: Gather Data About the Issue 
* Step 2: Validate the HDInsight Cluster Environment 
* Step 3: Review the Last Environment State Change 
* Step 4: Examine the Cluster Log Files 
* Step 5: Test the Cluster Step-by-Step 

---

## Step 1: Gather Data About the Issue
The first step in troubleshooting a HDInsight cluster is to gather information about what went wrong and the
current status and configuration of the cluster. This information will be used in the following steps to
confirm or rule out possible causes of the cluster failure.

#### Define the Problem
A clear definition of the problem is the first place to begin. Some questions to ask yourself:
* What did I expect to happen? What happened instead?
* When did this problem first occur? How often has it happened since?
* Has anything changed in how I configure or run my cluster?

#### Cluster Details
The following cluster details are useful in helping track down issues. 
* Name of the cluster
* Region and availability zone the cluster was launched into.
* State of the cluster, including details of the last state change.
* Type and number of HDInsight instances specified for the master, core, and task nodes.

You can quickly get much of this top level information via the Azure portal.  A sample screen is shown below:

![HDInsight Azure Portal Information](./media/hdinsight-troubleshoot-failed-cluster/portal.png)

Alternatively, you can use the Azure cli to get information about a HDInsight cluster by running the following commands:

```
    azure hdinsight cluster list
    azure hdinsight cluster show <Cluster Name>
```
Or, you can use PowerShell to view this type of information.  See [Manage Hadoop clusters in HDInsight by using Azure PowerShell](https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-administer-use-powershell) for details.

---

## Step 2: Validate the Environment
A typical HDInsight cluster uses a number of services and open-source software packages (such as Apache HBase, Apache Spark, etc...). In addition, it's common to find that a HDInsight cluster interoperates
with other Azure services, such as Azure Virtual Networks and others.  Failures in any of the running services on your cluster or any external services can result in a cluster failure.  Additionally, a requested cluster service 
configuration change could also cause the cluster to fail.

#### Service Details
* Check the Open-source library Release Versions
* Check for Azure Service Outages 
* Check for Azure Service Usage Limits 
* Check the Azure Virtual Network Subnet Configuration 

### Viewing Cluster Configuration Settings with the Ambari UI
Apache Ambari simplifies the management and monitoring of a HDInsight cluster by providing an easy to use web UI and REST API. 
Ambari is included on Linux-based HDInsight clusters, and is used to monitor the cluster and make configuration changes.
Click on the 'Cluster Dashboard' blade on the Azure Portal HDInsight page to open the 'Cluster Dashboards' link page.  Next, click on 
the 'HDInsight cluster dashboard' blade to open the Ambari UI.  You'll be prompted for your cluster login credentials.  An example Ambari HDInsight Dashboard is shown below.

![Ambari UI](./media/hdinsight-troubleshoot-failed-cluster/ambari-ui.png)

#### Check for Azure Service Outages
HDInsight uses several Azure Web Services internally. It runs virtual servers on Azure HDInsight, stores data and scripts on Azure Blob storage and indexes log files in Azure Table storage.   Events that disrupt these services are rare — but when they occur — can cause issues in HDInsight.

Before you go further, check the [Azure Status Dashboard](https://azure.microsoft.com/en-us/status/). Check the region where you launched your
cluster to see whether there are disruption events in any of these services.

#### Check Azure Service Usage Limits
If you are launching a large cluster, have launched many clusters simultaneously, the cluster may have failed because you exceeded an Azure service limit.

Azure HDInsight limits the number of virtual server instances running on a single Azure region to 20 on-demand
or reserved instances. If you launch a cluster with more than 20 nodes, or launch a cluster that
causes the total number of HDInsight instances active on your Azure account to exceed 20, the cluster will not
be able to launch all of the HDInsight instances it requires and may fail. When this happens, HDInsight
returns an HDInsight QUOTA EXCEEDED error. You can request that Azure increase the number of HDInsight instances
that you can run on your account by submitting a Request to Increase Azure HDInsight Instance Limit
application.

Another thing that may cause you to exceed your usage limits is the delay between when a cluster is
terminated and when it releases all of its resources. Depending on its configuration, it may take up to
5-20 minutes for a cluster to fully terminate and release allocated resources. If you are getting an HDInsight
QUOTA EXCEEDED error when you attempt to launch a cluster, it may be because resources from a recently
terminated cluster may not yet have been released. In this case, you can either request that your Azure
HDInsight quota be increased, or you can wait twenty minutes and re-launch the cluster.
Azure S3 limits the number of buckets created on an account to 100. If your cluster creates a new
bucket that exceeds this limit, the bucket creation will fail and may cause the cluster to fail.

#### Check the Release Version
Compare the release label that you used to launch the cluster with the latest HDInsight release. Each
release of HDInsight includes improvements such as new applications, features, patches, and bug
fixes. The issue that is affecting your cluster may have already been fixed in the latest release version. If
possible, re-run your cluster using the latest version.

#### Check the Azure Virtual Network Subnet Configuration
If your cluster was launched in a Azure Virtual Network subnet, the subnet needs to be configured as described in
Plan and Configure Networking. In addition, check that the subnet you launch the cluster into has
enough available public IP addresses to assign one to each node in the cluster.

## Step 3: Review the Last State Change
The last state change provides information about what occurred the last time the cluster changed state.
This often has information that can tell you what went wrong as a cluster changes state to FAILED. For
example, if you launch a streaming cluster and specify an output location that already exists in Azure
Blob storage, the cluster will fail with a last state change of "Streaming output directory already exists".
You can locate the last state change value from the console by viewing the details pane for the
cluster, from the azure-cli using the `list-steps` or `describe-cluster` arguments, or from the API using the
`DescribeCluster` and `ListSteps` actions. For more information, see View Cluster Details.

---

## Step 4: Examine the Log Files
The next step is to examine the log files in order to locate an error code or other indication of the issue
that your cluster experienced. 

It may take some investigative work to determine what happened. Hadoop runs the work of the jobs
in task attempts on various nodes in the cluster. HDInsight can initiate speculative task attempts,
terminating the other task attempts that do not complete first. This generates significant activity that is
logged to the controller, stderr and syslog log files as it happens. In addition, multiple tasks attempts are
running simultaneously, but a log file can only display results linearly.

Start by checking the bootstrap action logs for errors or unexpected configuration changes during the
launch of the cluster. From there, look in the step logs to identify Hadoop jobs launched as part of a step
with errors. Examine the Hadoop job logs to identify the failed task attempts. The task attempt log will
contain details about what caused a task attempt to fail.

![HDInsight log file example](./media/hdinsight-troubleshoot-failed-cluster/logs.png)

The following sections describe how to use the various log files to identify error in your cluster.

#### Check the Bootstrap Action Logs
Bootstrap actions run scripts on the cluster as it is launched. They are commonly used to install
additional software on the cluster or to alter configuration settings from the default values. Checking
these logs may provide insight into errors that occurred during set up of the cluster as well as
configuration settings changes that could affect performance.

#### Check the Step Logs
There are four types of step logs:
* **controller**—Contains files generated by HDInsight (HDInsight) that arise from errors
encountered while trying to run your step. If your step fails while loading, you can find the stack trace
in this log. Errors loading or accessing your application are often described here, as are missing mapper
file errors.
* **stderr**—Contains error messages that occurred while processing the step. Application loading errors
are often described here. This log sometimes contains a stack trace.
* **stdout**—Contains status generated by your mapper and reducer executables. Application loading
errors are often described here. This log sometimes contains application error messages.
* **syslog**—Contains logs from non-Azure software, such as Apache and Hadoop. Streaming errors are
often described here.

Check stderr for obvious errors. If stderr displays a short list of errors, the step came to a quick stop with
an error thrown. This is most often caused by an error in the mapper and reducer applications being run
in the cluster.

Examine the last lines of controller and syslog for notices of errors or failures. Follow any notices about
failed tasks, particularly if it says "Job Failed".

#### Check the Task Attempt Logs
If the previous analysis of the step logs turned up one or more failed tasks, investigate the logs of the
corresponding task attempts for more detailed error information.

---
#### View HDInsight via Quick Links in Ambari

The HDInsight Ambari UI includes a number of 'Quick Links' sections.  To access the log links for a particular service in your HDInsight cluster, open the Ambari UI for your clustuer, 
then click on the service link from the list at left, next click on the 'Quick Links' drop down and then on the HDInsight node of interest and then on the link for its associated log.
An example, for HDFS logs, is shown below:

![Ambari Quick Links to Log Files](./media/hdinsight-troubleshoot-failed-cluster/quick-links.png)

#### HDInsight Logs written to Azure Tables
The logs written to Azure Tables provide one level of insight into what is happening with an HDInsight cluster.
When you create an HDInsight cluster, 6 tables are automatically created for Linux-based clusters in the default Table storage:
* hdinsightagentlog
* syslog
* daemonlog
* hadoopservicelog
* ambariserverlog
* ambariagentlog

Note: For Windows-based HDInsight clusters, different log tables are created.  See link at the end of this article on HDInsight logs for more details.

#### HDInsight Logs Written to Azure Blob Storage
HDInsight clusters are configured to write task logs to an Azure Blob Storage account for any job that is submitted using the Azure PowerShell cmdlets or the .NET Job Submission APIs.  If you submit jobs through RDP/command-line access to the cluster then the execution logging information will be found in the Azure Tables discussed in the previous paragraph.

#### HDInsight Logs genered by YARN

YARN aggregates logs across all containers on a worker node and stores them as one aggregated log file per worker node. The log is stored on the default file system after an application finishes. Your application may use hundreds or thousands of containers, but logs for ALL containers run on a single worker node are always aggregated to a single file. So there is only one log per worker node used by your application. Log Aggregation is enabled by default on HDInsight clusters version 3.0 and above. Aggregated logs are located in default storage for the cluster. The following path is the HDFS path to the logs:

```
    /app-logs/<user>/logs/<applicationId>
```

The aggregated logs are not directly readable, as they are written in a TFile, binary format indexed by container. Use the YARN ResourceManager logs or CLI tools to view these logs as plain text for applications or containers of interest.

##### YARN CLI tools
To use the YARN CLI tools, you must first connect to the HDInsight cluster using SSH. Specify the <applicationId>, <user-who-started-the-application>, <containerId>, and <worker-node-address> information when running these commands.
You can view these logs as plain text by running one of the following commands:

```bash
    yarn logs -applicationId <applicationId> -appOwner <user-who-started-the-application>
    yarn logs -applicationId <applicationId> -appOwner <user-who-started-the-application> -containerId <containerId> -nodeAddress <worker-node-address>
```

##### YARN ResourceManager UI
The YARN ResourceManager UI runs on the cluster headnode. It is accessed through the Ambari web UI. Use the following steps to view the YARN logs:
In your web browser, navigate to https://CLUSTERNAME.azurehdinsight.net. Replace CLUSTERNAME with the name of your HDInsight cluster.
From the list of services on the left, select YARN.
Yarn service selected
From the Quick Links dropdown, select one of the cluster head nodes and then select ResourceManager Log.
Yarn quick links
You are presented with a list of links to YARN logs.

#### Other Logs

Heap dumps contain a snapshot of the application's memory, including the values of variables at the time the dump was created. So they are useful for diagnosing problems that occur at run-time.  See the link at the bottom of this article for the process to enable heap dumps for your HDInsight cluster.

---

## Step 5: Test the Cluster Step by Step

A useful technique when you are trying to track down the source of an error is to restart the cluster
and submit the steps to it one by one. This lets you check the results of each step before processing the
next one, and gives you the opportunity to correct and re-run a step that has failed. This also has the
advantage that you only load your input data once.

To test a cluster step by step:
1. Launch a new cluster, with both keep alive and termination protection enabled. Keep alive keeps
the cluster running after it has processed all of its pending steps. Termination protection prevents a
cluster from shutting down in the event of an error. 
2. Submit a step to the cluster.
3. When the step completes processing, check for errors in the step log files. The fastest way to locate these log files is by connecting to
the master node and viewing the log files there. The step log files do not appear until the step runs
for some time, finishes, or fails.
4. If the step succeeded without error, run the next step. If there were errors, investigate the error in
the log files. If it was an error in your code, make the correction and re-run the step. Continue until
all steps run without error.
5. When you are done debugging the cluster, and want to terminate it, you will have to manually
terminate it. This is necessary because the cluster was launched with termination pprotection
enabled.

----

## Conclusion

There are a number of core considerations you need to pay attention to make sure your Spark Jobs run in a predictable and performant way.  It's key for you to focus on using the best Spark cluster configuration for your particular workload.  Along with that, you'll need to monitor the execution of long-running and/or high resource consuming Spark Job executions.  The most common challenges center around memory pressure due to improper configurations (particularly wrong-sized executors), long-running operations and tasks which result in cartesian operations.  Using caching judiciously can significantly speed up jobs.  Finally, it's important to adjust for data skew in your job tasks.

## See also

* [Manage HDInsight clusters by using the Ambari Web UI](https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-hadoop-manage-ambari)
* [Analyze HDInsight Logs](https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-debug-jobs)
* [Access YARN application log on Linux-based HDInsight](https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-hadoop-access-yarn-app-logs-linux)
* [Enable heap dumps for Hadoop services on Linux-based HDInsight](https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-hadoop-collect-debug-heap-dump-linux)
* [Known Issues for Apache Spark cluster on HDInsight](https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-apache-spark-known-issues)




