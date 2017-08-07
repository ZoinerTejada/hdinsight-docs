package com.microsoft.examples

import org.apache.http.impl.client.DefaultHttpClient
import java.nio.charset.StandardCharsets
import java.util.Base64
import java.time._
import org.apache.http.client.methods.HttpPost
import org.apache.http.entity.StringEntity
import org.apache.spark.sql.{ForeachWriter, Row}

class OpenTSDBSink(url:String, usernamePassword:String) extends ForeachWriter[org.apache.spark.sql.Row] {
  var encoding:String = _
  var httpClient:DefaultHttpClient = _
  var post:HttpPost = _

  override def process(value: Row): Unit = {
    val temp = value(0)
    val time = value(1)
    val device = value(2)

    if (temp != null && time != null) {
      // Convert time to epoch (timestamp)
      val timestamp = Instant.parse(time.toString).getEpochSecond
      val body = f"""{
                    |        "metric": "sensor.temperature",
                    |        "value": "$temp",
                    |        "timestamp": $timestamp,
                    |        "tags": {"deviceid": "$device"}
                    |}""".stripMargin
      post.setEntity(new StringEntity(body))
      httpClient.execute(post)
    }
  }
  override def close(errorOrNull: Throwable): Unit = {
  }
  override def open(partitionId: Long, version: Long): Boolean = {
    encoding = Base64.getEncoder.encodeToString(usernamePassword.getBytes(StandardCharsets.UTF_8))
    httpClient = new DefaultHttpClient()
    post = new HttpPost(url)
    post.setHeader("Content-type", "application/json")
    post.setHeader("Authorization", "Basic " + encoding)

    true
  }

}
