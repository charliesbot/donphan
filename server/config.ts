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
