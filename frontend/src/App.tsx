import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ModuleView from './pages/ModuleView';
import TopicView from './pages/TopicView';
import AdminPanel from './pages/AdminPanel';
import Login from './pages/Login';
import { Container, CssBaseline } from '@mui/material';

function App() {
  return (
    <Router>
      <CssBaseline />
      <Container maxWidth="md">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/module/:id" element={<ModuleView />} />
          <Route path="/topic/:id" element={<TopicView />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Container>
    </Router>
  );
}
export default App;