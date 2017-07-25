---
title: ETL at Scale - Azure HDInsight | Microsoft Docs
description: ''
services: hdinsight
documentationcenter: ''

tags: azure-portal
keywords: ETL, Oozie, Azure Data Factory, Sqoop, Flume, Hive, Pig, Spark SQL, HBase, SQL Data Warehouse, Azure Data Lake Store, Azure Storage

---
# ETL at Scale
Organizations that have terabytes of poly-structured data that needs to be curated and stored have often had deep issues using non-hadoop ETL tools.  Hadoop is very good at bringing in massive amounts of data while maintaining a consistant level of performance while the data load increases.  Hadoop is particularly good at processing files, whether they be video, text, sensor logs, or transactional records.

HDInsight allows organizations to stop ignoring data, simply because cleaning it would be cost-prohibitive, time consuming, or would too quickly hit a performance ceiling.  By analyzing all data available, decision-makers can better assess market position, competitive threats, sales forcasts, and marketing strategies.

Legacy ETL processes import data, clean it in place, and then store it in a relational data engine.  Once there, aggregate tables will be created by hand using another tool, sometimes the same ETL tool, and sometimes using some type of SQL.  

Creating these processes have the following challenges:

* Developing ETL solutions can take very long time. 

* Executing ETL packages can take a long time.  

* Executing failing portions of the process can be difficult.

* Any error in a text file requires strong resiliency in the ETL package to correct and log errors, then notify the appropriate people.

* The average data analyst complains that 80 - 90% of their time goes to data cleaning, while the remaining time is dedicated to data analysis.

In HDInsight, ETL processes usually span multiple tools, technologies, and products. Due to the flexibility of HDInsight, the process can be created in many different ways.  This article doesn't seek to be the definitive guide on every Hadoop-based ETL process.  Rather it outlines a typical process and introduces the individual product, one at a time, with an emphasis on how each product scales.

With that in mind, the process HDInsight ETL process might look like this:

![HDInsight ETL Overview](./media/hdinsight-etl-at-scale/hdinsight-etl-at-scale-overview.png)

## File Storage And Result Storage

Files are typically loaded into a location in Azure and left there.  As stated above, files can be any format, but typically they are CSVs.  Both Azure services listed only charge for the data that you actually use.  Neither service charges for compute time.

### Azure Storage 

