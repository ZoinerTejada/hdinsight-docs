---
title: Deep Dive - Advanced Analytics - Azure HDInsight | Microsoft Docs
description: ''
services: hdinsight
documentationcenter: ''

tags: azure-portal
keywords: machine learning, spark, sparkml, mllib, CNTK

---
# Deep Dive - Advanced Analytics

## What is Advanced Analytics for HDInsight?

HDInsight gives you the power to work with big data, providing the ability to obtain valuable insight from large amounts of structured, unstructured, and fast-moving data. Advanced Analytics is the use of highly scalable architectures, statistical and machine learning models, and intelligent dashboards to provide you with meaningful insights had been out of reach until now. Machine learning, or predictive analytics, are algorithms that identify and learn from relationships in your data to make predictions and guide your decisions.

## The advanced analytics process

![Process](./media/hdinsight-deep-dive-advanced-analytics/process.png)

After you've identified the business problem and have started collecting and processing your data, you need to create a model that represents the question you wish to predict. Your model will use one or more machine learning algorithms to make the type of prediction that best fits your business needs.  The majority of your data should be used to train your model, with the smaller portion being used to test or evaluate it. 

After you create, load, test and evaulate your model, the next step is to deploy your model so that it can be used for supplying answers to your question. The last step is to monitor your model's performance and tune, if necessary. 

## Common types of algorithms

An important aspect of any advanced analytics solution is the selection of one of more machine learning algorithms that best suits your requirements.
Shown below is a summary of the categories of algorithms and associated common business use cases.

![Machine Learning Use Cases](./media/hdinsight-deep-dive-advanced-analytics/ml-use-cases.png)

Along with selecting the best-fitting algorithm(s), you need to consider whether or not you'll need to provide data for training. Machine Learning algorithms are categorized in one of several types in this area.

* Supervised - algorithm needs to be trained on a set of labeled data before it can provide results
* Unsupervised - algorithm does not require training data 
* Reinforcement - algorithm uses software agents to determine idea behavior within a specific context (often used in robotics)
* Semi-supervised - algorithm can be augmented by extra targets through interactive query by trainer, which were not available during initial stage of training

---

| Algorithm Category| Use | Learning Type | Algorithms |
| --- | --- | --- | -- |
| Classification | Classify people or things into groups | Supervised | Decision trees, Logistic regression, neural networks |
| Clustering | Dividing a set of examples into homogenous groups | Unsupervised | K-means clustering |
| Pattern detection | Identify frequent associations in the data | Unsupervised | Association rules |
| Regression | Predict numerical outcomes | Supervised | Linear regression, neural networks |
| Reinforcement | Determine optimal behavior for robots | Reinforcement | Monte Carlo Simulations, DeepMind |

---

## Machine learning on HDInsight

There are several machine learning options that can be used as part of an advanced analytics workflow in HDInsight:

### 1. Machine Learning and Spark

