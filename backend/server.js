const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors()); 
app.use(express.json()); 

app.use('/api/auth', require('./routes/auth'));

app.get('/', (req, res) => {
  res.send('MindBridge Backend is Running!');
});

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected... Path of Athena is clear!'))
  .catch(err => console.log('Database connection error: ', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

app.use('/api/mood', require('./routes/mood'));

app.use('/api/journal', require('./routes/journal'));

app.use('/api/circle', require('./routes/circle'));