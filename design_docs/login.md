# Login

## Other Links
- [OAuth Config for Mastodon design doc](https://github.com/charliesbot/donphan/blob/main/design_docs/oauth.md)

## Login flow
Mastodon relies on the Fediverse, which means that every instance of the platform can see each other.

Therefore, we need to know beforehand the server where the user has a Mastodon account created.

![input](https://user-images.githubusercontent.com/10927770/210853176-1a6b9264-b67f-4b10-a2d4-6c340e964e46.png)

## OAuth Flow
The OAuth process is described in the [OAuth Config for Mastodon design doc](https://github.com/charliesbot/donphan/blob/main/design_docs/oauth.md).

The OAuth flow involves opening a browser and redirect to Donphan OAuth Server to complete authentication.

There are several ways to accomplish this goal.

## In App Browser
Login must happens in a web browser.
After the user sets the server where it account belongs, we start the OAuth process.

If the authentication is successful, we redirect to Donphan by using [deep linking](https://developer.android.com/training/app-links/deep-linking).

There are multiple ways to setup the InApp Browser.

### Web View
A Web View is an embedded browser inside the app. It is not secure, as developers can track the navigation and urls.
This also means the web view is just a fresh instance of a browser: if the user already logged in in the past, we lose those cookies and the user needs to logged in again before authorizing the app.

| Pros ✅ | ❌ |
|:--|:--|
| We have access to the URL (if needed) | Users need to login before authorization |
| App can get the auth token by reading the url or using deep linking | Insecure and not private |

### Custom Tabs / Safari Web View (chosen)
Android and iOS provides secure instances of the default browser, which means we can get a web view with cookies and storage from the user's browser.

Therefore, if the user previously logged in to their Mastodon's instance using their browser, the authorization page will appear instantly.

Because of this data, the data access as a developer is way more limited to keep privacy and security in mind.
This force the app to rely on deep linking to get the authorization token.

```typescript
 <Button
    title="Open InApp Browser"
    onPress={() => WebBrowser.openBrowserAsync('https://auth-server/oauth')}
  />
```

| Pros ✅ | ❌ |
|:--|:--|
| If the user already logged in, the auth page appears immediately | No access to urls |
| Secure by default: it might encourage confidence to the user |  |

## Implementation Details
[Expo offers a web view library](https://docs.expo.dev/versions/latest/sdk/webbrowser) that uses Chrome Tabs in Android and Safari Web View in iOS, which is required for our solution.

### Installation
`npx expo install expo-web-browser`

### Usage
```typescript
  import * as WebBrowser from 'expo-web-browser';
  // ...rest of the code
  
  const onOpenOAuth = async () => {
    await WebBrowser.openBrowserAsync('https://donphan-oauth.vercel.app/api/oauth');
  };
```

### Deep Linking
Once the OAuth flow completes, the server will call Donphan's app url.

Fortunately, [Expo offers an API to allow deep linking](https://docs.expo.dev/guides/deep-linking), which requires adding a file `app.json` in the root of the project.

app.json
```json
{
  "expo": {
    "android": {
      "intentFilters": [
        {
          "action": "VIEW",
          "data": [
            {
              "scheme": "donphanmastodon",
              "host": "oauth",
            }
          ],
          "category": ["BROWSABLE", "DEFAULT"]
        }
      ]
    }
  }
}
```

Which means that Donphan is registered to open links like: `donphanmastodon://oauth`

## Authorization

### InApp Browser Callback
Once the app receives the authentication token, we need to get an Authorization token.

[Expo offers a React Hook](https://docs.expo.dev/guides/linking/#handling-links) to listen registered URLs, which we need to get the authentication token.

`Linking.useURL()` must be used in the root component of the mobile app.

```typescript
import * as Linking from 'expo-linking';
import { useEffect } from 'react';

export default function App() {
    const url = Linking.useURL();
    useEffect(() => {
     const { queryParams } = Linking.parse(url);
     // get authentication token from queryParams
    }, [url]);

    // Rest of App component...
}
```

![auth](https://user-images.githubusercontent.com/10927770/210853159-6bfb0141-9007-488b-b982-2b4c0818f25f.png)

### Get Authorization Token
Once the app opens and gets the authentication token, we need to exchange that token with a **authorization token**.

```typescript
const getAuthToken = async (authToken: string) => {
  const token = fetch(`https://auth-server.com/auth?token=${authToken}`)
  .then((response) => response.json());
  // store the token in App's cache
}
```
