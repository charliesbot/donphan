import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Button, StyleSheet, TextInput, View } from "react-native";
import * as WebBrowser from "expo-web-browser";

const onOpenOAuth = async () => {
  await WebBrowser.openBrowserAsync(
    "https://donphan-oauth.vercel.app/api/oauth"
  );
};

export default function App() {
  const [serverUrl, setServerUrl] = useState("");
  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Mastodon Server"
        onChangeText={(text) => setServerUrl(text)}
      />
      <Button title="Login" onPress={() => alert(serverUrl)} />
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
