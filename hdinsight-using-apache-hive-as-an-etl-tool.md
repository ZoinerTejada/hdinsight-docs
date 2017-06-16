---
title: HDInsight Using Apache Hive as an ETL Tool | Microsoft Docs
description: ''
services: hdinsight
documentationcenter: ''

tags: azure-portal
keywords: HDInsight, ETL, Hive

---
# Using Apache Hive as an ETL Tool

You will need to cleanse and transform this data before loading it into a destination suitable for analytics. Extract, Transform, and Load (ETL) operations  are used to prepare data and load them into a data destination.  One of the more popular uses of Hadoop-based systems such as HDInsight is to take unstructured data and load them into a relational data warehouse to support decision support systems. 

Another way to architect an ETL solution is to use ELT.  ELT systems simply do the transformation in place on data that has already been loaded into it's final resting place, where ETL does that transformation as part of the loading process to a new destination.  See (<a href="https://msolap.wordpress.com/2014/03/02/etl-or-elt-or-both/">ETL or ELT… or both?</a>)[] on the Microsoft OLAP blog for a more complete discussion of this topic.


## Use case and model overview
Figure 1 shows an overview of the use case and model for ETL automation. Input data is transformed to generate the appropriate output.  During that transformation the data can change shape, data type, and even language.  ETL processes can convert Imperial to Metric, change time zones, improve precision to properly align with existing data in the destination.  ETL processes will also combine new data with existing data to either keep reporting up to date or provide further insight into existing data.  Applications such as reporting tools and services can then consume this data in an appropriate format, and use it for a variety of purposes.

![Apache Hive as ETL](./media/hdinsight-using-apache-hive-as-an-etl-tool/hdinsight-etl-architecture.png)

Hadoop is typically used in ETL processes that import either a massive amount of text files (like CSVs) or a smaller, but frequently changing amount of text files, or both massive and frequently changing.  Hive is a great tool to use to prepare the data before loading it into the data destination.  The Hive metadata store allows you to create a schema over the CSV and use a SQL-like language to interact with it.  SQL is an accessible language that most developers have already mastered.

The typical steps to using Hive to perform ETL would look like this:

1)  Load data into Azure Data Lake Store or Azure Blob Storage.

2)  Connect the data account with HDInsight.

3)  Create a Metadata Store for use with Hive.

4)  Create a Hive Metadata Store table that looks like this:

    DROP TABLE IF EXISTS hvac;

    --create the hvac table on comma-separated sensor data
    CREATE EXTERNAL TABLE hvac(`date` STRING, time STRING, targettemp BIGINT,
        actualtemp BIGINT, 
        system BIGINT, 
        systemage BIGINT, 
        buildingid BIGINT)
    ROW FORMAT DELIMITED FIELDS TERMINATED BY ',' 
    STORED AS TEXTFILE LOCATION 'wasb://{container}@{storageaccount}.blob.core.windows.net/HdiSamples/SensorSampleData/hvac/';

5)  Transform it and load it into the destination.  There are two ways to do that:

    1)  Query and prep data using Hive and save it as a CSV in the same place you used.  Then use a tool like SSIS to take that CSV and pipe it to the destination from Azure Blob Storage or Azure Data Lake Store.

    2)  Grab it using the Hive ODBC driver to query the Hive metadata store directly.  This can be used in Excel or C#.

    3) Use Linq to Hive in C#.

    4) Use a Hadoop tool to load it in the destination, like <a href="https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-use-sqoop-mac-linux">Sqoop</a>.


## Data sources
Data sources are typically external data that can be matched to existing data in your data store. Some examples are:
* Social media data, log files, sensors, and applications that generate data files.
* Datasets obtained from data providers, like weather statistics, or vendor sales numbers.
* Streaming data captured, filtered, and processed through a suitable tool or framework (see Collecting and loading data into HDInsight).

## Output targets
We can use hive to output data to a variety of targets including:
* A database such as SQL Server or Azure SQL Database.
* Excel
* Azure table and blob storage.
* Applications or services that require data to be processed into specific formats, or as files that contain specific types of information structure.
* A JSON Document Store like <a href="https://azure.microsoft.com/en-us/services/cosmos-db/">CosmosDB</a>.

## Considerations
There are some important points to consider when choosing the ETL automation model:
* This model is typically used when you want to:
    * Load stream data or large volumes of semi-structured or unstructured data from external sources into an existing database or information system.
    * Cleanse, transform, and validate the data before loading it; perhaps by using more than one transformation pass through the cluster.
    * Generate reports and visualizations that are regularly updated.  This would be great if the report takes too long to generate during the day, so instead you schedule the report to run at night.  You can use Azure Scheduler and PowerShell to automatically run a Hive query.
* If the target for the data is not a database, you can generate a file in the appropriate format within the query, like a CSV. This can easily be imported into Excel or Power BI.
* If you need to execute several operations on the data as part of the ETL process you should consider how you manage these. If they are controlled by an external program, rather than as a workflow within the solution, you will need to decide whether some can be executed in parallel, and you must be able to detect when each job has completed. Using a workflow mechanism such as Oozie within Hadoop may be easier than trying to orchestrate several operations using external scripts or custom programs. See <a href="https://msdn.microsoft.com/en-us/library/dn749829.aspx">Workflow and job orchestration</a> for more information about Oozie.

