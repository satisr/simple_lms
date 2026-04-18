import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { Typography, List, ListItem, ListItemButton, ListItemText, Paper, Button } from '@mui/material';

export default function ModuleView() {
  const { id } = useParams();
  const [module, setModule] = useState<any>(null);
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/modules/${id}`).then(res => setModule(res.data)).catch(console.error);
  }, [id]);
  if (!module) return <div>Ładowanie...</div>;
  return (
    <div style={{ padding: '2rem 0' }}>
      <Button component={Link} to="/" variant="outlined" style={{ marginBottom: '1rem' }}>Wstecz</Button>
      <Paper style={{ padding: '1rem' }}>
        <Typography variant="h4">{module.name}</Typography>
        <Typography color="textSecondary">{module.description}</Typography>
        <Typography variant="h6" style={{ marginTop: '1rem' }}>Tematy:</Typography>
        <List>
          {module.topics.map((topic: any) => (
            <ListItem disablePadding key={topic.id}>
              <ListItemButton component={Link} to={`/topic/${topic.id}`}>
                <ListItemText primary={topic.name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Paper>
    </div>
  );
}