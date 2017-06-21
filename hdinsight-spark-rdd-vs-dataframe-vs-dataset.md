---
title: Choosing between RDD, DataFrame and Dataset for Spark - Azure HDInsight | Microsoft Docs
description: ''
services: hdinsight
documentationcenter: ''

tags: azure-portal
keywords: spark, RDD, dataframe
---
# Choosing between RDD, DataFrame and Dataset for Spark

The driver runs the user's main function and executes the various parallel operations on the worker nodes. Then, the driver collects the results of the operations. The worker nodes read and write data from and to the Hadoop distributed file system (HDFS). The worker nodes also cache transformed data in-memory as Resiliant Distributed Datasets (RDDs).

Once the app is created in the Spark master, the resources are allocated to the apps by Spark master, creating an execution called the Spark driver. The Spark driver basically creates the SparkContext. When it creates the SparkContext, it starts creating the RDDs. The metadata of the RDDs are stored on the Spark driver.

The Spark driver connects to the Spark master and is responsible for converting an application to a directed graph (DAG) of individual tasks that get executed within an executor process on the worker nodes. Each application gets its own executor processes, which stay up for the duration of the whole application and run tasks in multiple threads.

Data sharing between operations is faster, since data is in-memory. Hadoop shares data through HDFS, an expensive option. It also maintains three replicas. Spark stores data in-memory without any replication.


On top of Spark Core runs a compliment of higher-level libraries that can be seamlessly used in the same application: Spark SQL, Spark Streaming, MLlib, and GraphX. This means that much of the work you perform to execute batch processing on Spark can be reused for streaming data and other activities.

## Working with data

