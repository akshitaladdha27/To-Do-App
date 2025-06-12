const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); 

// console.log('Connected to DB:', process.env.MONGO_URI);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

app.use(express.json());

const taskRoutes = require('./routes/taskroutes');
app.use('/api/task', taskRoutes);

// Middleware
app.use(cors());
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:3000'
}));


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ MongoDB Connected');
})
.catch((err) => {
  console.error('❌ MongoDB Connection Failed:', err.message);
});

// Test Route
app.get('/', (req, res) => {
  res.send('Server is running');
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server started at http://localhost:${PORT}`);
});
