# Login Config for Mastodon

## Create Mastodon Application

curl -X POST \
	-F 'client_name=Test Application' \
	-F 'redirect_uris=urn:ietf:wg:oauth:2.0:oob' \
	-F 'scopes=read write push' \
	-F 'website=https://myapp.example' \
	https://mastodon.example/api/v1/apps

## Setup OAUTH Server

Vercel lambdas are quite flexible (and cheap), so the Oauth config can rely on their servers.

By using [simple-oauth2](https://github.com/lelylan/simple-oauth2), the OAUTH process is quite simple.

### OAUTH Process

```js
// oauth.ts
import type {VercelRequest, VercelResponse} from "@vercel/node";
import {AuthorizationCode} from "simple-oauth2";
import {mastodonConfig, baseConfig} from "../util/util";

export default async (_: VercelRequest, response: VercelResponse) => {
  const client = new AuthorizationCode(mastodonConfig);

  const authorizationUri = client.authorizeURL({
    ...baseConfig,
    state: 'pseudo-random',
  });

  response.status(301).redirect(authorizationUri);
};

```

