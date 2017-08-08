---
title: Creating Spark ML Pipelines - Azure HDInsight | Microsoft Docs
description: ''
services: hdinsight
documentationcenter: ''

tags: azure-portal
keywords: r,r tools for visual studio,visual studio

---
# Creating Spark ML Pipelines

## Overview

The Apache Spark [spark.ml](http://spark.apache.org/docs/latest/ml-pipeline.html) package provides a uniform set of high-level APIs built on top of data frames that can help you create and tune practical machine learning pipelines. MLlib is Spark's scalable machine learning library, which brings modeling capabilities to this distributed environment. The moniker "Spark ML" is a term that refers to the MLlib DataFrame-based API, as opposed to the older RDD-based pipeline API, which is now in maintenance mode.

The primary function of an ML pipeline is to create a complete workflow by combining multiple machine learning algorithms together. There are oftentimes many steps required to process and learn from data, which requires applying a sequence of algorithms. Pipelines introduce a nice way to define the stages and order of your process. The stages of a pipeline are represented by a sequence of `PipelineStage`s, where a `Transformer` and `Estimator` perform tasks, and are executed in a specific order.

A `Transformer` is an algorithm that transforms one `DataFrame` to another by using the `transform()` method. For example, a feature transformer could read a column of a `DataFrame`, map it to another column, and output a new `DataFrame` with the mapped column appended to it.

`Estimator`s, an abstraction of learning algorithms, are responsible for fitting or training on a Dataset to produce a Transformer. To do this, an `Estimator` implements a method called `fit()`, which accepts a `DataFrame` and produces a `Model`, which is a `Transformer`.

Each stateless instance of a `Transformer` and `Estimator` has its own unique id, which can be used for specifying parameters. Both use a uniform API for specifying these parameters.

## Pipeline example

To demonstrate a practical use of an ML pipeline, we will use the sample HVAC.csv data file that comes pre-loaded on the Azure Storage or Data Lake Store configured as the default storage for your HDInsight cluster. To view the contents of the file, navigate to the following location: **/HdiSamples/HdiSamples/SensorSampleData/hvac**.

We'll start out with a custom parser to extract the data (HVAC.csv) we want to train our model. The function checks whether the building is "hot" by comparing its actual temperature to the target temperature. We'll store the parsed information wtihin a `LabeledDocument`, which stores the `BuildingID`, `SystemInfo` (comprising the system's Id and age), and the `label` (1.0 if the building is not, 0.0 if not). The last step of this segment is to save the data into a new `DataFrame`.

```python
# List the structure of data for better understanding. Because the data will be
# loaded as an array, this structure makes it easy to understand what each element
# in the array corresponds to

# 0 Date
# 1 Time
# 2 TargetTemp
# 3 ActualTemp
# 4 System
# 5 SystemAge
# 6 BuildingID

LabeledDocument = Row("BuildingID", "SystemInfo", "label")

# Define a function that parses the raw CSV file and returns an object of type LabeledDocument

def parseDocument(line):
    values = [str(x) for x in line.split(',')]
    if (values[3] > values[2]):
        hot = 1.0
    else:
        hot = 0.0        

    textValue = str(values[4]) + " " + str(values[5])

    return LabeledDocument((values[6]), textValue, hot)

# Load the raw HVAC.csv file, parse it using the function
data = sc.textFile("wasbs:///HdiSamples/HdiSamples/SensorSampleData/hvac/HVAC.csv")

documents = data.filter(lambda s: "Date" not in s).map(parseDocument)
training = documents.toDF()
```

The pipeline we'll be building consists of three stages: `Tokenizer` and `HashingTF` (both `Transformers`), and `Logistic Regression`, which is an `Estimator`.

Our data (extracted from the CSV and mapped to our `LabeledDocument` type), which is a `DataFrame` flows through the pipeline when `pipeline.fit(training)` is called. The first stage, `Tokenizer`, splits the `SystemInfo` input column (consisting of two "words": the system Id and age values) into a "words" output column. This new "words" column is added to the `DataFrame`. The next stage, `HashingTF`, converts the new "words" column into feature vectors. This new column, "features", is added to the `DataFrame`. Remember, these first two stages are `Transformer`s. Since `LogisticRegression` is an `Estimator`, our pipeline calls the `LogisticRegression.fit()` method to produce a `LogisticRegressionModel`. 

```python
tokenizer = Tokenizer(inputCol="SystemInfo", outputCol="words")
hashingTF = HashingTF(inputCol=tokenizer.getOutputCol(), outputCol="features")
lr = LogisticRegression(maxIter=10, regParam=0.01)

# Build the pipeline with our tokenizer, hashingTF, and logistic regression stages
pipeline = Pipeline(stages=[tokenizer, hashingTF, lr])

model = pipeline.fit(training)
```

To take a look at the new columns added by the `Tokenizer` and `HashingTF` transformers ("words" and "features"), as well as a sample of the `LogisticRegression` estimator, we'll run a `PipelineModel.transform()` method on our original `DataFrame`. * This is just for illustrative purposes. Typically, the next step would be to pass in a test `DataFrame` to validate our training:

```python
peek = model.transform(training)
peek.show()

# Outputs the following:
+----------+----------+-----+--------+--------------------+--------------------+--------------------+----------+
|BuildingID|SystemInfo|label|   words|            features|       rawPrediction|         probability|prediction|
+----------+----------+-----+--------+--------------------+--------------------+--------------------+----------+
|         4|     13 20|  0.0|[13, 20]|(262144,[250802,2...|[0.11943986671420...|[0.52982451901740...|       0.0|
|        17|      3 20|  0.0| [3, 20]|(262144,[89074,25...|[0.17511205617446...|[0.54366648775222...|       0.0|
|        18|     17 20|  1.0|[17, 20]|(262144,[64358,25...|[0.14620993833623...|[0.53648750722548...|       0.0|
|        15|      2 23|  0.0| [2, 23]|(262144,[31351,21...|[-0.0361327091023...|[0.49096780538523...|       1.0|
|         3|      16 9|  1.0| [16, 9]|(262144,[153779,1...|[-0.0853679939336...|[0.47867095324139...|       1.0|
|         4|     13 28|  0.0|[13, 28]|(262144,[69821,25...|[0.14630166986618...|[0.53651031790592...|       0.0|
|         2|     12 24|  0.0|[12, 24]|(262144,[187043,2...|[-0.0509556393066...|[0.48726384581522...|       1.0|
|        16|     20 26|  1.0|[20, 26]|(262144,[128319,2...|[0.33829638728900...|[0.58377663577684...|       0.0|
|         9|      16 9|  1.0| [16, 9]|(262144,[153779,1...|[-0.0853679939336...|[0.47867095324139...|       1.0|
|        12|       6 5|  0.0|  [6, 5]|(262144,[18659,89...|[0.07513008136562...|[0.51877369045183...|       0.0|
|        15|     10 17|  1.0|[10, 17]|(262144,[64358,25...|[-0.0291988646553...|[0.49270080242078...|       1.0|
|         7|      2 11|  0.0| [2, 11]|(262144,[212053,2...|[0.03678030020834...|[0.50919403860812...|       0.0|
|        15|      14 2|  1.0| [14, 2]|(262144,[109681,2...|[0.06216423725633...|[0.51553605651806...|       0.0|
|         6|       3 2|  0.0|  [3, 2]|(262144,[89074,21...|[0.00565582077537...|[0.50141395142468...|       0.0|
|        20|     19 22|  0.0|[19, 22]|(262144,[139093,2...|[-0.0769288695989...|[0.48077726176073...|       1.0|
|         8|     19 11|  0.0|[19, 11]|(262144,[139093,2...|[0.04988910033929...|[0.51246968885151...|       0.0|
|         6|      15 7|  0.0| [15, 7]|(262144,[77099,20...|[0.14854929135994...|[0.53706918109610...|       0.0|
|        13|      12 5|  0.0| [12, 5]|(262144,[89689,25...|[-0.0519932532562...|[0.48700461408785...|       1.0|
|         4|      8 22|  0.0| [8, 22]|(262144,[98962,21...|[-0.0120753606650...|[0.49698119651572...|       1.0|
|         7|      17 5|  0.0| [17, 5]|(262144,[64358,89...|[-0.0721054054871...|[0.48198145477106...|       1.0|
+----------+----------+-----+--------+--------------------+--------------------+--------------------+----------+

only showing top 20 rows
```



From this point, the `model` object can be used to make predictions. The full sample of this machine learning application, and step-by-step instructions for running it, can be found [here](https://docs.microsoft.com/azure/hdinsight/hdinsight-apache-spark-ipython-notebook-machine-learning).


## Next steps

This article introduced the key concepts behind Spark ML Pipelines, and illustrated a sample use case of pipelines through code examples.

* See a [full example machine learning application](https://docs.microsoft.com/azure/hdinsight/hdinsight-apache-spark-ipython-notebook-machine-learning) that incorporates Spark ML Pipelines.
* Learn more about [creating Spark ML models in notebooks](https://docs.microsoft.com/azure/machine-learning/machine-learning-data-science-process-scala-walkthrough).
