import React, { RefObject } from "react";
import { FlatList, StyleSheet, TextInput, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { RefreshDataFunction, ResetSearchFunction } from "../App";
import Meal from "../Meal";
import MealListItem from "./MealListItem";
import { useTheme } from "../theme/ThemeProvider";

const MealList = ({
  searchBarTextInputRef,
  mealListRef,
  data,
  refreshData,
  resetSearch,
}: {
  searchBarTextInputRef: RefObject<TextInput>;
  mealListRef: RefObject<FlatList>;
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
          searchBarTextInputRef={searchBarTextInputRef}
          mealListRef={mealListRef}
        />
      )}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
    />
  );
};

export default MealList;
