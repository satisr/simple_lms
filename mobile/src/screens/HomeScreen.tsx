import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';

// W przypadku Vercel możesz podać publiczny url backendu np. w env. My na razie używamy stałej:
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:3000/api';

export default function HomeScreen({ navigation }: any) {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_URL}/subjects`)
      .then(res => setSubjects(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" /></View>;

  return (
    <View style={styles.container}>
      <FlatList
        data={subjects}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item: subject }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{subject.name}</Text>
            <Text style={styles.description}>{subject.description}</Text>
            {subject.modules.map((module: any) => (
              <TouchableOpacity
                key={module.id}
                style={styles.moduleItem}
                onPress={() => navigation.navigate('Module', { id: module.id })}
              >
                <Text style={styles.moduleText}>{module.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { backgroundColor: '#fff', padding: 16, marginBottom: 16, borderRadius: 8, elevation: 2 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 4 },
  description: { fontSize: 14, color: '#666', marginBottom: 12 },
  moduleItem: { paddingVertical: 8, borderTopWidth: 1, borderTopColor: '#eee' },
  moduleText: { fontSize: 16, color: '#007AFF' }
});