import { useEffect, useState } from 'react';
import { BookOpen } from 'lucide-react';
import PageHeader from '../../components/platform/PageHeader';
import { api } from '../../services/api';

export default function LearningHubPage() {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/learning/courses').then((response) => setCourses(response.data || [])).catch((err) => setError(err.message));
  }, []);

  return (
    <section className="page-panel">
      <PageHeader title="Learning Hub" description="Structured ESG education for onboarding and continuous improvement." />
      {error ? <p className="error-line">{error}</p> : null}
      <div className="card-grid">
        {courses.map((course) => (
          <article className="content-card" key={course._id}>
            <BookOpen size={22} />
            <h3>{course.title}</h3>
            <p>{course.description}</p>
            <strong>{course.durationMinutes} min</strong>
          </article>
        ))}
      </div>
    </section>
  );
}
