---
title: Configuring Spark Settings - Azure HDInsight | Microsoft Docs
description: ''
services: hdinsight
documentationcenter: ''

tags: azure-portal
keywords: spark, configuration
---
# Configuring Spark Settings

A Spark cluster is an installation of the Apache Spark library onto a HDInsight Hadoop cluster.  Each HDInsight cluster includes default configuration parameters for your Spark cluster at the top level and also at the level of Spark services and service instances in your Spark cluster.  A Spark Job is a set of multiple tasks executed via parallel computation. Spark Jobs are generated in response to a Spark actions (such as 'collect' or 'save').  Spark uses a threadpool of tasks for parallel execution rather than a pool of JVM resources (used by MapReduce).

A key aspect of managing a HDInsight Hadoop cluster is monitoring all jobs on the cluster to make sure they are running in a predictable manner.  This application monitoring includes Apache Spark job monitoring and optimization.   The diagram below shows the core Spark Architecture.  It is important to consider the execution objects when determining how to optimize Spark Jobs.  The objects show in the the diagram are the Driver Program and it's associated Spark Context, the Cluster Manager, and the n-number of Worker Nodes.  Each Worker Node includes it's own Executor, Cache and n-number of Task instances.

## Default Spark HDInsight cluster 

The default HDInsight Apache Spark cluster includes the following: Head node (2), worker node (1+), ZooKeeper node (3) (free for A1 ZooKeeper VM size).  Below is a diagram

![Spark HDInsight Architecture](./media/hdinsight-spark-settings/spark-hdinsight-arch.png)

You can change the default Spark configuration values by providing a custom Spark configuration file.  An example is shown below.

```
    spark.hadoop.io.compression.codecs org.apache.hadoop.io.compress.DefaultCodec,is.hail.io.compress.BGzipCodec,org.apache.hadoop.io.compress.GzipCodec
    spark.sql.files.openCostInBytes 1099511627776
    spark.sql.files.maxPartitionBytes 1099511627776
    spark.hadoop.mapreduce.input.fileinputformat.split.minsize 1099511627776
    spark.hadoop.parquet.block.size 1099511627776
```

In the example shown above, the blah, blah, blah is overriden because xxxxxxxx.

----
## Viewing Cluster Configuration Settings

It is common practice when performing performance optimization on an HDInsight cluster to begin by verifying cluster configuration settings.  To do this for not only your particular Apache Spark configuration, but also other services that you may have installed, you launch the HDInsight Dashboard from the Azure Portal by clicking the 'Dashboard' link on the Spark cluster blade. 

You will be prompted to login with the username and password that you specified when you setup the HDInsight cluster.  After you enter your administrator cluster credentials, then you'll be presented with the Ambari Web UI.  This UI provides a dashboard view of the key cluster resource utilitization metrics.  

