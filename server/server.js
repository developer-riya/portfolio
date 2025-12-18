require('dotenv').config();
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const contactRoutes = require('./routes/contactRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Serve frontend static files
const publicPath = path.join(__dirname, '..', 'public');
app.use(express.static(publicPath));

// API routes
app.use('/', contactRoutes);

// Fallback to index.html for SPA-like behavior
app.get('*', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

// Database connection and server start
const PORT = process.env.PORT || 3000;
async function start(){
  try{
    if(!process.env.MONGO_URI) throw new Error('MONGO_URI not set in .env');
    await mongoose.connect(process.env.MONGO_URI, {useNewUrlParser:true,useUnifiedTopology:true});
    console.log('Connected to MongoDB');
    app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`));
  }catch(err){
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
}
start();
