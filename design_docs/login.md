# Login Config for Mastodon

## Create Mastodon Application
https://{your_mastodon_server}/settings/applications/new

## Test Auth Token
*Heads Up!* Notice the slash after **statuses**. 
This is required. Otherwise, the call to the endpoint fails.

```curl
curl -X POST 'https://{your_mastodon_server}/v1/statuses/' \
  -H "Accept: application/json" \
  -H "Authorization: Bearer {authorization_token}" \
  -F "status"="Primer toot con Donphan!"
```

## Setup OAUTH Server

Vercel lambdas are quite flexible (and cheap), so the Oauth config can rely on their servers.

By using [simple-oauth2](https://github.com/lelylan/simple-oauth2), the OAUTH process is quite simple.

## Oauth Process

### Setup Config Builder to reuse across authentication and authorization Oauth phases

```typescript
// MastodonConfigBuilder.ts

class MastodonConfigBuilder {
  static build = (mastodonServerUrl: string) => {
    return {
      baseConfig: {
        redirect_uri: "urn:ietf:wg:oauth:2.0:oob",
        scope: "read write follow push",
      },
      clientConfig: {
        client: {
          id: process.env.CLIENT_ID,
          secret: process.env.CLIENT_SECRET,
        },
        auth: {
          authorizeHost: `${mastodonServerUrl}/v3/oauth/authorize`,
          authorizePath: `${mastodonServerUrl}/v3/oauth/authorize`,
          tokenHost: `${mastodonServerUrl}/v3/oauth/token`,
          tokenPath: `${mastodonServerUrl}/v3/oauth/token`,
        },
      },
    };
  };
}

export { MastodonConfigBuilder };

```
This function can be used as follows: 
`MastodonConfigBuilder.build("{mastodon_server_url}");`

### Oauth Authentication
- (Vercel Serverless Functions)[https://vercel.com/docs/concepts/functions/serverless-functions]
allow us to create a simple function for free that is alive only when it is triggered.
- Simple Oauth 2 library handles the handshake process, so we just need to build the required config.
- A successful handshake returns an Authentication Token

```typescript
// oauth.ts
import type {VercelRequest, VercelResponse} from "@vercel/node";
import {AuthorizationCode} from "simple-oauth2";
import { MastodonConfigBuilder } from "utils";

export default async (_: VercelRequest, response: VercelResponse) => {
  const config = MastodonConfigBuilder.build(mastodonServerUrl);
  const client = new AuthorizationCode(config.clientConfig);

  const authorizationUri = client.authorizeURL({
    ...config.baseConfig,
    state: 'pseudo-random',
  });

  response.status(301).redirect(authorizationUri);
};
```

### Oauth Authorization
Once we have an authentication code, it is required to convert the token to an authorization code.
The authorization token allows the app to make actual requests to Mastodon's API.

```typescript
import type {VercelRequest, VercelResponse} from "@vercel/node";
import {AuthorizationCode} from "simple-oauth2";
import {MastodonConfigBuilder} from "util";

export default async (request: VercelRequest, response: VercelResponse) => {
  const config = MastodonConfigBuilder.build(mastodonServerUrl);
  const client = new AuthorizationCode(config.clientConfig);

  try {
    const accessToken = await client.getToken({
      ...client.baseConfig,
      code: request.query.code as string,
    });
    response.setHeader('Content-Type', 'application/json');
    response.end(JSON.stringify(accessToken));
  } catch (error) {
    console.log('Access Token Error', error.message);
    response.end();
  }
};
```
