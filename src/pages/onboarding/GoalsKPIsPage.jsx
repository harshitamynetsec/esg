import { useCallback, useEffect, useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Plus, Search } from 'lucide-react';
import PageHeader from '../../components/platform/PageHeader';
import { dashboardApi, getCachedResponse, getResourceCacheKey, resourceApi } from '../../services/api';

export default function GoalsKPIsPage() {
  const api = useMemo(() => resourceApi('kpis'), []);
  const [items, setItems] = useState([]);
  const [recommendedKpis, setRecommendedKpis] = useState([]);
  const [loadingRecommended, setLoadingRecommended] = useState(true);
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

  const loadData = useCallback(async () => {
    try {
      const params = { page, limit: 15 };
      const cacheKey = getResourceCacheKey('kpis', params);
      const cachedKpis = getCachedResponse(cacheKey);
      if (cachedKpis) {
        setItems(cachedKpis.data || []);
        setPagination(cachedKpis.meta || { page, pages: 1, total: cachedKpis.data?.length || 0 });
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
      setLoadingRecommended(false);
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

  return (
    <section>
      <PageHeader title="KPI Management" description="Review KPI performance, trends, and targets across the organization." />
      {successMsg ? <p className="status-line" style={{ marginBottom: 12 }}>{successMsg}</p> : null}
      {error ? <p className="error-line" style={{ marginBottom: 12 }}>{error}</p> : null}
      <div className="page-panel" style={{ marginBottom: 16 }}>
        <div className="field" style={{ maxWidth: 320 }}>
          <span>Search KPIs</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Search size={16} />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by name, code, or SDG" />
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div className="page-panel">
          <div className="page-header" style={{ marginBottom: 12 }}>
            <div>
              <h3 style={{ margin: 0 }}>KPI list</h3>
              <p style={{ margin: '6px 0 0', color: '#64748b', fontSize: 14 }}>
                Select a KPI to review its progress and target trend.
              </p>
            </div>
          </div>
          {visibleItems.length ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: 12,
              }}
            >
              {visibleItems.map((item) => {
                const itemId = item._id || item.id;
                const isSelected = selected && (selected._id || selected.id) === itemId;

                return (
                  <button
                    key={itemId}
                    type="button"
                    className="page-panel"
                    style={{
                      textAlign: 'left',
                      padding: 12,
                      margin: 0,
                      cursor: 'pointer',
                      border: isSelected ? '1px solid #0f766e' : '1px solid #e2e8f0',
                      background: isSelected ? '#f0fdf4' : '#ffffff',
                      transition: 'all 0.2s',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      minHeight: 100,
                    }}
                    onClick={() => setSelected(item)}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                        <strong style={{ color: '#0f172a' }}>{item.name}</strong>
                        {item.pillar ? (
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
                            {item.pillar}
                          </span>
                        ) : null}
                      </div>
                      {item.description ? (
                        <div style={{ color: '#64748b', fontSize: 13, marginTop: 8, lineHeight: 1.5 }}>
                          {item.description}
                        </div>
                      ) : null}
                    </div>
                    <div style={{ color: '#64748b', fontSize: 13, marginTop: 12 }}>
                      Current {item.currentValue ?? 0}
                      {' / '}
                      Target {item.targetValue ?? 0}
                      {item.unit ? ` ${item.unit}` : ''}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <p style={{ margin: 0, color: '#64748b' }}>No KPIs are available.</p>
          )}
          {pagination.pages > 1 ? (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
              <button className="secondary-button" type="button" disabled={page === 1} onClick={() => setPage((current) => current - 1)}>Previous</button>
              <span style={{ color: '#64748b', fontSize: 13 }}>Page {page} of {pagination.pages}</span>
              <button className="secondary-button" type="button" disabled={page >= pagination.pages} onClick={() => setPage((current) => current + 1)}>Next</button>
            </div>
          ) : null}
        </div>

        <div className="page-panel">
          {selected ? (
            <>
              <div className="page-header" style={{ marginBottom: 12 }}>
                <div>
                  <h3 style={{ margin: 0 }}>{selected.name}</h3>
                  <p style={{ margin: '6px 0 0', color: '#64748b', fontSize: 14 }}>
                    Review the selected KPI values and recent movement.
                  </p>
                </div>
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                  gap: 12,
                  marginBottom: 16,
                }}
              >
                <div className="metric-card"><span>Current</span><strong>{selected.currentValue}</strong></div>
                <div className="metric-card"><span>Target</span><strong>{selected.targetValue}</strong></div>
                <div className="metric-card"><span>Unit</span><strong>{selected.unit}</strong></div>
              </div>
              <div style={{ height: 260 }}>
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
          ) : <p style={{ margin: 0, color: '#64748b' }}>No KPI selected.</p>}
        </div>

        <div className="page-panel">
          <div className="page-header" style={{ marginBottom: 16 }}>
            <div>
              <h3 style={{ margin: 0 }}>Recommended KPIs</h3>
              <p style={{ margin: '6px 0 0', color: '#64748b', fontSize: 14 }}>
                Recommended KPIs aligned with your organization's latest assessment, grouped by SDG.
              </p>
            </div>
          </div>
          {groupedRecommendedKpis.length ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {groupedRecommendedKpis.map((group) => (
                <div key={group.sdgNumber || group.sdgName} style={{ background: '#f8fafc', padding: 16, borderRadius: 8, border: '1px solid #e2e8f0' }}>
                  <h4 style={{ margin: '0 0 12px', color: '#0f766e', fontSize: 15, display: 'flex', alignItems: 'center', gap: 8 }}>
                    {group.sdgNumber ? (
                      <span style={{ background: '#0f766e', color: '#ffffff', padding: '2px 8px', borderRadius: 4, fontSize: 12, fontWeight: 700 }}>
                        SDG {group.sdgNumber}
                      </span>
                    ) : null}
                    {group.sdgName ? group.sdgName : `SDG ${group.sdgNumber}`}
                  </h4>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                      gap: 12,
                    }}
                  >
                    {group.kpis.map((kpi) => (
                      <div
                        key={kpi.code || kpi.name}
                        style={{
                          background: '#ffffff',
                          padding: 14,
                          borderRadius: 6,
                          border: '1px solid #cbd5e1',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          gap: 12,
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                            <strong style={{ color: '#0f172a', fontSize: 14 }}>{kpi.name}</strong>
                            <span
                              style={{
                                fontSize: 11,
                                color: '#0369a1',
                                background: '#e0f2fe',
                                padding: '2px 6px',
                                borderRadius: 4,
                                fontWeight: 600,
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {kpi.code}
                            </span>
                          </div>
                          {kpi.description ? (
                            <p style={{ margin: '6px 0 0', color: '#64748b', fontSize: 12, lineHeight: 1.4 }}>
                              {kpi.description}
                            </p>
                          ) : null}
                        </div>
                        <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 8, display: 'flex', flexDirection: 'column', gap: 8 }}>
                          <div style={{ display: 'grid', gap: 4, fontSize: 12, color: '#475569' }}>
                            <div>
                              <strong>Target:</strong> {kpi.target || 'N/A'}
                            </div>
                            <div>
                              <strong>Unit:</strong> {kpi.unit || 'N/A'}
                            </div>
                          </div>
                          <button
                            type="button"
                            className="primary-button"
                            style={{ padding: '6px 12px', fontSize: 13, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
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
            <p style={{ margin: 0, color: '#64748b' }}>
              {loadingRecommended ? 'Loading recommended KPIs...' : 'No recommended KPIs available.'}
            </p>
          )}
        </div>
      </div>

      {activeTemplate ? (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: 16,
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: 8,
              padding: 24,
              maxWidth: 520,
              width: '100%',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ margin: 0, color: '#0f172a' }}>Add Recommended KPI</h3>
                <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 13 }}>
                  Configure required metrics and activate this template for your organization.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTemplate(null)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b', fontSize: 18 }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateFromTemplate} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
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
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 14 }}
                />
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <label className="field">
                  <span>SDG Alignment</span>
                  <input type="text" value={formData.sdgInfo} disabled style={{ background: '#f1f5f9', color: '#475569' }} />
                </label>

                <label className="field">
                  <span>Unit *</span>
                  <input type="text" value={formData.unit} onChange={(e) => setFormData({ ...formData, unit: e.target.value })} required />
                </label>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
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

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
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

