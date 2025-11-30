import express from 'express';
import compression from 'compression';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(compression());
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: '1h',
  setHeaders: res => {
    res.setHeader('X-Powered-By', 'Above The Stack - MSP Performance Scan');
  }
}));

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 4173;
  app.listen(PORT, () => {
    console.log(`MSP Performance Scan running at http://localhost:${PORT}`);
  });
}

export default app;
