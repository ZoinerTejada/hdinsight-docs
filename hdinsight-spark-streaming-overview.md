# What is Spark Streaming?

Spark Streaming enables you to implement scalable, high-throughput, fault-tolerant applications for the processing of data streams. You can run your Spark Streaming applications on HDInsight Spark clusters, and connect it to process data from a variety of sources such as Azure Event Hubs, Azure IoT Hub, Kafka, Flume, Twitter, ZeroMQ, raw TCP sockets or even by monitoring the HDFS filesystem for changes. 

Spark Streaming creates a long running job during which you are able to apply transformations to the data (such as map, reduce, join and extract data by windows of time) and then push out the results to filesystems, databases, dashboards and the console. 

![Stream Processing with HDInsight and Spark Streaming ](./media/hdinsight-spark-streaming-overview/hdinsight-spark-streaming.png)

Spark Streaming takes a micro-batch approach to how it processes data. This means that it must first wait to collect a time-defined batch of events (usually configred in the range of less than a second to a few seconds), before it sends the batch of events on for processing. This is in contrast to approaches that would receive a single event and process that single event immediately. The benefit of the micro-batch approach, as you will see, is it lets more efficiently process data that is rapidly ingested into your solution and gives you an abstraction that makes applying aggregate calculations on the events a little easier. 

The design goals of Spark Streaming include low latency (measured in seconds) and linear scalability. However, what sets Spark Streaming apart are its support for fault tolerance with the guarantee that any given event would be processed exactly once, even in the face of a node failure. Additionally, Spark Streaming is integrated with the Spark core API, giving Spark developers a familiar programming model and new developers one less new framework to learn when first starting with Spark. 

## Introducing the DStream  
Spark Streaming represents a continous stream of data using a discretized stream or DStream. This DStream can be created from input sources like Event Hubs or Kafka, or by applying transformation on another DStream. 

The DStream represents a few layers of abstraction on top of the raw event data. To understand how they work, it helps to build up a DStream from a single event. 

Start with a single event, say a temperature reading from a connected thermostat. When this event arrives at your Spark Streaming application, the first thing that happens is the event is stored in a reliable way- it is replicated so that multiple nodes have a copy of your event. This ensures that the failure of any single node will not result in the loss of your event. Spark core has a data structure that distributes data across multiple nodes in the cluster, where each node generally maintains its data completely in-memory for best performance. This data structure is called a resilient distributed dataset or RDD. The temperature reading event will be stored in an RDD. 

Each RDD represents a window of time in the stream and the set of RDD's is further collected into a DStream. Each DStream represent a sequence of RDD's where the continous stream of data is split into discrete batches of a configured size, measured in seconds. So for example, if the batch size was configured to be 1 second long, your DStream emits a batch every second containing a collection of RDD's that contain the data ingested during that second. When processing the DStream, the temperature event would appear in one of these batches. A Spark Streaming application that processes these events, processes the batches that contains the events. 

![Example DStream with Temperature Events ](./media/hdinsight-spark-streaming-overview/hdinsight-spark-streaming-example.png)

## Structure of a Spark Streaming Application
A Spark Streaming application is a long running application that receives data from ingest sources, applies transformation to process the data and then pushes the data out to one or more destinations. The structure of a Spark Streaming application has two main parts. First, you define the processing logic that includes where the data comes from, what processing to do on the data and where the results should go. Second, you run the defined application indefinitely, waiting for any signals to stop the long running application.

To give you a sense for the structure of a Spark Streaming Application, we will show a simple application that receives a line of text over a TCP socket and counts the number of times each word appears. 

### Define the application
The application definition consists of four main steps: creating a StreamingContext, creating a DStream from the StreamingContext, applying transformations to the DStream and ouputting the results. During this phase you are just describing the application logic, no actual transformations are applied or is output emitted until you run the application (as shown in the second phase).

#### Create a StreamingContext
Create a StreamingContext from the SparkContext that points to your cluster. When creating a StreamingContext you specify the size of the batch in seconds. In this example, we create the StreamingContext so it has a batch size of one second.

    val ssc = new StreamingContext(spark, Seconds(1))

