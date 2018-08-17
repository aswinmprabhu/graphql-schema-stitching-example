# graphql-schema-stitching-example

## Data modification before delegation
We might want to sanitize or modify some data at the parent Graphql API before we delegate it to some underlying Graphql API.
This can be achieved with the help of a custom resolver as illustrated below.

Let us consider a case where the insert_user mutation has to be delegated to an underlying schema. Before delegating, the email in the data has to be converted to all lowercase at the parent Graphql API level.

1. Create remote executable schemas with the makeRemoteExecutableSchema() function
https://gist.github.com/aswinmprabhu/61829a0197e48f227651b33b64d1d8e2
2. Create a custom resolver for our user case
https://gist.github.com/aswinmprabhu/6b3902ed6193cefcd4f0c9c3902d7c3b
3. Merge the schemas together with the mergeSchemas() function
https://gist.github.com/aswinmprabhu/0d867878093b764de87c4a965f811f42
4. Serve the merged schema with a new instance of the apollo server
https://gist.github.com/aswinmprabhu/7d7c863854558a88b981adfc5bac5ef0
