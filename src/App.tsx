import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { getMeals } from "./Controller";

const styles = StyleSheet.create({
  buttonContainer: {
    alignItems: "flex-end",
    width: "50%",
  },
  buttonText: {
    color: "white",
    fontSize: 20,
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
    height: 50,
    paddingHorizontal: "5%",
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
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  titleBar: {
    alignItems: "center",
    backgroundColor: "#32CD32",
    flexDirection: "row",
    height: 50,
    paddingHorizontal: "5%",
  },
  titleContainer: {
    alignItems: "flex-start",
    width: "50%",
  },
});

const App = () => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    getMeals()
      .then((data) => setData(data))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.titleBar}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>What to eat?</Text>
        </View>
        <View style={styles.buttonContainer}>
          <Pressable onPress={() => Alert.alert("add meal")}>
            <Text style={styles.buttonText}>add meal</Text>
          </Pressable>
        </View>
      </View>
      <FlatList
        ItemSeparatorComponent={() => <View style={styles.rowSeparator} />}
        data={data}
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
