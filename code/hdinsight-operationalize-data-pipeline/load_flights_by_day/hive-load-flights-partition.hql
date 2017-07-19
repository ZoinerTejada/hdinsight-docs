SET hive.exec.dynamic.partition.mode=nonstrict;

INSERT OVERWRITE TABLE flights
PARTITION (YEAR, MONTH, DAY_OF_MONTH)
SELECT 	
  	FL_DATE,
  	CARRIER,
  	FL_NUM,
  	ORIGIN,
  	DEST,
  	DEP_DELAY,
  	ARR_DELAY,
  	ACTUAL_ELAPSED_TIME,
  	DISTANCE,
	YEAR,
  	MONTH,
  	DAY_OF_MONTH
FROM rawflights
WHERE year = ${year} AND month = ${month} AND day_of_month = ${day};