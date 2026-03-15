/**
 * Main application controller
 */

const App = {
    currentModule: 'welcome',

    init() {
        this.bindNavigation();
        this.bindMenuToggle();
        this.loadModule('welcome');
        QuizEngine.updateProgressUI();
    },

    bindNavigation() {
        document.querySelectorAll('#module-list a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const moduleId = link.dataset.module;
                this.loadModule(moduleId);
                // Close mobile menu
                document.getElementById('sidebar').classList.remove('open');
            });
        });
    },

    bindMenuToggle() {
        const toggle = document.getElementById('menu-toggle');
        if (toggle) {
            toggle.addEventListener('click', () => {
                document.getElementById('sidebar').classList.toggle('open');
            });
        }
    },

    loadModule(moduleId) {
        this.currentModule = moduleId;

        // Update active nav
        document.querySelectorAll('#module-list a').forEach(a => {
            a.classList.toggle('active', a.dataset.module === moduleId);
        });

        const content = document.getElementById('content-area');

        if (moduleId === 'welcome') {
            content.innerHTML = this.getWelcomeContent();
            window.scrollTo(0, 0);
            return;
        }

        if (moduleId === 'final-exam') {
            content.innerHTML = '<div id="final-exam-container"></div>';
            QuizEngine.renderFinalExam('final-exam-container', window.finalExamQuestions);
            window.scrollTo(0, 0);
            return;
        }

        const mod = window.courseModules[moduleId];
        if (!mod) {
            content.innerHTML = '<p>Module not found.</p>';
            return;
        }

        let html = '<div class="module-content">';
        html += mod.content;
        html += '<div id="quiz-container-' + moduleId + '"></div>';
        html += '</div>';

        content.innerHTML = html;

        if (mod.quiz && mod.quiz.length > 0) {
            QuizEngine.renderQuiz('quiz-container-' + moduleId, mod.quiz, moduleId);
        }

        window.scrollTo(0, 0);
    },

    getWelcomeContent() {
        return `
        <div class="welcome-content">
            <h2>Welcome</h2>

            <div class="court-notice">
                <strong>NOTICE:</strong> This course has been ordered by a court of law as a remedial educational requirement.
                Completion of all 15 modules and the final examination is mandatory. You must pass each module quiz
                with a score of 70% or higher and the final exam with a score of 80% or higher. Your progress is tracked automatically.
            </div>

            <h3>Purpose of This Course</h3>
            <p>This course exists because you have presented arguments in a legal proceeding that have no basis in actual law. The arguments you have used — sometimes called \"sovereign citizen\" arguments — have been rejected by every court that has ever considered them. They are not a matter of opinion or interpretation. They are factually and legally wrong.</p>

            <p>This course will walk you through the most common false legal claims, explain why each one is wrong, and show you the actual court decisions that have rejected them. The goal is not to punish you. The goal is to make sure you understand how the law actually works so that you can participate meaningfully in the legal system going forward.</p>

            <h3>How This Course Works</h3>
            <p>There are 15 modules. Each one covers a specific false legal claim. For each claim, you will read:</p>
            <p><strong>The Claim:</strong> What sovereign citizens say.</p>
            <p><strong>The Reality:</strong> What the law actually is, explained in plain English.</p>
            <p><strong>The Case Law:</strong> Actual court decisions — with quotes from judges — that have rejected the claim.</p>
            <p><strong>A Quiz:</strong> Questions to confirm you understood the material.</p>

            <p>After completing all 15 modules, you must pass a Final Examination covering all topics.</p>

            <h3>A Note on Tone</h3>
            <p>This course is direct. It does not entertain the possibility that sovereign citizen arguments might be valid, because they are not. No court has ever accepted them. Not once. Not in any state. Not in any federal court. Not in any country that has considered them. This is not a debate — it is a correction.</p>

            <p>Select <strong>Module 1</strong> from the menu to begin.</p>
        </div>`;
    }
};

document.addEventListener('DOMContentLoaded', () => App.init());
