import React from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { useTheme } from "../theme/ThemeProvider";
import { SetQueryFunction } from "../App";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const SearchBar = ({ setQuery }: { setQuery: SetQueryFunction }) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    searchBar: {
      alignItems: "center",
      backgroundColor: theme.secondaryColor,
      flexDirection: "row",
      height: 50,
      justifyContent: "flex-start",
    },
    searchBarIcon: {
      backgroundColor: theme.secondaryColor,
      marginLeft: "5%",
    },
    searchBarInput: {
      backgroundColor: theme.secondaryColor,
      color: theme.primaryTextColor,
      flex: 1,
      fontSize: 16,
      height: 45,
      marginLeft: 5,
    },
  });

  const query = (query: string) => {
    const formattedQuery = query.toLowerCase();
    console.log(`Query: ${formattedQuery}`);
    setQuery(formattedQuery);
  };

  return (
    <View style={styles.searchBar}>
      <FontAwesomeIcon
        style={styles.searchBarIcon}
        icon={faSearch}
        color={"gray"}
        size={18}
      />
      <TextInput
        style={styles.searchBarInput}
        autoCapitalize="none"
        autoCorrect={false}
        placeholder={"Search meals"}
        onChangeText={query}
      />
    </View>
  );
};

export default SearchBar;
