---
title: Streaming at Scale - Azure HDInsight | Microsoft Docs
description: ''
services: hdinsight
documentationcenter: ''

tags: azure-portal
keywords: apache storm,storm cluster,kafka,streaming

---
# Streaming at Scale

Many of today's Big Data solutions must act on data in motion at any given point in time. In other words, realtime streaming data. In most cases, this data is most valuable at its time of arrival, such as stock market data, anomaly data used for fraud detection, social networking information that detects trending topics, etc. These applications require transparently scaling their computation models to large clusters, ensuring that valuable information isn't lost when huge spikes of streaming data come rushing in. Being able to quickly scale your solution by adding nodes on demand can be the difference between missing out on incoming information and making a key decision.

To ease the process of scaling streaming platforms, such as Kafka, Apache Storm, or Spark Streaming, HDInsight offers an elegant scale model without the need to throttle your resources. Unlike running one of these streaming platforms on-premises, HDInsight does not require you to have intimate knowledge of scaling a cluster without disrupting any currently running pipelines. All of the necessary steps are handled for you when scaling is performed through the HDInsight utilities.

## What does a streaming architecture look like?

From a very high level, you have one or more data sources generating events (sometimes in the millions per second) that need to be ingested very quickly to avoid dropping any useful information. This is handled by the Stream Buffering, or event queuing, layer by a service such as [Kafka]() or [Event Hubs](). Once you collect your events, you can then analyze the data using any real-time analytics system within the Stream Processing layer, such as [Storm](), [Spark Streaming](), [Azure Stream Analytics](), or similar. This processed data can be stored in long-term storage systems, like [Azure Data Lake Store](), or displayed in real-time on a [Power BI]() dashboard or custom web page. 
![HDInsight Streaming Patterns](./media/hdinsight-streaming-at-scale-overview/HDInsight-streaming-patterns.png)

When using Kafka as your ingest service, your options for stream processing are Spark and Storm.

Use the following button to deploy a new Azure virtual network, Kafka, and **Spark** clusters to your Azure subscription:

<a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fhditutorialdata.blob.core.windows.net%2Farmtemplates%2Fcreate-linux-based-kafka-spark-cluster-in-vnet-v2.json" target="_blank"><img src="./media/hdinsight-streaming-at-scale-overview/deploy-to-azure.png" alt="Deploy to Azure"></a>

Alternately, deploy a new Azure virtual network with Kafka and **Storm** clusters:

<a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fhditutorialdata.blob.core.windows.net%2Farmtemplates%2Fcreate-linux-based-kafka-storm-cluster-in-vnet.json" target="_blank"><img src="./media/hdinsight-streaming-at-scale-overview/deploy-to-azure.png" alt="Deploy to Azure"></a>

There are other options when designing your streaming architecture by incorporating other Azure services that are not necessarily part of the HDInsight platform. The following diagram illustrates using [Event Hubs]() for ingest, while opening up additional processors, such as [Stream Analytics](), [EventProcessor Host](), [Service Fabric](), and [Azure Functions](). The rest of the article will focus on scaling with Kafka and Storm or Spark Streaming.
![HDInsight Streaming Patterns](./media/hdinsight-streaming-at-scale-overview/HDInsight-streaming-patterns2.png)



## Reliability

Apache Storm guarantees that each incoming message is always fully processed, even when the data analysis is spread over hundreds of nodes.

The Nimbus node provides functionality similar to the Hadoop JobTracker, and it assigns tasks to other nodes in a cluster through Zookeeper. Zookeeper nodes provide coordination for a cluster and facilitate communication between Nimbus and the Supervisor process on the worker nodes. If one processing node goes down, the Nimbus node is informed, and it assigns the task and associated data to another node.

The default configuration for Apache Storm clusters is to have only one Nimbus node. Storm on HDInsight provides two Nimbus nodes. If the primary node fails, the Storm cluster switches to the secondary node while the primary node is recovered. The following diagram illustrates the task flow configuration for Storm on HDInsight:


## Scale

HDInsight clusters can be dynamically scaled by adding or removing worker nodes. This operation can be performed while processing data.

> [!IMPORTANT]
> To take advantage of new nodes added through scaling, you need to rebalance Storm topologies started before the cluster size was increased.


## Next steps

Learn more about real-time analytics solutions with Storm on HDInsight:

* [Get started with Apache Storm on HDInsight][gettingstarted]
* [Example topologies for Apache Storm on HDInsight](hdinsight-storm-example-topology.md)

[stormtrident]: https://storm.apache.org/documentation/Trident-API-Overview.html
[samoa]: http://yahooeng.tumblr.com/post/65453012905/introducing-samoa-an-open-source-platform-for-mining
[apachetutorial]: https://storm.apache.org/documentation/Tutorial.html
[gettingstarted]: hdinsight-apache-storm-tutorial-get-started-linux.md