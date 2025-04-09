import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [task, setTask] = useState('');
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    loadTodos();
  }, []);

  useEffect(() => {
    saveTodos();
  }, [todos]);

  const loadTodos = async () => {
    const data = await AsyncStorage.getItem('todos');
    if (data) setTodos(JSON.parse(data));
  };

  const saveTodos = async () => {
    await AsyncStorage.setItem('todos', JSON.stringify(todos));
  };

  const addTodo = () => {
    if (!task.trim()) return;
    setTodos([...todos, { text: task.trim(), done: false }]);
    setTask('');
  };

  const toggleDone = index => {
    const updated = [...todos];
    updated[index].done = !updated[index].done;
    setTodos(updated);
  };

  const deleteTodo = index => {
    const updated = todos.filter((_, i) => i !== index);
    setTodos(updated);
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.todoItem}>
      <TouchableOpacity onPress={() => toggleDone(index)}>
        <Text style={[styles.todoText, item.done && styles.done]}>
          {item.text}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => deleteTodo(index)}>
        <Text style={styles.delete}>✕</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <Text style={styles.heading}>📝 To-Do List</Text>

      <FlatList
        data={todos}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
        style={styles.list}
      />

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Add new task"
          value={task}
          onChangeText={setTask}
          style={styles.input}
        />
        <TouchableOpacity style={styles.addButton} onPress={addTodo}>
          <Text style={styles.addText}>＋</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 60, backgroundColor: '#f0f4f8' },
  heading: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  list: { flex: 1 },
  todoItem: {
    flexDirection: 'row', justifyContent: 'space-between',
    padding: 15, backgroundColor: '#fff', marginBottom: 10,
    borderRadius: 10, shadowColor: '#000', shadowOpacity: 0.1,
    shadowRadius: 5, elevation: 2
  },
  todoText: { fontSize: 16 },
  done: { textDecorationLine: 'line-through', color: 'gray' },
  delete: { color: 'red', fontWeight: 'bold', fontSize: 18 },
  inputContainer: {
    flexDirection: 'row', marginTop: 10,
    alignItems: 'center'
  },
  input: {
    flex: 1, padding: 12, backgroundColor: '#fff',
    borderRadius: 10, fontSize: 16
  },
  addButton: {
    marginLeft: 10, backgroundColor: '#007bff',
    padding: 12, borderRadius: 10
  },
  addText: { color: '#fff', fontSize: 20, fontWeight: 'bold' }
});
