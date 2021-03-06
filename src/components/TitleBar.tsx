import React, { RefObject, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import Dialog from "react-native-dialog";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCog, faPlus } from "@fortawesome/free-solid-svg-icons";
import { ResetSearchFunction } from "../App";
import { addMeal } from "../Controller";
import { useTheme } from "../theme/ThemeProvider";

const TitleBar = ({
  searchBarTextInputRef,
  mealListRef,
  resetSearch,
}: {
  searchBarTextInputRef: RefObject<TextInput>;
  mealListRef: RefObject<FlatList>;
  resetSearch: ResetSearchFunction;
}) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    appIcon: {
      height: 50,
      width: 50,
    },
    buttonText: {
      color: "white",
      fontSize: 20,
    },
    leftButton: {
      alignItems: "center",
      height: 50,
      justifyContent: "center",
      width: 50,
    },
    leftButtonContainer: {
      alignItems: "flex-start",
      flex: 1,
    },
    rightButton: {
      alignItems: "center",
      height: 50,
      justifyContent: "center",
      width: 50,
    },
    rightButtonContainer: {
      alignItems: "flex-end",
      flex: 1,
      height: 50,
    },
    titleBar: {
      alignItems: "center",
      backgroundColor: theme.primaryColor,
      flexDirection: "row",
      height: 50,
    },
    titleContainer: {
      alignItems: "center",
      flex: 1,
    },
  });

  const [newMealDialogVisible, setNewMealDialogVisible] = useState(false);
  const [newMeal, setNewMeal] = useState("");

  const showAddMealDialog = () => {
    // This is a hack that forces the keyboard to dismiss prior to the
    // dialog appearing. This allows the dialog to be centered in the
    // screen. Note: This doesn't always work either...
    if (searchBarTextInputRef.current?.isFocused()) {
      searchBarTextInputRef.current?.blur();
      setTimeout(() => setNewMealDialogVisible(true), 600);
    } else {
      setNewMealDialogVisible(true);
    }
  };

  const showSettingsDialog = () => {
    Alert.alert("Settings", "Custom settings coming soon!");
    return;
  };

  const handleAddMeal = async () => {
    if (newMeal == "") {
      Alert.alert("Empty meal?", "Don't kid yourself...");
      return;
    }
    await addMeal(newMeal);
    console.log(`Added new meal: ${newMeal}`);
    setNewMealDialogVisible(false);
    setNewMeal("");

    // refresh meals state data
    resetSearch();
    setTimeout(() => mealListRef.current?.scrollToEnd(), 750);
  };

  const handleCancel = () => {
    setNewMealDialogVisible(false);
  };

  return (
    <View style={styles.titleBar}>
      <View style={styles.leftButtonContainer}>
        <Pressable style={styles.leftButton} onPress={showSettingsDialog}>
          <FontAwesomeIcon icon={faCog} color={"white"} size={18} />
        </Pressable>
      </View>
      <View style={styles.titleContainer}>
        <Image
          style={styles.appIcon}
          source={require("../assets/app_icon_1024x1024_transparent.png")}
        />
      </View>
      <View style={styles.rightButtonContainer}>
        <Pressable style={styles.rightButton} onPress={showAddMealDialog}>
          <FontAwesomeIcon icon={faPlus} color={"white"} size={18} />
          <Dialog.Container visible={newMealDialogVisible}>
            <Dialog.Title>New meal!</Dialog.Title>
            <Dialog.Description>Enter your meal</Dialog.Description>
            <Dialog.Input
              autoFocus={true}
              placeholder="e.g. pizza"
              onChangeText={(meal) => setNewMeal(meal)}
            />
            <Dialog.Button label="Cancel" onPress={handleCancel} />
            <Dialog.Button label="Eat!" onPress={handleAddMeal} />
          </Dialog.Container>
        </Pressable>
      </View>
    </View>
  );
};

export default TitleBar;
