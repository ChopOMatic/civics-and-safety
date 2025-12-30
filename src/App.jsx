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

    // Update progress
    const moduleProgress = progress[moduleId] || [];
    if (!moduleProgress.includes(lessonId)) {
      setProgress({
        ...progress,
        [moduleId]: [...moduleProgress, lessonId]
      });
    }

    // Move to next lesson or quiz
    if (currentLessonIndex < activeModule.lessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
      window.scrollTo(0, 0);
    } else {
      setIsQuizActive(true);
      window.scrollTo(0, 0);
    }
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
                <Quiz module={activeModule} onComplete={() => {
                  setCurrentView('landing');
                  window.scrollTo(0, 0);
                }} />
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
          <h1 className="title">Foundations of Liberty</h1>
          <p className="subtitle">
            A comprehensive remedial course on civics, the rule of law, and the
            social contract. Grounded in history, designed for the future.
          </p>
          <div className="hero-cta">
            <button className="primary">Begin Curriculum</button>
            <button>View Syllabus</button>
          </div>
        </div>
      </header>

      {/* Philosophy Section */}
      <section className="section container">
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
          <h2>Our Philosophy</h2>
          <p style={{ marginTop: '1.5rem', color: 'var(--text-dim)' }}>
            True freedom stems from understanding the structures that protect it.
            Our curriculum focuses on the historical context of common law,
            the evolution of constitutional governance, and the practical application
            of civil rights in the modern era.
          </p>
        </div>

        <div className="grid">
          <div className="card">
            <h3>Foundational Law</h3>
            <p>
              Explore the origins of common law and the development of the
              constitutional framework that governs our society.
            </p>
          </div>
          <div className="card">
            <h3>Civil Responsibility</h3>
            <p>
              Understand the balance between individual rights and the collective
              obligations that maintain a safe and stable community.
            </p>
          </div>
          <div className="card">
            <h3>Modern Jurisprudence</h3>
            <p>
              Learn how traditional legal principles translate into contemporary
              statutes and the judicial system.
            </p>
          </div>
        </div>
      </section>

      {/* Curriculum Grid */}
      <section className="section" style={{ background: 'var(--bg-main)' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: '3rem' }}>The Curriculum</h2>
          <div className="grid">
            {courses.map((course) => (
              <div key={course.id} className="card module-card">
                <span className="module-tag">Module {course.id.split('-').pop()}</span>
                <h3>{course.title}</h3>
                <p>{course.description}</p>
                <ul className="lesson-list">
                  {course.lessons.map(lesson => (
                    <li key={lesson.id}>
                      <span>{lesson.title}</span>
                      <span className="duration">{lesson.duration}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className="primary"
                  style={{ width: '100%', marginTop: '1.5rem' }}
                  onClick={() => startModule(course)}
                >
                  Enroll in Module
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="container">
          <p>&copy; {new Date().getFullYear()} Civics & Safety Remedial Learning. All rights reserved.</p>
          <p style={{ marginTop: '0.5rem', fontSize: '0.8rem' }}>
            Educational purposes only. This platform does not provide legal advice.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;

