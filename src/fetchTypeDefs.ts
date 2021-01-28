import fetch from 'isomorphic-unfetch';
import buildAdminClient from './choco-appsync/buildAdminClient';
import {
  buildClientSchema,
  getIntrospectionQuery,
  IntrospectionQuery,
  printSchema,
} from 'graphql';

export const fetchTypeDefsWithUser = async () => {
  const chocoClient = await buildAdminClient();
  const introspectionResult: IntrospectionQuery = await chocoClient.request(
    `${getIntrospectionQuery()}`
  );
  const graphQLSchema = buildClientSchema(introspectionResult);
  const typeDefs = printSchema(graphQLSchema);

  // fs.writeFileSync(
  //   `${process.cwd()}/src/typeDefs.ts`,
  //   `export const typeDefs = \`
  // ${printSchema(graphQLSchema).replace(/`/g, '\\`')}\``
  // );

  return typeDefs;
};

export const fetchTypeDefs = async () => {
  const uri =
    'https://choco-doc.s3-eu-west-1.amazonaws.com/choco-appsync/gql_schema/schema.json';

  const response = await fetch(uri);
  const { data: jsonSchema } = await response.json();

  const graphQLSchema = buildClientSchema(jsonSchema);
  const typeDefs = printSchema(graphQLSchema);

  // fs.writeFileSync(
  //   `${process.cwd()}/src/typeDefs.ts`,
  //   `export const typeDefs = \`
  // ${printSchema(graphQLSchema).replace(/`/g, '\\`')}\``
  // );

  return typeDefs;
};
