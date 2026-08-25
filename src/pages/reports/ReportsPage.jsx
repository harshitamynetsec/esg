import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileBarChart } from 'lucide-react';
import PageHeader from '../../components/platform/PageHeader';
import { reportApi, resourceApi } from '../../services/api';

const REPORT_TYPES = [
  { value: 'esg_summary', label: 'ESG Summary' },
  { value: 'sdg_alignment', label: 'SDG Alignment' },
  { value: 'kpi_performance', label: 'KPI Performance' },
  { value: 'policy_compliance', label: 'Policy Compliance' },
];

const getCurrentQuarterRange = () => {
  const now = new Date();
  const quarter = Math.floor(now.getMonth() / 3);
  const start = new Date(now.getFullYear(), quarter * 3, 1);
  const end = new Date(now.getFullYear(), quarter * 3 + 3, 0);
  const toIso = (date) => date.toISOString().slice(0, 10);
  return { periodStart: toIso(start), periodEnd: toIso(end), quarter: quarter + 1, year: now.getFullYear() };
};

const emptyForm = () => {
  const { periodStart, periodEnd } = getCurrentQuarterRange();
  return { title: '', type: 'esg_summary', periodStart, periodEnd };
};

export default function ReportsPage() {
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const resource = useMemo(() => resourceApi('reports'), []);

  const loadHistory = useCallback(async () => {
    try {
      const response = await resource.list({ page, limit: 10, sort: '-createdAt' });
      setHistory(response.data || []);
      setPagination(response.meta || { page, pages: 1, total: response.data?.length || 0 });
    } catch (err) {
      setError(err.message);
    }
  }, [resource, page]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const generate = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setStatus('');
    setError('');
    try {
      await reportApi.generate(form);
      setStatus('Report generated successfully');
      setForm(emptyForm());
      setPage(1);
      await loadHistory();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const { quarter, year } = useMemo(() => getCurrentQuarterRange(), []);

  return (
    <section>
      <PageHeader title="Report Generation" description="Generate ESG, SDG alignment, KPI performance, and policy compliance reports from your organization's live data." />

      <div className="page-panel" style={{ marginBottom: 16 }}>
        <form className="form-grid" onSubmit={generate}>
          <label className="field">
            <span>Title</span>
            <input
              value={form.title}
              onChange={(event) => setForm({ ...form, title: event.target.value })}
              placeholder={`e.g., Q${quarter} ${year} ESG Summary`}
              required
            />
          </label>
          <label className="field">
            <span>Type</span>
            <select value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value })}>
              {REPORT_TYPES.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </label>
          <label className="field"><span>Period start</span><input type="date" value={form.periodStart} onChange={(event) => setForm({ ...form, periodStart: event.target.value })} required /></label>
          <label className="field"><span>Period end</span><input type="date" value={form.periodEnd} onChange={(event) => setForm({ ...form, periodEnd: event.target.value })} required /></label>
          <button className="primary-button" type="submit" disabled={submitting}>
            <FileBarChart size={18} />
            {submitting ? 'Generating...' : 'Generate'}
          </button>
        </form>
        {status ? <p className="status-line">{status}</p> : null}
        {error ? <p className="error-line">{error}</p> : null}
      </div>

      <div className="page-panel">
        <div className="page-header" style={{ marginBottom: 12 }}>
          <div><h3 style={{ margin: 0 }}>Report history</h3></div>
        </div>
        {history.length ? (
          <div style={{ display: 'grid', gap: 10 }}>
            {history.map((item) => (
              <Link
                key={item._id || item.id}
                to={`/app/reports/${item._id || item.id}`}
                className="page-panel"
                style={{ padding: 12, margin: 0, display: 'block', textDecoration: 'none', color: 'inherit' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                  <strong>{item.title}</strong>
                  <span style={{ color: '#64748b', fontSize: 12, textTransform: 'capitalize' }}>{(item.type || 'esg_summary').replaceAll('_', ' ')}</span>
                </div>
                <div style={{ color: '#64748b', fontSize: 13, marginTop: 6 }}>
                  Status: {item.status || 'draft'} · {item.periodStart ? new Date(item.periodStart).toLocaleDateString() : 'N/A'} - {item.periodEnd ? new Date(item.periodEnd).toLocaleDateString() : 'N/A'}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p style={{ margin: 0, color: '#64748b' }}>No reports generated yet.</p>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
          <button className="secondary-button" type="button" disabled={page === 1} onClick={() => setPage((current) => current - 1)}>Previous</button>
          <span style={{ color: '#64748b', fontSize: 13 }}>Page {page} of {pagination.pages}</span>
          <button className="secondary-button" type="button" disabled={page >= pagination.pages} onClick={() => setPage((current) => current + 1)}>Next</button>
        </div>
      </div>
    </section>
  );
}
