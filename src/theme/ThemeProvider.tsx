import { Appearance } from "react-native";
import darkTheme from "./DarkTheme";
import lightTheme from "./LightTheme";
import React, {
  createContext,
  ReactChild,
  ReactFragment,
  ReactPortal,
  useContext,
  useEffect,
  useState,
} from "react";

export const ThemeContext = createContext({
  isDark: false,
  theme: lightTheme,
});

export const ThemeProvider = (props: {
  children:
    | boolean
    | ReactChild
    | ReactFragment
    | ReactPortal
    | null
    | undefined;
}) => {
  // dark | light | no-preference
  const colorScheme = Appearance.getColorScheme();

  /*
   * To enable changing the app theme dynamicly in the app (run-time),
   * use useState so to override the default device theme.
   */
  const [isDark, setIsDark] = useState(colorScheme === "dark");

  // listen to changes of device theme
  useEffect(() => {
    setIsDark(colorScheme === "dark");
  }, [colorScheme]);

  const defaultTheme = {
    isDark,
    theme: isDark ? darkTheme : lightTheme,
  };

  return (
    <ThemeContext.Provider value={defaultTheme}>
      {props.children}
    </ThemeContext.Provider>
  );
};

// custom hook to get the theme context, returns { isDark, theme }
export const useTheme = () => useContext(ThemeContext);
