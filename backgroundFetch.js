import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";
import React, { useEffect, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";

const TASK_NAME = "BACKGROUND_TASK";

TaskManager.defineTask(TASK_NAME, () => {
  try {
    // fetch data here...
    const receivedNewData = "Simulated fetch " + Math.random();
    console.log("My task ", receivedNewData);
    return receivedNewData
      ? BackgroundFetch.Result.NewData
      : BackgroundFetch.Result.NoData;
  } catch (err) {
    // return BackgroundFetch.Result.Failed;
  }
});

registerBackgroundTask = async () => {
  try {
    await BackgroundFetch.registerTaskAsync(TASK_NAME, {
      minimumInterval: 5, // seconds,
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
