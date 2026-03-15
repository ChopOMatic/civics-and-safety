/**
 * Quiz Engine for the Remedial Civics Course
 * Handles module quizzes and the final exam
 */

const QuizEngine = {
    completedModules: new Set(),

    init() {
        const saved = localStorage.getItem('completedModules');
        if (saved) {
            JSON.parse(saved).forEach(m => this.completedModules.add(m));
        }
    },

    saveProgress() {
        localStorage.setItem('completedModules', JSON.stringify([...this.completedModules]));
    },

    markComplete(moduleId) {
        this.completedModules.add(moduleId);
        this.saveProgress();
        this.updateProgressUI();
    },

    updateProgressUI() {
        const total = 16; // 15 modules + final exam
        const done = this.completedModules.size;
        const pct = Math.round((done / total) * 100);
        const fill = document.getElementById('progress-fill');
        const text = document.getElementById('progress-text');
        if (fill) fill.style.width = pct + '%';
        if (text) text.textContent = done + ' of ' + total + ' completed';

        // Update nav items
        document.querySelectorAll('#module-list a').forEach(a => {
            const mod = a.dataset.module;
            if (this.completedModules.has(mod)) {
                a.classList.add('completed');
            }
        });
    },

    /**
     * Render a quiz into a container
     * @param {string} containerId - DOM id to render into
     * @param {Array} questions - array of question objects
     * @param {string} moduleId - module identifier for tracking
     * @param {number} passingScore - percentage needed to pass (default 70)
     */
    renderQuiz(containerId, questions, moduleId, passingScore = 70) {
        const container = document.getElementById(containerId);
        if (!container) return;

        let html = '<div class="quiz-section"><h3>Module Quiz</h3>';
        html += '<p style="font-family: Arial, sans-serif; font-size: 0.9rem; color: #555; margin-bottom: 1.5rem;">You must score at least ' + passingScore + '% to complete this module. Select the best answer for each question.</p>';

        questions.forEach((q, i) => {
            html += '<div class="quiz-question" data-question="' + i + '" data-correct="' + q.correct + '">';
            html += '<div class="q-number">Question ' + (i + 1) + ' of ' + questions.length + '</div>';
            html += '<div class="q-text">' + q.question + '</div>';
            q.options.forEach((opt, j) => {
                const letter = String.fromCharCode(65 + j);
                html += '<label class="quiz-option" data-option="' + j + '">';
                html += '<input type="radio" name="q' + i + '" value="' + j + '"> ';
                html += letter + '. ' + opt;
                html += '</label>';
            });
            html += '<div class="quiz-feedback" id="feedback-' + i + '"></div>';
            html += '</div>';
        });

        html += '<button class="quiz-btn quiz-btn-submit" onclick="QuizEngine.gradeQuiz(\'' + containerId + '\', \'' + moduleId + '\', ' + passingScore + ')">Submit Answers</button>';
        html += '<div id="quiz-results-' + containerId + '" class="quiz-results" style="display:none;"></div>';
        html += '</div>';

        container.innerHTML = html;
    },

    gradeQuiz(containerId, moduleId, passingScore) {
        const container = document.getElementById(containerId);
        const questions = container.querySelectorAll('.quiz-question');
        let correct = 0;
        let total = questions.length;
        let allAnswered = true;

        questions.forEach((qEl, i) => {
            const selected = qEl.querySelector('input[type="radio"]:checked');
            const correctIdx = parseInt(qEl.dataset.correct);
            const feedbackEl = document.getElementById('feedback-' + i);
            const options = qEl.querySelectorAll('.quiz-option');

            // Reset styles
            options.forEach(o => o.classList.remove('correct', 'incorrect', 'missed-correct'));

            if (!selected) {
                allAnswered = false;
                return;
            }

            const selectedIdx = parseInt(selected.value);

            if (selectedIdx === correctIdx) {
                correct++;
                options[selectedIdx].classList.add('correct');
                feedbackEl.className = 'quiz-feedback show correct-feedback';
                feedbackEl.textContent = 'Correct.';
            } else {
                options[selectedIdx].classList.add('incorrect');
                options[correctIdx].classList.add('missed-correct');
                feedbackEl.className = 'quiz-feedback show incorrect-feedback';
                const courseData = window.courseModules && window.courseModules[moduleId];
                const explanation = courseData && courseData.quiz && courseData.quiz[i] && courseData.quiz[i].explanation;
                feedbackEl.textContent = explanation || 'Incorrect. The correct answer is ' + String.fromCharCode(65 + correctIdx) + '.';
            }

            // Disable further input
            qEl.querySelectorAll('input[type="radio"]').forEach(r => r.disabled = true);
        });

        if (!allAnswered) {
            alert('Please answer all questions before submitting.');
            return;
        }

        const pct = Math.round((correct / total) * 100);
        const passed = pct >= passingScore;
        const resultsEl = document.getElementById('quiz-results-' + containerId);

        resultsEl.style.display = 'block';
        resultsEl.innerHTML = '<div class="score ' + (passed ? 'pass' : 'fail') + '">' + pct + '%</div>' +
            '<p>' + correct + ' out of ' + total + ' correct</p>' +
            '<p style="font-weight:600; margin-top:0.5rem;">' +
            (passed ? 'You have passed this module.' : 'You did not pass. You need ' + passingScore + '% to pass. Please review the material and try again.') +
            '</p>' +
            (!passed ? '<button class="quiz-btn quiz-btn-next" onclick="QuizEngine.retryQuiz(\'' + containerId + '\')">Try Again</button>' : '');

        if (passed) {
            this.markComplete(moduleId);
        }

        // Disable submit button
        container.querySelector('.quiz-btn-submit').disabled = true;
        container.querySelector('.quiz-btn-submit').style.opacity = '0.5';

        resultsEl.scrollIntoView({ behavior: 'smooth' });
    },

    retryQuiz(containerId) {
        const container = document.getElementById(containerId);
        const questions = container.querySelectorAll('.quiz-question');

        questions.forEach((qEl, i) => {
            const options = qEl.querySelectorAll('.quiz-option');
            options.forEach(o => o.classList.remove('correct', 'incorrect', 'missed-correct'));
            qEl.querySelectorAll('input[type="radio"]').forEach(r => {
                r.disabled = false;
                r.checked = false;
            });
            const fb = document.getElementById('feedback-' + i);
            if (fb) fb.className = 'quiz-feedback';
        });

        const resultsEl = document.getElementById('quiz-results-' + containerId);
        if (resultsEl) resultsEl.style.display = 'none';

        const submitBtn = container.querySelector('.quiz-btn-submit');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.style.opacity = '1';
        }

        container.querySelector('.quiz-section').scrollIntoView({ behavior: 'smooth' });
    },

    /**
     * Render the final exam
     */
    renderFinalExam(containerId, questions) {
        const container = document.getElementById(containerId);
        if (!container) return;

        let html = '<div class="exam-header"><h2>Final Examination</h2>';
        html += '<p>This exam covers all 15 modules. You must score at least 80% to pass. There are ' + questions.length + ' questions.</p></div>';

        html += '<div class="quiz-section">';
        questions.forEach((q, i) => {
            html += '<div class="quiz-question" data-question="' + i + '" data-correct="' + q.correct + '">';
            html += '<div class="q-number">Question ' + (i + 1) + ' of ' + questions.length + '</div>';
            html += '<div class="q-text">' + q.question + '</div>';
            q.options.forEach((opt, j) => {
                const letter = String.fromCharCode(65 + j);
                html += '<label class="quiz-option" data-option="' + j + '">';
                html += '<input type="radio" name="fq' + i + '" value="' + j + '"> ';
                html += letter + '. ' + opt;
                html += '</label>';
            });
            html += '<div class="quiz-feedback" id="feedback-' + i + '"></div>';
            html += '</div>';
        });

        html += '<button class="quiz-btn quiz-btn-submit" onclick="QuizEngine.gradeFinalExam(\'' + containerId + '\')">Submit Final Exam</button>';
        html += '<div id="quiz-results-' + containerId + '" class="quiz-results" style="display:none;"></div>';
        html += '</div>';

        container.innerHTML = html;
    },

    gradeFinalExam(containerId) {
        this.gradeQuiz(containerId, 'final-exam', 80);
    }
};

QuizEngine.init();
