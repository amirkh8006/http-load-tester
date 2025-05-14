const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = 4000;

const heyRoute = require('./routes/hey');
const pingRoute = require('./routes/ping');

app.use(cors())

app.use(bodyParser.json());

app.use('/run-hey', heyRoute);
app.use('/ping', pingRoute);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
