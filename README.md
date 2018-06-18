## What is this?
This benchmarks recursive query capabilities of both `MySQL` and `Postgres`. In particular, it looks at generating and querying a threaded comment model, like that of Reddit.

## Why are you doing this?
One of my upcoming projects features something akin to this threaded comment section, and I wanted to see what options are better for recursive workloads.

In particular, I was interested in the following queries:
- inserts
- (contentious) updates
- tree fetches

Although the final product will have far more tree queries (which will be much more refined), I wanted a rough performance overview of recursive queries in both RDBMSs.

## How do I run this?
First and foremost, you should have both `MySQL` and `Postgres` installed. In addition, if you have `MySQL` 8, you should change your root user's authentication plugin to `mysql_native_password` instead of `sha2_caching_password`, which `mysql2` - the library used by `Sequelize` - doesn't support at the time.

Then, run `make`. That will generate the fake data for both `MySQL` and `Postgres` and query them the exact same way using our ORM.

## Results
Here is the test run output from my laptop:
```
🌺 make
mysql-generate
✔ 3906 posts created, 15ms per post
postgres-generate
✔ 3906 posts created, 8ms per post
mysql-query
✔ fetching full unordered tree: 46ms
fetching full tree by date: 46ms
fetching full tree by score: 46ms
total rows: 3906, iters: 300
updating 30000 records: 20s
postgres-query
✔ fetching full unordered tree: 34ms
fetching full tree by date: 31ms
fetching full tree by score: 34ms
total rows: 3906, iters: 300
updating 30000 records: 16.1s
```

## Up next
- [ ] make the data generation fail fast, i.e. prevent querying if the data is bad
- [ ] include pagination by date and partial score `SELECTs`
- [ ] reconsider indexes to be used by the final queries