import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';

export default function HomeScreen({ navigation }) {
  const [habits, setHabits] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      loadHabits();
    }
  }, [isFocused]);

  const loadHabits = async () => {
    try {
      const storedHabits = await AsyncStorage.getItem('habits');
      if (storedHabits !== null) {
        setHabits(JSON.parse(storedHabits));
      }
    } catch (e) {
      console.error('Failed to load habits', e);
    }
  };

  const toggleHabit = async (id) => {
    const updatedHabits = habits.map(habit => 
      habit.id === id ? { ...habit, completed: !habit.completed } : habit
    );
    setHabits(updatedHabits);
    try {
      await AsyncStorage.setItem('habits', JSON.stringify(updatedHabits));
    } catch (e) {
      console.error('Failed to save habits', e);
    }
  };

  const deleteHabit = async (id) => {
    const updatedHabits = habits.filter(habit => habit.id !== id);
    setHabits(updatedHabits);
    try {
      await AsyncStorage.setItem('habits', JSON.stringify(updatedHabits));
    } catch (e) {
      console.error('Failed to delete habit', e);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.habitItem}>
      <Text style={[styles.habitText, item.completed && styles.habitCompleted]}>
        {item.name}
      </Text>
      <View style={styles.actionsContainer}>
        <Button 
          title={item.completed ? 'Отменить' : 'Выполнено'} 
          onPress={() => toggleHabit(item.id)}
          color={item.completed ? '#888' : '#28a745'}
        />
        <TouchableOpacity style={styles.deleteButton} onPress={() => deleteHabit(item.id)}>
          <Text style={styles.deleteButtonText}>✕</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {habits.length === 0 ? (
        <Text style={styles.emptyText}>У вас пока нет привычек.</Text>
      ) : (
        <FlatList
          data={habits}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      )}
      <View style={styles.buttonContainer}>
        <Button 
          title="Добавить привычку" 
          onPress={() => navigation.navigate('AddHabit')} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  habitItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#f9f9f9',
    marginBottom: 8,
    borderRadius: 8,
  },
  habitText: {
    fontSize: 18,
    flex: 1,
    marginRight: 10,
  },
  habitCompleted: {
    textDecorationLine: 'line-through',
    color: '#aaa',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteButton: {
    marginLeft: 10,
    padding: 8,
  },
  deleteButtonText: {
    color: '#dc3545',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginTop: 16,
    paddingBottom: 20,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#777',
    marginTop: 20,
  }
});
