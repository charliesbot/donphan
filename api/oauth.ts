import type { VercelRequest, VercelResponse } from "@vercel/node";
import { AuthorizationCode } from "simple-oauth2";
import { MastodonConfigBuilder } from "./config";

export default async (request: VercelRequest, response: VercelResponse) => {
  const mastodonServerUrl = request.query.mastodon_server_url as string;
  const config = MastodonConfigBuilder.build(mastodonServerUrl);
  const client = new AuthorizationCode(config.oauthConfig);

  const authorizationUri = client.authorizeURL({
    ...config.baseConfig,
    state: "pseudo-random",
  });

  console.log(authorizationUri);

  response.status(301).redirect(authorizationUri);
};
