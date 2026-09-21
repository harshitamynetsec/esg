import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../platform/PageHeader';
import { assessmentApi } from '../../services/assessmentApi';
import { getCachedResponse, setCachedResponse } from '../../services/api';

export default function MaterialityStep() {
  const navigate = useNavigate();

  const [topics, setTopics] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const hasAutoSelected = useRef(false);

  useEffect(() => {
    let active = true;

    const loadTopics = async () => {
      setLoading(true);
      try {
        const cacheKey = `material-topics:${page}:15`;
        const cached = getCachedResponse(cacheKey);
        if (cached && active) {
          setTopics(cached.data || []);
          setPagination(cached.meta || { page, pages: 1, total: cached.data?.length || 0 });
          setLoading(false);
        }
        const response = await assessmentApi.fetchMaterialTopics({ page, limit: 15 });

        if (!active) return;

        const list = response?.data || [];
        setCachedResponse(cacheKey, response);

        setTopics(list);
        setPagination(response?.meta || { page, pages: 1, total: list.length });

        if (list.length && !hasAutoSelected.current) {
          hasAutoSelected.current = true;
          const initialSelection = list
            .slice(0, 3)
            .map((topic) => topic._id || topic.id);

          setSelectedIds(initialSelection);
        }

        setError('');
      } catch (err) {
        if (!active) return;

        setError(
          err?.message || 'Unable to load material topics.'
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadTopics();

    return () => {
      active = false;
    };
  }, [page]);

  const toggleTopic = (topicId) => {
    setSelectedIds((current) =>
      current.includes(topicId)
        ? current.filter((id) => id !== topicId)
        : [...current, topicId]
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

      if (!questions.length) {
        setError(
          'No assessment questions are available for the selected material topics.'
        );
        return;
      }

      navigate('/app/onboarding/questionnaire', {
        state: {
          questions,
          selectedTopicIds: selectedIds,
        },
      });
    } catch (err) {
      setError(
        err?.message || 'Unable to start the assessment.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const selectedTopics = useMemo(
    () =>
      topics.filter((topic) =>
        selectedIds.includes(topic._id || topic.id)
      ),
    [selectedIds, topics]
  );

  return (
    <section>
      <PageHeader
        title="Select Your Material Topics"
        subtitle="Identify the ESG topics that matter most to your business."
      />

      {error && (
        <div
          style={{
            marginBottom: 16,
            padding: '12px 16px',
            borderRadius: 8,
            background: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#b91c1c',
          }}
        >
          {error}
        </div>
      )}

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}
      >
        {/* Selected Topics Panel */}
        <div className="page-panel">
          <div
            className="page-header"
            style={{ marginBottom: 16 }}
          >
            <div>
              <h3 style={{ margin: 0 }}>
                Selected topics
              </h3>

              <p
                style={{
                  margin: '6px 0 0',
                  color: '#64748b',
                  fontSize: 14,
                }}
              >
                Review the topics selected for your assessment.
              </p>
            </div>
          </div>

          {loading ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: 12,
              }}
            >
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={`selected-topic-skeleton-${index}`}
                  className="page-panel"
                  style={{ padding: 12, margin: 0, background: '#f8fafc', border: '1px solid #cbd5e1' }}
                >
                  <div className="skeleton skeleton-text" style={{ width: '55%', marginBottom: 8 }} />
                  <div className="skeleton skeleton-text" style={{ width: '85%' }} />
                </div>
              ))}
            </div>
          ) : selectedTopics.length ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(auto-fill, minmax(280px, 1fr))',
                gap: 12,
              }}
            >
              {selectedTopics.map((topic) => (
                <div
                  key={topic._id || topic.id}
                  className="page-panel"
                  style={{
                    padding: 12,
                    margin: 0,
                    background: '#f8fafc',
                    border: '1px solid #cbd5e1',
                  }}
                >
                  <strong>{topic.title}</strong>

                  <div
                    style={{
                      color: '#64748b',
                      fontSize: 13,
                      marginTop: 6,
                    }}
                  >
                    {topic.description ||
                      'This topic will shape the assessment questions.'}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p
              style={{
                color: '#64748b',
                margin: 0,
              }}
            >
              Choose at least one topic to continue.
            </p>
          )}

          <div
            style={{
              marginTop: 20,
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <button
              className="primary-button"
              type="button"
              onClick={handleContinue}
              disabled={submitting || !selectedIds.length}
            >
              {submitting
                ? 'Preparing questions...'
                : 'Continue'}
            </button>
          </div>
        </div>

        {/* All Topics Panel */}
        <div className="page-panel">
          <div
            className="page-header"
            style={{ marginBottom: 16 }}
          >
            <div>
              <h3 style={{ margin: 0 }}>
                Topics
              </h3>

              <p
                style={{
                  margin: '6px 0 0',
                  color: '#64748b',
                  fontSize: 14,
                }}
              >
                Select or remove topics based on your business priorities.
              </p>
            </div>
          </div>

          {loading ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: 12,
              }}
            >
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={`material-topic-skeleton-${index}`}
                  className="page-panel"
                  style={{ padding: 12, margin: 0, minHeight: '100px' }}
                >
                  <div className="skeleton skeleton-text" style={{ width: '60%', marginBottom: 10 }} />
                  <div className="skeleton skeleton-text" style={{ width: '95%', marginBottom: 6 }} />
                  <div className="skeleton skeleton-text" style={{ width: '80%', marginBottom: 16 }} />
                  <div className="skeleton skeleton-text" style={{ width: '40%' }} />
                </div>
              ))}
            </div>
          ) : topics.length === 0 ? (
            <p style={{ color: '#64748b' }}>
              No material topics are available.
            </p>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(auto-fill, minmax(280px, 1fr))',
                gap: 12,
              }}
            >
              {topics.map((topic) => {
                const topicId = topic._id || topic.id;
                const isSelected =
                  selectedIds.includes(topicId);

                return (
                  <button
                    key={topicId}
                    type="button"
                    className="page-panel"
                    style={{
                      textAlign: 'left',
                      padding: 12,
                      margin: 0,
                      cursor: 'pointer',
                      border: isSelected
                        ? '1px solid #0f766e'
                        : '1px solid #e2e8f0',
                      background: isSelected
                        ? '#f0fdf4'
                        : '#ffffff',
                      transition: 'all 0.2s',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      minHeight: '100px',
                    }}
                    onClick={() => toggleTopic(topicId)}
                  >
                    <div>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          gap: 8,
                        }}
                      >
                        <strong
                          style={{
                            color: '#0f172a',
                          }}
                        >
                          {topic.title}
                        </strong>

                        {topic.pillar && (
                          <span
                            style={{
                              fontSize: 11,
                              color: '#0f766e',
                              background: '#ccfbf1',
                              padding: '2px 6px',
                              borderRadius: 4,
                              textTransform: 'capitalize',
                              fontWeight: 600,
                            }}
                          >
                            {topic.pillar}
                          </span>
                        )}
                      </div>

                      {topic.description && (
                        <div
                          style={{
                            color: '#64748b',
                            fontSize: 13,
                            marginTop: 8,
                            lineHeight: 1.5,
                          }}
                        >
                          {topic.description}
                        </div>
                      )}
                    </div>

                  </button>
                );
              })}
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
            <button className="secondary-button" type="button" disabled={loading || page === 1} onClick={() => setPage((current) => current - 1)}>Previous</button>
            <span style={{ color: '#64748b', fontSize: 13 }}>Page {page} of {pagination.pages}</span>
            <button className="secondary-button" type="button" disabled={loading || page >= pagination.pages} onClick={() => setPage((current) => current + 1)}>Next</button>
          </div>
        </div>
      </div>
    </section>
  );
}