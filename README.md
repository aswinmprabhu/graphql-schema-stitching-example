# graphql-schema-stitching-example

## Data modification before delegation
We might want to sanitize or modify some data at the parent Graphql API before we delegate it to some underlying Graphql API.
This can be achieved with the help of a custom resolver as illustrated below.

1. Create a remote executable schemas
2. Create a custom resolver for our user case
3. Merge the schemas together with the mergeSchemas() function
4. Server the merged schema with a new instance of the apollo server
