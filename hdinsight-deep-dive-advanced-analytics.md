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

HDInsight gives you the power to work with big data, providing the ability to obtain valuable insight from large amounts of structured, unstructured, and fast-moving data. How do we make sense of this influx of information? What sort of questions are we able to answer?  Some questions you might want to ask when analyzing big data require advanced analytics.

Advanced Analytics is the use of highly scalable architectures, statistical and machine learning models, and intelligent dashboards to provide you with meaningful insights had been out of reach until now. Machine learning, or predictive analytics, are algorithms that identify and learn from relationships in your data to make predictions and guide your decisions.

## The advanced analytics process

Once you've identified the business problem and have started collecting and processing your data, you need to create a model that represents the question you wish to predict. Your model will use one or more machine learning algorithms to make the type of prediction that best fits your business needs.  The majority of your data should be used to train your model, with the smaller portion being used to test or evaluate it. 

After you create, load, test and evaulate your model, the next step is to deploy your model so that it can be used for supplying answers to your question. The last step is to monitor your model's performance and tune, if necessary. 

## Common types of algorithms

| Algorithm | Use | Learning Type | Tools |
| --- | --- | --- | -- |
| Classification | Classify people or things into groups | Supervised | Decision trees, Logistic regression, neural networks |
| Clustering | Dividing a set of examples into homogenous groups | Unsupervised | K-means clustering |
| Pattern detection | Identify frequent associations in the data | Unsupervised | Association rules |
| Regression | Predict numerical outcomes | Supervised | Linear regression, neural networks |

---

* Supervised algorithm - needs to be trained on a set of labeled data before it can provide results
* Unsupervised algorithm - does not require training data 

---

## Machine learning on HDInsight

There are several machine learning options that can be used as part of an advanced analytics workflow in HDInsight:

### 1. Machine Learning and Spark

