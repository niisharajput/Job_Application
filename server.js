const express = require('express');
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

app.use(express.static('public'));

// Connect to MongoDB
mongoose.connect('mongodb+srv://rajputniisha:Nisha192003@cluster0.tzsoc9u.mongodb.net/Job_Application', { useNewUrlParser: true, useUnifiedTopology: true });

// Define a schema for the job applications
const applicationSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  phone: String,
  resumePath: String,
  coverLetterPath: String,
  experience: String,
  position: String,
});

const Application = mongoose.model('Application', applicationSchema);

// Set up static files
app.use(express.static('public'));

// Set up multer for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Handle form submission
app.post('/submit', upload.fields([{ name: 'resume', maxCount: 1 }, { name: 'coverletter', maxCount: 1 }]), async (req, res) => {
  try {
    // Process form data and save to MongoDB
    console.log('Received form submission:', req.body);

    const formData = req.body;
    const resumePath = req.files['resume'][0].path;
    const coverLetterPath = req.files['coverletter'] ? req.files['coverletter'][0].path : null;

    const newApplication = new Application({
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      resumePath: resumePath,
      coverLetterPath: coverLetterPath,
      experience: formData.experience,
      position: formData.position,
    });

    await newApplication.save();

    // Respond with a success message
    console.log('Application submitted successfully!');
    res.send('Application submitted successfully!');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
