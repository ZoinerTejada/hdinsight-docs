
# Capacity Planning
Capacity planning is an important first step in deploying your HDInsight cluster. A good plan can help you optimize your costs while delivering high performance and usability to the users of your cluster. In addition, when provisioning your cluster there are a series of decisions you need to make that are either difficult or impossible to change later- thinking thru these decisions can save you from having to tear down your cluster and setup a new one to address the issue. 

The key questions to ask when doing your capacity planning are:
* In which geographic region should you deploy your cluster?
* What cluster type should you deploy?
* What size and type of virtual machine should your cluster nodes use?
* How many worker nodes should your cluster have?

The sections that follow provide guidance on each of these topics. 

## Choosing a region
The region determines where your cluster is actually provisioned.  The primary consideration in selecting a region is data locality- you want your cluster physically near the data it will process to minimize latency of reads and writes. 
There are a few scenarios to consider. 

### Availability of HDInsight in the region desired
HDInsight is available in most Azure regions, but not all. Be sure to check the HDInsight Linux entry in [Azure Products Available by Region](https://azure.microsoft.com/regions/services/) when selecting the location for your cluster deployment.

### Location of default storage
When provisioning your cluster, the default storage selected (e.g., the Azure Storage Account or Data Lake Store) must be in the same location as your cluster. This means your storage choice dictates the location you must select for your cluster. When using Data Lake Store for default storage, this may further narrow the locations available to your cluster as the Data Lake Store is currently only available in three locations globally (Central US, East US 2 and North Europe). Azure Storage is available in all location, so this same consideration does not apply. 

### Location of existing data
If you already have a Storage Account or Data Lake Store deployed and loaded with data and intend to use this storage as your cluster's default storage, then you will need to deploy your cluster into the same location as where the data is stored. Once you have an HDInsight cluster deployed, you can attach additional Azure Storage Accounts or access other Data Lake Stores. When using a Storage Account as an additional storage location, this account must reside in the same location as your cluster. When using a Data Lake Store, however, the cluster and the Data Lake Store can reside in different locations (although consider the latency consequences of doing so as the data has further to travel in reaching your cluster).

## Choosing a cluster type
The cluster type dictates the workload your HDInsight cluster is configured to run, such as Hadoop, Storm, Kafka or Spark. For a detailed description of the available cluster types, see [HDInsight Architecture](hdinsight-architecture.md). Each cluster type brings with it a specific deployment topology along with requirements specific to the type of nodes, namely the size and number of nodes. 

## Choosing the VM size and type
When planning you cluster deployment, you need to consider the VM size and type. Each cluster type brings with it a set of node types, and each node type has specific options for the VM size and type. You typically select different VM sizes and types for the different node types. What  your particular cluster will need is something you will need to benchmark using either simulated workloads (where you run your expected workloads on different size clusters, gradually increasing the size until the desired performance is reached) or canary queries (where you have specific queries you run periodically among the other production queries that can indicate if the cluster has enough resources or not). In general terms, the selection of the VM size and type boils down to selecting amongst CPU, RAM Memory and Network:

* CPU: The VM size dictates the number of cores. The more cores, the greater the degree of parallel computation each node can achieve. Additionally, some VM types have cores that are faster than the standard offering. 
* RAM: The VM size also dicates the amount of RAM available in the VM. With many workloads choosing to store data in memory for processing, as opposed to reading from disk, ensuring your worker nodes have enough memory to fit the data is one way to drive your selection of VM size.
* Network: For most cluster types, the data processed by the cluster lives in an external storage service (e.g., Data Lake Store or Azure Storage) and not on the local disks. Therefore, the network bandwidth and throughput connecting the node VM and this storage service is an important consideration. Typically, the network bandwidth available to a VM increases with larger sizes. For details, see [VM sizes overview](https://docs.microsoft.com/azure/virtual-machines/linux/sizes).  

## Choosing the cluster scale
Related to the size and type of the VM nodes, is the quantity of VM nodes in your cluster. This is often referred to as the cluser scale. For all cluster types, there are node types that have a specific scale (e.g., they require exactly three ZooKeeper nodes or two Head nodes) and node types that support scale out. The latter typically applies to Worker nodes that do the processing in a distributed fashion, where the processing can benefit from scaling out (e.g., adding additional Worker nodes). Depending on your cluster type, increasing the number of Worker nodes will add additional computational capacity (e.g.,more cores), but may also add to the total amount of memory available cluster wide to support in-memory storage of data being processed. As for the choice of VM size and type, the approach for selecting the right cluster scale is typically reached emprically either by using simulated worklaods or canary queries. 

## Quotas
A very important consideration when planning your deployment, after you have identified your target cluster VM size, scale and type is to confirm your subscription has enough quota capacity remaining. When you reach a quota limit, you may be blocked from deploying new clusters or from scaling out existing clusters by adding more worker nodes. The most common quota limit reached is the CPU Cores quota which exists at the subscription, region and VM series levels. For example, your subscription may have a 200 core limit and you may have a 30 core limit in West US 2 and a 30 core limit on Dv2 instances. These quota limits are soft in that you can [contact support to request a quota increase](https://docs.microsoft.com/azure/azure-supportability/resource-manager-core-quotas-request). However, there are some hard limits that cannot be changed with a call to support. When it comes to CPU cores, a single Azure subscription can have at most 10,000 cores, and this is a hard limit. For details on these limits, see [Azure subscription and service limits, quotas, and constraints](https://docs.microsoft.com/azure/azure-subscription-service-limits#limits-and-the-azure-resource-manager).

## Next steps

* [Set up clusters in HDInsight with Hadoop, Spark, Kafka, and more](hdinsight-hadoop-provision-linux-clusters.md): Learn how to set up and configure clusters in HDInsight with Hadoop, Spark, Kafka, Interactive Hive, HBase, R Server, or Storm.  