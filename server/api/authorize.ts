import type { VercelRequest, VercelResponse } from "@vercel/node";
import { AuthorizationCode } from "simple-oauth2";
import { MastodonConfigBuilder } from "./config";

export default async (request: VercelRequest, response: VercelResponse) => {
  const mastodonServerUrl = request.query.mastodon_server_url as string;
  const code = request.query.code as string;
  const config = MastodonConfigBuilder.build(mastodonServerUrl);
  const client = new AuthorizationCode(config.oauthConfig);

  try {
    const accessToken = await client.getToken({
      ...config.baseConfig,
      code,
    });
    response.setHeader("Content-Type", "application/json");
    response.end(JSON.stringify(accessToken));
  } catch (error) {
    console.log("Access Token Error", error.message);
    response.end();
  }
};
