import { ApolloServer, gql } from 'apollo-server';
import {
  makeRemoteExecutableSchema,
  introspectSchema,
  mergeSchemas,
} from 'graphql-tools';
import fetch from 'node-fetch';
import { HttpLink } from 'apollo-link-http';
// To satisfy Extend peer dependencies
import 'apollo-link';

async function makeMergedSchema() {

  // Create remote executable user schema
  const UserLink = new HttpLink({ 
    uri: 'https://bazookaand.herokuapp.com/v1alpha1/graphql',
    fetch,
  });
  const UserSchema = makeRemoteExecutableSchema({
    schema: await introspectSchema(UserLink),
    link: UserLink,
  });

  // Create a remote executable github schema
  const GitHubLink = new HttpLink({
    uri: 'https://api.github.com/graphql',
    headers: {"Authorization":"bearer <your github token here>"},
    fetch,
  })
  const GitHubSchema = makeRemoteExecutableSchema({
    schema: await introspectSchema(GitHubLink),
    link: GitHubLink,
  });

  // Create custom resolvers
  const customResolver = {
    Mutation: {
      insert_user(parent, args, context, info){
        let newArgs = { objects:[] };
        // Convert the email to lower case and append each object to the new arguments array
        for (const user of args.objects) {
          user.email = user.email.toLowerCase();
          newArgs.objects.push(user);
        }
        // Delegate after sanitization
        return info.mergeInfo.delegateToSchema({
          schema: UserSchema,
          operation: 'mutation',
          fieldName: 'insert_user',
          args: newArgs,
          context,
          info,
        });
      }
    } 
  };

  // merge the two schemas
  const mergedSchema = mergeSchemas({
    schemas: [UserSchema, GitHubSchema],
    resolvers: customResolver,
  });

  return mergedSchema;

};

// serve the merged schema
makeMergedSchema().then(mergedschema => {

  // Create a  new apollo server
  const server = new ApolloServer({ schema:mergedschema });

  server.listen({port: 3000})
    .then(({ url }) => {
      console.log(`🚀  Server ready at ${url}`);
    })
    .catch(err => console.log(err));

});
