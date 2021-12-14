import React from "react";
import { FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";
import getMeals from "./Controller";

const styles = StyleSheet.create({
  row: {
    alignItems: "center",
    flexDirection: "row",
    height: 60,
    paddingLeft: "5%",
    paddingRight: "5%",
  },
  rowLabel: {
    color: "gray",
    fontSize: 20,
  },
  rowLabelCol: {
    alignItems: "flex-end",
    width: "50%",
  },
  rowSeparator: {
    backgroundColor: "lightgray",
    height: 1,
    marginLeft: "5%",
  },
  rowTitle: {
    fontSize: 20,
  },
  rowTitleCol: {
    alignItems: "flex-start",
    width: "50%",
  },
  title: {
    color: "black",
    fontSize: 30,
    fontWeight: "100",
    textAlign: "center",
  },
});

const App = () => {
  const meals = getMeals();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Text style={styles.title}>What to eat?</Text>
      <FlatList
        ItemSeparatorComponent={() => <View style={styles.rowSeparator} />}
        data={meals}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={styles.rowTitleCol}>
              <Text style={styles.rowTitle}>{item.name}</Text>
            </View>
            <View style={styles.rowLabelCol}>
              <Text style={styles.rowLabel}>{item.last_eaten_ts}</Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default App;
