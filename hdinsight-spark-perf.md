---
title: Optimizing and configuring Spark Jobs for Performance - Azure HDInsight | Microsoft Docs
description: ''
services: hdinsight
documentationcenter: ''

tags: azure-portal
keywords: spark, RDD, dataframe
---
# Optimizing and configuring Spark Jobs for Performance

Opening paragraph about what Spark Jobs are and why optimization and configuration is key to predictable performance.

A Spark Job is ....

A Spark cluster configuration is ...

The top level concepts around Spark Job optimization are ...

## Concepts - Partitions, Caching and Serialization

This section will introduce concepts/levels at which performance tuning optimizations can be applied.  These include the following:
* Partitions - how data is split on disk, affects memory / CPU usage and shuffle size
* Caching - means to persist RDDs in distributed memory of the cluster, results in significant speed up
* Serialization - means efficient movement of data, discuss Java vs. Kryo
* Spark Architecture/Workflow - show picture below

![Spark Architecture](./media/hdinsight-spark-perf/spark-arch.png)

Here are the RDD stages

![RDD Stages](./media/hdinsight-spark-perf/rdd-stages.png)

and here's some more, blah...

---

## Best Practices

### Use Memory Efficiently

* Partition wisely (??? smaller ???, what else) - know your data -- size, types, distribution
* Use Kyro Serialization (what is this ???)
* Remember to clean up - long-term jobs consume memory indefinately, spark context cleanup fails in production --> use YARN!, separates spark-submit per batch

Spark Memory allocation details (see graphic below)

![Spark Memory Structure](./media/hdinsight-spark-perf/spark-memory.png)

* The value spark.executor.memory defines to TOTAL amount of memory available for the executor
* The value spark.storage.memoryFraction (default ~ 60%) defines the amount available for storing persisted RDDs
* The value spark.shuffle.memoryFraction (default ~ 20%) deinfes the amount reserved for shuffle
* Avoid using spark.storage.unrollFraction/safetyFraction (~30% of total memory)

YARN controls the maximum sum of memory used by the containers on each Spark node (see graphic below)

![YARN Spark Memory Management](./media/hdinsight-spark-perf/yarn-spark-memory.png)

### Avoid Shuffles

* Do this to speed up execution and increase stability.
* Do this by using custom partitioning and by using the driver to collect and broadcast.
    * NOTE: Using the driver is challenging! ( need more info on this part ???)

### Speed it Up

* Cache, but do it wisely.  If you use the data twice, then cache it.
* Broadcast variables, then they are visible to all executors.  They are only serialized once.  Results in very fast lookups.
* Threading - use thread pool on driver (not sure what this means?).  Results in fast operation, with many tasks.
* Using these techniques, can result in a 75x spped over ML Lib ALS predict()

Example of custom configure shown below (using Python) - not sure this is correct, need to check

```Python
    ...     //other setup code here
    conf = pyspark.SparkConf().setAll([         
        ('spark.driver.memory','100g'),          
        ('spark.executor.instances','60'),       
        ('spark.executor.cores', '5'),          
        ('spark.executor.memory', '20g'),       
        ('spark.io.compression.codec', 'lz4'),   
        ('spark.shuffle.consolidateFiles', 'true'),     
        ('spark.dynamicAllocation.enabled', 'false'),   
        ('spark.shuffle.manager', 'tungsten-sort'),      
        ('spark.akka.frameSize', '1028'),                  
        ])
    sc.stop()
    sc = pyspark.SparkContext(conf=conf)
```

## Watch out

#### Memory
You'll use more than you think, JVM garbage collection, Spark metadata (shuffles, long-running jobs), Scala/Java overhead, Shuffle/heap/YARN

To fix out of memory
* look at DAG Mgmt Shuffles -> reduce by map-side reducting, pre-partition (or bucketize) source data, maximize single shuffle, reduce data sent
* prefer 'ReduceByKey'(has fixed memory limit) to 'GroupByKey'(more powerful, i.e. aggregations, windowing, etc.. but, has unbounded memory limit)
* prefer 'TreeReduce'(does more work on the executors or partitions) to 'Reduce'(does all work on the driver)
* leverage DataFrame(Dataset?) to RDD and create ComplexTypes which encapsulate actions, such as 'Top N', various aggregations or windowing ops

### Debugging
Difficult as logs are distributed and hundreds of tasks are spawned

Slow jobs on Join/Shuffle - ex. 20 sec to run map job, but 4 hrs when joined/shuffled - why? data is skewed
    *to fix data skew -> salt the key, isolate salt (only some subset of keys) and filter to isolate subset of salted keys in map joins
    *to manage parallelism -> fight Cartesian Joins via adding nested structures, windowing and/or skip step(s)

