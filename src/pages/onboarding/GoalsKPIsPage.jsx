import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Plus, Search } from 'lucide-react';
import PageHeader from '../../components/platform/PageHeader';
import { dashboardApi, getCachedResponse, getResourceCacheKey, resourceApi } from '../../services/api';
import './GoalsKPIsPage.css';

export default function GoalsKPIsPage() {
  const api = useMemo(() => resourceApi('kpis'), []);
  const [items, setItems] = useState([]);
  const [recommendedKpis, setRecommendedKpis] = useState([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [activeTemplate, setActiveTemplate] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    unit: '',
    sdgInfo: '',
    pillar: '',
    targetValue: '',
    frequency: 'quarterly',
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(() => !getCachedResponse(getResourceCacheKey('kpis', { page: 1, limit: 15 })));

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 15 };
      const cacheKey = getResourceCacheKey('kpis', params);
      const cachedKpis = getCachedResponse(cacheKey);
      if (cachedKpis) {
        setItems(cachedKpis.data || []);
        setPagination(cachedKpis.meta || { page, pages: 1, total: cachedKpis.data?.length || 0 });
        setLoading(false);
      }
      const [kpisRes, dashRes] = await Promise.all([
        api.listCached(params),
        dashboardApi.dashboardCached(),
      ]);
      const loadedItems = kpisRes.data || [];
      setItems(loadedItems);
      setPagination(kpisRes.meta || { page, pages: 1, total: loadedItems.length });
      if (loadedItems.length && !selected) {
        setSelected(loadedItems[0]);
      }
      setRecommendedKpis(dashRes.data?.recommendedKpis || []);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [api, page, selected]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleOpenAddModal = (template) => {
    setActiveTemplate(template);
    setFormError('');
    setFormData({
      name: template.name || '',
      description: template.description || '',
      unit: template.unit || 'percentage',
      sdgInfo: template.sdgNumber ? `SDG ${template.sdgNumber}: ${template.sdgName || ''}` : 'N/A',
      pillar: '',
      targetValue: '',
      frequency: 'quarterly',
    });
  };

  const handleCreateFromTemplate = async (event) => {
    event.preventDefault();
    if (!formData.pillar || formData.targetValue === '' || !formData.frequency) {
      setFormError('Please select a pillar, enter a numeric target value, and choose a tracking frequency.');
      return;
    }

    setSubmitting(true);
    setFormError('');
    try {
      await api.create({
        name: formData.name,
        description: formData.description,
        unit: formData.unit || 'percentage',
        pillar: formData.pillar,
        targetValue: Number(formData.targetValue),
        frequency: formData.frequency,
        currentValue: 0,
        baselineValue: 0,
      });
      setActiveTemplate(null);
      setSuccessMsg(`KPI "${formData.name}" added to active KPIs successfully.`);
      await loadData();
    } catch (err) {
      setFormError(err.message || 'Failed to create KPI');
    } finally {
      setSubmitting(false);
    }
  };

  const visibleItems = useMemo(() => {
    const query = search.toLowerCase();
    return items.filter((item) => [item.name, item.pillar, item.unit].some((value) => (value || '').toLowerCase().includes(query)));
  }, [items, search]);

  const visibleRecommendedKpis = useMemo(() => {
    const query = search.toLowerCase().trim();
    if (!query) return recommendedKpis;
    return recommendedKpis.filter((kpi) =>
      [kpi.name, kpi.code, kpi.target, kpi.unit, kpi.sdgName, String(kpi.sdgNumber)]
        .some((val) => (val || '').toLowerCase().includes(query))
    );
  }, [recommendedKpis, search]);

  const groupedRecommendedKpis = useMemo(() => {
    const groups = {};
    (visibleRecommendedKpis || []).forEach((kpi) => {
      const sdgNum = kpi.sdgNumber || 0;
      const key = sdgNum ? `sdg-${sdgNum}` : 'other';
      if (!groups[key]) {
        groups[key] = {
          sdgNumber: kpi.sdgNumber,
          sdgName: kpi.sdgName,
          kpis: [],
        };
      }
      groups[key].kpis.push(kpi);
    });
    return Object.values(groups).sort((a, b) => (a.sdgNumber || 0) - (b.sdgNumber || 0));
  }, [visibleRecommendedKpis]);

  useEffect(() => {
    if (!selected && visibleItems[0]) setSelected(visibleItems[0]);
  }, [selected, visibleItems]);

  const selectedTrend = useMemo(() => {
    const base = Number(selected?.currentValue || 0);
    const target = Number(selected?.targetValue || 0);
    return [
      { month: 'Jan', value: Math.max(0, base - 10) },
      { month: 'Feb', value: Math.max(0, base - 5) },
      { month: 'Mar', value: base },
      { month: 'Apr', value: Math.min(target || base, base + 5) },
      { month: 'May', value: Math.min(target || base, base + 10) },
    ];
  }, [selected]);

  const summaryStats = useMemo(() => {
    const total = pagination.total || items.length;
    const onTrack = items.filter((item) => Number(item.targetValue || 0) > 0 && Number(item.currentValue || 0) >= Number(item.targetValue || 0)).length;
    const needsAttention = items.length ? items.length - onTrack : 0;
    const progressValues = items
      .filter((item) => Number(item.targetValue || 0) > 0)
      .map((item) => Math.min(100, (Number(item.currentValue || 0) / Number(item.targetValue || 0)) * 100));
    const avgProgress = progressValues.length
      ? Math.round(progressValues.reduce((sum, value) => sum + value, 0) / progressValues.length)
      : 0;
    return { total, onTrack, needsAttention, avgProgress };
  }, [items, pagination.total]);

  const getProgress = (item) => {
    const target = Number(item?.targetValue || 0);
    const current = Number(item?.currentValue || 0);
    if (!target) return 0;
    return Math.min(100, Math.max(0, (current / target) * 100));
  };

  const selectedProgress = selected ? Math.round(getProgress(selected)) : 0;

  return (
    <section>
      <PageHeader
        title="KPI Management"
        description="Review KPI performance, trends, and targets across the organization."
        action={<Link to="/app/kpis/add" className="primary-button"><Plus size={16} /> Add KPI</Link>}
      />
      {successMsg ? <p className="status-line" style={{ marginBottom: 12 }}>{successMsg}</p> : null}
      {error ? <p className="error-line" style={{ marginBottom: 12 }}>{error}</p> : null}

      <div className="kpi-toolbar">
        <div className="kpi-search-field">
          <Search size={16} />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by name, code, or SDG" />
        </div>
      </div>

      <div className="kpi-summary-grid">
        {loading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <div key={`kpi-stat-skeleton-${index}`} className="metric-card">
              <div className="skeleton skeleton-text" style={{ width: '50%', marginBottom: 10 }} />
              <div className="skeleton skeleton-text" style={{ width: '30%', height: 22 }} />
            </div>
          ))
        ) : (
          <>
            <div className="metric-card"><span>Total KPIs</span><strong>{summaryStats.total}</strong></div>
            <div className="metric-card"><span>On Track</span><strong>{summaryStats.onTrack}</strong></div>
            <div className="metric-card"><span>Needs Attention</span><strong>{summaryStats.needsAttention}</strong></div>
            <div className="metric-card"><span>Avg. Progress</span><strong>{summaryStats.avgProgress}%</strong></div>
          </>
        )}
      </div>

      <div className="kpi-workspace" style={{ marginBottom: 20 }}>
        <div className="page-panel kpi-list-panel">
          <div className="kpi-panel-heading">
            <h3>KPI list</h3>
            <p>Select a KPI to review its progress and target trend.</p>
          </div>
          {loading ? (
            <div className="kpi-list">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={`kpi-row-skeleton-${index}`} className="kpi-row skeleton-row" style={{ cursor: 'default' }}>
                  <div className="kpi-row-title" style={{ flex: '0 0 40%' }}>
                    <div className="skeleton skeleton-text" style={{ width: '100%' }} />
                  </div>
                  <div className="kpi-row-progress">
                    <div className="skeleton" style={{ flex: 1, height: 6, borderRadius: 999 }} />
                    <div className="skeleton skeleton-text" style={{ width: 60 }} />
                  </div>
                </div>
              ))}
            </div>
          ) : visibleItems.length ? (
            <div className="kpi-list">
              {visibleItems.map((item) => {
                const itemId = item._id || item.id;
                const isSelected = selected && (selected._id || selected.id) === itemId;
                const progress = getProgress(item);

                return (
                  <button
                    key={itemId}
                    type="button"
                    className={`kpi-row${isSelected ? ' is-selected' : ''}`}
                    onClick={() => setSelected(item)}
                  >
                    <div className="kpi-row-title">
                      <strong>{item.name}</strong>
                      {item.pillar ? <span className={`pillar-chip pillar-${item.pillar}`}>{item.pillar}</span> : null}
                    </div>
                    <div className={`kpi-row-progress${progress >= 100 ? ' is-complete' : ''}`}>
                      <div className="kpi-progress-track">
                        <div className="kpi-progress-fill" style={{ width: `${progress}%` }} />
                      </div>
                      <span className="kpi-row-value">
                        {item.currentValue ?? 0} / {item.targetValue ?? 0}{item.unit ? ` ${item.unit}` : ''}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="kpi-empty-panel">No KPIs are available.</p>
          )}
          <div className="kpi-pagination">
            <button className="secondary-button" type="button" disabled={loading || page === 1} onClick={() => setPage((current) => current - 1)}>Previous</button>
            <span>Page {page} of {pagination.pages}</span>
            <button className="secondary-button" type="button" disabled={loading || page >= pagination.pages} onClick={() => setPage((current) => current + 1)}>Next</button>
          </div>
        </div>

        <div className="page-panel kpi-detail-panel">
          {loading ? (
            <>
              <div className="skeleton skeleton-text" style={{ width: '55%', height: 18, marginBottom: 16 }} />
              <div className="kpi-detail-metrics">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={`kpi-detail-metric-skeleton-${index}`} className="metric-card">
                    <div className="skeleton skeleton-text" style={{ width: '60%', marginBottom: 10 }} />
                    <div className="skeleton skeleton-text" style={{ width: '35%', height: 20 }} />
                  </div>
                ))}
              </div>
              <div className="skeleton kpi-detail-chart" />
            </>
          ) : selected ? (
            <>
              <div className="kpi-detail-heading">
                <h3>{selected.name}</h3>
                {selected.pillar ? <span className={`pillar-chip pillar-${selected.pillar}`}>{selected.pillar}</span> : null}
              </div>
              {selected.description ? <p className="kpi-detail-description">{selected.description}</p> : null}
              <div className="kpi-detail-metrics">
                <div className="metric-card"><span>Current</span><strong>{selected.currentValue ?? 0}</strong></div>
                <div className="metric-card"><span>Target</span><strong>{selected.targetValue ?? 0}</strong></div>
                <div className="metric-card"><span>Progress</span><strong>{selectedProgress}%</strong></div>
              </div>
              <div className="kpi-detail-chart">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={selectedTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#0f766e" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>
          ) : <p className="kpi-empty-panel">No KPI selected.</p>}
        </div>
      </div>

      <div className="page-panel">
        <div className="kpi-panel-heading">
          <h3>Recommended KPIs</h3>
          <p>Recommended KPIs aligned with your organization's latest assessment, grouped by SDG.</p>
        </div>
        {loading ? (
          <div className="kpi-recommended-grid">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={`kpi-recommended-skeleton-${index}`} className="kpi-recommended-card">
                <div className="skeleton skeleton-text" style={{ width: '70%', marginBottom: 10 }} />
                <div className="skeleton skeleton-text" style={{ width: '90%', marginBottom: 6 }} />
                <div className="skeleton skeleton-text" style={{ width: '60%' }} />
              </div>
            ))}
          </div>
        ) : groupedRecommendedKpis.length ? (
          <div className="kpi-recommended-groups">
            {groupedRecommendedKpis.map((group) => (
              <div key={group.sdgNumber || group.sdgName} className="kpi-recommended-group">
                <h4 className="kpi-recommended-group-heading">
                  {group.sdgNumber ? <span className="kpi-sdg-badge">SDG {group.sdgNumber}</span> : null}
                  {group.sdgName ? group.sdgName : `SDG ${group.sdgNumber}`}
                </h4>
                <div className="kpi-recommended-grid">
                  {group.kpis.map((kpi) => (
                    <div key={kpi.code || kpi.name} className="kpi-recommended-card">
                      <div>
                        <div className="kpi-recommended-card-top">
                          <strong>{kpi.name}</strong>
                          <span className="kpi-recommended-code">{kpi.code}</span>
                        </div>
                        {kpi.description ? (
                          <p style={{ margin: '6px 0 0', color: '#64748b', fontSize: 12, lineHeight: 1.4 }}>
                            {kpi.description}
                          </p>
                        ) : null}
                      </div>
                      <div className="kpi-recommended-meta">
                        <div>
                          <div><strong>Target:</strong> {kpi.target || 'N/A'}</div>
                          <div><strong>Unit:</strong> {kpi.unit || 'N/A'}</div>
                        </div>
                        <button
                          type="button"
                          className="primary-button kpi-recommended-add"
                          onClick={() => handleOpenAddModal(kpi)}
                        >
                          <Plus size={14} /> Add KPI
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="kpi-empty-panel">No recommended KPIs available.</p>
        )}
      </div>

      {activeTemplate ? (
        <div className="kpi-modal-overlay">
          <div className="kpi-modal">
            <div className="kpi-modal-heading">
              <div>
                <h3>Add Recommended KPI</h3>
                <p>Configure required metrics and activate this template for your organization.</p>
              </div>
              <button type="button" className="kpi-modal-close" onClick={() => setActiveTemplate(null)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateFromTemplate} className="kpi-modal-form">
              <label className="field">
                <span>KPI Name *</span>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              </label>

              <label className="field">
                <span>Description</span>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                />
              </label>

              <div className="kpi-modal-row-2">
                <label className="field">
                  <span>SDG Alignment</span>
                  <input type="text" value={formData.sdgInfo} disabled style={{ background: '#f1f5f9', color: '#475569' }} />
                </label>

                <label className="field">
                  <span>Unit *</span>
                  <input type="text" value={formData.unit} onChange={(e) => setFormData({ ...formData, unit: e.target.value })} required />
                </label>
              </div>

              <div className="kpi-modal-row-3">
                <label className="field">
                  <span>Pillar *</span>
                  <select value={formData.pillar} onChange={(e) => setFormData({ ...formData, pillar: e.target.value })} required>
                    <option value="">Select pillar</option>
                    <option value="environmental">Environmental</option>
                    <option value="social">Social</option>
                    <option value="governance">Governance</option>
                  </select>
                </label>

                <label className="field">
                  <span>Target Value *</span>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={formData.targetValue}
                    onChange={(e) => setFormData({ ...formData, targetValue: e.target.value })}
                    placeholder="e.g. 100"
                    required
                  />
                </label>

                <label className="field">
                  <span>Frequency *</span>
                  <select value={formData.frequency} onChange={(e) => setFormData({ ...formData, frequency: e.target.value })} required>
                    <option value="">Select frequency</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="annually">Annually</option>
                  </select>
                </label>
              </div>

              {formError ? <p className="error-line" style={{ margin: 0 }}>{formError}</p> : null}

              <div className="kpi-modal-actions">
                <button type="button" className="secondary-button" onClick={() => setActiveTemplate(null)} disabled={submitting}>
                  Cancel
                </button>
                <button type="submit" className="primary-button" disabled={submitting}>
                  {submitting ? 'Creating...' : 'Confirm & Activate KPI'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </section>
  );
}

