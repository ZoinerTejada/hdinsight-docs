package com.microsoft.examples

import org.apache.spark.sql.{ForeachWriter, Row, SparkSession}
import org.apache.spark.sql.functions.{get_json_object, json_tuple}

object BlueYonderMain {
  def main (arg: Array[String]): Unit = {

    // Set your event hub values here:
    val eventhubParameters = Map[String, String] (
      "eventhubs.policyname" -> "spark",
      "eventhubs.policykey" -> "YOUR_KEY",
      "eventhubs.namespace" -> "YOUR_NAMESPACE",
      "eventhubs.name" -> "sensordata",
      "eventhubs.partition.count" -> "2",
      "eventhubs.consumergroup" -> "$Default",
      "eventhubs.progressTrackingDir" -> "/eventhubs/progress",
      "eventhubs.sql.containsProperties" -> "true"
    )
    val openTSDB_URL = "https://YOUR_OPENTSDB_URL/api/put"  // "https://streamingbi-tdb.apps.azurehdinsight.net/api/put"
    val creds = "admin:YOUR_PASSWORD"

    val spark = SparkSession.builder.getOrCreate()

    import spark.implicits._

    // Read the event hub data into a new stream:
    val inputStream = spark.readStream.
      format("eventhubs").
      options(eventhubParameters).
      load()

    // Extract just the fields we want while casting the binary event body data to string values:
    var inputSelect = inputStream.select(
      get_json_object(($"body").cast("string"), "$.Temperature").alias("Temperature"),
      get_json_object(($"body").cast("string"), "$.TimeStamp").alias("TimeStamp"),
      get_json_object(($"body").cast("string"), "$.DeviceId").alias("DeviceId"))

    // Alternate method: output to parquet files
    /*inputSelect.writeStream.outputMode("append").
      option("checkpointLocation", "wasb:///temp").
      format("parquet").
      option("path", "wasb:///StreamOutNew").
      start().awaitTermination()*/

    // Alternate method 2: use the custom HBaseSink to write directly to HBase
    // val writer = new HBaseSink()

    // Send data to OpenTSDB, using our custom OpenTSDBSink class:
    val writer = new OpenTSDBSink(openTSDB_URL, creds)
    inputSelect.writeStream.outputMode("append").foreach(writer).start().awaitTermination()
  }
}