---
title: Using the Phoenix Query Server REST SDK - Azure HDInsight | Microsoft Docs
description: ''
services: hdinsight
documentationcenter: ''

tags: azure-portal
keywords: Phoenix,HBase,.NET,c#,sdk

---
# Using the Phoenix Query Server REST SDK

[Apache Phoenix](http://phoenix.apache.org/) is an open source, massively parallel relational database layer over [HBase](hdinsight-hbase-overview). It allows you to use SQL-like queries over HBase through tools like [SQLLine](hdinsight-hbase-phoenix-squirrel-linux) using SSH. Phoenix also provides an HTTP server called Phoenix Query Server (PQS) that exposes a thin client that supports two transport mechanisms, JSON and Protocol Buffers, for client communication. Protocol Buffers is the default mechanism, and offers more efficient communication than JSON.

In this article, we'll show you how to use the PQS REST SDK to create tables, upsert rows individually and in bulk, and select data using SQL statements. We'll be using the [Microsoft .NET driver for Apache Phoenix Query Server](https://www.nuget.org/packages/Microsoft.Phoenix.Client) in our examples. This SDK is built on [Apache Calcite's Avatica](https://calcite.apache.org/avatica/) APIs, which exclusively uses Protocol Buffers as the serialization format. 

Refer to the [Apache Calcite Avatica Protocol Buffers Reference](https://calcite.apache.org/avatica/docs/protobuf_reference.html) for more information.

## Installing the SDK

Microsoft .NET driver for Apache Phoenix Query Server is provided as a NuGet package, which can be installed from the Visual Studio **NuGet Package Manager Console** with the following command:

    Install-Package Microsoft.Phoenix.Client


## Instantiating a new PhoenixClient object

To begin using the library, you must instantiate a new `PhoenixClient` object, passing in `ClusterCredentials` composed of the `Uri` to your cluster, the Hadoop user name and password.

```c#
var credentials = new ClusterCredentials(new Uri("https://CLUSTERNAME.azurehdinsight.net/"), "USERNAME", "PASSWORD");
client = new PhoenixClient(credentials);
```

Replace CLUSTERNAME with your HDInsight HBase cluster name, and USERNAME and PASSWORD with the Hadoop credentials specified on cluster creation. The default Hadoop user name is **admin**.

## Generating a unique connection Id

When we prepare to send one or more requests to PQS, we need to include a unique connection identifier to associate one or more requests with the connection.

```c#
string connId = Guid.NewGuid().ToString();
```

 In each of our samples, you will see that we initially make a call to the `OpenConnectionRequestAsync` method, passing in the unique connection id. We subsequently define `ConnectionProperties` and `RequestOptions`, passing those objects as well as the generated connection id to the `ConnectionSyncRequestAsync` method. PQS's `ConnectionSyncRequest` object helps ensure that the client and server have a consistent view of the database properties.

## The ConnectionSyncRequest ConnectionProperties

When you make a call to `ConnectionSyncRequestAsync`, you pass a `ConnectionProperties` object:

```c#
ConnectionProperties connProperties = new ConnectionProperties
{
    HasAutoCommit = true,
    AutoCommit = true,
    HasReadOnly = true,
    ReadOnly = false,
    TransactionIsolation = 0,
    Catalog = "",
    Schema = "",
    IsDirty = true
};
await client.ConnectionSyncRequestAsync(connId, connProperties, options);
```

Here is a breakdown of the properties of interest:

| Property | Description |
| -- | -- |
| AutoCommit | A boolean denoting if `autoCommit` is enabled for Phoenix transactions. |
| ReadOnly | A boolean denoting whether the connection is read-only. |
| TransactionIsolation | An integer which denotes the level of transaction isolation per the JDBC specification.|
| Catalog | The name of the catalog to use when fetching connection properties |
| Schema | The name of the schema to use when fetching connection properties. |
| IsDirty | A boolean denoting if the properties have been altered. |

Here are the `TransactionIsolation` possible values:

| Isolation value | Description |
| -- | -- |
| 0 | Transactions are not supported. |
| 1 | Dirty reads, non-repeatable reads and phantom reads may occur. |
| 2 | Dirty reads are prevented, but non-repeatable reads and phantom reads may occur. |
| 4 | Dirty reads and non-repeatable reads are prevented, but phantom reads may occur. |
| 8 | Dirty reads, non-repeatable reads, and phantom reads are all prevented. |

## Create a new table

HBase, like any other RDBMS, stores data in tables. Using Phoenix, we are able to use standard SQL queries to create new tables, defining the primary key and column types as well.

For this and the remaining examples, we'll be using the instantiated `PhoenixClient` object as defined above.


```c#
string connId = Guid.NewGuid().ToString();
RequestOptions options = RequestOptions.GetGatewayDefaultOptions();

// You can set certain request options, such as timeout in milliseconds:
options.TimeoutMillis = 300000;

// In gateway mode, PQS requests will be https://<cluster dns name>.azurehdinsight.net/hbasephoenix<N>/
// Requests sent to hbasephoenix0/ will be forwarded to PQS on workernode0
options.AlternativeEndpoint = "hbasephoenix0/";
CreateStatementResponse createStatementResponse = null;
OpenConnectionResponse openConnResponse = null;

try
{
    // Opening connection
    var info = new pbc::MapField<string, string>();
    openConnResponse = await client.OpenConnectionRequestAsync(connId, info, options);
    
    // Syncing connection
    ConnectionProperties connProperties = new ConnectionProperties
    {
        HasAutoCommit = true,
        AutoCommit = true,
        HasReadOnly = true,
        ReadOnly = false,
        TransactionIsolation = 0,
        Catalog = "",
        Schema = "",
        IsDirty = true
    };
    await client.ConnectionSyncRequestAsync(connId, connProperties, options);

    // Create the statement
    createStatementResponse = client.CreateStatementRequestAsync(connId, options).Result;
    
    // Create the table if it does not exist
    string sql = "CREATE TABLE IF NOT EXISTS Customers (Id varchar(20) PRIMARY KEY, FirstName varchar(50), " +
        "LastName varchar(100), StateProvince char(2), Email varchar(255), Phone varchar(15))";
    await client.PrepareAndExecuteRequestAsync(connId, sql, createStatementResponse.StatementId, long.MaxValue, int.MaxValue, options);

    Console.WriteLine($"Table \"Customers\" created.");
}
catch (Exception e)
{
    Console.WriteLine(e);
    throw;
}
finally
{
    if (createStatementResponse != null)
    {
        client.CloseStatementRequestAsync(connId, createStatementResponse.StatementId, options).Wait();
        createStatementResponse = null;
    }

    if (openConnResponse != null)
    {
        client.CloseConnectionRequestAsync(connId, options).Wait();
        openConnResponse = null;
    }
}
```

We created a new table named "Customers" using the `IF NOT EXISTS` option. The `CreateStatementRequestAsync` call is used to create a new Statement in the Avitica (PQS) server. In the `finally` block, we ensure that the `CreateStatementResponse` that this method returns, as well as the `OpenConnectionResponse` object are properly closed. 

## Inserting data individually

This individual data insert example, as well as the bulk insert example, references a `List<string>` collection of States and territories that you can use:

```c#
var states = new List<string> { "AL", "AK", "AS", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FM", "FL", "GA", "GU", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MH", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "MP", "OH", "OK", "OR", "PW", "PA", "PR", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VI", "VA", "WA", "WV", "WI", "WY" };
```

We'll use the table's `StateProvince` column value in a select operation later on.

```c#
string connId = Guid.NewGuid().ToString();
RequestOptions options = RequestOptions.GetGatewayDefaultOptions();
options.TimeoutMillis = 300000;

// In gateway mode, PQS requests will be https://<cluster dns name>.azurehdinsight.net/hbasephoenix<N>/
// Requests sent to hbasephoenix0/ will be forwarded to PQS on workernode0
options.AlternativeEndpoint = "hbasephoenix0/";
OpenConnectionResponse openConnResponse = null;
StatementHandle statementHandle = null;
try
{
    // Opening connection
    pbc::MapField<string, string> info = new pbc::MapField<string, string>();
    openConnResponse = await client.OpenConnectionRequestAsync(connId, info, options);
    // Syncing connection
    ConnectionProperties connProperties = new ConnectionProperties
    {
        HasAutoCommit = true,
        AutoCommit = true,
        HasReadOnly = true,
        ReadOnly = false,
        TransactionIsolation = 0,
        Catalog = "",
        Schema = "",
        IsDirty = true
    };
    await client.ConnectionSyncRequestAsync(connId, connProperties, options);

    string sql = "UPSERT INTO Customers VALUES (?,?,?,?,?,?)";
    PrepareResponse prepareResponse = await client.PrepareRequestAsync(connId, sql, 100, options);
    statementHandle = prepareResponse.Statement;
    
    var r = new Random();

    // Insert 300 rows
    for (int i = 0; i < 300; i++)
    {
        var list = new pbc.RepeatedField<TypedValue>();
        var id = new TypedValue
        {
            StringValue = "id" + i,
            Type = Rep.String
        };
        var firstName = new TypedValue
        {
            StringValue = "first" + i,
            Type = Rep.String
        };
        var lastName = new TypedValue
        {
            StringValue = "last" + i,
            Type = Rep.String
        };
        var state = new TypedValue
        {
            StringValue = states.ElementAt(r.Next(0, 49)),
            Type = Rep.String
        };
        var email = new TypedValue
        {
            StringValue = $"email{1}@junkemail.com",
            Type = Rep.String
        };
        var phone = new TypedValue
        {
            StringValue = $"555-229-341{i.ToString().Substring(0,1)}",
            Type = Rep.String
        };
        list.Add(id);
        list.Add(firstName);
        list.Add(lastName);
        list.Add(state);
        list.Add(email);
        list.Add(phone);

        Console.WriteLine("Inserting customer " + i);

        await client.ExecuteRequestAsync(statementHandle, list, long.MaxValue, true, options);
    }

    await client.CommitRequestAsync(connId, options);

    Console.WriteLine("Upserted customer data");

}
catch (Exception ex)
{
    
}
finally
{
    if (statementHandle != null)
    {
        await client.CloseStatementRequestAsync(connId, statementHandle.Id, options);
        statementHandle = null;
    }
    if (openConnResponse != null)
    {
        await client.CloseConnectionRequestAsync(connId, options);
        openConnResponse = null;
    }
}
```

The overall structure of executing an insert statement is very similar to how we created a new table. One thing of note is at the end of the `try` block, we explicitly commit the transaction. Also notice that we are executing an insert request 300 times since it's in a loop. This makes for a lengthly process due to excessive requests over a thin client. A more efficient execution plan is to insert our records within a batch process.

## Batch inserting data

The following code is nearly identical to the code we used for inserting data individually. In this case, however, we're using the `UpdateBatch` object in a call to `ExecuteBatchRequestAsync`, as opposed to repeatedly calling `ExecuteRequestAsync` with our prepared statement.

```c#
string connId = Guid.NewGuid().ToString();
RequestOptions options = RequestOptions.GetGatewayDefaultOptions();
options.TimeoutMillis = 300000;

// In gateway mode, PQS requests will be https://<cluster dns name>.azurehdinsight.net/hbasephoenix<N>/
// Requests sent to hbasephoenix0/ will be forwarded to PQS on workernode0
options.AlternativeEndpoint = "hbasephoenix0/";
OpenConnectionResponse openConnResponse = null;
CreateStatementResponse createStatementResponse = null;
try
{
    // Opening connection
    pbc::MapField<string, string> info = new pbc::MapField<string, string>();
    openConnResponse = await client.OpenConnectionRequestAsync(connId, info, options);
    // Syncing connection
    ConnectionProperties connProperties = new ConnectionProperties
    {
        HasAutoCommit = true,
        AutoCommit = true,
        HasReadOnly = true,
        ReadOnly = false,
        TransactionIsolation = 0,
        Catalog = "",
        Schema = "",
        IsDirty = true
    };
    await client.ConnectionSyncRequestAsync(connId, connProperties, options);

    // Creating statement
    createStatementResponse = await client.CreateStatementRequestAsync(connId, options);

    string sql = "UPSERT INTO Customers VALUES (?,?,?,?,?,?)";
    PrepareResponse prepareResponse = client.PrepareRequestAsync(connId, sql, long.MaxValue, options).Result;
    var statementHandle = prepareResponse.Statement;
    var updates = new pbc.RepeatedField<UpdateBatch>();
    
    var r = new Random();

    // Insert 300 rows
    for (int i = 300; i < 600; i++)
    {
        var list = new pbc.RepeatedField<TypedValue>();
        var id = new TypedValue
        {
            StringValue = "id" + i,
            Type = Rep.String
        };
        var firstName = new TypedValue
        {
            StringValue = "first" + i,
            Type = Rep.String
        };
        var lastName = new TypedValue
        {
            StringValue = "last" + i,
            Type = Rep.String
        };
        var state = new TypedValue
        {
            StringValue = states.ElementAt(r.Next(0, 49)),
            Type = Rep.String
        };
        var email = new TypedValue
        {
            StringValue = $"email{1}@junkemail.com",
            Type = Rep.String
        };
        var phone = new TypedValue
        {
            StringValue = $"555-229-341{i.ToString().Substring(0, 1)}",
            Type = Rep.String
        };
        list.Add(id);
        list.Add(firstName);
        list.Add(lastName);
        list.Add(state);
        list.Add(email);
        list.Add(phone);

        var batch = new UpdateBatch
        {
            ParameterValues = list
        };
        updates.Add(batch);

        Console.WriteLine($"Added customer {i} to batch");
    }

    var executeBatchResponse = await client.ExecuteBatchRequestAsync(connId, statementHandle.Id, updates, options);

    Console.WriteLine("Batch upserted customer data");

}
catch (Exception ex)
{

}
finally
{
    if (openConnResponse != null)
    {
        await client.CloseConnectionRequestAsync(connId, options);
        openConnResponse = null;
    }
}
```

In our environment, individually inserting 300 new records took almost 2 minutes. Inserting 300 records as a batch, however, took only about 6 seconds!

## Selecting data

In this example, we'll show how you can reuse the same connection to execute multiple queries. First we'll demonstrate selecting all, and fetching remaining records once the default maximum of 100 have been returned. Then we'll show using a total row count select statement, retrieving the single scalar result. Finally, we'll execute a select statement that returns the total number of customers per State.

```c#
string connId = Guid.NewGuid().ToString();
RequestOptions options = RequestOptions.GetGatewayDefaultOptions();

// In gateway mode, PQS requests will be https://<cluster dns name>.azurehdinsight.net/hbasephoenix<N>/
// Requests sent to hbasephoenix0/ will be forwarded to PQS on workernode0
options.AlternativeEndpoint = "hbasephoenix0/";
OpenConnectionResponse openConnResponse = null;
StatementHandle statementHandle = null;

try
{
    // Opening connection
    pbc::MapField<string, string> info = new pbc::MapField<string, string>();
    openConnResponse = await client.OpenConnectionRequestAsync(connId, info, options);
    // Syncing connection
    ConnectionProperties connProperties = new ConnectionProperties
    {
        HasAutoCommit = true,
        AutoCommit = true,
        HasReadOnly = true,
        ReadOnly = false,
        TransactionIsolation = 0,
        Catalog = "",
        Schema = "",
        IsDirty = true
    };
    await client.ConnectionSyncRequestAsync(connId, connProperties, options);
    var createStatementResponse = await client.CreateStatementRequestAsync(connId, options);

    string sql = "SELECT * FROM Customers";
    ExecuteResponse executeResponse = await client.PrepareAndExecuteRequestAsync(connId, sql, createStatementResponse.StatementId, long.MaxValue, int.MaxValue, options);

    pbc::RepeatedField<Row> rows = executeResponse.Results[0].FirstFrame.Rows;
    // Loop through all of the returned rows and display the first two columns
    for (int i = 0; i < rows.Count; i++)
    {
        Row row = rows[i];
        Console.WriteLine(row.Value[0].ScalarValue.StringValue + " " + row.Value[1].ScalarValue.StringValue);
    }
    
    // 100 is hard coded in server side as the default firstframe size
    // In order to get remaining rows, FetchRequestAsync is used
    Console.WriteLine("");
    Console.WriteLine($"Number of rows: {rows.Count}");

    // Fetch remaining rows, offset is not used, simply set to 0
    // if FetchResponse.Frame.Done = true, that means all the rows fetched
    FetchResponse fetchResponse = await client.FetchRequestAsync(connId, createStatementResponse.StatementId, 0, int.MaxValue, options);
    Console.WriteLine($"Frame row count: {fetchResponse.Frame.Rows.Count}");
    Console.WriteLine($"Fetch response is done: {fetchResponse.Frame.Done}");
    Console.WriteLine("");

    // Running query 2
    string sql2 = "select count(*) from Customers";
    ExecuteResponse countResponse = await client.PrepareAndExecuteRequestAsync(connId, sql2, createStatementResponse.StatementId, long.MaxValue, int.MaxValue, options);
    long count = countResponse.Results[0].FirstFrame.Rows[0].Value[0].ScalarValue.NumberValue;

    Console.WriteLine($"Total customer records: {count}");
    Console.WriteLine("");

    // Running query 3
    string sql3 = "select StateProvince, count(*) as Number from Customers group by StateProvince order by Number desc";
    ExecuteResponse groupByResponse = await client.PrepareAndExecuteRequestAsync(connId, sql3, createStatementResponse.StatementId, long.MaxValue, int.MaxValue, options);

    pbc::RepeatedField<Row> stateRows = groupByResponse.Results[0].FirstFrame.Rows;
    for (int i = 0; i < stateRows.Count; i++)
    {
        Row row = stateRows[i];
        Console.WriteLine(row.Value[0].ScalarValue.StringValue + ": " + row.Value[1].ScalarValue.NumberValue);
    }
}
catch (Exception ex)
{

}
finally
{
    if (statementHandle != null)
    {
        await client.CloseStatementRequestAsync(connId, statementHandle.Id, options);
        statementHandle = null;
    }
    if (openConnResponse != null)
    {
        await client.CloseConnectionRequestAsync(connId, options);
        openConnResponse = null;
    }
}
```

The output of the executed select statements should yield the following result:

```
id0 first0
id1 first1
id10 first10
id100 first100
id101 first101
id102 first102
...

// TRUNCATED FOR BREVITY

...
id185 first185
id186 first186
id187 first187
id188 first188

Number of rows: 100
Frame row count: 500
Fetch response is done: True

Total customer records: 600

NJ: 21
CA: 19
GU: 17
NC: 16
IN: 16
MA: 16
AZ: 16
ME: 16
IL: 15
OR: 15
...

// TRUNCATED FOR BREVITY

...
MO: 10
HI: 10
GA: 10
DC: 9
NM: 9
MD: 9
MP: 9
SC: 7
AR: 7
MH: 6
FM: 5
```



## Next steps

* Learn more about [Phoenix in HDInsight](hdinsight-phoenix-in-hdinsight)
* Read [Using the HBase REST SDK](hdinsight-using-hbase-rest-sdk) for information on another HBase-related SDK you can use.
