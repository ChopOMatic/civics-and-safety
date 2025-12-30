import React, { useState } from 'react';

const Quiz = ({ module, onComplete }) => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [showResults, setShowResults] = useState(false);
    const [score, setScore] = useState(0);

    // Mock questions based on module title for now
    const questions = [
        {
            question: `What is a primary focus of ${module.title}?`,
            options: [
                "Traditional legal frameworks",
                "Learning how to ignore all laws",
                "Finding loopholes in every statute",
                "Designing new flags"
            ],
            answer: 0
        },
        {
            question: "Which concept bridges individual rights with community safety?",
            options: [
                "The Magic Scroll",
                "The Social Contract",
                "The Secret Code",
                "The Sovereign Decree"
            ],
            answer: 1
        }
    ];

    const handleAnswer = (index) => {
        if (index === questions[currentQuestion].answer) {
            setScore(score + 1);
        }

        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            setShowResults(true);
        }
    };

    if (showResults) {
        return (
            <div className="quiz-container results">
                <h2>Knowledge Check Complete</h2>
                <div className="score-circle">
                    <span className="score">{Math.round((score / questions.length) * 100)}%</span>
                </div>
                <p>You have demonstrated a foundational understanding of {module.title}.</p>
                <button className="primary" onClick={onComplete}>Continue to Next Module</button>
            </div>
        );
    }

    return (
        <div className="quiz-container">
            <div className="quiz-header">
                <span className="quiz-tag">Knowledge Check</span>
                <h3>Question {currentQuestion + 1} of {questions.length}</h3>
            </div>
            <p className="question-text">{questions[currentQuestion].question}</p>
            <div className="options-grid">
                {questions[currentQuestion].options.map((option, idx) => (
                    <button
                        key={idx}
                        className="option-btn"
                        onClick={() => handleAnswer(idx)}
                    >
                        {option}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Quiz;