### Spark Cluster Architecture

* Executors                (--num-executors)
* Cores for each executor  (--executor-cores)
    - have middle-sized executors (=< 5 cores each w/19GB  per executor) -- not sure about amount of memory here ???
* Memory for each executor (--executor-memory) controls heap size on YARN, need to leave some memory for execution overhead

#### IMPORTANT - Application failure due to one or more Spark shuffle blocks (stored as Spark ByteBuffer blocks) being too big (Integer max size = 2 GB)
* shuffle block == Mapper-Reducer pair, file from local disk that reducers read from local disk in MapReduce
* this is a bad problem for SparkSQL as default # of partitions is 200 and low number of partitions => high shuffle block size
* to fix this either a) increase the number of partitions (set spark.sql.shuffle.partitions), also have ~128 MB/partition
        -OR- get rid of skew in the data
* Some wierd error related to Maven (OpenHashSet exception)
    - Guava version doesn't match Spark's Guava version

### 5 Mistakes
* size executors right
* 2 GB limit on Spark shuffle blocks
* avoid evil skew and cartesians
* learn to manage your DAG
* if non-default config, classpath leaks can hurt you


## OLD CONTENT STARTS HERE

**Resilient Distributed Datasets** (RDDs) address this by enabling fault-tolerant, distributed, in-memory computations. [(RDDs)](http://spark.apache.org/docs/latest/programming-guide.html#resilient-distributed-datasets-rdds) are the baseline data abstractions in Spark. They are fault-tolerant collections of elements stored in-memory or on-disk that can be operated on in parallel. An RDD can hold many kinds of source data. RDDs are created by loading an external dataset or distributing a collection from the Spark driver program.

An RDD can be persisted in-memory across operations. When an RDD is persisted, each node stores any partitions of it that it computes in-memory and then reuses them in other actions on the data set. You can mark an RDD as persistent just by calling the `persist()` or `cache()` method. You can also specify the storage level: on-disk or in-memory as a serialized Java object. Cached, or persistent, RDDs are fault-tolerant without replication.

Each RDD maintains its lineage (for example, the sequence of transformations that resulted in the RDD). If an RDD is lost because a node crashed, it can be reconstructed by replaying the sequence of operations.

----------

## What are RDD operations?
RDDs support two types of operations: transformations and actions.

* **Transformations** create a new dataset from an existing one. Transformations are lazy by default, meaning that no transformation is executed until you execute an action. This does not apply to persistent RDDs. Examples of transformations include: map, filter, sample, union, and more.

* **Actions** return a value to the driver program after running a computation on the dataset. Examples include: reduce, collect, count, first, foreach, etc.


The code sample below contains both transitions and actions.  It shows how to search through error messages in a log file that is stored in HDFS using Scala.  A source file is loaded, then filtered, cached and the rows in cache are counted.  Next an additional filter is applied to the cached rows.  Row are again counted and finally returned via the collect method.

```Scala
    val file = spark.textFile("hdfs://...")
    val errors = file.filter(line => line.contains("ERROR"))
    errors.cache()               
    errors.count()               
    errors.filter(line => line.contains(“Web")).count()
    errors.filter(line => line.contains(“Error")).collect()
```

-----

## Dataset API

The Dataset API, released as an API preview in Spark 1.6 (and as generally available in Spark 2.x), aims to provide the best of both worlds; the familiar object-oriented programming style and compile-time type-safety of the RDD API but with the performance benefits of the Catalyst query optimizer. Datasets also use the same efficient off-heap storage mechanism as the DataFrame API.

When it comes to serializing data, the Dataset API has the concept of encoders which translate between JVM representations (objects) and Spark’s internal binary format. Spark has built-in encoders which are very advanced in that they generate byte code to interact with off-heap data and provide on-demand access to individual attributes without having to de-serialize an entire object. Spark does not yet provide an API for implementing custom encoders, but that is planned for a future release.

![Unified API](./media/hdinsight-spark-rdd-vs-dataframe-vs-dataset/unified-api.png)



## Conclusion

These are the core things you need to pay attention to make sure your Spark Jobs run in a predictable and performant way.

## See also

* [How to Actually Tune Your Spark Jobs So They Work](https://www.slideshare.net/ilganeli/how-to-actually-tune-your-spark-jobs-so-they-work)
* [Debug Spark jobs running on Azure HDInsight](https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-apache-spark-job-debugging)
* [Manage resources for a Spark cluster on HDInsight](https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-apache-spark-resource-manager)
* [Use the Spark REST API to submit remote jobs to a Spark cluster](https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-apache-spark-livy-rest-interface)




