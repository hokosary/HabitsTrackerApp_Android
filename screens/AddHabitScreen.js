import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AddHabitScreen({ navigation }) {
  const [habitName, setHabitName] = useState('');

  const saveHabit = async () => {
    if (habitName.trim() === '') return;

    try {
      const storedHabits = await AsyncStorage.getItem('habits');
      const currentHabits = storedHabits ? JSON.parse(storedHabits) : [];
      
      const newHabit = {
        id: Date.now().toString(),
        name: habitName,
        completed: false,
      };

      const updatedHabits = [...currentHabits, newHabit];
      await AsyncStorage.setItem('habits', JSON.stringify(updatedHabits));
      
      navigation.navigate('Home');
    } catch (e) {
      console.error('Failed to save habit', e);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Название привычки:</Text>
      <TextInput
        style={styles.input}
        placeholder="Введите название"
        value={habitName}
        onChangeText={setHabitName}
      />
      <Button 
        title="Сохранить" 
        onPress={saveHabit} 
        disabled={habitName.trim() === ''}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    height: 48,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 24,
    paddingHorizontal: 12,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
});
