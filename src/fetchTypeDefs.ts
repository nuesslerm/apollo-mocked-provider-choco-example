// import * as fs from 'fs';
// import { printSchema, print } from 'graphql';
// import fetch from 'isomorphic-unfetch';
// import { introspectSchema } from '@graphql-tools/wrap';
// import { AsyncExecutor } from '@graphql-tools/delegate';

import buildAdminClient from './choco-appsync/buildAdminClient';
import {
  buildClientSchema,
  getIntrospectionQuery,
  IntrospectionQuery,
  printSchema,
} from 'graphql';

// interface FetchTypeDefOptions {
//   uri: string;
//   typescript: boolean;
//   path: string;
// }

// export const fetchTypeDefs = async ({
//   uri = 'http://localhost:4000/graphql',
//   typescript = true,
//   path = `${process.cwd()}/typeDefs.${typescript ? 'ts' : 'js'}`,
// }: FetchTypeDefOptions) => {
//   console.log('writing typeDefs to: ', path);

//   const executor: AsyncExecutor = async ({ document, variables }) => {
//     const query = print(document);
//     const fetchResult = await fetch(uri, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ query, variables }),
//     });
//     return fetchResult.json();
//   };

//   const schema = await introspectSchema(executor);

//   fs.writeFileSync(
//     path,
//     `export const typeDefs = \`
// ${printSchema(schema).replace(/`/g, '\\`')}\``
//   );
// };

export const fetchTypeDefs = async () => {
  const chocoClient = await buildAdminClient();
  const introspectionResult: IntrospectionQuery = await chocoClient.request(
    `${getIntrospectionQuery()}`
  );
  const graphQLSchema = buildClientSchema(introspectionResult);
  // console.log(chocoClient, graphQLSchema);

  const typeDefs = `${printSchema(graphQLSchema).replace(/`/g, '\\`')}`;

  // fs.writeFileSync(
  //   `${process.cwd()}/src/typeDefs.ts`,
  //   `export const typeDefs = \`
  // ${printSchema(graphQLSchema).replace(/`/g, '\\`')}\``
  // );

  return typeDefs;
};
