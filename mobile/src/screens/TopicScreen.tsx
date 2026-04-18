import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:3000/api';

export default function TopicScreen({ route }: any) {
  const { id } = route.params;
  const [topic, setTopic] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [solutions, setSolutions] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    axios.get(`${API_URL}/topics/${id}`)
      .then(res => setTopic(res.data))
      .catch(console.error);
  }, [id]);

  const handleSubmit = async (taskId: number) => {
    try {
      await axios.post(`${API_URL}/tasks/submit`, {
        taskId,
        studentEmail: email,
        solution: solutions[taskId]
      });
      Alert.alert('Sukces', 'Rozwiązanie wysłane pomyślnie!');
    } catch (err) {
      Alert.alert('Błąd', 'Nie udało się wysłać rozwiązania.');
    }
  };

  if (!topic) return <View style={styles.center}><ActivityIndicator size="large" /></View>;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{topic.name}</Text>
      <Text style={styles.content}>{topic.content}</Text>

      <Text style={styles.sectionTitle}>Zadania</Text>
      <TextInput
        style={styles.input}
        placeholder="Twój adres e-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      {topic.tasks.map((task: any) => (
        <View key={task.id} style={styles.taskCard}>
          <Text style={styles.taskQuestion}>{task.question}</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Wpisz rozwiązanie tutaj..."
            multiline
            numberOfLines={4}
            value={solutions[task.id] || ''}
            onChangeText={(text) => setSolutions({ ...solutions, [task.id]: text })}
          />
          <Button title="Wyślij odpowiedź" onPress={() => handleSubmit(task.id)} />
        </View>
      ))}
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
  content: { fontSize: 16, lineHeight: 24, color: '#333', marginBottom: 24 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 4, padding: 10, marginBottom: 16, fontSize: 16 },
  taskCard: { backgroundColor: '#f9f9f9', padding: 16, borderRadius: 8, marginBottom: 16, elevation: 1 },
  taskQuestion: { fontSize: 16, fontWeight: '500', marginBottom: 12 },
  textArea: { height: 100, textAlignVertical: 'top' }
});