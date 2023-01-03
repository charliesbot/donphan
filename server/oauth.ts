import type { VercelRequest, VercelResponse } from "@vercel/node";
import { AuthorizationCode } from "simple-oauth2";
import { MastodonConfigBuilder } from "./config";

export default async (request: VercelRequest, response: VercelResponse) => {
  const mastodonServerUrl = request.query.mastodonServerUrl as string;
  const config = MastodonConfigBuilder.build(mastodonServerUrl);
  const client = new AuthorizationCode(config.clientConfig);

  const authorizationUri = client.authorizeURL({
    ...config.baseConfig,
    state: "pseudo-random",
  });

  response.status(301).redirect(authorizationUri);
};
