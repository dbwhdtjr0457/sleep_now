import React, { useState, useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Accelerometer } from "expo-sensors";
import LineChartTimeLapse from "./LineChartTimeLapse";

export default function AccelerometerRecord(props) {
  const [{ x, y, z }, setData] = useState({ x: 0, y: 0, z: 0 });
  const [subscription, setSubscription] = useState(null);
  const [recordX, setRecordX] = useState(new Array(20).fill(0));
  const [recordY, setRecordY] = useState(new Array(20).fill(0));
  const [recordZ, setRecordZ] = useState(new Array(20).fill(0));

  const _slow = () => {
    Accelerometer.setUpdateInterval(1000);
  };
  const _fast = () => {
    Accelerometer.setUpdateInterval(100);
  };

  const _subscribe = () => {
    setSubscription(
      Accelerometer.addListener((accelerometerData) => {
        setData(accelerometerData);
        setRecordX((recordX) => [...recordX.slice(1), accelerometerData.x]);
        setRecordY((recordY) => [...recordY.slice(1), accelerometerData.y]);
        setRecordZ((recordZ) => [...recordZ.slice(1), accelerometerData.z]);
      })
    );
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  useEffect(() => {
    _slow();
    _unsubscribe();
    return () => _unsubscribe();
  }, []);

  return (
    <View style={styles(props).contentContainer}>
      <Text style={styles(props).text}>
        Accelerometer: (in Gs where 1 G = 9.81 m s^-2)
      </Text>
      <Text style={styles(props).text}>x: {x}</Text>
      <Text style={styles(props).text}>y: {y}</Text>
      <Text style={styles(props).text}>z: {z}</Text>
      <LineChartTimeLapse dataX={recordX} dataY={recordY} dataZ={recordZ} />
      <View style={styles(props).buttonContainer}>
        <TouchableOpacity
          onPress={subscription ? _unsubscribe : _subscribe}
          style={styles(props).button}
        >
          <Text>{subscription ? "On" : "Off"}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={_slow} style={[styles(props).button]}>
          <Text>Slow</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={_fast} style={styles(props).button}>
          <Text>Fast</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = (props) =>
  StyleSheet.create({
    contentContainer: {
      width: props.SCREEN_WIDTH,
      justifyContent: "center",
      backgroundColor: "#fff",
      paddingHorizontal: 20,
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
      backgroundColor: "#ddd",
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
    },
  });
