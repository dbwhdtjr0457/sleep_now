import React from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import * as Sensors from "expo-sensors";
import * as Location from "expo-location";
import useInterval from "./useInterval";
import { auth } from "./firebaseConfig";
import { getFirestore, collection, addDoc } from "firebase/firestore";

export default function TotalInfo(props) {
  const db = getFirestore();

  const addData = async (data) => {
    try {
      const docRef = await addDoc(collection(db, auth.currentUser.email), data);
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const [accelerometerArray, setAccelerometerArray] = React.useState(
    new Array(20).fill({ x: 0, y: 0, z: 0 })
  );
  const [gyroscopeArray, setGyroscopeArray] = React.useState(
    new Array(20).fill({ x: 0, y: 0, z: 0 })
  );
  const [lightSensorArray, setLightSensorArray] = React.useState(
    new Array(20).fill({ illuminance: 0 })
  );
  const [errorMsg, setErrorMsg] = React.useState(null);
  const [location, setLocation] = React.useState(null);
  const [isRecording, setIsRecording] = React.useState(false);

  React.useEffect(() => {
    updateInterval();
    _subscribe();
    _requestLocationPermissions();
    return () => {
      _unsubscribe();
    };
  }, []);

  const updateInterval = () => {
    Sensors.Accelerometer.setUpdateInterval(100);
    Sensors.Gyroscope.setUpdateInterval(100);
    Sensors.LightSensor.setUpdateInterval(100);
  };

  const _subscribe = () => {
    Sensors.Accelerometer.addListener((accelerometerData) => {
      setAccelerometerArray((accelerometerArray) => [
        ...accelerometerArray.slice(1),
        accelerometerData,
      ]);
    });
    Sensors.Gyroscope.addListener((gyroscopeData) => {
      setGyroscopeArray((gyroscopeArray) => [
        ...gyroscopeArray.slice(1),
        gyroscopeData,
      ]);
    });
    Sensors.LightSensor.addListener((lightSensorData) => {
      setLightSensorArray((lightSensorArray) => [
        ...lightSensorArray.slice(1),
        lightSensorData,
      ]);
    });
  };

  const _unsubscribe = () => {
    Sensors.Accelerometer.removeAllListeners();
    Sensors.Gyroscope.removeAllListeners();
    Sensors.LightSensor.removeAllListeners();
  };

  const _requestLocationPermissions = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
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

  const _checkArray = () => {
    console.log(accelerometerArray);
    console.log(gyroscopeArray);
    console.log(lightSensorArray);
  };

  const _updateTotalInfo = (
    accelerometerArray,
    gyroscopeArray,
    lightSensorArray,
    location
  ) => {
    const todayDate = new Date() + "";
    const timeNow = new Date();
    addData({
      [todayDate]: {
        date: timeNow,
        sensors: {
          accelerometer: {
            x: accelerometerArray.reduce((a, b) => a + b.x, 0) / 20,
            y: accelerometerArray.reduce((a, b) => a + b.y, 0) / 20,
            z: accelerometerArray.reduce((a, b) => a + b.z, 0) / 20,
          },
          gyroscope: {
            x: gyroscopeArray.reduce((a, b) => a + b.x, 0) / 20,
            y: gyroscopeArray.reduce((a, b) => a + b.y, 0) / 20,
            z: gyroscopeArray.reduce((a, b) => a + b.z, 0) / 20,
          },
          lightSensor: {
            illuminance:
              lightSensorArray.reduce((a, b) => a + b.illuminance, 0) / 20,
          },
          location: {
            city: location.city,
            name: location.name,
          },
        },
      },
    });
  };

  useInterval(() => {
    if (auth.currentUser && isRecording) {
      _updateTotalInfo(
        accelerometerArray,
        gyroscopeArray,
        lightSensorArray,
        location[0]
      );
    }
  }, 4000);

  let text = "Waiting..";
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location[0]);
  }

  return (
    <View style={styles(props).contentContainer}>
      <Text style={styles(props).text}>Total Info</Text>
      <Text style={styles(props).text}>Accelerometer: </Text>
      <Text style={styles(props).text}>(in Gs where 1 G = 9.81 m s^-2)</Text>
      <Text style={styles(props).text}>x: {accelerometerArray[19].x}</Text>
      <Text style={styles(props).text}>y: {accelerometerArray[19].y}</Text>
      <Text style={styles(props).text}>z: {accelerometerArray[19].z}</Text>
      <Text style={styles(props).text}>Gyroscope: (in rad/s)</Text>
      <Text style={styles(props).text}>x: {gyroscopeArray[19].x}</Text>
      <Text style={styles(props).text}>y: {gyroscopeArray[19].y}</Text>
      <Text style={styles(props).text}>z: {gyroscopeArray[19].z}</Text>
      <Text style={styles(props).text}>Light Sensor: (in lux)</Text>
      <Text style={styles(props).text}>
        illuminance: {lightSensorArray[19].illuminance}
      </Text>
      <Text style={styles(props).text}>Location: </Text>
      <Text style={styles(props).text}>{text}</Text>
      <Button title="Check Array" onPress={_checkArray} />
      <Button
        title="toggle recording"
        onPress={() => setIsRecording(!isRecording)}
      />
    </View>
  );
}

const styles = (props) =>
  StyleSheet.create({
    contentContainer: {
      flex: 1,
      width: props.SCREEN_WIDTH,
      backgroundColor: "white",
      alignItems: "center",
      justifyContent: "center",
    },
    text: {
      fontSize: 20,
      fontWeight: "bold",
    },
  });
