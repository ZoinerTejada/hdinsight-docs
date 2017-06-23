import org.apache.spark.sql.{SQLContext, _}
import org.apache.spark.sql.execution.datasources.hbase._
import org.apache.spark.{SparkConf, SparkContext}
val sparkConf = new SparkConf().setAppName("HBaseTestApp")
import spark.sqlContext.implicits._


def catalog = s"""{
    |"table":{"namespace":"default", "name":"Contacts"},
    |"rowkey":"key",
    |"columns":{
    |"rowkey":{"cf":"rowkey", "col":"key", "type":"string"},
    |"officeAddress":{"cf":"Office", "col":"Address", "type":"string"},
    |"officePhone":{"cf":"Office", "col":"Phone", "type":"string"},
    |"personalName":{"cf":"Personal", "col":"Name", "type":"string"},
    |"personalPhone":{"cf":"Personal", "col":"Phone", "type":"string"}
    |}
|}""".stripMargin



def withCatalog(cat: String): DataFrame = {
  spark.sqlContext
  .read
  .options(Map(HBaseTableCatalog.tableCatalog->cat))
  .format("org.apache.spark.sql.execution.datasources.hbase")
  .load()
}


val df = withCatalog(catalog)

df.show()

df.registerTempTable("contacts")

val query = spark.sqlContext.sql("select col3, col1 from contacts")
query.show()


case class ContactRecord(
    rowkey: String,
    officeAddress: String,
    officePhone: String,
    personalName: String,
    personalPhone: String
    )

val newContact = ContactRecord("16891", "40 Ellis St.", "674-555-0110","John Jackson","230-555-0194")

var newData = new Array[ContactRecord](1)
newData(0) = newContact

sc.parallelize(newData).toDF.write
.options(Map(HBaseTableCatalog.tableCatalog -> catalog))
.format("org.apache.spark.sql.execution.datasources.hbase").save()

df.show()
