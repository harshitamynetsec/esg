import { useEffect, useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Bell, ClipboardCheck, FileBarChart, Flag, Gauge, Shield, Target, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/platform/PageHeader';
import { dashboardApi, getCachedResponse } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import './DashboardPage.css';

const PILLAR_COLORS = { environmental: '#16a34a', social: '#2563eb', governance: '#7c3aed' };
const STATUS_COLORS = { onTrack: '#16a34a', needsAttention: '#f59e0b' };
const ACTIVITY_ICONS = {
  assessment: ClipboardCheck,
  kpi_history: TrendingUp,
  report: FileBarChart,
  policy: Shield,
};

const progressTier = (value) => {
  if (value >= 75) return 'progress-high';
  if (value >= 40) return 'progress-medium';
  return 'progress-low';
};

const fallbackData = {
  totals: { kpis: 0, policies: 0, materialTopics: 0, reports: 0, activeObjectives: 0 },
  pillarScores: [
    { pillar: 'environmental', score: 0 },
    { pillar: 'social', score: 0 },
    { pillar: 'governance', score: 0 },
  ],
  materialTopics: [],
  goals: [],
  objectives: [],
  kpiSummary: { total: 0, onTrack: 0, needsAttention: 0, byPillar: [] },
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
    const cached = getCachedResponse('dashboard');
    if (cached) setDashboard(cached.data || fallbackData);
    dashboardApi
      .dashboardCached()
      .then((response) => setDashboard(response.data || fallbackData))
      .catch((err) => setError(err.message));
  }, []);

  const welcomeName = useMemo(() => user?.firstName || user?.fullName || 'there', [user]);
  const esgScore = dashboard.recentAssessment?.pillarScores?.overall ?? dashboard.recentAssessment?.scores?.overall ?? 0;
  const kpiCount = dashboard.recommendedKpiCount ?? 0;

  const pillarPieData = useMemo(
    () => (dashboard.pillarScores || []).map((row) => ({ ...row, color: PILLAR_COLORS[row.pillar] || '#0f766e' })),
    [dashboard.pillarScores],
  );
  const hasPillarScore = pillarPieData.some((row) => row.score > 0);

  const kpiSummary = dashboard.kpiSummary || { total: 0, onTrack: 0, needsAttention: 0, byPillar: [] };
  const kpiStatusData = [
    { name: 'On track', value: kpiSummary.onTrack, color: STATUS_COLORS.onTrack },
    { name: 'Needs attention', value: kpiSummary.needsAttention, color: STATUS_COLORS.needsAttention },
  ];
  const onTrackPercent = kpiSummary.total ? Math.round((kpiSummary.onTrack / kpiSummary.total) * 100) : 0;

  return (
    <section>
      <PageHeader
        title="Customer dashboard"
        description="Monitor ESG performance, material topics, policies, and reporting activity from one workspace."
      />
      {error ? <p className="error-line">{error}</p> : null}
      <div className="page-panel dashboard-hero" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          <div>
            <p className="dashboard-hero-kicker">{user?.organization?.name || 'Organization Workspace'}</p>
            <h3>Welcome back, {welcomeName}</h3>
            <p>Your organization is tracking {kpiCount} KPIs and {dashboard.totals.materialTopics} material topics.</p>
          </div>
          <div className="dashboard-hero-actions">
            <Link className="primary-button" to="/app/onboarding/questionnaire">Start questionnaire</Link>
            <Link className="primary-button" to="/app/analytics">View analytics</Link>
            <Link className="primary-button" to="/app/reports">Generate report</Link>
          </div>
        </div>
      </div>
      <div className="dashboard-summary-grid">
        <div className="metric-card dashboard-stat-card stat-teal">
          <div className="dashboard-stat-icon"><Gauge size={20} /></div>
          <div className="dashboard-stat-body"><span>ESG score</span><strong>{esgScore}</strong></div>
        </div>
        <div className="metric-card dashboard-stat-card stat-blue">
          <div className="dashboard-stat-icon"><TrendingUp size={20} /></div>
          <div className="dashboard-stat-body"><span>KPIs</span><strong>{kpiCount}</strong></div>
        </div>
        <div className="metric-card dashboard-stat-card stat-purple">
          <div className="dashboard-stat-icon"><Target size={20} /></div>
          <div className="dashboard-stat-body"><span>Active Objectives</span><strong>{dashboard.totals.activeObjectives ?? 0}</strong></div>
        </div>
        <div className="metric-card dashboard-stat-card stat-amber">
          <div className="dashboard-stat-icon"><Flag size={20} /></div>
          <div className="dashboard-stat-body"><span>Material Topics</span><strong>{dashboard.totals.materialTopics}</strong></div>
        </div>
      </div>

      <div className="dashboard-chart-row">
        <div className="page-panel">
          <div className="page-header" style={{ marginBottom: 12 }}>
            <div><h3 style={{ margin: 0 }}>ESG Score by Pillar</h3></div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={pillarPieData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="pillar" tickFormatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)} />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                {pillarPieData.map((row) => (
                  <Cell key={row.pillar} fill={row.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="page-panel">
          <div className="page-header" style={{ marginBottom: 12 }}>
            <div><h3 style={{ margin: 0 }}>Pillar Composition</h3></div>
          </div>
          {hasPillarScore ? (
            <>
              <div className="dashboard-donut-wrap">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pillarPieData} dataKey="score" nameKey="pillar" innerRadius={55} outerRadius={80} paddingAngle={3} strokeWidth={0}>
                      {pillarPieData.map((row) => (
                        <Cell key={row.pillar} fill={row.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="dashboard-donut-center">
                  <strong>{esgScore}</strong>
                  <span>Overall</span>
                </div>
              </div>
              <div className="dashboard-legend-list">
                {pillarPieData.map((row) => (
                  <div key={row.pillar} className="dashboard-legend-row">
                    <span className="dashboard-legend-dot" style={{ background: row.color }} />
                    <span style={{ textTransform: 'capitalize' }}>{row.pillar}</span>
                    <strong>{row.score}</strong>
                  </div>
                ))}
              </div>
            </>
          ) : <p style={{ margin: 0, color: '#64748b' }}>Complete an assessment to see pillar scores.</p>}
        </div>

        <div className="page-panel">
          <div className="page-header" style={{ marginBottom: 12 }}>
            <div><h3 style={{ margin: 0 }}>KPI Status</h3></div>
          </div>
          {kpiSummary.total ? (
            <>
              <div className="dashboard-donut-wrap">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={kpiStatusData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={80} paddingAngle={3} strokeWidth={0}>
                      {kpiStatusData.map((row) => (
                        <Cell key={row.name} fill={row.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="dashboard-donut-center">
                  <strong>{onTrackPercent}%</strong>
                  <span>On track</span>
                </div>
              </div>
              <div className="dashboard-legend-list">
                {kpiStatusData.map((row) => (
                  <div key={row.name} className="dashboard-legend-row">
                    <span className="dashboard-legend-dot" style={{ background: row.color }} />
                    <span>{row.name}</span>
                    <strong>{row.value}</strong>
                  </div>
                ))}
              </div>
            </>
          ) : <p style={{ margin: 0, color: '#64748b' }}>No KPIs tracked yet.</p>}
        </div>
      </div>

      <div className="dashboard-workspace">
        <div className="dashboard-main-column">
          <div className="dashboard-lower-grid">
            <div className="page-panel">
              <div className="page-header" style={{ marginBottom: 12 }}>
                <div><h3 style={{ margin: 0 }}>Material topics overview</h3></div>
              </div>
              <div style={{ display: 'grid', gap: 10 }}>
                {(dashboard.materialTopics || []).length ? dashboard.materialTopics.slice(0, 5).map((topic) => {
                  const score = topic.impactScore ?? 0;
                  const color = PILLAR_COLORS[topic.pillar] || '#0f766e';
                  return (
                    <div key={topic._id || topic.id} className="dashboard-topic-row">
                      <span className="dashboard-legend-dot" style={{ background: color }} />
                      <span className="dashboard-topic-name">{topic.title}</span>
                      <div className="dashboard-topic-track">
                        <div className="dashboard-topic-fill" style={{ width: `${(score / 5) * 100}%`, background: color }} />
                      </div>
                      <span className="dashboard-topic-score">{score}/5</span>
                    </div>
                  );
                }) : <p style={{ margin: 0, color: '#64748b' }}>No material topics recorded.</p>}
              </div>
            </div>

            <div className="page-panel">
              <div className="page-header" style={{ marginBottom: 12 }}>
                <div><h3 style={{ margin: 0 }}>Recent activities</h3></div>
              </div>
              <div style={{ display: 'grid', gap: 12 }}>
                {(dashboard.recentActivities || []).length ? dashboard.recentActivities.slice(0, 5).map((item) => {
                  const Icon = ACTIVITY_ICONS[item.type] || Bell;
                  return (
                    <div key={`${item.type}-${item.source || item.label}`} className="dashboard-activity-row">
                      <div className={`dashboard-activity-icon activity-${item.type}`}><Icon size={14} /></div>
                      <div>
                        <strong style={{ color: '#334155', fontSize: 14 }}>{item.label}</strong>
                        <div style={{ color: '#64748b', fontSize: 13 }}>{item.detail} - {formatActivityDate(item.occurredAt)}</div>
                      </div>
                    </div>
                  );
                }) : <p style={{ margin: 0, color: '#64748b' }}>No recent activity yet.</p>}
              </div>
            </div>
          </div>
        </div>

        <aside className="dashboard-side-column">
          <div className="page-panel">
            <div className="page-header" style={{ marginBottom: 12 }}>
              <div><h3 style={{ margin: 0 }}>Active goals</h3></div>
            </div>
            <div style={{ display: 'grid', gap: 10 }}>
              {(dashboard.goals || []).length ? dashboard.goals.map((goal) => {
                const progress = goal.progress ?? 0;
                return (
                  <div key={goal._id || goal.id || goal.name} className="dashboard-list-item">
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 8 }}>
                      <strong>{goal.name || goal.title}</strong>
                      <span>{progress}%</span>
                    </div>
                    <div style={{ height: 8, background: '#e2e8f0', borderRadius: 999 }}>
                      <div className={progressTier(progress)} style={{ width: `${progress}%`, height: '100%', borderRadius: 999 }} />
                    </div>
                  </div>
                );
              }) : <p style={{ margin: 0, color: '#64748b' }}>No active goals recorded.</p>}
            </div>
          </div>

          <div className="page-panel">
            <div className="page-header" style={{ marginBottom: 12 }}>
              <div><h3 style={{ margin: 0 }}>Active objectives</h3></div>
            </div>
            <div style={{ display: 'grid', gap: 10 }}>
              {(dashboard.objectives || []).length ? dashboard.objectives.map((objective) => (
                <div key={objective._id || objective.id} className="dashboard-list-item">
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start' }}>
                    <strong>{objective.title}</strong>
                    {objective.sdgNumber ? <span className="dashboard-sdg-chip">SDG {objective.sdgNumber}</span> : null}
                  </div>
                  {objective.targetDate ? (
                    <div style={{ color: '#64748b', fontSize: 13, marginTop: 4 }}>
                      Target: {formatActivityDate(objective.targetDate)}
                    </div>
                  ) : null}
                </div>
              )) : <p style={{ margin: 0, color: '#64748b' }}>No active objectives yet.</p>}
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
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Bell size={16} /><h3 style={{ margin: 0 }}>Notifications</h3></div>
            </div>
            <div style={{ display: 'grid', gap: 10 }}>
              {(dashboard.notifications || []).length ? dashboard.notifications.slice(0, 4).map((notification) => (
                <div key={notification._id || notification.id} className="dashboard-list-item" style={{ display: 'flex', gap: 10 }}>
                  <span className="dashboard-notification-dot" />
                  <div>
                    <strong>{notification.title || 'New update'}</strong>
                    <div style={{ color: '#64748b', fontSize: 13 }}>{notification.message || 'Open the latest activity to review details.'}</div>
                  </div>
                </div>
              )) : <p style={{ margin: 0, color: '#64748b' }}>No notifications right now.</p>}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
