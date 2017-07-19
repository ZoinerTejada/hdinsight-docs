
DROP TABLE ${hiveTableName};
CREATE EXTERNAL TABLE ${hiveTableName}
(
    YEAR INT,
  	MONTH INT,
  	DAY_OF_MONTH INT,
  	CARRIER STRING,
  	AVG_DEP_DELAY FLOAT,
  	AVG_ARR_DELAY FLOAT,
  	TOTAL_DISTANCE FLOAT
)
ROW FORMAT DELIMITED
FIELDS TERMINATED BY '\t' STORED AS TEXTFILE LOCATION '${hiveDataFolder}';
INSERT OVERWRITE TABLE ${hiveTableName}
SELECT 	year, month, day_of_month, carrier, avg(dep_delay) avg_dep_delay, 
		avg(arr_delay) avg_arr_delay, sum(distance) total_distance 
FROM flights
GROUP BY year, month, day_of_month, carrier 
HAVING year = ${year} AND month = ${month} AND day_of_month = ${day};