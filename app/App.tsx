import { useEffect, useState } from "react";
import { Button, StyleSheet, TextInput, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";

const OAUTH_SERVER = "https://donphan.vercel.app/api";

const onOpenOAuth = async (mastodonServer: string) => {
  await WebBrowser.openBrowserAsync(
    `${OAUTH_SERVER}/oauth?mastodon_server_url=${mastodonServer}`
  );
};

export default function App() {
  const url = Linking.useURL();
  useEffect(() => {
    if (url != null) {
      const { queryParams } = Linking.parse(url);
      console.log("teeest ", queryParams);
    }
    // get authentication token from queryParams
  }, [url]);
  const [serverUrl, setServerUrl] = useState("");
  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Mastodon Server"
        onChangeText={(text) => setServerUrl(text)}
      />
      <Button title="Login" onPress={() => onOpenOAuth(serverUrl)} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
