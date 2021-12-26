import React, { useEffect, useState } from "react";
import {
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Dialog from "react-native-dialog";
import { addMeal, getMeals } from "./Controller";
import Meal from "./Meal";

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

/**
 * This function assumes 1 month = 28 days.
 */
export const formatTs = (ts: number) => {
  const currentDate = new Date();
  const tsDate = new Date(ts);

  const diffDays = Math.floor(
    (currentDate.getTime() - tsDate.getTime()) / (1000 * 3600 * 24)
  );

  if (diffDays < 1) {
    return "Today";
  } else if (diffDays < 7) {
    return `${diffDays} day(s) ago`;
  } else {
    const diffWeeks = Math.floor(diffDays / 7);
    if (diffWeeks < 4) {
      return `${diffWeeks} week(s) ago`;
    } else {
      const diffMonths = Math.floor(diffWeeks / 4);
      return `${diffMonths} month(s) ago`;
    }
  }
};

const App = () => {
  const [data, setData] = useState<Meal[]>([]);
  const [visible, setVisible] = useState(false);
  const [newMeal, setNewMeal] = useState("");

  const showAddMealDialog = () => {
    setVisible(true);
  };

  const handleAddMeal = async () => {
    await addMeal(newMeal);
    console.log(`Added new meal: ${newMeal}`);
    setVisible(false);

    // refresh meals state data
    refreshData();
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const refreshData = () => {
    getMeals()
      .then((data) => setData(data))
      .catch((error) => console.error(error));
  };

  // load meals state data
  useEffect(() => {
    refreshData();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.titleBar}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>What to eat?</Text>
        </View>
        <View style={styles.buttonContainer}>
          <Pressable onPress={showAddMealDialog}>
            <Text style={styles.buttonText}>add meal</Text>
            <Dialog.Container visible={visible}>
              <Dialog.Title>New meal!</Dialog.Title>
              <Dialog.Description>Enter your meal</Dialog.Description>
              <Dialog.Input
                placeholder="e.g. pizza"
                onChangeText={(meal) => setNewMeal(meal)}
              />
              <Dialog.Button label="Cancel" onPress={handleCancel} />
              <Dialog.Button label="Eat!" onPress={handleAddMeal} />
            </Dialog.Container>
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
              <Text style={styles.rowLabel}>
                {formatTs(item.last_eaten_ts)}
              </Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default App;
