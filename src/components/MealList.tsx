import React, { useRef, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { RefreshDataFunction, ResetSearchFunction } from "../App";
import Meal from "../Meal";
import MealListItem from "./MealListItem";
import { useTheme } from "../theme/ThemeProvider";

const MealList = ({
  mealListRef,
  data,
  refreshData,
  resetSearch,
}: {
  mealListRef: any;
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

  const [listHeight, setListHeight] = useState(0);
  const mealItemRefs = new Map<string, Swipeable>();

  return (
    <FlatList
      ref={mealListRef}
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
      onContentSizeChange={(width, height) => {
        // Known Issue: When app is loaded for the first time,
        // view scrolls to end automatically.
        if (height > listHeight) {
          // row was added
          mealListRef.current.scrollToEnd();
        }
        setListHeight(height);
      }}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
    />
  );
};

export default MealList;
