const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/accountsDB', { useNewUrlParser: true, useUnifiedTopology: true });

const accountSchema = new mongoose.Schema({
  username: String,
  sitename: String,
  password: String,
});

const Account = mongoose.model('Account', accountSchema);

// Get all accounts
app.get('/accounts', async (req, res) => {
  const accounts = await Account.find();
  res.json(accounts);
});

// Add new account

app.post('/register', async (req, res) => {
    try {
      const { username } = req.body;
  
      // Check if username is provided
      if (!username) {
        return res.status(400).json({ message: 'Username is required' });
      }
  
      // Check if the user already exists
      const userExists = await User.findOne({ username });
      if (userExists) {
        return res.status(400).json({ message: 'Username already exists' });
      }
  
      // Create a new user (Assuming there's more logic to add the new user)
      // You might need to implement saving user logic here
  
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  });
  
  app.post('/accounts', async (req, res) => {
    try {
      const { username, sitename, password } = req.body;
  
      // Validation: Check if all fields are provided
      if (!username || !sitename || !password) {
        return res.status(400).json({ message: 'All fields are required' });
      }
  
      // Check if the username already exists
      const existingAccount = await Account.findOne({ username });
      if (existingAccount) {
        return res.status(400).json({ message: 'Username already exists' });
      }
  
      // Create a new account if username is unique
      const newAccount = new Account({ username, sitename, password });
      await newAccount.save();
  
      res.status(201).json(newAccount);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  });
  

// Update an account
app.put('/accounts/:id', async (req, res) => {
  const { id } = req.params;
  const { username, sitename, password } = req.body;
  const updatedAccount = await Account.findByIdAndUpdate(id, { username, sitename, password }, { new: true });
  res.json(updatedAccount);
});

// Delete an account
app.delete('/accounts/:id', async (req, res) => {
  const { id } = req.params;
  await Account.findByIdAndDelete(id);
  res.json({ message: 'Account deleted' });
});

// Start the server
app.listen(5000, () => {
  console.log('Server is running on port http://localhost:5000');
});
