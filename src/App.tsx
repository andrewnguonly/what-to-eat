import React, { useEffect, useRef, useState } from "react";
import { Alert, AppState, SafeAreaView } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { getMeals } from "./Controller";
import Meal from "./Meal";
import TitleBar from "./components/TitleBar";
import MealList from "./components/MealList";
import { ThemeProvider } from "./theme/ThemeProvider";
import NotificationService from "./notifications/NotificationService";

export type RefreshDataFunction = () => void;

const App = () => {
  // notifications
  const onNotification = (notification: {
    title: string;
    message: string | undefined;
  }) => {
    Alert.alert(notification.title, notification.message);
  };
  const notificationService = new NotificationService(onNotification);

  // app state
  const appState = useRef(AppState.currentState);
  const [data, setData] = useState<Meal[]>([]);
  const refreshData = () => {
    getMeals()
      .then((data) => setData(data))
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    // TODO: wait for fixes to react-native-push-notification
    // schedule notifications
    // notificationService.scheduleNotification(lunchNotification);
    // notificationService.scheduleNotification(dinnerNotification);

    // refresh state data when app is started for the first time
    refreshData();

    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        // clear all notifications
        notificationService.cancelAllNotifications();

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
        <ThemeProvider>
          <TitleBar refreshData={refreshData} />
          <MealList data={data} refreshData={refreshData} />
        </ThemeProvider>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
};

export default App;
