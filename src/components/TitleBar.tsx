import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Dialog from "react-native-dialog";
import { RefreshDataFunction } from "../App";
import { addMeal } from "../Controller";
import { useTheme } from "../theme/ThemeProvider";

const TitleBar = ({ refreshData }: { refreshData: RefreshDataFunction }) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    buttonContainer: {
      alignItems: "flex-end",
      width: "50%",
    },
    buttonText: {
      color: "white",
      fontSize: 20,
    },
    title: {
      color: "white",
      fontSize: 20,
      fontWeight: "bold",
    },
    titleBar: {
      alignItems: "center",
      backgroundColor: theme.primaryColor,
      flexDirection: "row",
      height: 50,
      paddingHorizontal: "5%",
    },
    titleContainer: {
      alignItems: "flex-start",
      width: "50%",
    },
  });

  const [newMealDialogVisible, setNewMealDialogVisible] = useState(false);
  const [newMeal, setNewMeal] = useState("");

  const showAddMealDialog = () => {
    setNewMealDialogVisible(true);
  };

  const handleAddMeal = async () => {
    await addMeal(newMeal);
    console.log(`Added new meal: ${newMeal}`);
    setNewMealDialogVisible(false);

    // refresh meals state data
    refreshData();
  };

  const handleCancel = () => {
    setNewMealDialogVisible(false);
  };

  return (
    <View style={styles.titleBar}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>What to eat?</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Pressable onPress={showAddMealDialog}>
          <Text style={styles.buttonText}>add meal</Text>
          <Dialog.Container visible={newMealDialogVisible}>
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
  );
};

export default TitleBar;
