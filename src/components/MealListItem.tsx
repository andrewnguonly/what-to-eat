import React, { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import Dialog from "react-native-dialog";
import { Swipeable } from "react-native-gesture-handler";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faClock, faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { RefreshDataFunction } from "../App";
import { addMeal, editMealName, deleteMealByName } from "../Controller";
import { useTheme } from "../theme/ThemeProvider";

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
    if (currentDate.getDate() == tsDate.getDate()) {
      return "today";
    } else {
      // corner case: not a full 1 day, but still yesterday
      return "1d";
    }
  } else if (diffDays < 7) {
    return `${diffDays}d`;
  } else {
    const diffWeeks = Math.floor(diffDays / 7);
    if (diffWeeks < 4) {
      return `${diffWeeks}w`;
    } else {
      const diffMonths = Math.floor(diffWeeks / 4);
      return `${diffMonths}mo`;
    }
  }
};

export const formatEatenCount = (eatenCount: number) => {
  if (eatenCount > 1) {
    return ` (${eatenCount})`;
  } else {
    return "";
  }
};

const MealListItem = ({
  name,
  lastEatenTs,
  eatenCount,
  refreshData,
  mealItemRefs,
}: {
  name: string;
  lastEatenTs: number;
  eatenCount: number;
  refreshData: RefreshDataFunction;
  mealItemRefs: Map<string, Swipeable>;
}) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    row: {
      alignItems: "center",
      backgroundColor: theme.secondaryColor,
      flexDirection: "row",
      height: 50,
      paddingHorizontal: "5%",
    },
    rowLabel: {
      color: theme.secondaryTextColor,
      fontSize: 16,
    },
    rowLabelContainer: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "flex-end",
    },
    rowSubtitle: {
      color: theme.secondaryTextColor,
      fontSize: 16,
    },
    rowTitle: {
      color: theme.primaryTextColor,
      fontSize: 16,
    },
    rowTitleContainer: {
      flex: 2,
      flexDirection: "row",
      justifyContent: "flex-start",
    },
    swipeRightMenuContainer: {
      flexDirection: "row",
      width: "40%",
    },
    editButton: {
      alignItems: "center",
      backgroundColor: "#FFC123",
      flex: 1,
      justifyContent: "center",
    },
    deleteButton: {
      alignItems: "center",
      backgroundColor: "red",
      flex: 1,
      justifyContent: "center",
    },
  });

  const [newName, setNewMealName] = useState("");
  const [existingMealDialogVisible, setExistingMealDialogVisible] =
    useState(false);
  const [editMealDialogVisible, setEditMealDialogVisible] = useState(false);

  const showExistingMealDialog = () => {
    setExistingMealDialogVisible(true);
    [...mealItemRefs.entries()].forEach(([, ref]) => {
      // close all swipe menus
      ref.close();
    });
  };

  const showEditMealDialog = () => {
    setEditMealDialogVisible(true);
  };

  const handleExistingMeal = async () => {
    await addMeal(name);
    console.log(`Added existing meal: ${name}`);
    setExistingMealDialogVisible(false);
    // refresh meals state data
    refreshData();
  };

  const handleEditMeal = async () => {
    if (newName == "") {
      Alert.alert("Empty meal?", "Don't kid yourself...");
      return;
    }
    await editMealName(name, newName);
    console.log(`Update meal name: ${name} --> ${newName}`);
    setEditMealDialogVisible(false);
    setNewMealName("");
    // refresh meals state data
    refreshData();
  };

  const handleDeleteMeal = async () => {
    await deleteMealByName(name);
    console.log(`Deleted existing meal: ${name}`);
    // refresh meals state data
    refreshData();
  };

  const handleCancel = () => {
    setExistingMealDialogVisible(false);
    setEditMealDialogVisible(false);
  };

  const swipeRight = () => {
    return (
      <View style={styles.swipeRightMenuContainer}>
        <Pressable style={styles.editButton} onPress={showEditMealDialog}>
          <FontAwesomeIcon icon={faEdit} color={"white"} size={18} />
        </Pressable>
        <Pressable style={styles.deleteButton} onPress={handleDeleteMeal}>
          <FontAwesomeIcon icon={faTrashAlt} color={"white"} size={18} />
        </Pressable>
      </View>
    );
  };

  return (
    <Swipeable
      renderRightActions={swipeRight}
      rightThreshold={-200}
      key={name}
      ref={(ref) => {
        if (ref && !mealItemRefs.get(name)) {
          mealItemRefs.set(name, ref);
        }
      }}
      onSwipeableWillOpen={() => {
        [...mealItemRefs.entries()].forEach(([key, ref]) => {
          if (key !== name && ref) ref.close();
        });
      }}
    >
      <Pressable onPress={showExistingMealDialog}>
        <View style={styles.row}>
          <View style={styles.rowTitleContainer}>
            <Text style={styles.rowTitle} numberOfLines={1}>
              {name}
            </Text>
            <Text style={styles.rowSubtitle}>
              {formatEatenCount(eatenCount)}
            </Text>
          </View>
          <View style={styles.rowLabelContainer}>
            <FontAwesomeIcon
              icon={faClock}
              color={theme.secondaryTextColor}
              size={18}
            />
            <Text style={styles.rowLabel}> {formatTs(lastEatenTs)}</Text>
          </View>
        </View>
        <Dialog.Container visible={existingMealDialogVisible}>
          <Dialog.Title>Repeat...</Dialog.Title>
          <Dialog.Description>Eating {name} again?</Dialog.Description>
          <Dialog.Button label="Cancel" onPress={handleCancel} />
          <Dialog.Button label="Eat!" onPress={handleExistingMeal} />
        </Dialog.Container>
        <Dialog.Container visible={editMealDialogVisible}>
          <Dialog.Title>Edit meal</Dialog.Title>
          <Dialog.Description>Update your meal name</Dialog.Description>
          <Dialog.Input
            placeholder={name}
            onChangeText={(meal) => setNewMealName(meal)}
          />
          <Dialog.Button label="Cancel" onPress={handleCancel} />
          <Dialog.Button label="Update" onPress={handleEditMeal} />
        </Dialog.Container>
      </Pressable>
    </Swipeable>
  );
};

export default MealListItem;