[HDInsight Spark](https://docs.microsoft.com/azure/hdinsight/hdinsight-apache-spark-overview) is an Azure-hosted offering of [Spark](http://spark.apache.org/), a unified, open source, parallel data processing framework supporting in-memory processing to boost Big Data analytics. The Spark processing engine is built for speed, ease of use, and sophisticated analytics. Spark's in-memory distributed computation capabilities make it a good choice for the iterative algorithms used in machine learning and graph computations. 

There are three scalable machine learning libraries that bring the algorithmic modeling capabilities to this distributed environment:
* **MLlib** - MLlib contains the original API built on top of Spark RDDs
* **SparkML** - SparkML is a newer package that provides a higher-level API built on top of Spark DataFrames for constructing ML pipelines
* **MMLSpark**  - The Microsoft Machine Learning library for Apache Spark ([MMLSpark](https://github.com/Azure/mmlspark)) is designed to make data scientists more productive on Spark, increase the rate of experimentation, and leverage cutting-edge machine learning techniques, including deep learning, on very large datasets. The MMLSpark library simplifies common modeling tasks for building models in PySpark. 

### 2. R and R Server

As part of HDInsight, you can now create an HDInsight cluster with R Server ready to be used with massive datasets and models. This new capability provides data scientists and statisticians with a familiar R interface that can scale on-demand through HDInsight, without the overhead of cluster setup and maintenance.

### 3. Azure Machine Learning and Hive

Azure Machine Learning provides tools to model predictive analytics, as well as a fully managed service you can use to deploy your predictive models as ready-to-consume web services. Azure Machine Learning provides tools for creating complete predictive analytics solutions in the cloud to quickly create, test, operationalize, and manage predictive models. Select from a large algorithm library, use a web-based studio for building models, and easily deploy your model as a web service.

## 4. Spark and Deep Learning

[Deep learning](https://www.microsoft.com/en-us/research/group/dltc/) is a branch of machine learning that uses deep neural networks, inspired by the biological processes of the human brain. Many researchers see deep learning as a very promising approach for making artificial intelligence better. Some examples of deep learning are spoken language translators, image recognition systems, and machine reasoning.

To help advance its own work in deep learning, Microsoft has developed the free, easy-to-use, open-source [Microsoft Cognitive Toolkit](https://www.microsoft.com/en-us/cognitive-toolkit/). The toolkit is being used extensively by a wide variety of Microsoft products, by companies worldwide with a need to deploy deep learning at scale, and by students interested in the very latest algorithms and techniques. 

---

## Scenario - Score Image Contents

Deep neural networks (DNNs) are extraordinarily versatile and increasingly popular machine learning models that require significantly more time and computational resources for execution than traditional approaches. By deploying these models on Microsoft HDInsight clusters, data scientists and engineers can easily scale available computation resources to achieve a desired throughput rate while using familiar scripting languages and deep learning frameworks. 

In this article we show how DNNs produced in two common deep learning frameworks, Microsoft’s Cognitive Toolkit (CNTK) and Google’s TensorFlow, can be operationalized for scoring large image collections harbored on Azure Data Lake Store using PySpark. We apply this approach to a common DNN use case – aerial image classification – and demonstrate how the method can be used to identify recent patterns in urban development.

In this article, you do the following steps.
Run a custom script to install Microsoft Cognitive Toolkit on an Azure HDInsight Spark cluster.
Upload a Jupyter notebook to the Spark cluster to see how to apply a trained Microsoft Cognitive Toolkit deep learning model to files in an Azure Blob Storage Account using the Spark Python API (PySpark)

### Description of the Aerial Image Classification Use Case
The classification of aerial images is a common task with significant economic and political impact across a wide range of industries. Aerial photography is often analyzed in precision agriculture to monitor crop performance and identify regions in need of corrective treatments. In marketing and finance, image classifiers can identify property features and aid in property value estimation. Government agencies may use aerial imagery classification to enforce regulations: for example, Greece recently uncovered tens of thousands of tax evaders by identifying properties containing home pools. Image classifiers are also employed in geopolitical surveillance to identify novel remote settlements, and to estimate population density or infer economic vitality when direct data are unavailable. Researchers in government in academia may also use aerial data to track urban expansion, deforestation, and the impact of climate change.

This blog post and the associated tutorial focus on a specific use case: predicting a region’s land use type (developed, cultivated, forested etc.) from aerial imagery. Large training and validation datasets for this application can easily be constructed from the vast troves of regularly-published and freely-available U.S. aerial images and ground-truth land use labels. Image classifiers trained on this data can quantify trends in land use and even identify new land development at the level of individual properties, as we will illustrate below.

### Training Aerial Image Classifiers Through Transfer Learning
Producing a DNN from scratch can require weeks of GPU compute time and extraordinarily large training datasets. A common alternative is to repurpose an existing DNN trained to perform a related task: this process is called transfer learning or retraining. To illustrate how transfer learning is performed, we introduce the DNN architecture of AlexNet (a prototypical image classification DNN employed in this use case) and the practical role of each layer.
![Layers](./media/hdinsight-deep-dive-advanced-analytics/ml-layers.png)

### How does this solution flow?

In this article, you complete the two steps:
1. Setup your HDInsight Spark Cluster
    * Run a script action on an HDInsight Spark 2.0 cluster to install Microsoft Cognitive Toolkit using the command shown below on the head and worker nodes of your cluster.
    ```bash
    https://raw.githubusercontent.com/Azure-Samples/hdinsight-pyspark-cntk-integration/master/cntk-install.sh
    ```
    * Run a script action on an HDInsight Spark 2.0 cluster to install Python packages
    * Upload the Jupyter notebook that runs the solution to the cluster by 
    cloning the `CNTK_model_scoring_on_Spark_walkthrough.ipynb` file from
    this GitHub repo `https://github.com/Azure-Samples/hdinsight-pyspark-cntk-integration`

2. The following remaining steps are covered in the Jupyter notebook.
    * Load sample images into a Spark Resiliant Distributed Dataset or RDD
    * Load modules and define presets
    * Download the dataset locally on the Spark cluster
    * Convert the dataset into an RDD
    * Score the images using a trained Cognitive Toolkit model
    * Download the trained Cognitive Toolkit model to the Spark cluster
    * Define functions to be used by worker nodes
    * Score the images on worker nodes
    * Evaluate model accuracy

---

### Recipe
* Begin with an Azure HDInsight Hadoop cluster pre-provisioned with an Apache Spark 2.1.0 distribution. Spark is a distributed-computing framework widely used for big data processing, streaming, and machine learning. Spark HDInsight clusters come with pre-configured Python environments where the Spark Python API (PySpark) can be used.
* Install the Microsoft Cognitive Toolkit (CNTK) on all cluster nodes using a Script Action. Cognitive Toolkit is an open-source deep-learning library from Microsoft. As of version 2.0, Cognitive Toolkit has high-level Python interfaces for both training models on CPUs/GPUs as well as loading and scoring pre-trained models. Cognitive Toolkit can be installed as a Python package in the existing Python environments on all nodes of the HDInsight cluster. Script actions enable this installation to be done in one step using one script, thus eliminating the hurdles involved in configuring each cluster node separately. In addition to installing necessary Python packages and required dependencies, script actions can also be used to restart any affected applications and services in order to maintain the cluster state consistent.
* Pre-process and score thousands of images in parallel using Cognitive Toolkit and PySpark in a Jupyter notebook. Python can be run interactively through Jupyter Notebooks which also provide a visualization environment. This solution uses the Cognitive Toolkit Python APIs and PySpark inside a Jupyter notebook on an HDInsight cluster.
The same strategy can also be used to extract features from image datasets in a scalable manner using pre-trained neural networks. More about this in the “Try it Out!” section.

### Example
We followed this recipe on the CIFAR-10 image set compiled and distributed by Alex Krizhevsky, Vinod Nair, and Geoffrey Hinton. The CIFAR-10 dataset contains 60,000 32×32 color images belonging to 10 mutually exclusive classes:

![Images](./media/hdinsight-deep-dive-advanced-analytics/ml-images.png)

For more details on the dataset, see Alex Krizhevsky’s [Learning Multiple Layers of Features from Tiny Images](https://www.cs.toronto.edu/~kriz/learning-features-2009-TR.pdf).

The dataset was partitioned into a training set of 50,000 images and a test set of 10,000 images. The first set was used to train a twenty-layer deep convolutional residual network (ResNet) model using Cognitive Toolkit by following [this tutorial](https://github.com/Microsoft/CNTK/tree/master/Examples/Image/Classification/ResNet) from the Cognitive Toolkit GitHub repository. The remaining 10,000 images were used for testing the model’s accuracy. This is where distributed computing comes into play: the task of preprocessing and scoring the images is highly parallelizable. With the saved trained model in hand, we used:

PySpark to distribute the images and trained model to the cluster’s worker nodes.
Python to preprocess the images on each node.
Cognitive Toolkit to load the model and score the pre-processed images on each node.
Jupyter Notebooks to run the PySpark script, aggregate the results and use [Matplotlib](https://matplotlib.org/) to visualize the model performance.
The entire preprocessing/scoring of the 10,000 images takes less than one minute on a cluster with 4 worker nodes. The model accurately predicts the labels of ~9,100 (91%) images. A confusion matrix illustrates the most common classification errors:

![Results](./media/hdinsight-deep-dive-advanced-analytics/ml-results.png)

For example, the matrix shows that mislabeling dogs as cats and vice versa occurs more frequently than for other label pairs.

### Conclusion
Apache Spark provides a framework for parallelizing computations over large datasets on a cluster while the Microsoft Cognitive Toolkit offers a state-of-the-art Python package for deep learning. Setting up a cluster where these tools interoperate efficiently and in a user-friendly environment is usually error-prone and time consuming. In this post, we described a “turnkey” setup script that can configure Cognitive Toolkit on an HDInsight Spark cluster, as well as an example Jupyter notebook that illustrates best practices in utilizing Cognitive Toolkit at scale for scoring and evaluating a pre-trained model.

### Try it Out!
Follow [this tutorial](https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-apache-spark-microsoft-cognitive-toolkit) to implement this solution end-to-end: setup an HDInsight Spark cluster, install Cognitive Toolkit, and run the Jupyter Notebook that scores 10,000 CIFAR images.
More advanced:
Take your favorite image dataset.
Obtain a pre-trained Cognitive Toolkit [ResNet model](https://migonzastorage.blob.core.windows.net/deep-learning/models/cntk/imagenet/ResNet_152.model) and remove the final dense layer to turn it into an image featurizer.
Extract the image features and use them to train a scalable classifier with PySpark. This step is fully parallelizable.

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
