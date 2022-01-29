import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { RefreshDataFunction, ResetSearchFunction } from "../App";
import Meal from "../Meal";
import MealListItem from "./MealListItem";
import { useTheme } from "../theme/ThemeProvider";

const MealList = ({
  data,
  refreshData,
  resetSearch,
}: {
  data: Meal[];
  refreshData: RefreshDataFunction;
  resetSearch: ResetSearchFunction;
}) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    rowSeparator: {
      backgroundColor: theme.secondaryTextColor,
      height: 1,
      marginLeft: "5%",
    },
  });

  const mealItemRefs = new Map<string, Swipeable>();

  return (
    <FlatList
      ItemSeparatorComponent={() => <View style={styles.rowSeparator} />}
      data={data}
      renderItem={({ item }) => (
        <MealListItem
          name={item.name}
          lastEatenTs={item.lastEatenTs}
          eatenCount={item.eatenCount}
          deferred={item.deferred}
          refreshData={refreshData}
          resetSearch={resetSearch}
          mealItemRefs={mealItemRefs}
        />
      )}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
    />
  );
};

export default MealList;
