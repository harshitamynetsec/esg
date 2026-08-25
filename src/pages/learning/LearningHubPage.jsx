import { useEffect, useState } from 'react';
import { BookOpen, Check, ChevronDown, CircleCheck, Clock } from 'lucide-react';
import PageHeader from '../../components/platform/PageHeader';
import LessonContent from '../../components/learning/LessonContent';
import { getCachedResponse, learningApi } from '../../services/api';
import './LearningHubPage.css';

const countLessons = (course) => course.modules.reduce((sum, module) => sum + module.lessons.length, 0);

const countCompleted = (course) => course.modules.reduce(
  (sum, module) => sum + module.lessons.filter((lesson) => lesson.progress?.status === 'completed').length,
  0,
);

export default function LearningHubPage() {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState('');
  const [openModuleId, setOpenModuleId] = useState('');
  const [openLessonId, setOpenLessonId] = useState('');
  const [savingLessonId, setSavingLessonId] = useState('');
  const [loading, setLoading] = useState(() => !getCachedResponse('learning:hub'));

  useEffect(() => {
    const cached = getCachedResponse('learning:hub');
    if (cached) {
      setCourses(cached.data || []);
      setLoading(false);
    }

    learningApi.hubCached()
      .then((response) => {
        const data = response.data || [];
        setCourses(data);
        if (data[0]?.modules?.[0]) setOpenModuleId(data[0].modules[0]._id);
        setError('');
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const toggleModule = (moduleId) => {
    setOpenModuleId((current) => (current === moduleId ? '' : moduleId));
  };

  const toggleLesson = (lessonId) => {
    setOpenLessonId((current) => (current === lessonId ? '' : lessonId));
  };

  const markComplete = async (course, module, lesson) => {
    setSavingLessonId(lesson._id);
    try {
      await learningApi.updateProgress({
        course: course._id,
        module: module._id,
        lesson: lesson._id,
        status: 'completed',
        percentComplete: 100,
      });
      setCourses((current) => current.map((c) => (c._id !== course._id ? c : {
        ...c,
        modules: c.modules.map((m) => (m._id !== module._id ? m : {
          ...m,
          lessons: m.lessons.map((l) => (l._id !== lesson._id ? l : {
            ...l,
            progress: { status: 'completed', percentComplete: 100 },
          })),
        })),
      })));
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingLessonId('');
    }
  };

  const hasCourses = courses.length > 0;

  return (
    <section>
      <PageHeader title="Learning Hub" description="Structured ESG education for onboarding and continuous improvement." />
      {error ? <p className="error-line">{error}</p> : null}

      {loading ? (
        Array.from({ length: 2 }).map((_, index) => (
          <article key={`learning-course-skeleton-${index}`} className="learning-course page-panel">
            <div className="learning-course-header">
              <div className="skeleton" style={{ width: 44, height: 44, borderRadius: 10, flexShrink: 0 }} />
              <div className="learning-course-info">
                <div className="skeleton skeleton-text" style={{ width: '35%', height: 18, marginBottom: 8 }} />
                <div className="skeleton skeleton-text" style={{ width: '70%', marginBottom: 12 }} />
                <div style={{ display: 'flex', gap: 14 }}>
                  <div className="skeleton skeleton-text" style={{ width: 90 }} />
                  <div className="skeleton skeleton-text" style={{ width: 70 }} />
                  <div className="skeleton skeleton-text" style={{ width: 110 }} />
                </div>
              </div>
              <div className="skeleton" style={{ width: 60, height: 60, borderRadius: '50%', flexShrink: 0 }} />
            </div>
            <div className="learning-module-list">
              {Array.from({ length: 3 }).map((__, moduleIndex) => (
                <div key={`learning-module-skeleton-${index}-${moduleIndex}`} className="skeleton-row" style={{ padding: '14px 16px', border: '1px solid #e2e8f0', borderRadius: 8 }}>
                  <div className="skeleton skeleton-row-icon" style={{ borderRadius: '50%' }} />
                  <div className="skeleton-row-body">
                    <div className="skeleton skeleton-text" style={{ width: '40%' }} />
                    <div className="skeleton skeleton-text" style={{ width: '65%' }} />
                  </div>
                </div>
              ))}
            </div>
          </article>
        ))
      ) : courses.map((course) => {
        const totalLessons = countLessons(course);
        const completedLessons = countCompleted(course);
        const percent = totalLessons ? Math.round((completedLessons / totalLessons) * 100) : 0;

        return (
          <article key={course._id} className="learning-course page-panel">
            <div className="learning-course-header">
              <div className="learning-course-icon"><BookOpen size={22} /></div>
              <div className="learning-course-info">
                <h2>{course.title}</h2>
                <p>{course.description}</p>
                <div className="learning-course-meta">
                  <span><Clock size={14} /> {course.durationMinutes} min total</span>
                  <span>{course.modules.length} modules</span>
                  <span>{completedLessons}/{totalLessons} lessons complete</span>
                </div>
              </div>
              <div className="learning-course-progress">
                <div className="learning-progress-ring" style={{ '--percent': `${percent}%` }}>
                  <span>{percent}%</span>
                </div>
              </div>
            </div>

            <div className="learning-module-list">
              {course.modules.map((module, moduleIndex) => {
                const moduleOpen = openModuleId === module._id;
                const moduleCompleted = module.lessons.length > 0
                  && module.lessons.every((lesson) => lesson.progress?.status === 'completed');

                return (
                  <div key={module._id} className={`learning-module ${moduleOpen ? 'is-open' : ''}`}>
                    <button type="button" className="learning-module-header" onClick={() => toggleModule(module._id)}>
                      <span className="learning-module-index">{moduleCompleted ? <CircleCheck size={18} /> : moduleIndex + 1}</span>
                      <span className="learning-module-title">
                        <strong>{module.title}</strong>
                        <small>{module.description}</small>
                      </span>
                      <ChevronDown size={18} className="learning-module-chevron" />
                    </button>

                    {moduleOpen ? (
                      <div className="learning-lesson-list">
                        {module.lessons.map((lesson) => {
                          const lessonOpen = openLessonId === lesson._id;
                          const completed = lesson.progress?.status === 'completed';

                          return (
                            <div key={lesson._id} className="learning-lesson">
                              <button type="button" className="learning-lesson-header" onClick={() => toggleLesson(lesson._id)}>
                                <span className="learning-lesson-title">{lesson.title}</span>
                                <span className="learning-lesson-meta">
                                  <Clock size={13} /> {lesson.durationMinutes} min
                                  {completed ? <span className="learning-status-pill is-complete"><Check size={12} /> Completed</span> : null}
                                </span>
                              </button>
                              {lessonOpen ? (
                                <div className="learning-lesson-body">
                                  <LessonContent content={lesson.content} />
                                  <div className="learning-lesson-actions">
                                    <button
                                      type="button"
                                      className="primary-button"
                                      disabled={completed || savingLessonId === lesson._id}
                                      onClick={() => markComplete(course, module, lesson)}
                                    >
                                      <Check size={16} />
                                      {completed ? 'Completed' : savingLessonId === lesson._id ? 'Saving...' : 'Mark as complete'}
                                    </button>
                                  </div>
                                </div>
                              ) : null}
                            </div>
                          );
                        })}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </article>
        );
      })}

      {!loading && !hasCourses && !error ? (
        <div className="page-panel learning-empty"><p>No learning content is available yet.</p></div>
      ) : null}
    </section>
  );
}
