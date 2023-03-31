import { Dimensions, ScrollView, StyleSheet, View } from "react-native";
import AccelerometerRecord from "./AccelerometerRecord";
import GyroscopeRecord from "./GyroscopeRecord";
import LightSensorRecord from "./LightSensorRecord";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function App() {
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        horizontal
        pagingEnabled
      >
        <AccelerometerRecord SCREEN_WIDTH={SCREEN_WIDTH} />
        <GyroscopeRecord SCREEN_WIDTH={SCREEN_WIDTH} />
        <LightSensorRecord SCREEN_WIDTH={SCREEN_WIDTH} />
      </ScrollView>
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
  scrollView: {
    backgroundColor: "#eee",
    justifyContent: "center",
  },
});
