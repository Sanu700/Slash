// server/index.js

import express from 'express';
import redirectRouter from './redirect.js';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use('/go', redirectRouter);  // All tracked links will go through this route

app.get('/', (req, res) => {
  res.send('Backend running. Use /go/:serviceId to redirect.');
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
