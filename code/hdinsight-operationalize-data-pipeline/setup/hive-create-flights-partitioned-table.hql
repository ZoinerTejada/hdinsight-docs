SET hive.exec.dynamic.partition.mode=nonstrict;

CREATE TABLE flights
(
  	FL_DATE STRING,
  	CARRIER STRING,
  	FL_NUM STRING,
  	ORIGIN STRING,
  	DEST STRING,
  	DEP_DELAY FLOAT,
  	ARR_DELAY FLOAT,
  	ACTUAL_ELAPSED_TIME FLOAT,
  	DISTANCE FLOAT
)
PARTITIONED BY (YEAR INT, MONTH INT, DAY_OF_MONTH INT)
ROW FORMAT SERDE 'org.apache.hadoop.hive.serde2.OpenCSVSerde'
WITH SERDEPROPERTIES 
(
    "separatorChar" = ",",
    "quoteChar"     = "\""
);
