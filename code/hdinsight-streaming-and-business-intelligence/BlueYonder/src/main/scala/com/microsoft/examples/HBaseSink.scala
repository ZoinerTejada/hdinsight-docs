package com.microsoft.examples

import org.apache.spark.sql.{ForeachWriter, Row, SparkSession}
import org.apache.hadoop.hbase.{HBaseConfiguration, TableName}
import org.apache.hadoop.hbase.client.{ConnectionFactory, HTable, Put}
import org.apache.hadoop.hbase.mapred.TableOutputFormat
import org.apache.hadoop.hbase.util.Bytes

class  HBaseSink() extends ForeachWriter[org.apache.spark.sql.Row] {

  var sensorDataTable:org.apache.hadoop.hbase.client.Table = _

  override def process(value: Row): Unit = {
    val temp = value(0)
    val time = value(1)
    val device = value(2)

    if (temp != null && time != null) {
      val rowkey = time.toString() + "_" + temp.toString()
      val put = new Put(Bytes.toBytes(rowkey))
      put.add(Bytes.toBytes("Device"), Bytes.toBytes("Temperature"), Bytes.toBytes(temp.toString()))
      put.add(Bytes.toBytes("Device"), Bytes.toBytes("TimeStamp"), Bytes.toBytes(time.toString()))
      put.add(Bytes.toBytes("Device"), Bytes.toBytes("DeviceId"), Bytes.toBytes(device.toString()))
      sensorDataTable.put(put)
    }
  }
  override def close(errorOrNull: Throwable): Unit = {
  }
  override def open(partitionId: Long, version: Long): Boolean = {
    // set up HBase Table configuration
    val config = HBaseConfiguration.create()
    config.set(TableOutputFormat.OUTPUT_TABLE, "SensorData")

    val connection = ConnectionFactory.createConnection(config)
    sensorDataTable = connection.getTable(TableName.valueOf("SensorData"))
    true
  }
}