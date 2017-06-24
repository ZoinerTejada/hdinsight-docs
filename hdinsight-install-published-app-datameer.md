---
title: Install Published Application - Datameer on Azure HDInsight | Microsoft Docs
description: Learn how to install third-party Hadoop applications on Azure HDInsight.
services: hdinsight
documentationcenter: ''
author: 
manager: 
editor: 
tags: azure-portal

ms.assetid: 
ms.service: hdinsight
ms.custom: hdinsightactive
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 
ms.author: 

---
# Install published application - Datameer on Azure HDInsight

In this article, you will learn how to install the [Datameer](https://www.datameer.com/) published Hadoop application on Azure HDInsight. Read [Install third-party Hadoop applications](hdinsight-apps-install-applications) for a list of available Independent Software Vendor (ISV) applications, as well as an overview of the HDInsight application platform. For instructions on installing your own application, see [Install custom HDInsight applications](hdinsight-apps-install-custom-applications.md).

## About Datameer

Sitting natively on the powerful Hadoop platform, Datameer extends existing Azure HDInsight capabilities by facilitating quick integration, preparation and analysis of all structured and unstructured data. Datameer makes it easy to ingest and integrate data with more than 70 sources and formats: structured, semi-structured, and unstructured. You can directly upload data, or use their unique data links to pull data on demand. Datameer’s self-service functionality and familiar spreadsheet interface reduces the complexity of big data technology and dramatically accelerates time to insight. The spreadsheet interface provides a simple mechanism for entering declarative spreadsheet formulas that are translated to fully optimized Hadoop jobs. If you have BI or Excel skills, you can use Hadoop in the cloud quickly.

[Datameer documentation](http://www.datameer.com/documentation/display/DAS50/Home?ls=Partners&lsd=Microsoft&c=Partners&cd=Microsoft)


## How to install the Datameer published application

The instructions provided in this article use Azure portal. You can also export the Azure Resource Manager template from the portal or obtain a copy of the Resource Manager template from most vendors, and use Azure PowerShell and Azure CLI to deploy the template.  See [Create Linux-based Hadoop clusters in HDInsight using Resource Manager templates](hdinsight-hadoop-create-linux-clusters-arm-templates.md).

## Prerequisites

All that's needed is an existing HDInsight cluster, or you can follow steps to [create an HDInsight cluster](hdinsight-hadoop-linux-tutorial-get-started.md#create-cluster).

## Install application to existing clusters
The following procedure shows you how to install the HDInsight application to an existing HDInsight cluster.

**To install Datameer**

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Click **HDInsight Clusters** in the left menu.  If you don't see it, click **More Services**, and then click **HDInsight Clusters**.
3. Click an HDInsight cluster.  If you don't have one, you must create one first.  see [Create clusters](hdinsight-hadoop-linux-tutorial-get-started.md#create-cluster).
4. Click **Applications** under the **Configurations** category. You can see a list of installed applications if there are any. If you cannot find Applications, that means there is no applications for this version of the HDInsight cluster.
   
    ![HDInsight applications portal menu](./media/hdinsight-apps-install-applications/hdinsight-apps-portal-menu.png)
5. Click **Add** from the blade menu. 
   
    ![HDInsight applications installed apps](./media/hdinsight-apps-install-applications/hdinsight-apps-installed-apps.png)
   
    You can see a list of existing HDInsight applications.
   
    ![HDInsight applications available applications](./media/hdinsight-install-published-app-datameer/hdinsight-apps-list.png)
6. Select Datameer, accept the legal terms, and then click **Select**.

You can see the installation status from the portal notifications (click the bell icon on the top of the portal). After the application is installed, the application will appear on the Installed Apps blade.

## Install applications during cluster creation
You have the option to install Datameer when you create a cluster. During the process, HDInsight applications are installed after the cluster is created and is in the running state. The following procedure shows you how to install Datameer when you create a cluster.

**To install Datameer**

1. Sign in to the [Azure  portal](https://portal.azure.com).
2. Click **NEW**, Click **Data + Analytics**, and then click **HDInsight**.
3. Select **Custom (size, settings, apps)**.
4. Enter **Cluster Name**: This name must be globally unique.
5. Click **Subscription** to select the Azure subscription that will be used for the cluster.
6. Click **Select cluster Type**, and then select:
   
   * **Cluster Type**: Select **Hadoop**. This is the only available cluster type for Datameer.
   * **Operating System**: Select **Linux**.
   * **Version**: Select HDI version 3.4. For more information about versions, see [HDInsight cluster versions](hdinsight-component-versioning.md).
   * **Cluster Tier**: Azure HDInsight provides the big data cloud offerings in two categories: Standard tier and Premium tier. For more information, see [Cluster tiers](hdinsight-hadoop-provision-linux-clusters.md#cluster-tiers).
7. Click **Credentials** and then enter a password for the admin user. You must also enter an **SSH Username** and either a **PASSWORD** or **PUBLIC KEY**, which will be used to authenticate the SSH user. Using a public key is the recommended approach. Click **Select** at the bottom to save the credentials configuration.
8. Click **Resource Group** to select an existing resource group, or click **New** to create a new resource group.
9. Select the cluster **Location**.
10. Click **Next**.
11. Select your **Storage Account Settings**, selecting one of the existing storage accounts or creating a new one to be used as the default storage account for the cluster. In this blade, you may also select additional storage accounts as well as configure metastore settings to preserve your metadata outside of the cluster.
12. Click **Next**.
13. Select Datameer in the **Applications** blade, accept the terms of use by clicking **Purchase**, then **OK**, then click **Next**.

    ![Datameer](./media/hdinsight-install-published-app-datameer/datameer.png)

14. Complete the remaining steps, such as cluster size and advanced settings. On the **Summary** blade, confirm your settings, and then click **Create**.

## List installed HDInsight apps and properties
The portal shows a list of the installed HDInsight applications for a cluster, and the properties of each installed application.

**To list HDInsight application and display properties**

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Click **HDInsight Clusters** in the left menu.  If you don't see it, click **Browse**, and then click **HDInsight Clusters**.
3. Click an HDInsight cluster.
4. From the **Settings** blade, click **Applications** under the **General** category. The Installed Apps blade lists all the installed applications. 
   
    ![HDInsight applications installed apps](./media/hdinsight-install-published-app-datameer/hdinsight-apps-installed-apps-with-apps.png)
5. Click one of the installed applications to show the property. The property blade lists:
   
   * App name: application name.
   * Status: application status. 
   * Webpage: The URL of the web application that you have deployed to the edge node if there is any. The credential is the same as the HTTP user credentials that you have configured for the cluster.
   * HTTP endpoint: The credential is the same as the HTTP user credentials that you have configured for the cluster. 
   * SSH endpoint: You can use SSH to connect to the edge node. The SSH credentials are the same as the SSH user credentials that you have configured for the cluster. For information, see [Use SSH with HDInsight](hdinsight-hadoop-linux-use-ssh-unix.md).
6. To delete a application, right-click the application, and then click **Delete** from the context menu.

## Connect to the edge node
You can connect to the edge node using HTTP and SSH. The endpoint information can be found from the [portal](#list-installed-hdinsight-apps-and-properties). For information, see [Use SSH with HDInsight](hdinsight-hadoop-linux-use-ssh-unix.md).

The HTTP endpoint credentials are the HTTP user credentials that you have configured for the HDInsight cluster; the SSH endpoint credentials are the SSH credentials that you have configured for the HDInsight cluster.

## Troubleshoot
See [Troubleshoot the installation](hdinsight-apps-install-custom-applications.md#troubleshoot-the-installation).

## Next steps
* [Install custom HDInsight applications](hdinsight-apps-install-custom-applications.md): learn how to deploy an un-published HDInsight application to HDInsight.
* [Publish HDInsight applications](hdinsight-apps-publish-applications.md): Learn how to publish your custom HDInsight applications to Azure Marketplace.
* [MSDN: Install an HDInsight application](https://msdn.microsoft.com/library/mt706515.aspx): Learn how to define HDInsight applications.
* [Customize Linux-based HDInsight clusters using Script Action](hdinsight-hadoop-customize-cluster-linux.md): learn how to use Script Action to install additional applications.
* [Create Linux-based Hadoop clusters in HDInsight using Resource Manager templates](hdinsight-hadoop-create-linux-clusters-arm-templates.md): learn how to call Resource Manager templates to create HDInsight clusters.
* [Use empty edge nodes in HDInsight](hdinsight-apps-use-edge-node.md): learn how to use an empty edge node for accessing HDInsight cluster, testing HDInsight applications, and hosting HDInsight applications.

