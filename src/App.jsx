import React, { useState, useEffect } from 'react';
import './App.css';
import courses from './data/courses.json';
import Quiz from './components/Quiz';
import { generateInsight } from './services/aiService';

function App() {
  const [currentView, setCurrentView] = useState('landing');
  const [activeModule, setActiveModule] = useState(null);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [dynamicInsight, setDynamicInsight] = useState(null);
  const [progress, setProgress] = useState(() => {
    const saved = localStorage.getItem('civics-progress');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('civics-progress', JSON.stringify(progress));
  }, [progress]);

  const startModule = (module) => {
    setActiveModule(module);
    setCurrentLessonIndex(0);
    setIsQuizActive(false);
    setCurrentView('module');
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    if (activeModule && !isQuizActive) {
      const lesson = activeModule.lessons[currentLessonIndex];
      generateInsight(lesson.title, activeModule.title).then(insight => {
        setDynamicInsight(insight.text);
      });
    }
  }, [activeModule, currentLessonIndex, isQuizActive]);

  const completeLesson = () => {
    const moduleId = activeModule.id;
    const lessonId = activeModule.lessons[currentLessonIndex].id;

    const moduleProgress = progress[moduleId] || [];
    if (!moduleProgress.includes(lessonId)) {
      setProgress({
        ...progress,
        [moduleId]: [...moduleProgress, lessonId]
      });
    }

    if (currentLessonIndex < activeModule.lessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
      window.scrollTo(0, 0);
    } else {
      setIsQuizActive(true);
      window.scrollTo(0, 0);
    }
  };

  const handleQuizComplete = (certified) => {
    if (certified) {
      const moduleId = activeModule.id;
      const moduleProgress = progress[moduleId] || [];
      if (!moduleProgress.includes('quiz-passed')) {
        setProgress({
          ...progress,
          [moduleId]: [...moduleProgress, 'quiz-passed']
        });
      }
    }
    setCurrentView('landing');
    window.scrollTo(0, 0);
  };

  const isLessonComplete = (moduleId, lessonId) => {
    return progress[moduleId]?.includes(lessonId);
  };

  if (currentView === 'module' && activeModule) {
    const currentLesson = activeModule.lessons[currentLessonIndex];
    return (
      <div className="app">
        <nav className="module-nav">
          <div className="container">
            <button onClick={() => setCurrentView('landing')}>&larr; Exit Course</button>
            <span className="nav-title">{activeModule.title}</span>
            <div className="progress-mini">
              {currentLessonIndex + 1} / {activeModule.lessons.length}
            </div>
          </div>
        </nav>

        <main className="container module-reader">
          <aside className="module-sidebar">
            <div className="sidebar-header">
              <h3>Module Map</h3>
              <p className="subtitle">{activeModule.title}</p>
            </div>
            <ul>
              {activeModule.lessons.map((lesson, idx) => (
                <li
                  key={lesson.id}
                  className={`lesson-item ${idx === currentLessonIndex && !isQuizActive ? 'active' : ''} ${isLessonComplete(activeModule.id, lesson.id) ? 'completed' : ''}`}
                  onClick={() => {
                    setCurrentLessonIndex(idx);
                    setIsQuizActive(false);
                  }}
                >
                  <span className="status-dot"></span>
                  <div className="lesson-info">
                    <span className="lesson-label">Lesson {idx + 1}</span>
                    <span className="lesson-title">{lesson.title}</span>
                  </div>
                </li>
              ))}
              <li
                className={`lesson-item quiz-item ${isQuizActive ? 'active' : ''}`}
                onClick={() => {
                  if (activeModule.lessons.every(l => isLessonComplete(activeModule.id, l.id))) {
                    setIsQuizActive(true);
                  }
                }}
              >
                <span className="status-dot"></span>
                <div className="lesson-info">
                  <span className="lesson-label">Final Assessment</span>
                  <span className="lesson-title">Knowledge Review</span>
                </div>
              </li>
            </ul>
          </aside>

          <section className="module-content">
            <div className="content-parchment">
              {isQuizActive ? (
                <Quiz module={activeModule} onComplete={handleQuizComplete} />
              ) : (
                <>
                  <span className="lesson-number">Lesson {currentLessonIndex + 1} of {activeModule.lessons.length}</span>
                  <h1>{currentLesson.title}</h1>

                  <div className="article-body">
                    {currentLesson.content.split('\n\n').map((paragraph, pIdx) => {
                      if (paragraph.startsWith('**The Reality:**') || paragraph.startsWith('**The Facts:**')) {
                        return (
                          <div key={pIdx} className="fact-box">
                            <span className="box-label">FACT</span>
                            <p>{paragraph.replace(/^\*\*The Reality:\*\*\s*|^\*\*The Facts:\*\*\s*/, '')}</p>
                          </div>
                        );
                      }
                      if (paragraph.startsWith('**The Sovereignty Myth:**') || paragraph.startsWith('**The Argument:**')) {
                        return (
                          <div key={pIdx} className="myth-box">
                            <span className="box-label">COMMON ARGUMENT</span>
                            <p>{paragraph.replace(/^\*\*The Sovereignty Myth:\*\*\s*|^\*\*The Argument:\*\*\s*/, '')}</p>
                          </div>
                        );
                      }
                      return <p key={pIdx}>{paragraph}</p>;
                    })}
                  </div>

                  <div className="ai-insight-box">
                    <h4><span className="sparkle">✨</span> Deep Dive Analysis</h4>
                    <p className="insight-text">
                      {dynamicInsight || "Synthesizing legal precedents..."}
                    </p>
                    <span className="insight-footer">Generated via High-Tier Synthesis</span>
                  </div>

                  <div className="lesson-footer">
                    <button className="primary big" onClick={completeLesson}>
                      {currentLessonIndex < activeModule.lessons.length - 1 ? 'Complete & Continue' : 'Finish Lessons & Start Quiz'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="app">
      {/* Hero Section */}
      <header className="hero">
        <div className="container">
          <div className="judicial-seal">Lex • Veritas • Iustitia</div>
          <h1 className="title">Judicial Remedial Curriculum</h1>
          <p className="subtitle">
            A logic-based restorative course on the Rule of Law, Territorial Jurisdiction,
            and the Social Contract. Certified for Judicial Enforcement and Remedial Learning.
          </p>
          <div className="hero-cta">
            <button className="primary" onClick={() => {
              const element = document.getElementById('curriculum');
              element?.scrollIntoView({ behavior: 'smooth' });
            }}>Enter Curriculum</button>
            <button variant="outline">Download Syllabus</button>
          </div>
        </div>
      </header>

      {/* Philosophy Section */}
      <section className="section container">
        <div className="philosophy-header">
          <h2>Educational Methodology</h2>
          <p>
            Understanding the law requires a bridge of logic. Our coursework uses
            systematic deconstruction to help individuals reconcile their personal
            beliefs with the established legal reality of modern jurisprudence.
          </p>
        </div>

        <div className="grid">
          <div className="card">
            <div className="card-icon">⚖️</div>
            <h3>Linguistic Clarity</h3>
            <p>
              Moving beyond the 'language trap' by understanding the specific
              statutory definitions that govern our modern society.
            </p>
          </div>
          <div className="card">
            <div className="card-icon">🗺️</div>
            <h3>Territorial Truth</h3>
            <p>
              Understanding that jurisdiction is a function of geography and the
              Constitution, ensuring order for all residents.
            </p>
          </div>
          <div className="card">
            <div className="card-icon">📜</div>
            <h3>Precedent & Reality</h3>
            <p>
              Walking through real case law to see the logical end-points of
              various legal theories in actual courtrooms.
            </p>
          </div>
        </div>
      </section>

      {/* Curriculum Grid */}
      <section id="curriculum" className="section curriculum-section">
        <div className="container">
          <h2 className="section-title">Required Mastery Modules</h2>
          <div className="grid">
            {courses.map((course) => {
              const isLocked = course.id !== 'm1' && !progress[courses[courses.indexOf(course) - 1]?.id]?.includes('quiz-passed');

              return (
                <div key={course.id} className={`card module-card ${isLocked ? 'locked' : ''}`}>
                  <div className="module-header">
                    <span className="module-tag">Module {course.id.split('m').pop()}</span>
                    {progress[course.id]?.includes('quiz-passed') && <span className="completed-badge">✓ Certified</span>}
                  </div>
                  <h3>{course.title}</h3>
                  <p>{course.description}</p>

                  <div className="module-footer">
                    {isLocked ? (
                      <div className="lock-notice">
                        <span className="lock-icon">🔒</span> Complete previous module to unlock
                      </div>
                    ) : (
                      <button
                        className="primary full-width"
                        onClick={() => startModule(course)}
                      >
                        {progress[course.id]?.includes('quiz-passed') ? 'Review Content' : 'Begin Module'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="judicial-footer">
        <div className="container">
          <div className="footer-seal">Department of Judicial Remediation</div>
          <p>&copy; {new Date().getFullYear()} Civics & Safety Remedial Learning Platform.</p>
          <p className="disclaimer">
            This platform provides educational content for judicial remedial purposes.
            Successful completion does not constitute legal advice or representation.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;

