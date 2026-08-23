import { useEffect, useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { FileBarChart, Flag, Target, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/platform/PageHeader';
import { dashboardApi } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

const fallbackData = {
  totals: { kpis: 0, policies: 0, materialTopics: 0, reports: 0, activeObjectives: 0 },
  pillarScores: [
    { pillar: 'environmental', score: 0 },
    { pillar: 'social', score: 0 },
    { pillar: 'governance', score: 0 },
  ],
  materialTopics: [],
  goals: [],
  reports: [],
  recentActivities: [],
  notifications: [],
  recentAssessment: null,
  recommendedKpiCount: 0,
  recommendedKpis: [],
};

const formatActivityDate = (value) => {
  if (!value) return 'Recently';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Recently';

  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(fallbackData);
  const [error, setError] = useState('');

  useEffect(() => {
    dashboardApi
      .dashboard()
      .then((response) => setDashboard(response.data || fallbackData))
      .catch((err) => setError(err.message));
  }, []);

  const welcomeName = useMemo(() => user?.firstName || user?.fullName || 'there', [user]);
  const esgScore = dashboard.recentAssessment?.pillarScores?.overall ?? dashboard.recentAssessment?.scores?.overall ?? 0;
  const kpiCount = dashboard.recommendedKpiCount ?? 0;

  return (
    <section>
      <PageHeader
        title="Customer dashboard"
        description="Monitor ESG performance, material topics, policies, and reporting activity from one workspace."
      />
      {error ? <p className="error-line">{error}</p> : null}
      <div className="page-panel" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          <div>
            <h3 style={{ margin: '0 0 6px' }}>Welcome back, {welcomeName}</h3>
            <p style={{ margin: 0, color: '#64748b' }}>
              Your organization is tracking {kpiCount} KPIs and {dashboard.totals.materialTopics} material topics.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Link className="primary-button" to="/app/onboarding/questionnaire">Start questionnaire</Link>
            <Link className="primary-button" to="/app/analytics">View analytics</Link>
            <Link className="primary-button" to="/app/reports">Generate report</Link>
          </div>
        </div>
      </div>
      <div className="dashboard-summary-grid">
        <div className="metric-card"><span>ESG score</span><strong>{esgScore}</strong></div>
        <div className="metric-card"><span>KPIs</span><strong>{kpiCount}</strong></div>
        <div className="metric-card"><span>Active Objectives</span><strong>{dashboard.totals.activeObjectives ?? 0}</strong></div>
        <div className="metric-card"><span>Material Topics</span><strong>{dashboard.totals.materialTopics}</strong></div>
      </div>
      <div className="dashboard-workspace">
        <div className="dashboard-main-column">
          <div className="page-panel dashboard-chart-panel">
            <div className="page-header" style={{ marginBottom: 12 }}>
              <div><h3 style={{ margin: 0 }}>ESG Score Overview</h3></div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={dashboard.pillarScores}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="pillar" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="score" fill="#0f766e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="dashboard-lower-grid">
            <div className="page-panel">
              <div className="page-header" style={{ marginBottom: 12 }}>
                <div><h3 style={{ margin: 0 }}>Material topics overview</h3></div>
              </div>
              <div style={{ display: 'grid', gap: 10 }}>
                {(dashboard.materialTopics || []).length ? dashboard.materialTopics.slice(0, 5).map((topic) => (
                  <div key={topic._id || topic.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
                    <span>{topic.title}</span>
                    <span>{topic.impactScore ?? 0}/5</span>
                  </div>
                )) : <p style={{ margin: 0, color: '#64748b' }}>No material topics recorded.</p>}
              </div>
            </div>

            <div className="page-panel">
              <div className="page-header" style={{ marginBottom: 12 }}>
                <div><h3 style={{ margin: 0 }}>Recent activities</h3></div>
              </div>
              <ul style={{ margin: 0, paddingLeft: 16, display: 'grid', gap: 8 }}>
                {(dashboard.recentActivities || []).length ? dashboard.recentActivities.slice(0, 5).map((item) => (
                  <li key={`${item.type}-${item.source || item.label}`} style={{ color: '#334155' }}>
                    <strong>{item.label}</strong>
                    <div style={{ color: '#64748b', fontSize: 13 }}>{item.detail} - {formatActivityDate(item.occurredAt)}</div>
                  </li>
                )) : <li style={{ color: '#64748b' }}>No recent activity yet.</li>}
              </ul>
            </div>
          </div>
        </div>

        <aside className="dashboard-side-column">
          <div className="page-panel">
            <div className="page-header" style={{ marginBottom: 12 }}>
              <div><h3 style={{ margin: 0 }}>Active goals</h3></div>
            </div>
            <div style={{ display: 'grid', gap: 10 }}>
              {(dashboard.goals || []).length ? dashboard.goals.map((goal) => (
                <div key={goal._id || goal.id || goal.name} className="dashboard-list-item">
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 8 }}>
                    <strong>{goal.name || goal.title}</strong>
                    <span>{goal.progress ?? 0}%</span>
                  </div>
                  <div style={{ height: 8, background: '#e2e8f0', borderRadius: 999 }}>
                    <div style={{ width: `${goal.progress ?? 0}%`, height: '100%', background: '#0f766e', borderRadius: 999 }} />
                  </div>
                </div>
              )) : <p style={{ margin: 0, color: '#64748b' }}>No active goals recorded.</p>}
            </div>
          </div>

          <div className="page-panel">
            <div className="page-header" style={{ marginBottom: 12 }}>
              <div><h3 style={{ margin: 0 }}>Quick actions</h3></div>
            </div>
            <div style={{ display: 'grid', gap: 10 }}>
              <Link className="icon-text-button dashboard-action" to="/app/kpis"><TrendingUp size={16} />View KPIs</Link>
              <Link className="icon-text-button dashboard-action" to="/app/objectives"><Target size={16} />Manage objectives</Link>
              <Link className="icon-text-button dashboard-action" to="/app/material-topics"><Flag size={16} />Review topics</Link>
              <Link className="icon-text-button dashboard-action" to="/app/reports"><FileBarChart size={16} />Open reports</Link>
            </div>
          </div>

          <div className="page-panel">
            <div className="page-header" style={{ marginBottom: 12 }}>
              <div><h3 style={{ margin: 0 }}>Notifications</h3></div>
            </div>
            <div style={{ display: 'grid', gap: 10 }}>
              {(dashboard.notifications || []).length ? dashboard.notifications.slice(0, 4).map((notification) => (
                <div key={notification._id || notification.id} className="dashboard-list-item">
                  <strong>{notification.title || 'New update'}</strong>
                  <div style={{ color: '#64748b', fontSize: 13 }}>{notification.message || 'Open the latest activity to review details.'}</div>
                </div>
              )) : <p style={{ margin: 0, color: '#64748b' }}>No notifications right now.</p>}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
