import React, { useState } from "react";
import { Alert, Image, Pressable, StyleSheet, View } from "react-native";
import Dialog from "react-native-dialog";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { ResetSearchFunction } from "../App";
import { addMeal } from "../Controller";
import { useTheme } from "../theme/ThemeProvider";

const TitleBar = ({ resetSearch }: { resetSearch: ResetSearchFunction }) => {
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
    leftButtonContainer: {
      alignItems: "flex-start",
      flex: 1,
      paddingLeft: "5%",
    },
    rightButtonContainer: {
      alignItems: "flex-end",
      flex: 1,
      paddingRight: "5%",
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
    setNewMealDialogVisible(true);
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
  };

  const handleCancel = () => {
    setNewMealDialogVisible(false);
  };

  return (
    <View style={styles.titleBar}>
      <View style={styles.leftButtonContainer} />
      <View style={styles.titleContainer}>
        <Image
          style={styles.appIcon}
          source={require("../assets/app_icon_1024x1024_transparent.png")}
        />
      </View>
      <View style={styles.rightButtonContainer}>
        <Pressable onPress={showAddMealDialog}>
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
