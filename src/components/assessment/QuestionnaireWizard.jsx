import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PageHeader from '../platform/PageHeader';
import { assessmentApi } from '../../services/assessmentApi';

const optionScale = [0, 1, 2, 3, 4];

export default function QuestionnaireWizard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [questions, setQuestions] = useState(location.state?.questions || []);
  const [answers, setAnswers] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [selectedTopicIds] = useState(location.state?.selectedTopicIds || []);

  useEffect(() => {
    if (!questions.length) {
      navigate('/app/onboarding/material-topics');
    }
  }, [navigate, questions.length]);

  const currentQuestion = questions[currentIndex];
  const completionPercent = questions.length ? Math.round((Object.keys(answers).length / questions.length) * 100) : 0;

  const updateAnswer = (value) => {
    if (!currentQuestion) return;
    setAnswers((current) => ({ ...current, [currentQuestion._id || currentQuestion.id]: value }));
  };

  const nextStep = () => {
    if (!currentQuestion) return;
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((current) => current + 1);
    }
  };

  const previousStep = () => {
    if (currentIndex > 0) {
      setCurrentIndex((current) => current - 1);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!currentQuestion) return;

    setIsSubmitting(true);
    setError('');

    try {
      const payload = questions.map((question) => ({
        questionId: question._id || question.id,
        selectedValue: Number(answers[question._id || question.id] ?? 0),
      }));

      const response = await assessmentApi.submitAssessment({
        answers: payload,
        selectedTopicIds,
      });
      setSubmitted(true);
      const result = response?.data || response;
      if (result) {
        navigate('/app/analytics', { state: { assessmentResult: result } });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentAnswer = useMemo(() => {
    if (!currentQuestion) return null;
    return answers[currentQuestion._id || currentQuestion.id];
  }, [answers, currentQuestion]);

  if (!currentQuestion) {
    return null;
  }

  return (
    <section className="page-panel" style={{ margin: 24 }}>
      <PageHeader
        title="ESG Assessment"
        description="Respond to each question using the 0 to 4 scale, where 0 means not in place and 4 means fully mature."
      />
      {error ? <p className="error-line">{error}</p> : null}
      {submitted ? <p className="status-line">Assessment submitted successfully.</p> : null}
      <div className="page-panel" style={{ marginTop: 12, padding: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <strong>Progress</strong>
          <span>{completionPercent}%</span>
        </div>
        <div style={{ height: 8, background: '#e2e8f0', borderRadius: 999 }}>
          <div style={{ width: `${completionPercent}%`, height: '100%', background: '#0f766e', borderRadius: 999 }} />
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ marginTop: 16 }}>
        <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
          <legend style={{ fontWeight: 600, marginBottom: 12, fontSize: '1.05rem' }}>
            {currentIndex + 1}. {currentQuestion.text || currentQuestion.prompt || currentQuestion.indicator || 'Assessment question'}
          </legend>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {optionScale.map((value) => {
              const isSelected = currentAnswer === value;
              return (
                <label
                  key={value}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '12px 14px',
                    borderRadius: 8,
                    border: isSelected ? '2px solid #0f766e' : '1px solid #e2e8f0',
                    background: isSelected ? '#f0fdfa' : '#fff',
                    cursor: 'pointer',
                  }}
                >
                  <input type="radio" name={`question-${currentQuestion._id || currentQuestion.id}`} value={value} checked={isSelected} onChange={() => updateAnswer(value)} required />
                  <span>{value}</span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginTop: 20 }}>
          <button className="icon-text-button" type="button" onClick={previousStep} disabled={currentIndex === 0}>
            Previous
          </button>
          <div style={{ display: 'flex', gap: 8 }}>
            {currentIndex < questions.length - 1 ? (
              <button className="primary-button" type="button" onClick={nextStep}>
                Next
              </button>
            ) : (
              <button className="primary-button" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit assessment'}
              </button>
            )}
          </div>
        </div>
      </form>
    </section>
  );
}
