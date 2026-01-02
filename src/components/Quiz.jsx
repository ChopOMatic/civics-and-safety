import React, { useState } from 'react';

const Quiz = ({ module, onComplete }) => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [showResults, setShowResults] = useState(false);
    const [score, setScore] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [hasAnswered, setHasAnswered] = useState(false);

    const questions = module.quiz || [];
    const minScoreRequired = 100; // Mandatory Mastery

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

    const resetQuiz = () => {
        setCurrentQuestion(0);
        setShowResults(false);
        setScore(0);
        setSelectedAnswer(null);
        setHasAnswered(false);
    };

    const finalScorePercent = Math.round((score / questions.length) * 100);
    const isPassed = finalScorePercent >= minScoreRequired;

    if (showResults) {
        return (
            <div className="quiz-container results">
                <h2>Module Knowledge Assessment</h2>
                <div className="score-circle" style={{ borderColor: isPassed ? '#22c55e' : '#ef4444' }}>
                    <span className="score" style={{ color: isPassed ? '#22c55e' : '#ef4444' }}>{finalScorePercent}%</span>
                </div>

                {isPassed ? (
                    <>
                        <p><strong>Assessment Successful.</strong> You have demonstrated full logical mastery of the principles in {module.title}.</p>
                        <div className="lesson-footer">
                            <button className="primary" onClick={() => onComplete(true)}>Certified: Return to Curriculum</button>
                        </div>
                    </>
                ) : (
                    <>
                        <p><strong>Assessment Unsuccessful.</strong> Judicial remediation requires 100% logical accuracy to ensure full understanding of the law.</p>
                        <p className="subtitle">Please review the module content and attempt the assessment again.</p>
                        <div className="lesson-footer">
                            <button className="primary" onClick={resetQuiz}>Re-attempt Assessment</button>
                        </div>
                    </>
                )}
            </div>
        );
    }

    const q = questions[currentQuestion];

    if (!q) return <div>No assessment data available for this module.</div>;

    return (
        <div className="quiz-container">
            <div className="quiz-header">
                <span className="quiz-tag">Remedial Assessment</span>
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
                        <strong style={{ color: selectedAnswer === q.answer ? '#166534' : '#991b1b' }}>
                            {selectedAnswer === q.answer ? "✓ Logical Match" : "✗ Logical Discrepancy"}
                        </strong>
                        <br />
                        {q.explanation}
                    </p>
                    <button className="primary" style={{ marginTop: '1.5rem' }} onClick={nextQuestion}>
                        {currentQuestion < questions.length - 1 ? 'Continue to Next Question' : 'Submit Assessment'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default Quiz;
