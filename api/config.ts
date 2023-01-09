class MastodonConfigBuilder {
  static build = (mastodonServerUrl: string) => {
    return {
      baseConfig: {
        redirect_uri: "donphanmastodon://oauth",
        scope: "read write follow push",
      },
      oauthConfig: {
        client: {
          id: process.env.CLIENT_ID as string,
          secret: process.env.CLIENT_SECRET as string,
        },
        auth: {
          authorizeHost: `${mastodonServerUrl}/oauth/authorize`,
          authorizePath: `${mastodonServerUrl}/oauth/authorize`,
          tokenHost: `${mastodonServerUrl}/oauth/token`,
          tokenPath: `${mastodonServerUrl}/oauth/token`,
        },
      },
    };
  };
}

export { MastodonConfigBuilder };