[HDInsight Spark](https://docs.microsoft.com/azure/hdinsight/hdinsight-apache-spark-overview) is an Azure-hosted offering of [Spark](http://spark.apache.org/), a unified, open source, parallel data processing framework supporting in-memory processing to boost Big Data analytics. The Spark processing engine is built for speed, ease of use, and sophisticated analytics. Spark's in-memory distributed computation capabilities make it a good choice for the iterative algorithms used in machine learning and graph computations. 

There are three scalable machine learning libraries that bring the algorithmic modeling capabilities to this distributed environment:
* [**MLlib**](https://spark.apache.org/docs/latest/ml-guide.html) - MLlib contains the original API built on top of Spark RDDs
* [**SparkML**](https://spark.apache.org/docs/1.2.2/ml-guide.html) - SparkML is a newer package that provides a higher-level API built on top of Spark DataFrames for constructing ML pipelines
* [**MMLSpark**](https://github.com/Azure/mmlspark)  - The Microsoft Machine Learning library for Apache Spark or MMLSpark is designed to make data scientists more productive on Spark, increase the rate of experimentation, and leverage cutting-edge machine learning techniques, including deep learning, on very large datasets. The MMLSpark library simplifies common modeling tasks for building models in PySpark. 

### 2. R and R Server

As part of HDInsight, you can create an HDInsight cluster with [R Server](https://docs.microsoft.com/en-us/r-server/what-is-microsoft-r-server) ready to be used with massive datasets and models. This new capability provides data scientists and statisticians with a familiar R interface that can scale on-demand through HDInsight, without the overhead of cluster setup and maintenance.

### 3. Azure Machine Learning and Hive

[Azure Machine Learning Studio](https://studio.azureml.net/) provides tools to model predictive analytics, as well as a fully managed service you can use to deploy your predictive models as ready-to-consume web services. Azure Machine Learning provides tools for creating complete predictive analytics solutions in the cloud to quickly create, test, operationalize, and manage predictive models. Select from a large algorithm library, use a web-based studio for building models, and easily deploy your model as a web service.

### 4. Spark and Deep Learning

[Deep learning](https://www.microsoft.com/en-us/research/group/dltc/) is a branch of machine learning that uses deep neural networks (or DNNs), inspired by the biological processes of the human brain. Many researchers see deep learning as a very promising approach for making artificial intelligence better. Some examples of deep learning are spoken language translators, image recognition systems, and machine reasoning. To help advance its own work in deep learning, Microsoft has developed the free, easy-to-use, open-source [Microsoft Cognitive Toolkit](https://www.microsoft.com/en-us/cognitive-toolkit/). The toolkit is being used extensively by a wide variety of Microsoft products, by companies worldwide with a need to deploy deep learning at scale, and by students interested in the very latest algorithms and techniques. 

In the next section of this article, we'll review an example of an advanced analytics machine learning pipeline using HDInsight.

---

## Scenario - Score Images to Identify Patterns in Urban Development

In this scenario you will see how DNNs produced in a deep learning framework, Microsoft’s Cognitive Toolkit (CNTK) can be operationalized for scoring large image collections stored in an Azure BLOB Storage Account using PySpark on an HDInsight Spark cluster. This approach is applied to a common DNN use case, aerial image classification, and can be used to identify recent patterns in urban development.  You will use a pre-trained image classification model. The model is pre-trained on the [CIFAR-10 dataset](https://www.cs.toronto.edu/~kriz/cifar.html) and has been applied to 10,000 withheld images.

There are three key tasks in this advanced analytics scenario:
1. Provision an Azure HDInsight Hadoop cluster with an Apache Spark 2.1.0 distribution. 
2. Run a custom script to install Microsoft Cognitive Toolkit on all nodes of an Azure HDInsight Spark cluster. 
3. Upload a pre-built Jupyter notebook to your HDInsight Spark cluster to to apply a trained Microsoft Cognitive Toolkit deep learning model to files in an Azure Blob Storage Account using the Spark Python API (PySpark). 

This example uses the recipe on the CIFAR-10 image set compiled and distributed by Alex Krizhevsky, Vinod Nair, and Geoffrey Hinton. The CIFAR-10 dataset contains 60,000 32×32 color images belonging to 10 mutually exclusive classes:

![Images](./media/hdinsight-deep-dive-advanced-analytics/ml-images.png)

For more details on the dataset, see Alex Krizhevsky’s [Learning Multiple Layers of Features from Tiny Images](https://www.cs.toronto.edu/~kriz/learning-features-2009-TR.pdf).

The dataset was partitioned into a training set of 50,000 images and a test set of 10,000 images. The first set was used to train a twenty-layer deep convolutional residual network (ResNet) model using Cognitive Toolkit by following [this tutorial](https://github.com/Microsoft/CNTK/tree/master/Examples/Image/Classification/ResNet) from the Cognitive Toolkit GitHub repository. The remaining 10,000 images were used for testing the model’s accuracy. This is where distributed computing comes into play: the task of pre-processing and scoring the images is highly parallelizable. With the saved trained model in hand, we used:

* PySpark to distribute the images and trained model to the cluster’s worker nodes.
* Python to pre-process the images on each node of the HDInsight Spark cluster.
* Cognitive Toolkit to load the model and score the pre-processed images on each node.
* Jupyter Notebooks to run the PySpark script, aggregate the results and use [Matplotlib](https://matplotlib.org/) to visualize the model performance.

The entire preprocessing/scoring of the 10,000 images takes less than one minute on a cluster with 4 worker nodes. The model accurately predicts the labels of ~9,100 (91%) images. A confusion matrix illustrates the most common classification errors. For example, the matrix shows that mislabeling dogs as cats and vice versa occurs more frequently than for other label pairs.

![Results](./media/hdinsight-deep-dive-advanced-analytics/ml-results.png)


### Try it Out!
Follow [this tutorial](https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-apache-spark-microsoft-cognitive-toolkit) to implement this solution end-to-end: setup an HDInsight Spark cluster, install Cognitive Toolkit, and run the Jupyter Notebook that scores 10,000 CIFAR images.

---

## See also

### Scenarios

Hive and Azure Machine Learning 

* [Hive and Azure Machine Learning end-to-end](https://docs.microsoft.com/en-us/azure/machine-learning/machine-learning-data-science-process-hive-walkthrough)
* [Using an Azure HDInsight Hadoop Cluster on a 1 TB dataset](https://docs.microsoft.com/en-us/azure/machine-learning/machine-learning-data-science-process-hive-criteo-walkthrough)

Spark and MLLib

* [Machine learning with Spark on HDInsight](https://docs.microsoft.com/en-us/azure/machine-learning/machine-learning-data-science-spark-overview)
* [Spark with Machine Learning: Use Spark in HDInsight for analyzing building temperature using HVAC data](https://docs.microsoft.com/azure/hdinsight/hdinsight-apache-spark-ipython-notebook-machine-learning)
* [Spark with Machine Learning: Use Spark in HDInsight to predict food inspection results](https://docs.microsoft.com/azure/hdinsight/hdinsight-apache-spark-machine-learning-mllib-ipython)

Deep Learning, CNTK and others

* [Embarrassingly Parallel Image Classification, Using Cognitive Toolkit and TensorFlow on Azure HDInsight Spark](https://blogs.technet.microsoft.com/machinelearning/2017/04/12/embarrassingly-parallel-image-classification-using-cognitive-toolkit-tensorflow-on-azure-hdinsight-spark/)
* [Data Science Azure Virtual Machine](https://docs.microsoft.com/en-us/azure/machine-learning/machine-learning-data-science-virtual-machine-overview)
* [Introducing H2O.ai on Azure HDInsight](https://azure.microsoft.com/en-us/blog/introducing-h2o-ai-with-on-azure-hdinsight-to-bring-the-most-robust-ai-platform-for-enterprises/)
