import { getDatabase, ref, set } from "firebase/database";
import { StyleSheet, Text, View } from "react-native";

export default function FirebaseTest(props) {
  const db = getDatabase();
  const dbRef = ref(db, "users" + "/" + "Ada");
  set(dbRef, {
    username: "Ada Lovelace",
    email: "hello.gmail.com",
    phone: "123-456-7890",
    data: {
      "2021-08-01": {
        "00:00": {
          temperature: 25,
          humidity: 50,
          light: 100,
          sound: 200,
          motion: 300,
          co2: 400,
          voc: 500,
          pm25: 600,
        },
      },
    },
  });
  return (
    <View style={styles(props).contentContainer}>
      <Text style={styles(props).text}>Firebase Test</Text>
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
  });
