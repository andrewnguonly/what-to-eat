import React, { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import Dialog from "react-native-dialog";
import { Swipeable } from "react-native-gesture-handler";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faClock,
  faEdit,
  faRedo,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { RefreshDataFunction, ResetSearchFunction } from "../App";
import {
  addMeal,
  editMealName,
  deferMealByName,
  deleteMealByName,
} from "../Controller";
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
  deferred,
  refreshData,
  resetSearch,
  mealItemRefs,
}: {
  name: string;
  lastEatenTs: number;
  eatenCount: number;
  deferred: boolean;
  refreshData: RefreshDataFunction;
  resetSearch: ResetSearchFunction;
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
      width: "45%",
    },
    editButton: {
      alignItems: "center",
      backgroundColor: "#FFC123",
      flex: 1,
      justifyContent: "center",
    },
    deferButton: {
      alignItems: "center",
      backgroundColor: "mediumorchid",
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
  const [deferMealDialogVisible, setDeferMealDialogVisible] = useState(false);

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

  const showDeferMealDialog = () => {
    setDeferMealDialogVisible(true);
  };

  const handleExistingMeal = async () => {
    await addMeal(name);
    console.log(`Added existing meal: ${name}`);
    setExistingMealDialogVisible(false);
    resetSearch();
  };

  const handleEditMeal = async () => {
    if (newName == "") {
      Alert.alert("Empty meal?", "Don't kid yourself...");
      return;
    }
    if (newName == name) {
      Alert.alert("Same meal?", "Don't kid yourself...");
      return;
    }
    await editMealName(name, newName);
    console.log(`Update meal name: ${name} --> ${newName}`);
    setEditMealDialogVisible(false);
    setNewMealName("");
    refreshData();
    // do not reset search
  };

  const handleDeferMeal = async () => {
    await deferMealByName(name);
    console.log(`Deferred meal: ${name}`);
    setDeferMealDialogVisible(false);
    resetSearch();
  };

  const handleDeleteMeal = async () => {
    await deleteMealByName(name);
    console.log(`Deleted existing meal: ${name}`);
    resetSearch();
  };

  const handleCancel = () => {
    setExistingMealDialogVisible(false);
    setEditMealDialogVisible(false);
    setDeferMealDialogVisible(false);
    mealItemRefs.get(name)?.close();
  };

  const swipeRight = () => {
    return (
      <View style={styles.swipeRightMenuContainer}>
        <Pressable style={styles.editButton} onPress={showEditMealDialog}>
          <FontAwesomeIcon icon={faEdit} color={"white"} size={18} />
        </Pressable>
        <Pressable style={styles.deferButton} onPress={showDeferMealDialog}>
          <FontAwesomeIcon icon={faRedo} color={"white"} size={18} />
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
              icon={deferred ? faRedo : faClock}
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
            autoFocus={true}
            placeholder={name}
            defaultValue={name}
            onChangeText={(meal) => setNewMealName(meal)}
          />
          <Dialog.Button label="Cancel" onPress={handleCancel} />
          <Dialog.Button label="Update" onPress={handleEditMeal} />
        </Dialog.Container>
        <Dialog.Container visible={deferMealDialogVisible}>
          <Dialog.Title>Later?</Dialog.Title>
          <Dialog.Description>Don't wanna eat {name} now?</Dialog.Description>
          <Dialog.Button label="Cancel" onPress={handleCancel} />
          <Dialog.Button label="Later" onPress={handleDeferMeal} />
        </Dialog.Container>
      </Pressable>
    </Swipeable>
  );
};

export default MealListItem;