[Resilient Distributed Datasets (RDDs)](http://spark.apache.org/docs/latest/programming-guide.html#resilient-distributed-datasets-rdds) are the primary abstraction in Spark, a fault-tolerant collection of elements stored in-memory or on-disk that can be operated on in parallel. An RDD can hold any time of object, and is created by loading an external dataset or distributing a collection from the driver program.

There are two types of RDDs:

1. **Parallelized collection** which applies a parallel transformation to an existing Scala collection; users must specify the number of partitions.
2. **A Hadoop data set** to run functions on each record of a file in HDFS or any other storage system supported by Hadoop.

An RDD can be persisted in-memory across operations. When an RDD is persisted, each node stores any partitions of it that it computes in-memory and then reuses them in other actions on the data set. You can mark an RDD as persistent just by calling the `persist()` or `cache()` method. You can also specify the storage level: on-disk or in-memory as a serialized Java object. Cached, or persistent, RDDs are fault-tolerant without replication.

Each RDD maintains its lineage (for example, the sequence of transformations that resulted in the RDD). If an RDD is lost because a node crashed, it can be reconstructed by replaying the sequence of operations.

There are two types of operations that RDDs support:

1. [**Transformations**](http://spark.apache.org/docs/latest/programming-guide.html#transformations) create a new data set from an existing data set. They're considered *lazy*, meaning they do not compute their results right away. They are only computed when an action requires a result to be returned to the driver program. This does not apply to persistent RDDs. Examples include: map, filter, sample, union, and more.
2. [**Actions**](http://spark.apache.org/docs/latest/programming-guide.html#actions) return a value to the driver program after running a computation on the data set. Examples include: reduce, collect, count, first, foreach, etc.

### Transformations and actions code sample

The following code sample demonstrates searching through error messages in a log file that is stored in HDFS:
```Scala
    val file = spark.textFile("hdfs://...")
    val errors = file.filter(line => line.contains("ERROR"))
    // Cache errors
    errors.cache() 
    // Count all the errors
    errors.count()
    // Count errors mentioning MySQL
    errors.filter(line => line.contains(“Web")).count()
    // Fetch the MySQL errors as an array of strings
    errors.filter(line => line.contains(“Error")).collect()
```
In this sample, we're using `hdfs()` and `filter()` **transformations**, and `count()` and `collect()` **actions**.

Notice that in the block of sample code, there are 4 comments:

* **Cache errors** – Implementing the `cache()` method will collect all of the errors present.
* **Count all errors** – Calling the `count()` action counts all the errors in the referenced data.
* **Count errors mentioning MySQL** – When implementing this code, MySQL errors are counted with the count action.
* **Fetch the MySQL errors as an array of strings** – When implementing this code, MySQL errors are extracted as an array of strings by way of the collect action.

### RDD-supported transformations

| Transformation | Description |
| -- | -- |
| `map(func)` | Returns a new distributed data set formed by passing each element of the source through a function func. |
| `filter(func)` | Returns a new data set formed by selecting those elements of the source on which func returns true. |
| `flatmap(func)` | Similar to map, but allows each input item to be mapped to zero or more output items (func should return a Seq rather than a single item). |
| `sample(withReplacement, fraction, seed)` | Samples a fraction of the data, with or without replacement, using a given random number generator seed. |
| `union(otherDataset)` | Returns a new data set that contains the union of the elements in the source data set and in the argument. |
| `distinct(([numTasks]))` | Returns a new data set that contains the distinct elements of the source data set. |
| `groupBykey([numTasks])` | When called on a data set of (K, V) pairs, returns a data set of (K, Seq[V]) pairs. |
| `reduceByKey(func, [numTasks])` | When called on a data set of (K, V) pairs, returns a data set of (K, V) pairs where the values for each key are aggregated using the given reduce function. |
| `sortByKey([ascending], [numTasks])` | When called on a data set of (K, V) pairs where K implements are ordered, returns a data set of (K, V) pairs sorted by keys in ascending or descending order, as specified in the Boolean ascending argument. |
| `join(otherDataset,[numTasks])` | When called on data sets of type (K, V) and (K, W), returns a data set of (K, (V, W)) pairs with all pairs of elements for each key. |
| `cogroup(otherDataset, [numTasks])` | When called on data sets of type (K, V) and (K, W), returns a data set of (K, Seq[V], Seq[W]) tuples, also called groupWith. |
| `cartesian(otherDataset)` | When called on data sets of types T and U, returns a data set of (T, U) pairs (all pairs of elements). |

### RDD-supported actions

| Action | Description |
| -- | -- |
| `saveAsTextFile(path)` | Writes the elements of the data set as a text file (or a set of text files) in a given directory in either the local filesystem, HDFS, or other Hadoop-supported file systems. Spark will call ToString on each element to convert it to a line of text in the file. |
| `saveAsSequenceFile(path)` | Writes the elements of the data set as a Hadoop SequenceFile in a given path in the local filesystem, HDFS, or any other Hadoop-supported file system. Only available on RDDs of key-value pairs that either implement the Writable interface of Hadoop, or are implicitly convertible to Writable (Spark includes conversions for basic types like Int and Double, String). |
| `countByKey()` | Returns a “Map” of (K, Int) pairs with the count of each key. Only available on RDDs of type (K, V).  |
| `foreach(func)` | Runs a function func on each element of the data set. Usually done for side effects, such as updating an accumulator.
| `reduce(func)` | Aggregates elements of the data set using a function func (which takes two arguments and returns one), and should be commutative and associative in order to be computed correctly in parallel. |
| `collect()` | Returns all the elements of the data set as an array at the driver program. Usually useful after a filter or other operation returns a sufficiently small subset of the data. |
| `first()` | Returns the first element of the data set—similar to take(n). |
| `count()` | Returns the number of elements in the data set. |
| `take(n)` | Returns an array with the first n elements of the data set. Currently not executed in parallel, instead the driver program computes all the elements. |
| `takeSample (withReplacement, fraction, seed)` | Returns an array with a random sample of num elements of the data set, with or without replacement, using the given random number generator seed. |

### RDD-supported persistence options

| Option | Description |
| -- | -- |
| `MEMORY_ONLY` | Stores RDD as deserialized Java objects in the JVM. If the RDD does not fit in-memory, some partitions will not be cached and will be recomputed on the fly each time they are needed. This is the default level. |
| `MEMORY_AND_DISK` | Stores RDD as deserialized Java objects in the JVM. If the RDD does not fit in-memory, store the partitions that do not fit on-disk, and read them from there when they are needed. |
| `MEMORY_ONLY_SER` | Stores RDD as serialized Java objects (one byte array per partition). This is generally more space-efficient than deserialized objects, especially when using a fast serializer, but it is more CPU-intensive to read. |
| `MEMORY_AND_DISK_SER` | Similar to MEMORY_ONLY_SER, but spills partitions that do not fit in-memory to disk, instead of recomputing them on the fly each time they are needed. |
| `DISK_ONLY` | Stores the RDD partitions only on-disk. |
| `MEMORY_ONLY_2, MEMORY_AND_DISK_2, and more` | Same as the levels above, but replicates each partition on two cluster nodes. |

### END of original content

Apache Spark is evolving at a rapid pace, including changes and additions to core APIs. One of the most disruptive areas of change is around the representation of data sets. Spark 1.0 used the RDD API but in the past twelve months, two new alternative and incompatible APIs have been introduced. Spark 1.3 introduced the radically different DataFrame API and the recently released Spark 1.6 release introduces a preview of the new Dataset API.

Many existing Spark developers will be wondering whether to jump from RDDs directly to the Dataset API, or whether to first move to the DataFrame API. Newcomers to Spark will have to choose which API to start learning with.

This article provides an overview of each of these APIs, and outlines the strengths and weaknesses of each one. A companion github repository provides working examples that are a good starting point for experimentation with the approaches outlined in this article.

The RDD (Resilient Distributed Dataset) API has been in Spark since the 1.0 release. From a developer’s perspective, an RDD is simply a set of Java or Scala objects representing data.

The RDD API provides many transformation methods, such as map(), filter(), and reduce() for performing computations on the data. Each of these methods results in a new RDD representing the transformed data. However, these methods are just defining the operations to be performed and the transformations are not performed until an action method is called. Examples of action methods are collect() and saveAsObjectFile().

Example of RDD transformations and actions
Scala:

```Scala
    rdd.filter(_.age > 21)               // transformation
        .map(_.last)                     // transformation                     
        .saveAsObjectFile("under21.bin") // action
```

```Java
    rdd.filter(p -> p.getAge() < 21)     // transformation 
        .map(p -> p.getLast())            // transformation
        .saveAsObjectFile("under21.bin"); // action
```` 

The main advantage of RDDs is that they are simple and well understood because they deal with concrete classes, providing a familiar object-oriented programming style with compile-time type-safety. For example, given an RDD containing instances of Person we can filter by age by referencing the age attribute of each Person object:

Example: Filter by attribute with RDD

```Scala
    rdd.filter(_.age > 21)  
```

```Java
    rdd.filter(person -> person.getAge() > 21)
```

The main disadvantage to RDDs is that they don’t perform particularly well. Whenever Spark needs to distribute the data within the cluster, or write the data to disk, it does so using Java serialization by default (although it is possible to use Kryo as a faster alternative in most cases). The overhead of serializing individual Java and Scala objects is expensive and requires sending both data and structure between nodes (each serialized object contains the class structure as well as the values). There is also the overhead of garbage collection that results from creating and destroying individual objects.

## DataFrame API

Spark 1.3 introduced a new DataFrame API as part of the Project Tungsten initiative which seeks to improve the performance and scalability of Spark. The DataFrame API introduces the concept of a schema to describe the data, allowing Spark to manage the schema and only pass data between nodes, in a much more efficient way than using Java serialization. There are also advantages when performing computations in a single process as Spark can serialize the data into off-heap storage in a binary format and then perform many transformations directly on this off-heap memory, avoiding the garbage-collection costs associated with constructing individual objects for each row in the data set. Because Spark understands the schema, there is no need to use Java serialization to encode the data.

The DataFrame API is radically different from the RDD API because it is an API for building a relational query plan that Spark’s Catalyst optimizer can then execute. The API is natural for developers who are familiar with building query plans, but not natural for the majority of developers. The query plan can be built from SQL expressions in strings or from a more functional approach using a fluent-style API.

Example: Filter by attribute with DataFrame
Note that these examples have the same syntax in both Java and Scala
```Scala
    //SQL Style
    df.filter("age > 21");

    //Expression builder style:
    df.filter(df.col("age").gt(21));
```
Because the code is referring to data attributes by name, it is not possible for the compiler to catch any errors. If attribute names are incorrect then the error will only detected at runtime, when the query plan is created.

Another downside with the DataFrame API is that it is very scala-centric and while it does support Java, the support is limited. For example, when creating a DataFrame from an existing RDD of Java objects, Spark’s Catalyst optimizer cannot infer the schema and assumes that any objects in the DataFrame implement the scala.Product interface. Scala case classes work out the box because they implement this interface.

## Dataset API

The Dataset API, released as an API preview in Spark 1.6, aims to provide the best of both worlds; the familiar object-oriented programming style and compile-time type-safety of the RDD API but with the performance benefits of the Catalyst query optimizer. Datasets also use the same efficient off-heap storage mechanism as the DataFrame API.

When it comes to serializing data, the Dataset API has the concept of encoders which translate between JVM representations (objects) and Spark’s internal binary format. Spark has built-in encoders which are very advanced in that they generate byte code to interact with off-heap data and provide on-demand access to individual attributes without having to de-serialize an entire object. Spark does not yet provide an API for implementing custom encoders, but that is planned for a future release.

Additionally, the Dataset API is designed to work equally well with both Java and Scala. When working with Java objects, it is important that they are fully bean-compliant. In writing the examples to accompany this article, we ran into errors when trying to create a Dataset in Java from a list of Java objects that were not fully bean-compliant.

![Unified API](./media/hdinsight-spark-rdd-vs-dataframe-vs-dataset/unfied-api.png)


## Example: Creating Dataset from a list of objects

```Scala
    val sc = new SparkContext(conf)
    val sqlContext = new SQLContext(sc)
    import sqlContext.implicits._
    val sampleData: Seq[ScalaPerson] = ScalaData.sampleData()
    val dataset = sqlContext.createDataset(sampleData)
```
```Java
    JavaSparkContext sc = new JavaSparkContext(sparkConf);
    SQLContext sqlContext = new SQLContext(sc);
    List data = JavaData.sampleData();
    Dataset dataset = sqlContext.createDataset(data, Encoders.bean(JavaPerson.class));
```
Transformations with the Dataset API look very much like the RDD API and deal with the Person class rather than an abstraction of a row.

Example: Filter by attribute with Dataset
```Scala
    dataset.filter(_.age < 21);
```
```Java
    dataset.filter(person -> person.getAge() < 21);
```
Despite the similarity with RDD code, this code is building a query plan, rather than dealing with individual objects, and if age is the only attribute accessed, then the rest of the the object’s data will not be read from off-heap storage.

## Conclusions

If you are developing primarily in Java then it is worth considering a move to Scala before adopting the DataFrame or Dataset APIs. Although there is an effort to support Java, Spark is written in Scala and the code often makes assumptions that make it hard (but not impossible) to deal with Java objects.

If you are developing in Scala and need your code to go into production with Spark 1.6.0 then the DataFrame API is clearly the most stable option available and currently offers the best performance.

However, the Dataset API preview looks very promising and provides a more natural way to code. Given the rapid evolution of Spark it is likely that this API will mature very quickly through 2017 and become the de-facto API for developing new applications.

## See also

* [Get started: Create an Apache Spark cluster in HDInsight and run interactive Spark SQL queries](https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-apache-spark-jupyter-spark-sql)
* [Spark SQL, DataFrames and Datasets Guide](https://spark.apache.org/docs/2.0.0/sql-programming-guide.html#datasets-and-dataframes)




