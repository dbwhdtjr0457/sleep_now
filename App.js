import React, { useEffect, useRef } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { auth } from "./firebaseConfig";

import TotalInfo from "./TotalInfo";
import BackgroundFetchRecord from "./backgroundFetch";
import { LoginPage } from "./LoginPage";
import { app } from "./firebaseConfig";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function App() {
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
            <TouchableOpacity
              onPress={() => {
                console.log(auth.currentUser);
              }}
            >
              <Text>Log Current User</Text>
            </TouchableOpacity>
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
