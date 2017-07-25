---
title: HDInsight Using Apache Hive as an ETL Tool | Microsoft Docs
description: ''
services: hdinsight
documentationcenter: ''

tags: azure-portal
keywords: HDInsight, ETL, Hive

---
# Using Apache Hive as an ETL Tool

You will at typically need to cleanse and transform data before loading it into a destination suitable for analytics. Extract, Transform, and Load (ETL) operations  are used to prepare data and load them into a data destination.  One of the more popular uses of Hive on HDInsight is to take unstructured data and use it to process and then load data into a relational data warehouse to support decision support systems. In this approach, data is extracted from the source and stored in scalable storage (such as Azure Storage blobs or Azure Data Lake Store). The data is then tranformed using a sequence of Hive queries and is ultimately staged within Hive in preparation for bulk loading into the destination data store. This is the typical ETL process with Hive.

## Use case and model overview
The figure below shows an overview of the use case and model for ETL automation. Input data is transformed to generate the appropriate output.  During that transformation the data can change shape, data type, and even language.  ETL processes can convert Imperial to Metric, change time zones, improve precision to properly align with existing data in the destination.  ETL processes can also combine new data with existing data to either keep reporting up to date or provide further insight into existing data.  Applications such as reporting tools and services can then consume this data in an appropriate format, and use it for a variety of purposes.

![Apache Hive as ETL](./media/hdinsight-using-apache-hive-as-an-etl-tool/hdinsight-etl-architecture.png)

Hadoop is typically used in ETL processes that import either a massive amount of text files (like CSVs) or a smaller, but frequently changing amount of text files, or both massive and frequently changing.  Hive is a great tool to use to prepare the data before loading it into the data destination.  Hive allows you to create a schema over the CSV and use a SQL-like language to generate MapReduce progams that interact with the data. This is a compelling benefit of Hive, since SQL is an accessible language that most developers have already mastered and they can quickly get to productive without having to learn to implement MapReduce programs in Java.

The typical steps to using Hive to perform ETL are as follows:

1)  Load data into Azure Data Lake Store or Azure Blob Storage.
2)  Create an HDInsight cluster and connect the data store with HDInsight. Also, create a Metadata Store database (using Azure SQL Database) for use by Hive in storing your schemas.
4)  Define the schema to apply at read-time over data in the data store:

    ```
    DROP TABLE IF EXISTS hvac;

    --create the hvac table on comma-separated sensor data stored in Azure Storage blobs
    
    CREATE EXTERNAL TABLE hvac(`date` STRING, time STRING, targettemp BIGINT,
        actualtemp BIGINT, 
        system BIGINT, 
        systemage BIGINT, 
        buildingid BIGINT)
    ROW FORMAT DELIMITED FIELDS TERMINATED BY ',' 
    STORED AS TEXTFILE LOCATION 'wasb://{container}@{storageaccount}.blob.core.windows.net/HdiSamples/SensorSampleData/hvac/';
    ```

5)  Transform the data and load it into the destination.  There are a few ways to use Hive during the transformation and loading:

    1)  Query and prep data using Hive and save it as a CSV in Azure Data Lake Store or Blob storage.  Then use a tool like SQL Server Integration Services (SSIS) to acquire those CSVs and load the data into the destination relational database (like SQL Server).

    2) Query the data directly from Excel or C# using the Hive ODBC driver. 

    3) Use <a href="https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-use-sqoop-mac-linux">Apache Sqoop</a> to read the prepared flat CSV files and load them into the destination relational database.


## Data sources
Data sources are typically external data that can be matched to existing data in your data store. Some examples are:
* Social media data, log files, sensors, and applications that generate data files.
* Datasets obtained from data providers, like weather statistics, or vendor sales numbers.
* Streaming data captured, filtered, and processed through a suitable tool or framework (see Collecting and loading data into HDInsight).

## Output targets
We can use hive to output data to a variety of targets including:
* A relational database such as SQL Server or Azure SQL Database.
* A data warehouse, like Azure SQL Data Warehouse.
* Excel
* Azure table and blob storage.
* Applications or services that require data to be processed into specific formats, or as files that contain specific types of information structure.
* A JSON Document Store like <a href="https://azure.microsoft.com/en-us/services/cosmos-db/">CosmosDB</a>.

## Considerations
There are some important points to consider when choosing to perform ETL:
* This model is typically used when you want to:
    * Load stream data or large volumes of semi-structured or unstructured data from external sources into an existing database or information system.
    * Cleanse, transform, and validate the data before loading it; perhaps by using more than one transformation pass through the cluster.
    * Generate reports and visualizations that are regularly updated.  This would be great if the report takes too long to generate during the day, so instead you schedule the report to run at night.  You can use Azure Scheduler and PowerShell to automatically run a Hive query.
* If the target for the data is not a database, you can generate a file in the appropriate format within the query, like a CSV. This can easily be imported into Excel or Power BI.
* If you need to execute several operations on the data as part of the ETL process you should consider how you manage these. If they are controlled by an external program, rather than as a workflow within the solution, you will need to decide whether some can be executed in parallel, and you must be able to detect when each job has completed. Using a workflow mechanism such as Oozie within Hadoop may be easier than trying to orchestrate several operations using external scripts or custom programs. See <a href="https://msdn.microsoft.com/en-us/library/dn749829.aspx">Workflow and job orchestration</a> for more information about Oozie.

## See Next
* [ETL at scale](hdinsight-etl-at-scale.md): Learn more about performing ETL at scale. 
* [Operationalize Data Pipelines with Oozie](hdinsight-operationalize-data-pipeline.md): Learn how to build a data pipeline that uses Hive to summarize CSV flight delay data, stage the prepared data in Azure Storage blobs and then use Sqoop to load the summarized data into Azure SQL Database.
* [ETL Deep Dive](hdinsight-etl-deep-dive.md): Walk thru an end-to-end ETL pipeline.