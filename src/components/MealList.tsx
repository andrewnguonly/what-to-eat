import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { RefreshDataFunction } from "../App";
import Meal from "../Meal";
import MealListItem from "./MealListItem";

const styles = StyleSheet.create({
  rowSeparator: {
    backgroundColor: "lightgray",
    height: 1,
    marginLeft: "5%",
  },
});

const MealList = ({
  data,
  refreshData,
}: {
  data: Meal[];
  refreshData: RefreshDataFunction;
}) => {
  const mealItemRefs = new Map<string, Swipeable>();

  return (
    <FlatList
      ItemSeparatorComponent={() => <View style={styles.rowSeparator} />}
      data={data}
      renderItem={({ item }) => (
        <MealListItem
          name={item.name}
          lastEatenTs={item.lastEatenTs}
          refreshData={refreshData}
          mealItemRefs={mealItemRefs}
        />
      )}
    />
  );
};

export default MealList;