#### Create a DStream
Using the StreamingContext instance you created, create an input DStream for your input source. In this case, we are opening watching for the appearance of new files in default storage attached to the HDInsight cluster. 

    val lines = ssc.textFileStream("/uploads/2017/01/")

#### Apply transformations
You implement the processing by applying transformations on the DStream. Our application will receive one line of text at a time from the file, split each line into words, and then follows the map reduce pattern to count the number of times each word appears.

    val words = lines.flatMap(_.split(" "))
    val pairs = words.map(word => (word, 1))
    val wordCounts = pairs.reduceByKey(_ + _)

#### Output results
Push the transformation results out to the destination systems by applying output operations. In this case, we show the result of each run thru the computation in the console output. 

    wordCounts.print()

### Run the application
Start the streaming application and run until a termination signal is received. 

    ssc.start()            
    ssc.awaitTermination()

For details on the Spark Stream API, along with the event sources, transformations and output operations it supports see [Spark Streaming Programming Guide](https://people.apache.org/~pwendell/spark-releases/latest/streaming-programming-guide.html).

## Sliding Windows
If you want to perform aggregate calculations on your DStream over some time period, for example to get an average temperature over the last 2 seconds, you can use the sliding window operations included with Spark Streaming. A sliding window is defined as having a duration (referred to as the window length) and the interval at which the window's content are evaluated (referred toas the slide interval). 

These sliding windows can overlap, for example you can define a window with a length of 2 seconds, that slides every 1 second. This means every time you perform an aggregation calculation, the window will include data from the last 1 second of the previous window as well as any new data in the next 1 second. 

![Example Initial Window with Temperature Events ](./media/hdinsight-spark-streaming-overview/hdinsight-spark-streaming-window-01.png)

![Example Window with Temperature Events After Sliding](./media/hdinsight-spark-streaming-overview/hdinsight-spark-streaming-window-02.png)

The sliding window functions available in the Spark Streaming API include window, countByWindow, reduceByWindow and countByValueAndWindow. For details on these functions see [Transformations on DStreams](https://people.apache.org/~pwendell/spark-releases/latest/streaming-programming-guide.html#transformations-on-dstreams).

## Checkpointing
In order to deliver resiliency and fault tolerance, Spark Streaming relies on checkpointing to insure that stream processing can continue uninterrupted, even in the face of node failures. In HDInsight, Spark creates checkpoints to durable storage (Azure Storage or Data Lake Store). These checkpoints store the metadata about the streaming application- such as the configuration, the operations defined by the application and any batches that were queued but not yet processed. In some cases, the checkpoints will also include the saving of the data in the RDD's to shorten the time it takes to rebuild the state of the data from what is presend in the RDD's managed by Spark. 

## Deploying Spark Streaming Applications
You typically build your Spark Streaming application locally and then deploy it to Spark on HDInsight by copying the JAR file that contains your application to the default storage attached to your HDInsight cluster. Then you can start your application by using the LIVY REST API's available from your cluster. This is a POST operation where the body of the POST includes a JSON document that provides the path to your JAR, the name of the class whose main method defines and runs the streaming application, and optionally the resource requirements of the job (e.g., number of executors, memory and cores), and any configuration settings your application code requires. 

![Example Window with Temperature Events After Sliding](./media/hdinsight-spark-streaming-overview/hdinsight-spark-streaming-livy.png)

The status of all applications can also be checked with a GET request against a LIVY endpoint. Finally, you can terminate a running application by issuing a DELETE request against the LIVE endpoint. For details on the LIVY API, see [Remote jobs with LIVY](https://docs.microsoft.com/azure/hdinsight/hdinsight-apache-spark-livy-rest-interface)

## See also

* [Create an Apache Spark Cluster in HDInsight](https://docs.microsoft.com/azure/hdinsight/hdinsight-hadoop-create-linux-clusters-portal)
* [Spark Streaming Programming Guide](https://people.apache.org/~pwendell/spark-releases/latest/streaming-programming-guide.html)
* [Launch Spark jobs remotely with LIVY](https://docs.microsoft.com/azure/hdinsight/hdinsight-apache-spark-livy-rest-interface)