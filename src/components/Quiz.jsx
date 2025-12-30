import React, { useState } from 'react';

const Quiz = ({ module, onComplete }) => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [showResults, setShowResults] = useState(false);
    const [score, setScore] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [hasAnswered, setHasAnswered] = useState(false);

    const questions = module.quiz || [];

    const handleAnswer = (index) => {
        if (hasAnswered) return;

        setSelectedAnswer(index);
        setHasAnswered(true);

        if (index === questions[currentQuestion].answer) {
            setScore(score + 1);
        }
    };

    const nextQuestion = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setHasAnswered(false);
            setSelectedAnswer(null);
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
                <p>You have demonstrated a foundational understanding of the legal principles in {module.title}.</p>
                <div className="lesson-footer">
                    <button className="primary" onClick={onComplete}>Return to Curriculum</button>
                </div>
            </div>
        );
    }

    const q = questions[currentQuestion];

    if (!q) return <div>No questions available for this module.</div>;

    return (
        <div className="quiz-container">
            <div className="quiz-header">
                <span className="quiz-tag">Knowledge Check</span>
                <h3>Question {currentQuestion + 1} of {questions.length}</h3>
            </div>
            <p className="question-text">{q.question}</p>
            <div className="options-grid">
                {q.options.map((option, idx) => {
                    let statusClass = "";
                    if (hasAnswered) {
                        if (idx === q.answer) statusClass = "correct";
                        else if (idx === selectedAnswer) statusClass = "incorrect";
                    }

                    return (
                        <button
                            key={idx}
                            className={`option-btn ${statusClass}`}
                            onClick={() => handleAnswer(idx)}
                            disabled={hasAnswered}
                        >
                            <span className="option-indicator">
                                {String.fromCharCode(65 + idx)}
                            </span>
                            {option}
                        </button>
                    );
                })}
            </div>

            {hasAnswered && (
                <div className="explanation-box animate-in">
                    <p>
                        <strong>{selectedAnswer === q.answer ? "✓ Correct" : "✗ Incorrect"}</strong>
                        <br />
                        {q.explanation}
                    </p>
                    <button className="primary" style={{ marginTop: '1rem' }} onClick={nextQuestion}>
                        {currentQuestion < questions.length - 1 ? 'Next Question' : 'View Final Score'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default Quiz;
