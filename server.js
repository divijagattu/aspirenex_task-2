const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/quiz')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

const questionSchema = new mongoose.Schema({
    question: String,
    options: [String],
    correctOption: String,
});

const Question = mongoose.model('Question', questionSchema);

app.put('/create-quiz', async (req, res) => {
    console.log('Received request to create quiz:', req.body);
    const questions = req.body;
    try {
        const result = await Question.insertMany(questions);
        res.status(201).send(result);
    } catch (error) {
        console.error('Error inserting questions:', error);
        res.status(400).send(error);
    }
});

app.get('/take-quiz', async (req, res) => {
    console.log('Received request to take quiz');
    try {
        const questions = await Question.find();
        res.status(200).send(questions);
    } catch (error) {
        console.error('Error fetching questions:', error);
        res.status(400).send(error);
    }
});

const port = 5001; // Changed port number
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