[Azure Storage](https://azure.microsoft.com/en-us/services/storage/blobs/) has [very specific scalability targets](https://docs.microsoft.com/en-us/azure/storage/storage-scalability-targets) that you should familarize yourself with.  For most analytic nodes, Azure Storage scales best when dealing with many smaller files.  Azure Storage guarantees the same performance, no matter how many files or how large the files (as long as you are within your limits.)  This means that you can store terabytes of data and still get consistent performance, regardless if you are using a subset of the data or all of the data.

Azure Storage also has several different types of blobs.  One in particular, append blob, is a great option for storing web logs or sensor data.  

Blobs can be distributed across many servers in order to scale out access to them, but a single blob can only be served by a single server. While blobs can be logically grouped in blob containers, there are no partitioning implications from this grouping.

Azure Storage also has a WebHDFS API layer for the blob storage.  This means that all of the services in HDInsight can access files in Azure Blob Storage for data cleaning and data processing, similar to how those services would use Hadoop Distributed Files System (HDFS).

Data is typically ingested into Azure Storage using either PowerShell, the Azure Storage SDK, or AZCopy.

### Azure Data Lake Store

Azure Data Lake Store (ADLS) is Azure's implementation of HDFS.  It doesn't actually use HDFS, but it's design paradigm is very similar.  As such, ADLS is very good when working with large files, since a large file can be stored across multiple nodes.  The user never needs to think about how to partition data in ADLS, as it's done behind the scenes.  You get massive throughput to run analytic jobs with thousands of concurrent executors that efficiently read and write hundreds of terabytes of data.

Here two some other notable differences between Azure Storage and ADLS:

* ADLS allows you to have a folder hierarchy.  Azure Storage only has a flat set of containers that server as folders.

* Optimized performance for parallel analytics workloads. High Throughput and IOPS.

Data is typically ingested into ADLS using Azure Data Factory, ADLS SDKs, AdlCopy Service, Apache DistCp, or Apache Sqoop.  Which of these services to use might largely depend on where the data is.  If the data is currently in an existing Hadoop cluster, you might use Apache DistCp, AdlCopy Service, or Azure Data Factory.  If it's in Azure Blob Storage, you might use Azure Data Lake Store .NET SDK, Azure PowerShell, or Azure Data Factory.


It is also optimized for event ingestion using Azure Event Hub or Apache Storm.

### Considerations with Both Storage options

For uploading datasets that range in sefveral terabytes, network latency can be a major problem, particularly if the data is coming from an on-premise location.  In such cases, you can use the options below:

* Azure ExpressRoute:  Azure ExpressRoute lets you create private connections between Azure datacenters and infrastructure on your premises. This provides a reliable option for transferring large amounts of data. For more information, see [Azure ExpressRoute documentation](https://docs.microsoft.com/en-us/azure/expressroute/expressroute-introduction).

* "Offline" upload of data. If using Azure ExpressRoute is not feasible for any reason, you can use [Azure Import/Export service](https://docs.microsoft.com/en-us/azure/storage/storage-import-export-service) to ship hard disk drives with your data to an Azure data center. Your data is first uploaded to Azure Storage Blobs. You can then use [Azure Data Factory](https://docs.microsoft.com/en-us/azure/data-factory/data-factory-azure-datalake-connector) or [AdlCopy](https://docs.microsoft.com/en-us/azure/data-lake-store/data-lake-store-copy-data-azure-storage-blob) tool to copy data from Azure Storage Blobs to Data Lake Store.

### Azure SQL Data Warehouse

Azure SQL DW is a great choice to store cleaned and prepared results for future analytics.  Azure HDInsight can be used to perform those services for Azure SQL DW.

Azure SQL Data Warehouse (SQL DW) is a relational database store that is optimzied for analytic workloads.  Azure SQL DW scales based on partitioned tables.  Tables can be partitioned across multiple nodes.  Azure SQL DW nodes are selected at the time of creation.  They can scale after the fact, but that's an active process that might require data movement.  This is sometimes a time consuming and expensive process, so should be done carefully.  See [SQL Data Warehouse - Manage Compute](https://docs.microsoft.com/en-us/azure/sql-data-warehouse/sql-data-warehouse-manage-compute-overview) for more information.

### HBase

Apache HBase is a key-value store on Azure HDInsight.  Apache HBase is an open-source, NoSQL database that is built on Hadoop and modeled after Google BigTable. HBase provides random access and strong consistency for large amounts of unstructured and semistructured data in a schemaless database organized by column families.

Data is stored in the rows of a table, and data within a row is grouped by column family. HBase is a schemaless database in the sense that neither the columns nor the type of data stored in them need to be defined before using them. The open-source code scales linearly to handle petabytes of data on thousands of nodes. It can rely on data redundancy, batch processing, and other features that are provided by distributed applications in the Hadoop ecosystem.   

HBase is an excellent destination for Sensor and log data for future analysis.

HBase scalability is dependant on the number of nodes in the HDInsight cluster.

### Azure SQL Database and Azure Database

Azure offers three different relational databases as Platform-as-a-Service(PAAS).

* [Azure SQL Database](https://docs.microsoft.com/en-us/azure/sql-database/) is an implementation of Microsoft SQL Server.

* [Azure Database for MySQL](https://docs.microsoft.com/en-us/azure/mysql/)  is an implementation of Oracle MySQL.

* [Azure Database for PostgreSQL](https://docs.microsoft.com/en-us/azure/postgresql/quickstart-create-server-database-portal) is an implementation of PostgresSQL.

These products scale up, which means that they are scaled by adding more CPU and memory.  You can also choose to use premium disks with the products for better I/O performance.  
 
Azure SQL Database offers tooling for scale-out with [Elastic Database Tools](https://docs.microsoft.com/en-us/azure/sql-database/sql-database-elastic-scale-get-started)

Both services scale by using a slider bar to pick how much compute resources you need.  Both have independant tooling and performance recommendations according to your needs and workload.  

Selection of which service will depend how comfortable you are with the base products.

For more information on performance, see [Tuning Performance in Azure SQL Database](https://docs.microsoft.com/en-us/azure/sql-database/sql-database-performance-guidance).  Information on tuning Azure Database for MySQL and Azure Database for PostgreSQL will be forthcoming. 

### Azure Analysis Services 

Azure Analysis Services (AAS) is an analytical data engine used in decision support and business analytics, providing the analytical data for business reports and client applications such as Power BI, Excel, Reporting Services reports, and other data visualization tools.

The basic idea is that data is loaded into AAS where AAS will calculate all of the aggregations necessary to support the previously mentioned tooling.  This is done for two primary reasons:

* Pre-aggregations are very fast for the user doing analytics.  Results are interactive and near-instant.

* Calculations can be centralized and approved by the business or organization.  This supports one version of the truth across multiple reports, spreadsheets, or dashboards.

Data can be loaded directly into AAS cubes from Azure Blog Storage, Azure SQL Database, and Azure Data Warehouse.

Cubes can scale by changing tiers for each individual cube.  For more information, see [Azure Analysis Services Pricing](https://azure.microsoft.com/en-us/pricing/details/analysis-services/).

## Extract and Load

Once the data exists in Azure, we can use many services to extract and load it into other products.  HDInsight supports Sqoop and Flume. 

### Sqoop

Apache Sqoop is a tool designed for efficiently transferring data betweeen structured, semi-structured and unstructured data sources. 

Sqoop uses MapReduce to import and export the data, which provides parallel operation as well as fault tolerance.


### Flume
Apache Flume is a distributed, reliable, and available service for efficiently collecting, aggregating, and moving large amounts of log data. It has a simple and flexible architecture based on streaming data flows. It is robust and fault tolerant with tunable reliability mechanisms and many failover and recovery mechanisms. It uses a simple extensible data model that allows for online analytic application.

Apache Flume cannot be used with Azure HDInsight.  An on-premise Hadoop installation can use Flume to send data to either Azure Storage Blobs or Azure Data Lake Store.  For more information, see [this blog post](https://blogs.msdn.microsoft.com/bigdatasupport/2014/03/18/using-apache-flume-with-hdinsight/).



### Other options
Other options for extract and load are SQL Server Integration Services installed in an Azure Virtual Machine and Azure Data Factory. Both have connectors into HDInsight that allow for data movement amongst various sources and destinations.  


## Transform
Once data exists in the chosen location, we need to actually clean it, combine it, or prepare it for a specific usage pattern.  Hive, Pig, and Spark SQL are all very good choices for that kind of work.  They are all supported on HDInsight.  They all use MapReduce to achieve scalability and high-performance.

See [Using Apache Hive as an ETL Tool](./hdinsight-using-apache-hive-as-an-etl-tool.md) for more information on Hive.

See [Use Pig with Hadoop on HDInsight](https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-use-pig) for more information on Pig.


## Orchestrations

ETL jobs in HDInsight often involved several different products working in conjunction with each other.  You might use Hive to clean some portion of the data, while Pig cleans another portion.  You might use Azure Data Factory to load data into Azure SQL Database from Azure Data Lake Store.

Orechestration is needed to run the appropriate job at the appropriate time.

### Oozie

Apache Oozie is a workflow/coordination system that manages Hadoop jobs. It is integrated with the Hadoop stack, and it supports Hadoop jobs for Apache MapReduce, Apache Pig, Apache Hive, and Apache Sqoop. It can also be used to schedule jobs that are specific to a system, such as Java programs or shell scripts.

For more information, see [Use Oozie with Hadoop to define and run a workflow on HDInsight](https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-use-oozie-linux-mac)

### Azure Data Factory

Azure Data Factory is the platform for this kind of scenarios. It is a cloud-based data integration service that allows you to create data-driven workflows in the cloud for orchestrating and automating data movement and data transformation. Using Azure Data Factory, you can create and schedule data-driven workflows (called pipelines) that can ingest data from disparate data stores, process/transform the data by using compute services such as Azure HDInsight Hadoop, Spark, Azure Data Lake Analytics, and Azure Machine Learning, and publish output data to data stores such as Azure SQL Data Warehouse for business intelligence (BI) applications to consume.

For more information on Azure Data Factory, see the [documentation](https://docs.microsoft.com/en-us/azure/data-factory/data-factory-introduction).
