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
            <h3>Module Map</h3>
            <ul>
              {activeModule.lessons.map((lesson, idx) => (
                <li
                  key={lesson.id}
                  className={`lesson-item ${idx === currentLessonIndex ? 'active' : ''} ${isLessonComplete(activeModule.id, lesson.id) ? 'completed' : ''}`}
                  onClick={() => setCurrentLessonIndex(idx)}
                >
                  <span className="status-dot"></span>
                  {lesson.title}
                </li>
              ))}
            </ul>
          </aside>

          <section className="module-content">
            <div className="content-parchment">
              <span className="lesson-number">Lesson {currentLessonIndex + 1}</span>
              <h1>{currentLesson.title}</h1>
              <p className="lex-quote">
                "Justice is the constant and perpetual will to render to every man his due."
                <br /><span className="source">— Justinian I</span>
              </p>
              <div className="article-body">
                {isQuizActive ? (
                  <Quiz module={activeModule} onComplete={() => setCurrentView('landing')} />
                ) : (
                  <>
                    <p>
                      To understand the foundations of liberty, one must first distinguish between
                      Natural Law (Lex Naturalis) and Written Law (Lex Scripta). Natural Law is
                      philosophical and universal, while Written Law is the specific code adopted
                      by a society to maintain order.
                    </p>
                    <p>
                      In this lesson, we will explore why the differentiation is critical for
                      navigating modern jurisprudence. This is particularly relevant for those seeking
                      to understand the limits of statutory authority...
                    </p>

                    <div className="ai-insight-box">
                      <h4><span className="sparkle">✨</span> AI Insight (Google Credits)</h4>
                      <p>
                        {dynamicInsight || "Analyzing lesson context..."}
                      </p>
                    </div>
                  </>
                )}
              </div>

              {!isQuizActive && (
                <div className="lesson-footer">
                  <button className="primary" onClick={completeLesson}>
                    {currentLessonIndex < activeModule.lessons.length - 1 ? 'Next Lesson' : 'Move to Knowledge Check'}
                  </button>
                </div>
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

