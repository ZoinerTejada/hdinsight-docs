---
title: An introduction to Apache Kafka on HDInsight - Azure | Microsoft Docs
description: 'Learn about Apache Kafka on HDInsight: What it is, what it does, and where to find examples and getting started information.'
services: hdinsight
documentationcenter: ''
author: Blackmist
manager: jhubbard
editor: cgronlun

ms.assetid: f284b6e3-5f3b-4a50-b455-917e77588069
ms.service: hdinsight
ms.custom: hdinsightactive
ms.devlang: na
ms.topic: get-started-article
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 06/15/2017
ms.author: larryfr
---
# Introducing Apache Kafka on HDInsight (preview)

[Apache Kafka](https://kafka.apache.org) is an open-source distributed streaming platform that can be used to build real-time streaming data pipelines and applications. Kafka also provides message broker functionality similar to a message queue, where you can publish and subscribe to named data streams. Kafka on HDInsight provides you with a managed, highly scalable, and highly available service in the Microsoft Azure cloud.

## Why use Kafka on HDInsight?

Kafka provides the following features:

* Publish-subscribe messaging pattern: Kafka provides a Producer API for publishing records to a Kafka topic. The Consumer API is used when subscribing to a topic.

* Stream processing: Kafka is often used with Apache Storm or Spark for real-time stream processing. Kafka 0.10.0.0 (HDInsight version 3.5) introduced a streaming API that allows you to build streaming solutions without requiring Storm or Spark.

* Horizontal scale: Kafka partitions streams across the nodes in the HDInsight cluster. Consumer processes can be associated with individual partitions to provide load balancing when consuming records.

* In-order delivery: Within each partition, records are stored in the stream in the order that they were received. By associating one consumer process per partition, you can guarantee that records are processed in-order.

* Fault-tolerant: Partitions can be replicated between nodes to provide fault tolerance.

* Integration with Azure Managed Disks: Managed disks provides higher scale and throughput for the disks used by the virtual machines in the HDInsight cluster.

    Managed disks are enabled by default for Kafka on HDInsight, and the number of disks used per node can be configured during HDInsight creation. For more information on managed disks, see [Azure Managed Disks](../storage/storage-managed-disks-overview.md).

    For information on configuring managed disks with Kafka on HDInsight, see [Increase scalability of Kafka on HDInsight](hdinsight-apache-kafka-scalability.md).

## Use cases

* **Messaging**: Since it supports the publish-subscribe message pattern, Kafka is often used as a message broker.

* **Activity tracking**: Since Kafka provides in-order logging of records, it can be used to track and re-create activities. For example, user actions on a web site or within an application.

* **Aggregation**: Using stream processing, you can aggregate information from different streams to combine and centralize the information into operational data.

* **Transformation**: Using stream processing, you can combine and enrich data from multiple input topics into one or more output topics.

## Architecture

![Kafka cluster](./media/hdinsight-apache-kafka-introduction/kafka-cluster.png)

The diagram above shows a typical Kafka configuration that uses consumer groups, partitioning, and replication to offer parallel reading of events, as well as fault tolerance. Apache ZooKeeper is built for concurrent, resilient, and low-latency transactions, managing state in the Kafka cluster. Kafka stores records in *topics*. Records are produced by *producers*, and consumed by *consumers*. Producers retrieve records from Kafka *brokers*. Each worker node in your HDInsight cluster is a Kafka broker. A partition is created per consumer, allowing parallel processing of the streaming data. Replication is employed to spread the partitions across nodes, protecting against node (broker) outages. A partition denoted with an *(L)* is the leader for the given partition. Producer traffic is routed to the leader of each node, per state managed by ZooKeeper. Rebalancing Kafka partition replicas helps us achieve high availability (Fault Domain/Update Domain awareness). The [partition replica rebalancing tool](https://github.com/hdinsight/hdinsight-kafka-tools) (`rebalance_rackaware.py`) distributes replicas of partitions of a topic across brokers in a manner such that each replica is in a separate fault domain and update domain. The tool also distibutes the leaders such that each broker has approximately the same number of leaders for partitions.

There are several advantages to deploying Kafka on HDInsight. The [partition replica rebalancing tool](https://github.com/hdinsight/hdinsight-kafka-tools) can be used to automatically rebalance the replicas after scaling or applying updates. HDInsight is the only provider in the industry to host a managed Kafka environment, while providing a 99.9% uptime SLA. HDInsight also uses a two-dimensional matrix for implementing rack awareness by way of an [update domain, and fault domain](https://docs.microsoft.com/azure/architecture/resiliency/high-availability-azure-applications), as opposed to using a single dimensional unit.

## Next steps

Use the following links to learn how to use Apache Kafka on HDInsight:

* [Get started with Kafka on HDInsight](hdinsight-apache-kafka-get-started.md)

* [Use MirrorMaker to create a replica of Kafka on HDInsight](hdinsight-apache-kafka-mirroring.md)

* [Use Apache Storm with Kafka on HDInsight](hdinsight-apache-storm-with-kafka.md)

* [Use Apache Spark with Kafka on HDInsight](hdinsight-apache-spark-with-kafka.md)

* [Connect to Kafka through an Azure Virtual Network](hdinsight-apache-kafka-connect-vpn-gateway.md)