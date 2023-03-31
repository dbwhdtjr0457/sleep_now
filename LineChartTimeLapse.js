import React, { Component } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";

export default function LineChartTimeLapse(props) {
  let dataset = [];
  let i = 0;

  for (let data in props) {
    i += 1;
    let r = 255 * (i % 3);
    let g = 255 * ((i + 1) % 3);
    let b = 255 * ((i + 2) % 3);
    dataset.push({
      data: props[data],
      color: (opacity = 1) => `rgba(${r}, ${g}, ${b}, ${opacity})`, // optional
    });
  }

  return (
    <View style={styles(props).chartContainer}>
      <LineChart
        data={{
          datasets: dataset,
        }}
        width={Dimensions.get("window").width - 20} // from react-native
        height={150}
        chartConfig={{
          backgroundGradientTo: "#ffa726",
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        }}
        bezier
      />
    </View>
  );
}

const styles = (props) =>
  StyleSheet.create({
    chartContainer: {
      justifyContent: "center",
      alignItems: "center",
    },
  });
