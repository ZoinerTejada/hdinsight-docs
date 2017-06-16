---
title: HDInsight Analyze Sensor Data with Hive | Microsoft Docs
description: ''
services: hdinsight
documentationcenter: ''

tags: azure-portal
keywords: HDInsight, IoT, Hive

---
# Using Apache Hive and the Hive Query Console to Analyze Sensor Data

Learn how to analyze sensor data by using the Hive Query Console with HDInsight (Hadoop), then visualize the data in Microsoft Excel by using Power View.

In this example, you'll use Hive to process historical data produced by heating, ventilation, and air conditioning (HVAC) systems to identify systems that are not able to reliably maintain a set temperature. You will learn how to:

* Create HIVE tables to query data stored in comma separated value (CSV) files.
* Create HIVE queries to analyze the data.
* Use Microsoft Excel to connect to HDInsight (using open database connectivity (ODBC) to retrieve the analyzed data.
* Use Power View to visualize the data.

![A diagram of the solution architecture](./media/hdinsight-hive-analyze-sensor-data/hvac-architecture.png)

##Prerequisites

* An HDInsight (Hadoop) cluster: See [Provision Hadoop clusters in HDInsight](hdinsight-provision-clusters.md) for information about creating a cluster.

* Microsoft Excel 2016

	> [AZURE.NOTE] Microsoft Excel is used for data visualization with [Power View](https://support.office.com/Article/Power-View-Explore-visualize-and-present-your-data-98268d31-97e2-42aa-a52b-a68cf460472e?ui=en-US&rs=en-US&ad=US).

* [Microsoft Hive ODBC Driver](http://www.microsoft.com/download/details.aspx?id=40886)

## To run the sample

1. From your web browser, navigate to the following URL. Replace `<clustername>` with the name of your HDInsight cluster.

	 	https://<clustername>.azurehdinsight.net

When prompted, authenticate by using the administrator user name and password you used when provisioning this cluster.  On the right, click on "Hive".  Look for Hive View 2.0 towards the bottom of the center page, then click on "Go to View."  Stay on this page as we begin the tutorial.
[Hive Dashboard](./media/hdinsight-hive-analyze-sensor-data/hdinsight-sensor-data-dashboard.png)


2. Install the Hive ODBC Driver on Windows.

3.  Install <a href="http://www.microsoft.com/en-us/download/details.aspx?id=40886">Excel 2016 on Windows</a>.

# Introduction
Many personal and commercial devices now contain sensors, which collect information from the physical world. For example, most phones have a GPS, fitness devices track how many steps you've taken, and thermostats can monitor the temperature of a building.

In this tutorial, you'll learn how HDInsight can be used to process historical data produced by heating, ventilation, and air conditioning (HVAC) systems to identify systems that are not able to reliably maintain a set temperature. You will learn how to:

* Refine and enrich temperature data from buildings in several countries
* Analyze the data to determine which buildings have problems maintaining comfortable temperatures (actual recorded temperature vs. temperature the thermostat was set to)
* Infer reliability of HVAC systems used in the buildings
* Visualize the data in Microsoft Excel

# Sensor Data Loaded Into Windows Azure Storage Blob

Let's load the sensor data into your default storage account.  

1.  Login to the Azure dashboard and click on your HDInsight cluster.

2.  On the right pane, click on  **Storage Accounts**. 

[Storage Account](./media/hdinsight-hive-analyze-sensor-data/hdinsight-sensor-data-storage-account.png)

3.  Click on your storage account.

4.  Click on "Open in Explorer"

[Open in Explorer](./media/hdinsight-hive-analyze-sensor-data/hdinsight-sensor-data-open-in-explorer.png)

5.  If you haven't already installed Azure Storage Explorer, this will prompt you to.

6.  Connect your Azure Account to Azure Storage Explorer.  Look at <a href="https://docs.microsoft.com/en-us/azure/vs-azure-tools-storage-manage-with-storage-explorer"> Getting Started with Azure Storage Explorer</a> for more information.

7.  Expand your Storage Account.

8.  Expand **Blob Containers**

9.  Create a new blob container called "sensordata".

10.  Under the "sensordata" blob container, create a new folder called "hvac".

11.  Upload this file to the new hvac folder:

[hvac csv file](./media/hdinsight-hive-analyze-sensor-data/hvac.csv)

## Creating Hive Tables to Query the Sensor Data in the Windows Azure Blob Storage

The following Hive statement creates an external table that allows Hive to query data stored in Azure Blob Storage. External tables preserve the data in the original file format while allowing Hive to perform queries against the data within the file. In this case, the data is stored in the file as comma separated values (CSV).

The Hive statements below create a new table, named hvac, by describing the fields within the files, the delimiter (comma) between fields, and the location of the file in Azure Blob Storage. This will allow you to create Hive queries over your data.  Remember to replace the path with your individual HDInsight cluster name.

1.  In your Ambari console that you logged into earlier, you should be on the Hive screen.

2.  Copy and paste the query below and put it in the white textbox in the middle of the screen.

DROP TABLE IF EXISTS hvac;

--create the hvac table on comma-separated sensor data
CREATE EXTERNAL TABLE hvac(`date` STRING, time STRING, targettemp BIGINT,
    actualtemp BIGINT, 
    system BIGINT, 
    systemage BIGINT, 
    buildingid BIGINT)
ROW FORMAT DELIMITED FIELDS TERMINATED BY ',' 
STORED AS TEXTFILE LOCATION 'wasbs://sensordata@hivesensordata.blob.core.windows.net/hvac/';

3.  Click the green "Execute" button.

4.  You can always execute a "SELECT * FROM hvac;" to see if you successfully loaded data.

## Creating Hive Queries over Sensor Data
The following Hive query creates select temperatures from your HVAC data, looking for temperature variations (see the query below). Specifically, the difference between the target temperature the thermostat was set to and the recorded temperature. If the difference is greater than 5, the temp_diff column will be set to 'HOT',or 'COLD' and extremetemp will be set to 1; otherwise, temp_diff will be set to ‘NORMAL’ and extremetemp will be set to 0.

The query will write the results into a new tables: hvac_temperatures (see the CREATE TABLE statements below). 

1.  In your Ambari console that you logged into earlier, you should be on the Hive screen.

2.  Copy and paste the query below and put it in the white textbox in the middle of the screen.

DROP TABLE IF EXISTS hvac_temperatures;

--create the hvac_temperatures table by selecting from the hvac table
CREATE TABLE hvac_temperatures AS
SELECT *, targettemp - actualtemp AS temp_diff, 
    IF((targettemp - actualtemp) > 5, 'COLD', 
    IF((targettemp - actualtemp) < -5, 'HOT', 'NORMAL')) AS temprange, 
    IF((targettemp - actualtemp) > 5, '1', IF((targettemp - actualtemp) < -5, '1', 0)) AS extremetemp
FROM hvac;

3.  Click the green "Execute" button.

4.  Run SELECT COUNT(*) FROM hvac_temperatures; to see if there are any records in the table.


# Loading Data into Excel
Once the job has successfully completed, you can use the Microsoft Hive ODBC Driver to import data from Hive into Excel 2016. Once you have installed the driver, use the following steps to connect to the table.

1. Open Excel and create a blank workbook.

2. From the Data tab, select From Other Sources, and then select From Microsoft Query.

[Excel Open Other Data Sources](./media/hdinsight-hive-analyze-sensor-data/hdinsight-sensor-data-open-other-data-sources.png)

3. Choose the hive ODBC driver.

[Excel Open Hive Driver](./media/hdinsight-hive-analyze-sensor-data/hdinsight-sensor-data-choose-hive-odbc.png)

4. In the Microsoft Hive ODBC Driver Connection dialog, enter the following values, and then click OK.

* Host - The host name of your HDInsight cluster. 	* For example, mycluster.azurehdinsight.net
* User Name - The administrator name for your HDInsight cluster (usually admin)
* Password - The administrator password
* All other fields can be left as the default values.

[Excel Hive ODBC Connection Information](./media/hdinsight-hive-analyze-sensor-data/hdinsight-sensor-data-connectioninformation.png)

5. In the Query Wizard, select the hvac_temperatures table, and then select the > button.

[Excel Hive Query Wizard](./media/hdinsight-hive-analyze-sensor-data/hdinsight-sensor-data-querywizard.png)

6. Click Next to continue through the wizard, until you reach a dialog with a Finish button. Click Finish.

7. When the Import Data dialog appears, click OK to accept the defaults. After the query completes, the data will be displayed in Excel.

[Excel Hive Query Results](./media/hdinsight-hive-analyze-sensor-data/hdinsight-sensor-data-queryresults)

8.  Click **Pivot Table Report** and then **OK**

[Excel Hive Pivot Table](./media/hdinsight-hive-analyze-sensor-data/hdinsight-sensor-data-pivottable.png)

9.  In the pivot table, buildingid to rows, date to columns, and actualtemp to the values.

[Excel Hive Setup Pivot](./media/hdinsight-hive-analyze-sensor-data/hdinsight-sensor-data-createpivot.png)

10.  Click on the dropdown arrow next ot actualtemp in the values section and click **Value Field Settings**.

[Excel Hive Setup Pivot](./media/hdinsight-hive-analyze-sensor-data/hdinsight-sensor-data-value-change.png)

11.  Change the count to an average and click **OK**.

12.  You should be able to see interesting trends by date for each buildings temperature.  Your results should look like the following:

[Excel Hive Setup Pivot](./media/hdinsight-hive-analyze-sensor-data/hdinsight-sensor-data-results.png)