In addition to viewing the top level cluster metrics, you can also view cluster configuration information.  To see configuration values for Apache Spark, click on the 'Configs' tab, then click on the 'Spark2' (or 'Spark' depending on the version of Spark that you've installed on your cluster) service link in the service list.  

You will be presented with a list of configuration values for your cluster as shown below.

![Spark Configurations](./media/hdinsight-spark-perf/spark-config.png)

To view Spark configuration values, click the one of the links labeled with the word 'spark' in the link title.  Configurations for Spark include the following both custom and advanced configuration values include these configuration categories:
* Custom Spark2-defaults
* Custom Spark2-metrics-properties
* Advanced Spark2-defaults
* Advanced Spark2-env
* Advanced spark2-hive-site-override

After you click one of these links you can view and also update configuration values.  If you create a non-default set of configuration values, then you can see a history of any configuration updates you've performed in this UI as well.  This configuration history can be helpful if you wish to verify a non-default configuration is in use for performance optimization.

Note: If you only wish to verify common Spark configuration settings, you can also click on the 'Environment' tab on the top level Spark Job UI interface.  In this view, you can view, but not change, cluster configuration values.  The Spark Job UI is described in the next section of this article.

----

## Spark Cluster Optimization Techniques

Listed below are a set of common Spark Cluster optimization challenges, considerations and recommended actions to improve results.

### 1. Use Memory Efficiently

Because Spark operates by placing data in memory, appropriately managing memory resources is a key aspect of optimizing the execution of Spark Jobs.  There are several techniques that you can use to use your cluster's memory efficiently.  These include the following: 

* Prefer smaller data partitions, account for data size, types and distribution in your partitioning strategy
* Consider the newer, more efficient Kyro data Serialization, rather than the default Java Serialization
* Prefer to use YARN, as it separates spark-submit per batch
* Monitor and tune Spark configuration settings

For reference the Spark memory structure and some key executor memory parameters are shown below. 

#### Spark Memory allocation details 

![Spark Memory Structure](./media/hdinsight-spark-perf/spark-memory.png)

* The value spark.executor.memory defines the TOTAL amount of memory available for the executor
* The value spark.storage.memoryFraction (default ~ 60%) defines the amount available for storing persisted RDDs
* The value spark.shuffle.memoryFraction (default ~ 20%) deinfes the amount reserved for shuffle
* Avoid using spark.storage.unrollFraction/safetyFraction (~30% of total memory)

![Spark Architecture](./media/hdinsight-spark-perf/spark-arch.png)

The diagram below shows the core Spark Job workflow stages.  As above, it's important to review Job workflow objects when optimizing Spark Jobs.  In the diagram the data is represented by the low-level RDD Objects.  The next step is the DAG Scheduler. The DAG Scheduler interacts with the Task Scheduler to schedule, submit, launch and retry tasks.  These two schedulers interact with the worker instances.  Worker instances host threads and also make use of a Block Manager.  The Block Manager stores and serves blocks of data to the workflow.

![RDD Stages](./media/hdinsight-spark-perf/rdd-stages.png)

If you are using YARN, then YARN controls the maximum sum of memory used by the containers on each Spark node.  The graphic below shows the key objects and relationship between them.

![YARN Spark Memory Management](./media/hdinsight-spark-perf/yarn-spark-memory.png)

Here are set of common practices you can try if you are addressing 'out of memory' messages:

* Review DAG Management Shuffles -> reduce by map-side reducting, pre-partition (or bucketize) source data, maximize single shuffle, reduce the amount of data sent
* Prefer 'ReduceByKey'(has fixed memory limit) to 'GroupByKey'(more powerful, i.e. aggregations, windowing, etc.. but, has unbounded memory limit)
* Prefer 'TreeReduce'(does more work on the executors or partitions) to 'Reduce'(does all work on the driver)
* Leverage DataFrame rather than the lower-level RDD object 
* Create ComplexTypes which encapsulate actions, such as 'Top N', various aggregations or windowing ops

### Spark Cluster Custom Configuration

Depending on your Spark workload, you may determine that a non-default Spark configuration would result in more optimized Spark Job executions.  You should perform benchmark testing with key workloads to validate any non-default cluster configurations.  Some of the common parameters that you may consider adjusting are listed below with associated parameter notes.

* Executors                (--num-executors)
    - set the appropriate number of executors
* Cores for each executor  (--executor-cores)
    - have middle-sized executors, as other processed will consume some portion of the available memory
* Memory for each executor (--executor-memory) 
    - controls heap size on YARN, you'll need to leave some memory for execution overhead

-----
## Conclusion

There are a number of core considerations you need to pay attention to make sure your Spark Jobs run in a predictable and performant way.  It's key for you to focus on using the best Spark cluster configuration for your particular workload.  Along with that, you'll need to monitor the execution of long-running and/or high resource consuming Spark Job executions.  The most common challenges center around memory pressure due to improper configurations (particularly wrong-sized executors), long-running operations and tasks which result in cartesian operations.  Using caching judiciously can significantly speed up jobs.  Finally, it's important to adjust for data skew in your job tasks.

## See also

* [Manage resources for a Spark cluster on HDInsight](https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-apache-spark-resource-manager)
* [Tuning Spark](https://spark.apache.org/docs/latest/tuning.html)
* [Set up clusters in HDInsight with Hadoop, Spark, Kafka, and more](https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-hadoop-provision-linux-clusters)
* [What are the Hadoop components and versions available with HDInsight?](https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-component-versioning)




