import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";
import React, { useEffect, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { auth } from "./firebaseConfig";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import * as Sensors from "expo-sensors";

const TASK_NAME = "BACKGROUND_TASK";
const db = getFirestore();

let a = 0;

TaskManager.defineTask(TASK_NAME, () => {
  try {
    // fetch data here...
    const receivedNewData = "Simulated fetch " + Math.random();
    console.log("My task ", receivedNewData);
    const addData = async (data) => {
      try {
        const docRef = await addDoc(collection(db, "test"), data);
        console.log("Document written with ID: ", docRef.id);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
      a = a + 1;
    };
    addData({
      time: new Date(),
      data: receivedNewData,
      a: a,
    });
    return receivedNewData
      ? BackgroundFetch.Result.NewData
      : BackgroundFetch.Result.NoData;
  } catch (err) {
    console.log("My task failed:", err);
    // return BackgroundFetch.Result.Failed;
  }
});

registerBackgroundTask = async () => {
  try {
    await BackgroundFetch.registerTaskAsync(TASK_NAME, {
      minimumInterval: 1,
      stopOnTerminate: false,
    });
    console.log("Task registered");
  } catch (err) {
    console.log("Task Register failed:", err);
  }
};

unregisterBackgroundTask = async () => {
  try {
    await BackgroundFetch.unregisterTaskAsync(TASK_NAME);
    console.log("Task unregistered");
  } catch (err) {
    console.log("Task unregister failed:", err);
  }
};

export default function backgroundFetch(props) {
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    registerBackgroundTask();
    setIsRegistered(true);
  }, []);

  return (
    <View style={styles(props).contentContainer}>
      <Text>Background Fetch</Text>
      <Button
        title={isRegistered ? "Unregister" : "Register"}
        onPress={() => {
          isRegistered ? unregisterBackgroundTask() : registerBackgroundTask();
          setIsRegistered(!isRegistered);
        }}
      />
    </View>
  );
}

const styles = (props) =>
  StyleSheet.create({
    contentContainer: {
      flex: 1,
      width: props.SCREEN_WIDTH,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#fff",
    },
  });
