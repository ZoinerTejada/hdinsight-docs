create table flights (year integer not null, quarter integer, month integer not null, dayofmonth integer not null, 
dayofweek integer, flightdate char(8), uniquecarrier char(2), airlineid char(5), carrier char(2)  not null, tailnum char(6), 
flightnum integer not null, originairportid char(5), originairportseqid char(7), origincitymarketid char(5), 
origin char(3)  not null
CONSTRAINT pk PRIMARY KEY(Year,Month, DayOfMonth,Carrier,FlightNum,Origin));




upsert into flights values(2014, 1, 1, 4, 6, '1/4/14', 'OO', '20304', 'OO', 'N495CA', 6459, '13930', '1393003', '30977', 'ORD');