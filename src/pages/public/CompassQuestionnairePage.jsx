import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { questionnaireApi } from '../../services/api';
import PageHeader from '../../components/platform/PageHeader';
import '../../styles/platform.css';


export default function CompassQuestionnairePage() {
  const navigate = useNavigate();
  const [questionnaire, setQuestionnaire] = useState(null);
  const [answers, setAnswers] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [saved, setSaved] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const savedDraft = localStorage.getItem('esg_questionnaire_draft');
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        setAnswers(parsed.answers || {});
        setCurrentIndex(parsed.currentIndex || 0);
      } catch {
        // ignore malformed draft
      }
    }

    questionnaireApi.get('compass').then((response) => setQuestionnaire(response.data)).catch((err) => setError(err.message));
  }, []);

  useEffect(() => {
    if (!questionnaire) return;
    localStorage.setItem('esg_questionnaire_draft', JSON.stringify({ answers, currentIndex, questionnaireId: questionnaire._id }));
  }, [answers, currentIndex, questionnaire]);

  const questions = useMemo(() => questionnaire?.questions || [], [questionnaire]);
  const currentQuestion = questions[currentIndex];
  const answeredCount = useMemo(() => Object.keys(answers).filter((key) => answers[key] !== '').length, [answers]);
  const completionPercent = questions.length ? Math.round((answeredCount / questions.length) * 100) : 0;

  const updateAnswer = (value) => {
    setAnswers((current) => ({ ...current, [currentQuestion._id]: value }));
  };

  const nextStep = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((current) => current + 1);
    }
  };

  const previousStep = () => {
    if (currentIndex > 0) {
      setCurrentIndex((current) => current - 1);
    }
  };

  const saveProgress = () => {
    setSaved('Progress saved locally');
  };

  const submit = async (event) => {
    event.preventDefault();
    try {
      const response = await questionnaireApi.submit({
        questionnaire: questionnaire._id,
        answers: Object.entries(answers).map(([questionId, value]) => ({ questionId, value })),
      });
      setResult(response.data.assessment);
      localStorage.removeItem('esg_questionnaire_draft');
      setError('');
      navigate('/app/onboarding/material-topics');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="page-panel" style={{ margin: 24 }}>
      <PageHeader title={questionnaire?.title || 'Sustainability Compass'} description={questionnaire?.description || 'Complete your assessment to guide ESG priorities and reporting.'} />
      {error ? <p className="error-line">{error}</p> : null}
      {saved ? <p className="status-line">{saved}</p> : null}
      {result ? <p className="status-line">Overall ESG score: {result.scores.overall}</p> : null}
      <div className="page-panel" style={{ marginTop: 12, padding: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <strong>Completion</strong>
          <span>{completionPercent}%</span>
        </div>
        <div style={{ height: 8, background: '#e2e8f0', borderRadius: 999 }}>
          <div style={{ width: `${completionPercent}%`, height: '100%', background: '#0f766e', borderRadius: 999 }} />
        </div>
      </div>
      <form onSubmit={submit}>
        {currentQuestion ? (
          <fieldset className="field" key={currentQuestion._id} style={{ marginBottom: 14, marginTop: 16, border: 'none', padding: 0 }}>
            <legend style={{ fontWeight: '600', marginBottom: '16px', fontSize: '1.1rem', lineHeight: '1.4' }}>
              {currentQuestion.prompt}
            </legend>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Added fallback to empty array to prevent map errors */}
              {(currentQuestion.options || []).map((option) => {
                const isSelected = answers[currentQuestion._id] === option.value;
                
                return (
                  <label 
                    key={option.value} 
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '12px 16px',
                      cursor: 'pointer',
                      borderRadius: '8px',
                      border: isSelected ? '2px solid #0f766e' : '1px solid #e2e8f0',
                      backgroundColor: isSelected ? '#f0fdfa' : '#ffffff',
                      transition: 'all 0.2s ease-in-out',
                      width: '100%',
                      boxSizing: 'border-box',
                      
                    }}
                  >
                    <input 
                      type="radio" 
                      name={`question_${currentQuestion._id}`}
                      value={option.value}
                      checked={isSelected}
                      onChange={() => updateAnswer(option.value)}
                      required
                      style={{ 
                        marginTop: '4px', 
                        marginRight: '12px',
                        cursor: 'pointer',
                        width: '18px',
                        height: '18px',
                        flexShrink: 0,
                        accentColor: '#0f766e'
                      }}
                    />
                    <span style={{ 
                      lineHeight: '1.5', 
                      color: '#334155',
                      flex: 1,
                      textAlign: 'left'
                    }}>
                      {option.label}
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        ) : (
          <p>Loading questions...</p>
        )}

        
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap', marginTop: 16 }}>
          <button className="icon-text-button" type="button" onClick={previousStep} disabled={currentIndex === 0}>Previous</button>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button className="icon-text-button" type="button" onClick={saveProgress}>Save progress</button>
            {currentIndex < questions.length - 1 ? (
              <button className="primary-button" type="button" onClick={nextStep}>Next</button>
            ) : (
              <button className="primary-button" type="submit" disabled={!questionnaire}>Submit assessment</button>
            )}
          </div>
        </div>
      </form>
    </section>
  );
}
