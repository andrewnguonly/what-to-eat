import React, { useEffect, useRef, useState } from "react";
import { Alert, AppState, SafeAreaView, TextInput } from "react-native";
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler";
import { getMeals } from "./Controller";
import Meal from "./Meal";
import TitleBar from "./components/TitleBar";
import SearchBar from "./components/SearchBar";
import MealList from "./components/MealList";
import { ThemeProvider } from "./theme/ThemeProvider";
import NotificationService from "./notifications/NotificationService";

export type RefreshDataFunction = () => void;
export type ResetSearchFunction = () => void;
export type SetQueryFunction = React.Dispatch<React.SetStateAction<string>>;

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
  const [query, setQuery] = useState("");
  const mealListRef = useRef<FlatList>(null);

  // child references
  const searchBarTextInputRef = useRef<TextInput>(null);

  const refreshData = () => {
    getMeals(query)
      .then((data) => setData(data))
      .catch((error) => console.error(error));
  };

  /**
   * Resets search state and also refreshes data.
   */
  const resetSearch = () => {
    if (query == "") {
      refreshData();
    } else {
      setQuery(""); // will force refresh data
    }
    if (searchBarTextInputRef.current !== null) {
      searchBarTextInputRef.current.clear();
    }
  };

  useEffect(() => {
    // TODO: wait for fixes to react-native-push-notification
    // schedule notifications
    // notificationService.scheduleNotification(lunchNotification);
    // notificationService.scheduleNotification(dinnerNotification);

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

  useEffect(() => {
    refreshData();
  }, [query]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemeProvider>
          <TitleBar resetSearch={resetSearch} />
          <SearchBar textInputRef={searchBarTextInputRef} setQuery={setQuery} />
          <MealList
            mealListRef={mealListRef}
            data={data}
            refreshData={refreshData}
            resetSearch={resetSearch}
          />
        </ThemeProvider>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
};

export default App;
