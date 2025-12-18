const express = require('express');
const { body, validationResult } = require('express-validator');
const Contact = require('../models/Contact');

const router = express.Router();

// POST /contact - store a new contact message
router.post('/contact', [
  body('name').isLength({min:2}).withMessage('Name is too short'),
  body('email').isEmail().withMessage('Valid email required'),
  body('message').isLength({min:5}).withMessage('Message is too short')
], async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) return res.status(400).json({ errors: errors.array(), error: errors.array()[0].msg });

  const { name, email, message } = req.body;
  try{
    const contact = new Contact({ name, email, message });
    await contact.save();
    res.status(201).json({ message: 'Message received. Thank you!' });
  }catch(err){
    console.error(err);
    res.status(500).json({ error: 'Server error saving message' });
  }
});

// GET /contacts - retrieve all messages (simple admin token protection)
router.get('/contacts', async (req, res) => {
  const adminToken = req.get('x-admin-token');
  if(!adminToken || adminToken !== process.env.ADMIN_TOKEN){
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try{
    const items = await Contact.find().sort({date:-1}).lean();
    res.json(items);
  }catch(err){
    console.error(err);
    res.status(500).json({ error: 'Server error fetching messages' });
  }
});

module.exports = router;
