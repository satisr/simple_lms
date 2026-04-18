import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:3000/api';

export default function ModuleScreen({ route, navigation }: any) {
  const { id } = route.params;
  const [module, setModule] = useState<any>(null);

  useEffect(() => {
    axios.get(`${API_URL}/modules/${id}`)
      .then(res => setModule(res.data))
      .catch(console.error);
  }, [id]);

  if (!module) return <View style={styles.center}><ActivityIndicator size="large" /></View>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{module.name}</Text>
      <Text style={styles.description}>{module.description}</Text>
      <Text style={styles.sectionTitle}>Tematy:</Text>
      <FlatList
        data={module.topics}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item: topic }) => (
          <TouchableOpacity
            style={styles.topicItem}
            onPress={() => navigation.navigate('Topic', { id: topic.id })}
          >
            <Text style={styles.topicText}>{topic.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  description: { fontSize: 16, color: '#666', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8, marginTop: 16 },
  topicItem: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  topicText: { fontSize: 16, color: '#007AFF' }
});