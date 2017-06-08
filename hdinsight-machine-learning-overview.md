---
title: Machine Learning Overview - Azure HDInsight | Microsoft Docs
description: ''
services: hdinsight
documentationcenter: ''

tags: azure-portal
keywords: machine learning,mahout,r,sparkml,mllib,scikit-learn

---
# Machine Learning Overview

HDInsight gives us the power to work with big data, providing the ability to obtain valuable insight from large (petabytes, or even exabytes) of structured, unstructured, and fast-moving data. How do we make sense of this influx of information? What sort of questions are we able to answer?

Some of the questions one might ask when analyzing big data are:

**Questions on social and web analytics:** What is my brand and product sentiment? How effective is my online campaign? Who am I reaching? How can I optimize or target the correct audience? 

**Questions that require connecting to live data feeds:** A large shipping company uses live weather feeds and traffic patterns to fine tune its ship and truck routes, leading to improved delivery times and cost savings. Retailers analyze sales, pricing and economic, demographic and live weather data to tailor product selections at particular stores and determine the timing of price markdowns.

**Questions that require advanced analytics:** Financial firms using machine learning to build better fraud detection algorithms that go beyond the simple business rules involving charge frequency and location to also include an individual’s customized buying patterns, ultimately leading to a better customer experience.

To help answer these questions, we can harness the power of machine learning. If you are unfamiliar with the term, the simplest way to describe machine learning is that it is a technique of data science that helps computers learn from existing data in order to forecast future behaviors, outcomes, and trends.

## Analytics spectrum

![Analytics spectrum](./media/hdinsight-machine-learning-overview/analytics-spectrum.png)

Analytics can be thought of as being on a spectrum of increasing sophistication, consisting of four categories:

* **Descriptive** – What is happening?
    * *Example*: For a retail store, identify the customer segments for marketing purposes
* **Diagnostic** – Why did it happen?
    * *Example*: Understanding what factors are causing customers to leave a service (churn)
* **Predictive** – What will happen?
    * *Example*: Identify customers who are likely to upgrade to the latest phone
* **Prescriptive** – What should be done?
    * *Example*: What’s the best offer to give to a customer who is likely to want that latest phone

## The data science process

When you break it down to its essence, the learning process is the same for both humans and machines. We both require data input, using observation, memory, and recall to provide a factual basis for further reasoning. We then use abstraction by translating the data into broader representations. Finally, we generalize by using the abstraction to form a basis for action.

When employing machine learning, the typical data science process follows these five steps:

![The data science five-step process](./media/hdinsight-machine-learning-overview/process.png)

Once you've identified the business problem and have started collecting and processing your data, you need to create a model that represents your question or the outcome you wish to predict. The large bulk of your data should be used to train your model, with the smaller portion being used to test or evaluate it. The next step is to deploy, or operationalize, the model so that it can be used for supplying answers to our question. The last step is to monitor our model's performance and tune, if necessary. Part of this process can be periodically retraining our model with new data to try and increase its accuracy.

### Supervised or unsupervised learning?

Supervised and unsupervised learning refers to the requirements of the algorithm you want to use. If your algorithm needs to be trained on a set of data before it can provide conclusions, then it is considered a supervised algorithm, or learner. These need to be carefully trained before they can be shown other examples and provide good results.

Unsupervised algorithms, on the other hand, do not require training. They provide results, given the data at hand. The goal of unsupervised algorithms is to find relationships in the data. For instance, you might want to find groupings of customer demographics with similar buying habits.


## Common types of algorithms

| Algorithm | Use | Learning Type | Tools |
| --- | --- | --- | -- |
| Classification | Classify people or things into groups | Supervised | Decision trees, Logistic regression, neural networks |
| Clustering | Dividing a set of examples into homogenous groups | Unsupervised | K-means clustering |
| Pattern detection | Identify frequent associations in the data | Unsupervised | Association rules |
| Regression | Predict numerical outcomes | Supervised | Linear regression, neural networks |




## Machine learning on HDInsight

There are several options for machine learning with HDInsight:

### Spark ML and MLlib

TBD

### R

TBD

### Azure Machine Learning and Hive

TBD

## Deep learning

TBD



## See also

* Some overview link

### Scenarios

* [Spark with Machine Learning: Use Spark in HDInsight for analyzing building temperature using HVAC data](https://docs.microsoft.com/azure/hdinsight/hdinsight-apache-spark-ipython-notebook-machine-learning)
* [Spark with Machine Learning: Use Spark in HDInsight to predict food inspection results](https://docs.microsoft.com/azure/hdinsight/hdinsight-apache-spark-machine-learning-mllib-ipython)
* [Generate movie recommendations with Mahout](https://docs.microsoft.com/azure/hdinsight/hdinsight-hadoop-mahout-linux-mac)