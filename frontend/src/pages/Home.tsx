import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Typography, List, ListItem, ListItemButton, ListItemText, Paper, Divider } from '@mui/material';

export default function Home() {
  const [subjects, setSubjects] = useState<any[]>([]);
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/subjects`).then(res => setSubjects(res.data)).catch(console.error);
  }, []);
  return (
    <div style={{ padding: '2rem 0' }}>
      <Typography variant="h3" gutterBottom>Baza Wiedzy</Typography>
      {subjects.map(subject => (
        <Paper key={subject.id} style={{ margin: '1rem 0', padding: '1rem' }}>
          <Typography variant="h5">{subject.name}</Typography>
          <Typography color="textSecondary">{subject.description}</Typography>
          <List>
            {subject.modules.map((module: any) => (
              <div key={module.id}>
                <ListItem disablePadding>
                  <ListItemButton component={Link} to={`/module/${module.id}`}>
                    <ListItemText primary={module.name} />
                  </ListItemButton>
                </ListItem>
                <Divider />
              </div>
            ))}
          </List>
        </Paper>
      ))}
    </div>
  );
}