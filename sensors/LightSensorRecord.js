import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";
import { LightSensor } from "expo-sensors";

export default function LightSensorRecord(props) {
  const [{ illuminance: lux }, setData] = useState({ lux: 0 });
  const [subscription, setSubscription] = useState(null);
  const [record, setRecord] = useState(new Array(20).fill(0));

  const _toggle = () => {
    if (subscription) {
      _unsubscribe();
    } else {
      _subscribe();
    }
  };

  const _subscribe = () => {
    setSubscription(
      LightSensor.addListener((lightSensorData) => {
        setData(lightSensorData);
        setRecord((record) => [
          ...record.slice(1),
          lightSensorData.illuminance,
        ]);
      })
    );
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  const _requestPermission = async () => {
    const { status } = await LightSensor.requestPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access light sensor was denied");
    }
  };

  useEffect(() => {
    _unsubscribe();
    _requestPermission();
    return () => _unsubscribe();
  }, []);

  return (
    <View style={styles(props).sensor}>
      <Text style={styles(props).text}>Light Sensor:</Text>
      <Text style={styles(props).text}>
        lux:{" "}
        {Platform.OS === "android" ? `${lux}` : `Only available on Android`}
      </Text>
      <View style={styles(props).buttonContainer}>
        <TouchableOpacity onPress={_toggle} style={styles(props).button}>
          <Text>Toggle</Text>
        </TouchableOpacity>
      </View>
      <View style={styles(props).buttonContainer}>
        <TouchableOpacity
          onPress={_requestPermission}
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
    sensor: {
      width: props.SCREEN_WIDTH,
      marginTop: 15,
      backgroundColor: "#fff",
      paddingHorizontal: 10,
      justifyContent: "center",
    },
    text: {
      fontSize: 20,
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
