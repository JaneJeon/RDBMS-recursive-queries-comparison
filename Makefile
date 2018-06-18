MYSQL = DIALECT=mysql USERNAME=root
POSTGRES = DIALECT=postgres USERNAME=postgres

GENERATE = node generate.js
QUERY = node query.js

MAKEFLAGS += -s

# TODO: fail fast
all: generate query

generate: mysql-generate postgres-generate

query: mysql-query postgres-query

mysql-generate:
	echo $@
	$(MYSQL) $(GENERATE)

postgres-generate:
	echo $@
	$(POSTGRES) $(GENERATE)

mysql-query:
	echo $@
	$(MYSQL) $(QUERY)

postgres-query:
	echo $@
	$(POSTGRES) $(QUERY)