import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../platform/PageHeader';
import { assessmentApi } from '../../services/assessmentApi';

export default function MaterialityStep() {
  const navigate = useNavigate();
  const [topics, setTopics] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;

    const loadTopics = async () => {
      try {
        const response = await assessmentApi.fetchMaterialTopics();
        if (!active) return;
        const list = Array.isArray(response) ? response : response?.data || [];
        setTopics(list);
        if (list.length) {
          const initialSelection = list.slice(0, 3).map((topic) => topic._id || topic.id);
          setSelectedIds(initialSelection);
        }
        setError('');
      } catch (err) {
        if (!active) return;
        setError(err.message);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadTopics();

    return () => {
      active = false;
    };
  }, []);

  const toggleTopic = (topicId) => {
    setSelectedIds((current) =>
      current.includes(topicId) ? current.filter((id) => id !== topicId) : [...current, topicId],
    );
  };

  const handleContinue = async () => {
    if (!selectedIds.length) {
      setError('Select at least one material topic to continue.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const response = await assessmentApi.startAssessment(selectedIds);
      const questions = response?.questions || [];
      navigate('/app/onboarding/questionnaire', {
        state: { questions, selectedTopicIds: selectedIds },
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const selectedTopics = useMemo(() => topics.filter((topic) => selectedIds.includes(topic._id || topic.id)), [selectedIds, topics]);

  return (
    <section>
      <PageHeader
        title="Select material topics"
        description="Choose the topics most relevant to your organization so the assessment can adapt to your context."
      />
      {error ? <p className="error-line">{error}</p> : null}
      <div className="metric-grid">
        <div className="page-panel">
          <div className="page-header" style={{ marginBottom: 12 }}>
            <div>
              <h3 style={{ margin: 0 }}>Topics</h3>
            </div>
          </div>
          {loading ? (
            <p style={{ color: '#64748b' }}>Loading topics...</p>
          ) : (
            <div style={{ display: 'grid', gap: 10 }}>
              {topics.map((topic) => {
                const topicId = topic._id || topic.id;
                const isSelected = selectedIds.includes(topicId);
                return (
                  <button
                    key={topicId}
                    type="button"
                    className="page-panel"
                    style={{
                      textAlign: 'left',
                      padding: 12,
                      margin: 0,
                      border: isSelected ? '1px solid #0f766e' : '1px solid transparent',
                    }}
                    onClick={() => toggleTopic(topicId)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong>{topic.title}</strong>
                      <span>{topic.pillar}</span>
                    </div>
                    <div style={{ color: '#64748b', fontSize: 13, marginTop: 6 }}>
                      Impact {topic.impactScore || 0} • Stakeholder {topic.stakeholderPriority || 0}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="page-panel">
          <div className="page-header" style={{ marginBottom: 12 }}>
            <div>
              <h3 style={{ margin: 0 }}>Selected topics</h3>
            </div>
          </div>
          {selectedTopics.length ? (
            <div style={{ display: 'grid', gap: 10 }}>
              {selectedTopics.map((topic) => (
                <div key={topic._id || topic.id} className="page-panel" style={{ padding: 12, margin: 0 }}>
                  <strong>{topic.title}</strong>
                  <div style={{ color: '#64748b', fontSize: 13, marginTop: 6 }}>{topic.description || 'This topic will shape the assessment questions.'}</div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#64748b', margin: 0 }}>Choose at least one topic to continue.</p>
          )}

          <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
            <button className="primary-button" type="button" onClick={handleContinue} disabled={submitting}>
              {submitting ? 'Preparing questions...' : 'Continue'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
