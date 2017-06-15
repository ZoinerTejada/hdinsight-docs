

# Creating Spark Streaming jobs with exactly once event processing semantics
Stream processing applications may take different approaches to how they handle the re-processing of messages in the face of some failure in the system, these approaches yield different event processing semantics:
* At least once: In some cases, it is acceptable for a given event to be processed multiple times. If the system guarantees that the message will always get processed, but it may get processed more than once, than it provides an at least once semantics. 
* At most once: In some cases, it is acceptable to lose messages, but it is critical that messages not be processed more than once. A system to supports this is providing an at most once processing semantics.
* Exactly once: In other cases, a message must processed once and only once irrespective of failures in components of the system. Systems that support this provide an exactly once semantics. 

This article focuses on how you configure Spark Streaming to achieve exactly once processing semantics. 

## Achieving Exactly Once Semantics with Spark Streaming
To achieve exactly once processing of an event by a Spark Streaming application, you need to consider how all of the points of failure restart after having an issue and how you can avoid data loss. Consider that in a Spark Streaming application you have an input source, a driver process that manages the long running job, one or more receiver processes that pull data from the input source, and tasks that apply the processing and push the results to an output sink. To achieve exactly once semantics means ensuring that no data is lost at any point and that the processing is restartable, regadless of where the failure occurs. The following describes each of the key components of achieving exactly once semantics.

### Replayable Sources & Reliable Receivers
The source your Spark Streaming application is reading your events from must be replayable. This means that it should be possible to ask the source to provide the message again in cases where the message was retrieved but then the system failed before it could be persisted or processed. In Azure,  both Azure Event Hubs and Kafka on HDInsight provide replayable sources. An even simpler example of a replayable source is a fault-tolerant file system like HDFS, Azure Storage blobs or Azure Data Lake Store where all the data can be kept in perpetuity (and you can re-read it in its entirety at any point). In Spark Streaming, sources like Event Hubs and Kafka have reliable receivers, meaning they keep track of their progress reading thru the source and persist it to fault-tolerant storage (either within ZooKeeper or in Spark Streaming checkpoints written to HDFS). That way, if a receiver fails and is later restarted it can pick up where it left off.    

### Use the Write Ahead Log
Spark Streaming supports the use of a Write Ahead Log, where any event received from a source is first written to Spark's checkpoint directory in fault-tolerant storage (in Azure this is HDFS backed by either Azure Storage or Azure Data Lake Store) before being stored in an RDD by the receiver running within a worker. In your Spark Streaming application, the Write Ahead Log is enabled for all receivers by setting the ```spark.streaming.receiver.writeAheadLog.enable``` configuration to ```true```. The Write Ahead Log provides fault-tolerance for failures of both the driver and the executors.  

In the case of workers running tasks against the event data, consider that following the insertion into the Write Ahead Log, the event is inserted by the receiver into an RDD, which by definition is both replicated and distributed across multiple workers. Should the task fail because the worker running it crashed, the task will simply be restarted on another worker that has a replica of the event data, so the event is not lost. 

### Use Checkpoints
The drivers need to be restartable. If the driver running your Spark Streaming application crashes, it takes down with it all executors running receivers, tasks and any RDD's storing event data. This surfaces two considerations- first you need to be able to save the progress of the job so you can resume it later. This is accomplished by checkpointing the Directed Acyclic Graph (DAG) of the DStream periodically to fault-tolerant storage. This metadata includes the configuration used to create the streaming application, the operations that define the application, and any batches that are queued but not yet completed. This will enable a failed driver to be restarted from the checkpoint information. When it restarts, it will launch new receivers that themselves recover the event data back into RDD's from the Write Ahead Log. Checkpoints are enabled in Spark Streaming in two steps. On the StreamingContext object you configure the path in storage to where the checkpoints are stored:

    val ssc = new StreamingContext(spark, Seconds(1))
    ssc.checkpoint("/path/to/checkpoints)

In HDInsight, these checkpoints should be saved to your default storage attached to your cluster (either Azure Storage or Azure Data Lake Store). Next, you need to specify a checkpoint interval (in seconds) on the DStream that controls how often any state data (e.g., state derived from the input event) is persisted to storage. Persisting state data this way can reduce the computation needed when rebuilding the state from the source event. 

    val lines = ssc.socketTextStream("hostname", 9999)
    lines.checkpoint(30)
    ssc.start()
    ssc.awaitTermination()

### Use Idempotent Sinks
The destination to which your job writes results must be able to handle the situation where it is given the same result more than once. It must be able to detect such duplicate results and ignore them. You can achieve idempotent sinks by implementing logic that first checks for the existence of the result in the datastore. If the result already exists, the write should appear to succeed from the perspective of your Spark job, but in reality your data store ignored the duplicate data. If the result does not exist, then it should insert the new result into its storage. One example of this is to use a stored procedure with Azure SQL Database that is used to insert events into a table. When the stored procedure is invoked, it first looks up the event by key fields and only if none are found is the record inserted into the table. Another example is to use a partitioned file system, like Azure Storage blobs or Azure Data Lake store. In this case your sink logic does not need to check for the existence of a file. If the file representing the event exists, it is simply overwritten with the same data. Otherwise, a new file is created at the computed path. In the end idempotent sinks should support being called multiple times with the same data and no change of state should result. 

## Next steps
This article covered the key components of achieving exactly once semantics with your Spark Streaming applications. 

- Review [Spark Streaming Overview](hdinsight-spark-streaming-overview) for an architectural overview of a Spark Streaming application.
- See [Creating highly available Spark Streaming jobs in YARN](hdinsight-spark-streaming-high-availability.md) for guidance on how to enable high availability for your Spark Streaming applications in HDInsight.
