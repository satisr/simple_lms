import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { Typography, Paper, Button, TextField } from '@mui/material';

export default function TopicView() {
  const { id } = useParams();
  const [topic, setTopic] = useState<any>(null);
  const [solutions, setSolutions] = useState<{ [key: number]: string }>({});
  const [email, setEmail] = useState('');
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/topics/${id}`).then(res => setTopic(res.data)).catch(console.error);
  }, [id]);

  const handleSubmit = async (taskId: number) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/tasks/submit`, { taskId, studentEmail: email, solution: solutions[taskId] });
      alert('Rozwiązanie wysłane!');
    } catch (err) { alert('Błąd wysyłania rozwiązania.'); }
  };

  if (!topic) return <div>Ładowanie...</div>;
  return (
    <div style={{ padding: '2rem 0' }}>
      <Button component={Link} to="/" variant="outlined" style={{ marginBottom: '1rem' }}>Strona główna</Button>
      <Paper style={{ padding: '2rem' }}>
        <Typography variant="h4" gutterBottom>{topic.name}</Typography>
        <Typography style={{ whiteSpace: 'pre-wrap', marginBottom: '1rem' }}>{topic.content}</Typography>
        <Typography variant="h5" style={{ marginTop: '2rem', marginBottom: '1rem' }}>Zadania</Typography>
        <TextField label="Twój adres e-mail" fullWidth value={email} onChange={e => setEmail(e.target.value)} style={{ marginBottom: '1rem' }} />
        {topic.tasks.map((task: any) => (
          <div key={task.id} style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '4px' }}>
            <Typography variant="subtitle1" gutterBottom>{task.question}</Typography>
            <TextField multiline rows={4} fullWidth variant="outlined" placeholder="Wpisz rozwiązanie tutaj..." value={solutions[task.id] || ''} onChange={e => setSolutions({ ...solutions, [task.id]: e.target.value })} style={{ marginBottom: '1rem' }} />
            <Button variant="contained" color="primary" onClick={() => handleSubmit(task.id)}>Wyślij odpowiedź</Button>
          </div>
        ))}
      </Paper>
    </div>
  );
}