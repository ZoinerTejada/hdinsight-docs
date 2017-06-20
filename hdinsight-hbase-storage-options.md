# Choosing storage option for HBase on HDInsight

HBase on HDInsight can be configured to use either Azure Storage blobs or Azure Data Lake Store as the location where it stores its data (e.g., Storefiles) and metadata. When you provision an HDInsight cluster, either option can be used as the default storage location. Additionally, either can be attached to the HDInsight cluster as additional storage.


## Azure Storage
When using Azure Storage blobs, the files managed by HBase will be stored a block blobs in the configured Storage Account. There are some limitation you should be aware of when choosing Azure Storage that may affect the performance and scalability of your HDInsight HBase cluster:

* Total Storage Account Capacity: Azure Storage has an upper limit of 500 TB per Storage Account. This means that if you only have one Storage Account attached to your HDInsight HBase cluster, then the maximum size it can support will be close to 500 TB. 
* Maximum Blob Size: Each individual blob in Azure Storage blobs has a maximum size of approximately 4.75 TB. This dictates maximum size of your individual Storefiles.
* Maximum Throughput for Storage Account: The Storage Account has an all-up limit of 20,000 requests per second. This limit represents the combined requests per  second against all blobs in the Storage Account. This means there is an upper limit of how many "hot" Storefiles your Storage Account will support. For example, if you had 41 Storefiles that were hot, each using 500 requests per second, you would hit this upper limit because your Storage Account would be experiencing 20,500 requests per second. When you hit the limit, your requests will be throttled, slowing down the execution of your HBase operations.
* Maximum Throughout for a Single Blob: Each blob in Azure Storage supports a maximum throughput of up to 60 MB/s or 500 requests per second. This limit effectively caps the throughput available for serving requests against your Storefiles, since each Storefile is represented by a blob.  When you exceed these limits, your requests will be throttled, slowing down the execution of your HBase operations against that Storefile.

For the latest on Azure Storage limits, see [Azure subscription limits and quotas](https://docs.microsoft.com/azure/azure-subscription-service-limits#storage-limits).


## Data Lake Store
When using Azure Data Lake Store, the files managed by HBase are stored by Data Lake Store without any of the aforementioned limitations that apply to Azure Storage Blobs. This provides many benefits:

* No limits on the all up size of your HBase storage.
* No limits on the size of your Storefiles.
* High throughput and IOPs.

Additionally, because Azure Data Lake Store is designed to support write-once, read many analytic workloads, it automatically replicates files to multiple serving nodes. For example, in read scenarios the Storefile can be read from any of the replicas. This means that multiple HBase operations against the same Storefile may be served from different nodes, giving your queries a greater maximum throughput than if the data was served from one node only.

### Region availability limits
When utilizing Azure Data Lake Store, consider that it is not available in all regions. In order to use Data Lake Store with your HDInsight HBase cluster, you will need to provision your HDInsight cluster in the same location in which you have provisioned an instance of Data Lake Store. For the latest list of regions supporting Azure Data Lake Store, see [Azure Products by Region](https://azure.microsoft.com/regions/services/)


## See also

* For more details on HDInsight storage architecture, see [HDInsight Architecture](hdinsight-architecture.md)
