import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Paper, Typography } from '@mui/material';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:3000/api/admin/login', { email, password });
      localStorage.setItem('token', res.data.token);
      navigate('/admin');
    } catch (err) { alert('Błąd logowania'); }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '4rem' }}>
      <Paper style={{ padding: '2rem', width: '300px' }}>
        <Typography variant="h5" gutterBottom>Logowanie (Admin)</Typography>
        <TextField fullWidth label="Email" value={email} onChange={e => setEmail(e.target.value)} margin="normal" />
        <TextField fullWidth type="password" label="Hasło" value={password} onChange={e => setPassword(e.target.value)} margin="normal" />
        <Button fullWidth variant="contained" color="primary" onClick={handleLogin} style={{ marginTop: '1rem' }}>Zaloguj</Button>
      </Paper>
    </div>
  );
}