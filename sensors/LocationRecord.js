import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet } from "react-native";

import * as Location from "expo-location";
import { TouchableOpacity } from "react-native";

export default function LocationRecord(props) {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const _requestPermissions = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync()
      .then((status) => {
        console.log(status);
      })
      .catch((error) => {
        console.log(error);
      });
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Highest,
    });
    const location = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });
    setLocation(location);
  };

  useEffect(() => {
    _requestPermissions();
  }, []);

  let text = "Waiting..";
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  return (
    <View style={styles(props).contentContainer}>
      <Text style={styles(props).text}>Location: </Text>
      <Text style={styles(props).text}>{text}</Text>
      <View style={styles(props).buttonContainer}>
        <TouchableOpacity
          onPress={_requestPermissions}
          style={styles(props).button}
        >
          <Text>Request Permission</Text>
        </TouchableOpacity>
      </View>
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
    text: {
      color: "#000",
      fontSize: 20,
      overflow: "hidden",
    },
    buttonContainer: {
      flexDirection: "row",
      alignItems: "stretch",
      marginTop: 15,
    },
    button: {
      flex: 1,
      marginHorizontal: 10,
      backgroundColor: "#eee",
      alignItems: "center",
      padding: 10,
    },
  });
