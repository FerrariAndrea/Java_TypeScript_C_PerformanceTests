# Java_TypeScript_PerformanceTests
That project amis to test the performace between Java and TypeScript, in a HTTP API Context


# Test 1

Users with statefull action, interaction using HTTP GET.

A virtual user will do 20 requests waiting 2sec among them.

For each virtual user call, the user:
* generate a random triple and call Blazegraph to save it in the RDF-Store
* save that generated triple in own server session
* will query blazegraph to gets all the triples in the store, excluding their own triples
* will compare all the query result triples with all the triples in the own session, and if there is a match it will increase a counter (alweys in their own session)

Summary Results:

"th" mark the thread pool size. 

The "Response time" is the time needed for a single http request to the (Java/TypeScript) webserver from the Artillery client.

The "Session time" is the time needed for a single Artillery virtual user to finish its 20 http requests.

![Results](Results/Results.jpg)
