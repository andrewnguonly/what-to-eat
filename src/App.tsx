import React from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text } from 'react-native';
import getMeals from './Controller';

const styles = StyleSheet.create({

  title: {
    color: 'black',
    fontSize: 30,
    textAlign: 'center',
  }
});

const App = () => {

  const meals = getMeals();

  return (
    <SafeAreaView>
      <Text style={styles.title}>What to eat?</Text>
      <FlatList
        data={meals}
        renderItem={({item}) => <Text>{item.name}</Text>}
      />
    </SafeAreaView>
  );
};

export default App;
