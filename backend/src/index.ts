import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const authenticate = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Brak tokenu autoryzacyjnego' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Nieprawidłowy token' });
  }
};

app.get('/api/subjects', async (req, res) => {
  try {
    const subjects = await prisma.subject.findMany({ include: { modules: true } });
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ error: 'Błąd podczas pobierania przedmiotów' });
  }
});

app.get('/api/modules/:moduleId', async (req, res) => {
  try {
    const moduleData = await prisma.module.findUnique({
      where: { id: parseInt(req.params.moduleId) },
      include: { topics: true },
    });
    res.json(moduleData);
  } catch (error) {
    res.status(500).json({ error: 'Błąd podczas pobierania modułu' });
  }
});

app.get('/api/topics/:topicId', async (req, res) => {
  try {
    const topic = await prisma.topic.findUnique({
      where: { id: parseInt(req.params.topicId) },
      include: { tasks: true },
    });
    res.json(topic);
  } catch (error) {
    res.status(500).json({ error: 'Błąd podczas pobierania tematu' });
  }
});

app.post('/api/tasks/submit', async (req, res) => {
  const { taskId, studentEmail, solution } = req.body;
  try {
    const task = await prisma.task.findUnique({ where: { id: taskId }, include: { topic: { include: { module: { include: { subject: true } } } } } });
    if (!task) return res.status(404).json({ error: 'Nie znaleziono zadania' });

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: process.env.TEACHER_EMAIL || 'nauczyciel@lms.local',
      subject: `Rozwiązanie zadania: ${task.question} od ${studentEmail}`,
      text: `Uczeń ${studentEmail} przesłał rozwiązanie do zadania:\n${solution}`,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: 'Rozwiązanie wysłane pomyślnie!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Błąd' });
  }
});

app.post('/api/admin/login', async (req, res) => {
  const { email, password } = req.body;
  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin || !await bcrypt.compare(password, admin.password)) {
    return res.status(401).json({ error: 'Nieprawidłowe dane logowania' });
  }
  const token = jwt.sign({ adminId: admin.id }, process.env.JWT_SECRET || 'secret');
  res.json({ token });
});

app.post('/api/admin/subjects', authenticate, async (req, res) => {
  try {
    const subject = await prisma.subject.create({ data: req.body });
    res.json(subject);
  } catch (error) { res.status(500).json({ error: 'Błąd' }); }
});

app.post('/api/admin/modules', authenticate, async (req, res) => {
  try {
    const moduleData = await prisma.module.create({ data: req.body });
    res.json(moduleData);
  } catch (error) { res.status(500).json({ error: 'Błąd' }); }
});

app.post('/api/admin/topics', authenticate, async (req, res) => {
  try {
    const topic = await prisma.topic.create({ data: req.body });
    res.json(topic);
  } catch (error) { res.status(500).json({ error: 'Błąd' }); }
});

app.post('/api/admin/tasks', authenticate, async (req, res) => {
  try {
    const task = await prisma.task.create({ data: req.body });
    res.json(task);
  } catch (error) { res.status(500).json({ error: 'Błąd' }); }
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Serwer działa na http://localhost:${PORT}`);
  });
}

export default app;
