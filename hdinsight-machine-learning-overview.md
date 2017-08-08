---
title: Machine Learning Overview - Azure HDInsight | Microsoft Docs
description: ''
services: hdinsight
documentationcenter: ''

tags: azure-portal
keywords: machine learning,mahout,r,sparkml,mllib,scikit-learn

---
# Machine learning on HDInsight

HDInsight enables machine learning against big data, providing the ability to obtain valuable insight from large (petabytes, or even exabytes) of structured, unstructured, and fast-moving data. There are several machine learning options that run in HDInsight:

## SparkML and MLlib

[HDInsight Spark](https://docs.microsoft.com/azure/hdinsight/hdinsight-apache-spark-overview) is an Azure-hosted offering of [Spark](http://spark.apache.org/), a unified, open source, parallel data processing framework supporting in-memory processing to boost Big Data analytics. The Spark processing engine is built for speed, ease of use, and sophisticated analytics. Spark's in-memory distributed computation capabilities make it a good choice for the iterative algorithms used in machine learning and graph computations. There are two scalable machine learning libraries that bring the algorithmic modeling capabilities to this distributed environment: MLlib and SparkML. MLlib contains the original API built on top of RDDs. SparkML is a newer package that provides a higher-level API built on top of DataFrames for constructing ML pipelines. SparkML does not support all of the same features of MLlib yet, but will eventually replace MLlib as Spark's standard machine learning library.

In our effort to contribute to the open source community, helping drive forward innovation in this space, we are excited to announce the Microsoft Machine Learning library for Apache Spark ([MMLSpark](https://github.com/Azure/mmlspark)). This is a library that is designed to make data scientists more productive on Spark, increase the rate of experimentation, and leverage cutting-edge machine learning techniques, including deep learning, on very large datasets. We've found that many have struggled with SparkML's low-level APIs when building scalable ML models, such as indexing strings, coercing data into a layout expected by machine learning algorithms, and assembling feature vectors. The MMLSpark library simplifies these and other common tasks for building models in PySpark. 

## R

[R](https://www.r-project.org/) is currently the most popular statistical programming language in the world. It is an open source data visualization tool with a community of over 2.5 million users and growing. Given its thriving user base, and over 8,000 contributed packages, R is the natural choice for many companies who require machine learning. As part of HDInsight, you can now create an HDInsight cluster with R Server ready to be used with massive datasets and models. This new capability provides data scientists and statisticians with a familiar R interface that can scale on-demand through HDInsight, without the overhead of cluster setup and maintenance.

![Training for prediction with R server](./media/hdinsight-machine-learning-overview/r-training.png)

The edge node of a cluster provides a convenient place to connect to the cluster and to run your R scripts.  You also have the option to run them across the nodes of the cluster by using ScaleR’s Hadoop Map Reduce or Spark compute contexts.

Using R Server on HDInsight with Spark, you can parallelize training across the nodes of a cluster by using a Spark compute context. With an edge node, you have options for easily running ScaleR’s parallelized distributed functions across the cores of the edge node server. It also enables parallelizing functions from open source R packages, if desired.

## Azure Machine Learning and Hive

![Making advanced analytics accessible to Hadoop with Microsoft Azure Machine Learning](./media/hdinsight-machine-learning-overview/hadoop-azure-ml.png)

Azure Machine Learning provides tools to model predictive analytics, as well as a fully managed service you can use to deploy your predictive models as ready-to-consume web services. Azure Machine Learning provides tools for creating complete predictive analytics solutions in the cloud to quickly create, test, operationalize, and manage predictive models. You do not need to buy any hardware nor manually manage virtual machines. Select from a large algorithm library, use a web-based studio for building models, and easily deploy your model as a web service.

Create features for data in an Hadoop cluster using [Hive queries](https://docs.microsoft.com/en-us/azure/machine-learning/machine-learning-data-science-create-features-hive). Feature engineering attempts to increase the predictive power of learning algorithms by creating features from raw data that help facilitate the learning process.


## Deep learning

[Deep learning](https://www.microsoft.com/en-us/research/group/dltc/) is a branch of machine learning that uses deep neural networks, inspired by the biological processes of the human brain. Many researchers see deep learning as a very promising approach for making artificial intelligence better. Some examples of deep learning are spoken language translators, image recognition systems, and machine reasoning.

To help advance its own work in deep learning, Microsoft has developed the free, easy-to-use, open-source [Microsoft Cognitive Toolkit](https://www.microsoft.com/en-us/cognitive-toolkit/). The toolkit is being used extensively by a wide variety of Microsoft products, by companies worldwide with a need to deploy deep learning at scale, and by students interested in the very latest algorithms and techniques. 


## See also

### Scenarios

* [Spark with Machine Learning: Use Spark in HDInsight for analyzing building temperature using HVAC data](https://docs.microsoft.com/azure/hdinsight/hdinsight-apache-spark-ipython-notebook-machine-learning)
* [Spark with Machine Learning: Use Spark in HDInsight to predict food inspection results](https://docs.microsoft.com/azure/hdinsight/hdinsight-apache-spark-machine-learning-mllib-ipython)
* [Generate movie recommendations with Mahout](https://docs.microsoft.com/azure/hdinsight/hdinsight-hadoop-mahout-linux-mac)
* [Hive and Azure Machine Learning](https://docs.microsoft.com/en-us/azure/machine-learning/machine-learning-data-science-create-features-hive)
* [Hive and Azure Machine Learning end-to-end](https://docs.microsoft.com/en-us/azure/machine-learning/machine-learning-data-science-process-hive-walkthrough)
* [Machine learning with Spark on HDInsight](https://docs.microsoft.com/en-us/azure/machine-learning/machine-learning-data-science-spark-overview)

### Deep learning resources
* [Deep learning toolkit with Spark](https://blogs.technet.microsoft.com/machinelearning/2017/04/25/using-microsofts-deep-learning-toolkit-with-spark-on-azure-hdinsight-clusters/)
* [Embarrassingly parallel image classification with Cognitive toolkit + Tensorflow on Spark](https://blogs.technet.microsoft.com/machinelearning/2017/04/12/embarrassingly-parallel-image-classification-using-cognitive-toolkit-tensorflow-on-azure-hdinsight-spark/)
