import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Typography, Paper, TextField, Button, Divider } from '@mui/material';

export default function AdminPanel() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [subjectName, setSubjectName] = useState('');
  const [subjectDescription, setSubjectDescription] = useState('');
  const [moduleName, setModuleName] = useState('');
  const [moduleDescription, setModuleDescription] = useState('');
  const [moduleSubjectId, setModuleSubjectId] = useState('');
  const [topicName, setTopicName] = useState('');
  const [topicContent, setTopicContent] = useState('');
  const [topicModuleId, setTopicModuleId] = useState('');
  const [taskQuestion, setTaskQuestion] = useState('');
  const [taskTopicId, setTaskTopicId] = useState('');

  useEffect(() => { if (!token) navigate('/login'); }, [token, navigate]);

  const api = axios.create({ baseURL: 'http://localhost:3000/api/admin', headers: { Authorization: `Bearer ${token}` } });

  const handleAddSubject = async () => {
    try {
      await api.post('/subjects', { name: subjectName, description: subjectDescription });
      alert('Dodano przedmiot!');
    } catch (err) { alert('Błąd dodawania przedmiotu'); }
  };
  const handleAddModule = async () => {
    try {
      await api.post('/modules', { name: moduleName, description: moduleDescription, subjectId: parseInt(moduleSubjectId) });
      alert('Dodano moduł!');
    } catch (err) { alert('Błąd dodawania modułu'); }
  };
  const handleAddTopic = async () => {
    try {
      await api.post('/topics', { name: topicName, content: topicContent, moduleId: parseInt(topicModuleId) });
      alert('Dodano temat!');
    } catch (err) { alert('Błąd dodawania tematu'); }
  };
  const handleAddTask = async () => {
    try {
      await api.post('/tasks', { question: taskQuestion, topicId: parseInt(taskTopicId) });
      alert('Dodano zadanie!');
    } catch (err) { alert('Błąd dodawania zadania'); }
  };

  return (
    <div style={{ padding: '2rem 0' }}>
      <Typography variant="h4" gutterBottom>Panel Administratora</Typography>
      <Paper style={{ padding: '1rem', marginBottom: '1rem' }}>
        <Typography variant="h6">Dodaj Przedmiot</Typography>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
          <TextField label="Nazwa przedmiotu" value={subjectName} onChange={e => setSubjectName(e.target.value)} />
          <TextField label="Opis przedmiotu" value={subjectDescription} onChange={e => setSubjectDescription(e.target.value)} />
          <Button variant="contained" onClick={handleAddSubject}>Dodaj Przedmiot</Button>
        </div>
      </Paper>
      <Divider style={{ margin: '2rem 0' }} />
      <Paper style={{ padding: '1rem', marginBottom: '1rem' }}>
        <Typography variant="h6">Dodaj Moduł</Typography>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
          <TextField label="ID Przedmiotu" type="number" value={moduleSubjectId} onChange={e => setModuleSubjectId(e.target.value)} />
          <TextField label="Nazwa modułu" value={moduleName} onChange={e => setModuleName(e.target.value)} />
          <TextField label="Opis modułu" value={moduleDescription} onChange={e => setModuleDescription(e.target.value)} />
          <Button variant="contained" onClick={handleAddModule}>Dodaj Moduł</Button>
        </div>
      </Paper>
      <Divider style={{ margin: '2rem 0' }} />
      <Paper style={{ padding: '1rem', marginBottom: '1rem' }}>
        <Typography variant="h6">Dodaj Temat</Typography>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
          <TextField label="ID Modułu" type="number" value={topicModuleId} onChange={e => setTopicModuleId(e.target.value)} />
          <TextField label="Nazwa tematu" value={topicName} onChange={e => setTopicName(e.target.value)} />
          <TextField label="Treść tematu" multiline rows={4} value={topicContent} onChange={e => setTopicContent(e.target.value)} />
          <Button variant="contained" onClick={handleAddTopic}>Dodaj Temat</Button>
        </div>
      </Paper>
      <Divider style={{ margin: '2rem 0' }} />
      <Paper style={{ padding: '1rem', marginBottom: '1rem' }}>
        <Typography variant="h6">Dodaj Zadanie</Typography>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
          <TextField label="ID Tematu" type="number" value={taskTopicId} onChange={e => setTaskTopicId(e.target.value)} />
          <TextField label="Treść zadania" multiline rows={2} value={taskQuestion} onChange={e => setTaskQuestion(e.target.value)} />
          <Button variant="contained" onClick={handleAddTask}>Dodaj Zadanie</Button>
        </div>
      </Paper>
    </div>
  );
}