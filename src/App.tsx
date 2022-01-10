import React, { useEffect, useRef, useState } from "react";
import { AppState, SafeAreaView } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { getMeals } from "./Controller";
import Meal from "./Meal";
import TitleBar from "./components/TitleBar";
import MealList from "./components/MealList";

export type RefreshDataFunction = () => void;

const App = () => {
  const appState = useRef(AppState.currentState);
  const [data, setData] = useState<Meal[]>([]);

  const refreshData = () => {
    getMeals()
      .then((data) => setData(data))
      .catch((error) => console.error(error));
  };

  // load meals state data
  useEffect(() => {
    // refresh state data when app is started for the first time
    refreshData();

    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        // refresh state data when app comes to the foreground
        refreshData();
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <TitleBar refreshData={refreshData} />
        <MealList data={data} refreshData={refreshData} />
      </GestureHandlerRootView>
    </SafeAreaView>
  );
};

export default App;
