import express from 'express';
import process from 'process';
const PORT = process.env.PORT || 3000;

let app = express();

// TODO: Delete this handler
app.get('/ping', (req, res) => res.send('pong'));

app.listen(PORT, () => console.log(`pictochat server is listening on port ${PORT}`));
