const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/quizmaker', { useNewUrlParser: true, useUnifiedTopology: true });

const questionSchema = new mongoose.Schema({
    question: String,
    options: [String],
    correctOption: String,
});

const Question = mongoose.model('Question', questionSchema);

const questions = [
    {
        question: "What is the capital of France?",
        options: ["Berlin", "Madrid", "Paris", "Rome"],
        correctOption: "3"
    },
    {
        question: "What is the capital of Germany?",
        options: ["Berlin", "Madrid", "Paris", "Rome"],
        correctOption: "1"
    },
];

Question.insertMany(questions)
    .then(() => {
        console.log('Data inserted');
        mongoose.connection.close();
    })
    .catch((error) => {
        console.error('Error inserting data:', error);
    });
