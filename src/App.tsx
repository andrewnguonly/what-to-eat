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

  // child references
  const mealListRef = useRef<FlatList>(null);
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
    searchBarTextInputRef.current?.clear();
    searchBarTextInputRef.current?.blur();
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
        console.log("App coming into active state...");
        notificationService.setApplicationIconBadgeNumber(0);
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  // reset search / refresh data every 12 hours
  useEffect(() => {
    const interval = setInterval(() => {
      resetSearch();
    }, 1000 * 60 * 60 * 12);
    return () => clearInterval(interval);
  }, []);

  // refresh data when search query changes
  useEffect(() => {
    refreshData();
  }, [query]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemeProvider>
          <TitleBar
            searchBarTextInputRef={searchBarTextInputRef}
            mealListRef={mealListRef}
            resetSearch={resetSearch}
          />
          <SearchBar textInputRef={searchBarTextInputRef} setQuery={setQuery} />
          <MealList
            searchBarTextInputRef={searchBarTextInputRef}
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
