import { buildSigner, Client, SignatureMethod } from '@chocoapp/appsync-client';
import { AuthType, ClientAuthFactory } from '@chocoapp/auth-client';
import * as config from './config';

function getJWTToken() {
  return ClientAuthFactory.build({
    identityPoolId: config.identityPoolId,
    userPoolId: config.adminPoolId,
    userPoolWebClientId: config.adminPoolWebClientId,
    authType: AuthType.PASSWORD,
    userIdentifier: config.userIdentifier,
    password: config.password,
  }).getToken();
}

export default async function buildAdminClient() {
  const token = await getJWTToken();
  const signer = buildSigner({
    signature: SignatureMethod.JWT,
    token,
  });

  return new Client(config.graphqlUrl, signer);
}
