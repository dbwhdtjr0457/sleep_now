import React from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  View,
  Button,
  Text,
} from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
  onAuthStateChanged,
} from "firebase/auth";
import { NavigationContainer } from "@react-navigation/native";

import { app, auth } from "./firebaseConfig";
import TotalInfo from "./TotalInfo";
import BackgroundFetchRecord from "./backgroundFetch";
import LoginPage from "./LoginPage";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

WebBrowser.maybeCompleteAuthSession();

export default function App() {
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId:
      "515961940311-61j17l8h550tn169vgso77bqk1h1d3eo.apps.googleusercontent.com",
    androidClientId:
      "515961940311-giojge8do3kgptauht8m8h62a2fr70l9.apps.googleusercontent.com",
    expoClientId:
      "515961940311-61j17l8h550tn169vgso77bqk1h1d3eo.apps.googleusercontent.com",
  });

  React.useEffect(() => {
    if (response?.type === "success") {
      console.log(response.params);
      const { id_token } = response.params;
      const auth = getAuth();
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential);
    }
  }, [response]);

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const { uid, email, displayName, accessToken } = user;
    }
  });

  return (
    <NavigationContainer>
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollView}
          horizontal
          pagingEnabled
        >
          <LoginPage SCREEN_WIDTH={SCREEN_WIDTH} />
          <TotalInfo SCREEN_WIDTH={SCREEN_WIDTH} />
          <BackgroundFetchRecord SCREEN_WIDTH={SCREEN_WIDTH} />
          <View style={styles.contentContainer}>
            <Button
              disabled={!request}
              title="Login with Google"
              onPress={() => {
                promptAsync();
              }}
            />
          </View>
        </ScrollView>
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    backgroundColor: "#eee",
    justifyContent: "center",
  },
  contentContainer: {
    flex: 1,
    width: SCREEN_WIDTH,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
