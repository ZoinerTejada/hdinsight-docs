---
title: Use Spark with HDInsight - Azure HDInsight | Microsoft Docs
description: ''
services: hdinsight
documentationcenter: ''

tags: azure-portal
keywords: spark,batch processing

---
# Use Spark with HDInsight

[Spark on HDInsight](https://docs.microsoft.com/azure/hdinsight/hdinsight-apache-spark-overview) provides us with a unified framework for running large-scale data analytics applications that capitalizes on an in-memory compute engine at its core, for high performance querying on big data. It leverages a parallel data processing framework that persists data in-memory and disk if needed. This allows Spark to deliver both 100x faster speed and a common execution model to various tasks like extract, transform, load (otherwise known as ETL), batch, and interactive queries on data in Hadoop distributed file system (or, HDFS). One of the advantages Spark's unified framework gives us, is the ability to use the same code for both batch processing and realtime stream processing.

## Spark cluster architecture

Here is the Spark cluster architecture and how it works:

![Spark cluster architecture](./media/hdinsight-spark-with-hdinsight/spark-architecture.png)

In the head node, we have the Spark master that manages the number of applications, the apps are mapped to the Spark driver. Every app is managed by Spark master in various way. Spark can be deployed on top of Mesos, Yarn, or the Spark cluster manager, which allocates worker node resources to an application. The resources in the cluster are managed by Spark master in the HDInsight. That means the Spark master has knowledge of which resources, like memory, are occupied or available on the worker node.

The driver runs the user's main function and executes the various parallel operations on the worker nodes. Then, the driver collects the results of the operations. The worker nodes read and write data from and to the Hadoop distributed file system (HDFS). The worker nodes also cache transformed data in-memory as Resiliant Distributed Datasets (RDDs).

## The Spark cluster architecture driver

The driver performs the following:

![Spark cluster architecture driver](./media/hdinsight-spark-with-hdinsight/spark-driver.png)

Once the app is created in the Spark master, the resources are allocated to the apps by Spark master, creating an execution called the Spark driver. The Spark driver basically creates the SparkContext. When it creates the SparkContext, it starts creating the RDDs. The metadata of the RDDs are stored on the Spark driver.

The Spark driver connects to the Spark master and is responsible for converting an application to a directed graph (DAG) of individual tasks that get executed within an executor process on the worker nodes. Each application gets its own executor processes, which stay up for the duration of the whole application and run tasks in multiple threads.


Submit [remote batch jobs](https://docs.microsoft.com/azure/hdinsight/hdinsight-apache-spark-livy-rest-interface) to an HDInsight Spark cluster.

## Batch processing in Spark

When working with big data, you have two high-level options with which you can process that data: [stream processing](hdinsight-streaming-at-scale-overview.md) and batch processing. If your needs dictate real-time (subsecond) processing, you will opt to process your data using a stream processing component, like Spark Streaming. On the other hand, batch processing is for queries or programs that take much longer, such as tens of minutes, hours, or days to complete.

Some example batch processing scenarios include ETL (extract-transform-load) pipelines, working with extremely large, pre-existing datasets, or in situations where computation or transformation against the data takes significant time.

Whether working with large datasets through batch processing, or stream processing, a common way to work with the data more efficiently is through a concept called *schema on read*. As the name implies, you apply the data's schema as you are loading it from disk, or memory. This offers the flexibility of working with data from various sources and formats that do not already have the schema applied. You can take the data in whatever format it arrives and overlay a schema you've created to make it easier to work with that data.

Spark offers a very fast processing engine for running batch processing against very large data sets, while making the core processing engine available to stream processing as well.

## Spark vs. traditional MapReduce

What makes Spark fast? How is the architecture of Apache Spark different than traditional MapReduce, allowing it to offer better performance for data sharing?

![Traditional MapReduce vs. Spark](./media/hdinsight-spark-with-hdinsight/mapreduce-vs-spark.png)

Spark provides primitives for in-memory cluster computing. A Spark job can load and cache data into memory and query it repeatedly, much more quickly than disk-based systems. Spark also integrates into the Scala programming language to let you manipulate distributed data sets like local collections. There's no need to structure everything as map and reduce operations.

Data sharing between operations is faster, since data is in-memory. Hadoop shares data through HDFS, an expensive option. It also maintains three replicas. Spark stores data in-memory without any replication.

![Spark: a unified framework](./media/hdinsight-spark-with-hdinsight/spark-unified.png)

At its base, [Spark Core](https://mvnrepository.com/artifact/org.apache.spark/spark-core_2.10/latest) is the engine that drives the distributed, large-scale parallel processing, memory management/fault recovery, the scheduling, distribution, and monitoring of jobs on a cluster, and interaction with the underlying storage system.

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

### Accumulators

![Accumulators](./media/hdinsight-spark-with-hdinsight/accumulators.png)

Accumulators are variables that can only be added to through an associative operation. They are used to implement counters and sums efficiently in parallel. Spark natively supports accumulators of numeric value types and standard mutable collections. It is possible for programmers to extend for new types. One thing of note, only the driver program can read the value of an accumulator; the tasks cannot.

### Working with DataFrames

A DataFrame is a distributed collection of data organized into named columns. It is conceptually equivalent to a table in a relational database or a data frame in R/Python, but with richer optimizations under the hood. DataFrames can be constructed from a wide array of sources such as: structured data files, tables in Hive, external databases, or existing RDDs. The DataFrame API is available in Scala, Java, and Python.

![DataFrames](./media/hdinsight-spark-with-hdinsight/dataframes.png)

Once built, DataFrames provide a domain-specific language for distributed data manipulation. You can also incorporate Spark SQL while working with DataFrames. Data scientists are employing increasingly sophisticated techniques that go beyond joins and aggregations. To support this, DataFrames can be used directly in the MLlib machine learning pipeline API. In addition, programs can run arbitrarily complex user functions on DataFrames.

### Creating DataFrames from data sources

A Spark data source can read in data to create DataFrames, which has a schema that Spark understands. Examples include: JSON files, JDBC source, Parquet, and Hive tables. 

    >>> val df = sqlContext.jsonFile(”somejasonfile.json“)			      //from JSON file*
    >>> val df = hiveContext.table(”somehivetable“)				      //from a  Hive Table
    >>> val df = sqlContext.parquetFile(”someparquetsource“)		      //from a parquet file
    >>> val df = sqlContext.load(source="jdbc", url=“UrlToConnect", dbtable=“tablename") //from JDBC source

The DataFrame interface makes it possible to operate on a variety of data sources. A DataFrame can be operated on as a normal RDD and/or registered as a temporary table. Registering a DataFrame as a table allows you to run SQL queries over its data. Below is a list of the general methods for loading and saving data using the Spark data sources, with some specific options that are available for the built-in data sources.

#### JSON file
You can also manually specify the data source that will be used along with any extra options that you would like to pass to the data source. Data sources are specified by their fully qualified name (for example, org.apache.spark.sql.parquet), but for built-in sources you can also use the shortened name (JSON, Parquet, JDBC). DataFrames of any type can be converted into other types using this syntax.

Spark SQL can automatically infer the schema of a JSON dataset and load it as a DataFrame. This conversion can be done using one of two methods in a SQLContext:
* `jsonFile` – Loads data from a directory of JSON files, where each line of the files is a JSON object.
* `jsonRDD` – Loads data from an existing RDD, where each element of the RDD is a string containing a JSON object.

Note that the file that is offered as `jsonFile` is not a typical JSON file. Each line must contain a separate, self-contained valid JSON object. As a consequence, a regular multi-line JSON file will most often fail.

#### Hive table
Spark SQL also supports reading and writing data stored in Apache Hive. However, since Hive has a large number of dependencies, it is not included in the default Spark assembly. Hive support is enabled by adding the -Phive and -Phive-thriftserver flags to the Spark build. This command builds a new assembly jar that includes Hive. Note that this Hive assembly jar must also be present on all of the worker nodes, as they will need access to the Hive serialization and deserialization libraries (SerDes) in order to access data stored in Hive.
Configuration of Hive is done by placing your `hive-site.xml` file in conf/.

#### Parquet file
In the simplest form, the default data source (parquet unless otherwise configured by spark.sql.sources.default) will be used for all operations.

#### Java Database Connectivity (JDBC) source
Spark SQL also includes a data source that can read data from other databases using JDBC. This functionality should be preferred over using JdbcRDD. This is because the results are returned as a DataFrame and can be easily processed in Spark SQL or joined with other data sources. The JDBC data source is also easier to use from Java or Python as it does not require the user to provide a ClassTag. (Note that this is different than the Spark SQL JDBC server, which allows other applications to run queries using Spark SQL.)

### Creating DataFrames from RDDs

You can create DataForms from existing RDDs in two ways:

1. **Use reflection:** Infer the schema of an RDD that contains specific types of objects. This approach leads to more concise code. It works well when you already know the schema while writing your Spark application.
2. **Specify the schema programmatically:** Enables you to construct a schema then apply it to an existing RDD. This method is more verbose, but it enables you to construct DataFrames when the columns and their types are not known until runtime.

#### Create DataFrames from existing a JSON RDD, using the `jsonRDD` function.

    >>> val df = sqlContext.jsonRDD(anUserRDD)

### DataFrame operations

DataFrames provide a domain-specific language for structured data manipulation in Scala, Java, and Python. Below is a sample of various operations you can use:

    >>> val df = sqlContext.jsonFile(”somejsonfile.json“)
    >>> df.show()				 	// Show the contents of the DataFrame
    >>> df.printSchema()				// Print the schema in a tree format
    >>> df.select(“name”).show()			// Select and show the name columns
    >>> df.select(df(”name”),df (“age”) +1).show() 	// Select all but increment the age by 1
    >>> df.filter(df(”age”) > 21).show()		// Select people older than 21
    >>> df.groupBy(“age”).count().show()		// Count people by age

Through certain DataFrame operations, you can use `SQLContext` to understand the construction and demographics of your data.

| Option | Description |
| -- | -- |
| `df.show()` | This operation shows the contents of the data you have selected |
| `df.printSchema()` | This operation prints your schema (table) in a tree format |
| `df.select(“name”).show()` | This operation will select and display the name you have selected for the columns you’ve specified |
| `df.select(dr(“name”),df(“age”) + 1).show()` | This operation example will select all your data as well as add one to each of the ages shown |
| `df.filter(df(“age”) > a21.show()` | This operation example will select all data that shows that the data is greater than 21 |
| `df.groupBy(“age”).count().show()` | This operation example will count the data you’ve selected by age and show you only the results that meet the criteria you’ve presented |


## See also

* Some overview link

### Scenarios


