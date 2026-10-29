import { useEffect, useMemo, useState } from 'react';
import { assessmentApi } from '../../services/assessmentApi';
import PageHeader from '../platform/PageHeader';
import InfoTooltip from '../platform/InfoTooltip';
import { CHART_TOOLTIPS } from '../../data/tooltipData';

const pillarLabels = {
  environmental: 'Environmental',
  social: 'Social',
  governance: 'Governance',
};

const pillarTooltips = {
  environmental: CHART_TOOLTIPS.environmentalScore,
  social: CHART_TOOLTIPS.socialScore,
  governance: CHART_TOOLTIPS.governanceScore,
};

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pdfMessage, setPdfMessage] = useState('');

  useEffect(() => {
    let active = true;

    const loadAnalytics = async () => {
      try {
        const response = await assessmentApi.fetchDashboardAnalytics();
        if (!active) return;
        setAnalytics(response?.data || response || null);
        setError('');
      } catch (err) {
        if (!active) return;
        setError(err.message);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadAnalytics();

    return () => {
      active = false;
    };
  }, []);

  const pillarScores = useMemo(() => {
    const scores = analytics?.pillarScores || {};
    return Object.entries(pillarLabels).map(([key, label]) => ({ key, label, score: scores[key] ?? 0 }));
  }, [analytics]);

  const handleDownloadReport = async () => {
    setPdfMessage('');
    try {
      const response = await assessmentApi.downloadPdfReport();
      const blob = response?.data || response;
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'ESG_Report.pdf';
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      setPdfMessage('Report downloaded successfully.');
    } catch (err) {
      if (err?.status === 400) {
        setPdfMessage('Please complete your assessment first to generate a report.');
        return;
      }
      setPdfMessage(err.message || 'Unable to download the report.');
    }
  };

  return (
    <section className="analytics-dashboard">
      <PageHeader
        title="Assessment analytics"
        description="Review your latest assessment results and the actions that matter most for your ESG roadmap."
      />
      {error ? <p className="error-line">{error}</p> : null}
      {pdfMessage ? <p className="status-line">{pdfMessage}</p> : null}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <button className="primary-button" type="button" onClick={handleDownloadReport}>
          Download ESG Report (PDF)
        </button>
      </div>

      {loading ? (
        <p style={{ color: '#64748b' }}>Loading analytics...</p>
      ) : !analytics ? (
        <p style={{ color: '#64748b' }}>No assessment analytics available yet.</p>
      ) : (
        <>
          <div className="metric-grid">
            {pillarScores.map((pillar) => (
              <div key={pillar.key} className="metric-card">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>{pillar.label}</span>
                  {pillarTooltips[pillar.key] && <InfoTooltip data={pillarTooltips[pillar.key]} title={pillar.label} />}
                </div>
                <strong>{pillar.score}%</strong>
              </div>
            ))}
          </div>

          <div className="analytics-section">
            <div className="page-panel analytics-panel">
              <div className="page-header" style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <h3 style={{ margin: 0 }}>Compliance gaps</h3>
                  <InfoTooltip data={CHART_TOOLTIPS.gapAnalysis} title="Compliance Gaps Rationale" />
                </div>
              </div>
              {(analytics.complianceGaps || []).length ? (
                <div style={{ display: 'grid', gap: 10 }}>
                  {analytics.complianceGaps.map((gap, index) => (
                    <div key={`${gap.question}-${index}`} className="analytics-card">
                      <strong>{gap.questionText}</strong>
                      <small>{gap.pillar}</small>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: '#64748b', margin: 0 }}>No compliance gaps identified.</p>
              )}
            </div>

            <div className="page-panel analytics-panel">
              <div className="page-header" style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <h3 style={{ margin: 0 }}>Strengths</h3>
                  <InfoTooltip data={CHART_TOOLTIPS.keyStrengths} title="ESG Strengths Rationale" />
                </div>
              </div>
              {(analytics.strengths || []).length ? (
                <div style={{ display: 'grid', gap: 10 }}>
                  {analytics.strengths.map((strength, index) => (
                    <div key={`${strength.question}-${index}`} className="analytics-card">
                      <strong>{strength.questionText}</strong>
                      <small>{strength.pillar}</small>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: '14px 12px', minHeight: 86, display: 'flex', alignItems: 'flex-start' }}>
                  <p style={{ color: '#64748b', margin: 0 }}>No strengths recorded.</p>
                </div>
              )}
            </div>
          </div>

          <div className="analytics-section">
            <div className="page-panel analytics-panel">
              <div className="page-header" style={{ marginBottom: 12 }}>
                <div>
                  <h3 style={{ margin: 0 }}>Prioritized KPIs</h3>
                </div>
              </div>
              {(analytics.kpisToTrack || []).length ? (
                <div style={{ display: 'grid', gap: 10 }}>
                  {analytics.kpisToTrack.map((kpi, index) => (
                    <div key={`${kpi.kpi || kpi.name}-${index}`} className="analytics-card">
                      <strong>{kpi.name}</strong>
                      <small>{kpi.pillar} • {kpi.unit || 'N/A'}</small>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: '#64748b', margin: 0 }}>No recommended KPIs available.</p>
              )}
            </div>

            <div className="page-panel analytics-panel">
              <div className="page-header" style={{ marginBottom: 12 }}>
                <div>
                  <h3 style={{ margin: 0 }}>Priority topics</h3>
                </div>
              </div>
              {(analytics.prioritizedMaterialTopics || []).length ? (
                <div style={{ display: 'grid', gap: 10 }}>
                  {analytics.prioritizedMaterialTopics.map((topic, index) => (
                    <div key={`${topic.materialTopic || topic.title}-${index}`} className="analytics-card">
                      <strong>{topic.title}</strong>
                      <small>{topic.pillar}</small>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: '#64748b', margin: 0 }}>No prioritized topics available.</p>
              )}
            </div>
          </div>
        </>
      )}
    </section>
  );
}
