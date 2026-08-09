import { useEffect, useMemo, useState } from 'react';
import { FileBarChart } from 'lucide-react';
import PageHeader from '../../components/platform/PageHeader';
import ResourcePage from '../../components/platform/ResourcePage';
import { reportApi, resourceApi } from '../../services/api';

export default function ReportsPage() {
  const [form, setForm] = useState({
    title: 'Quarterly ESG Summary',
    type: 'esg_summary',
    periodStart: '2026-04-01',
    periodEnd: '2026-06-30',
  });
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);
  const resource = useMemo(() => resourceApi('reports'), []);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const response = await resource.list({ limit: 10 });
        setHistory(response.data || []);
      } catch (err) {
        setError(err.message);
      }
    };
    loadHistory();
  }, [resource]);

  const generate = async (event) => {
    event.preventDefault();
    try {
      await reportApi.generate(form);
      setStatus('Report generated successfully');
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <section className="page-panel" style={{ marginBottom: 16 }}>
        <PageHeader title="Report Generation" description="Generate ESG, SDG alignment, KPI performance, and policy compliance reports." />
        <form className="form-grid" onSubmit={generate}>
          <label className="field"><span>Title</span><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></label>
          <label className="field">
            <span>Type</span>
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              <option value="esg_summary">ESG Summary</option>
              <option value="sdg_alignment">SDG Alignment</option>
              <option value="kpi_performance">KPI Performance</option>
              <option value="policy_compliance">Policy Compliance</option>
            </select>
          </label>
          <label className="field"><span>Period start</span><input type="date" value={form.periodStart} onChange={(e) => setForm({ ...form, periodStart: e.target.value })} /></label>
          <label className="field"><span>Period end</span><input type="date" value={form.periodEnd} onChange={(e) => setForm({ ...form, periodEnd: e.target.value })} /></label>
          <button className="primary-button" type="submit"><FileBarChart size={18} />Generate</button>
        </form>
        {status ? <p className="status-line">{status}</p> : null}
        {error ? <p className="error-line">{error}</p> : null}
      </section>
      <section className="metric-grid" style={{ marginBottom: 16 }}>
        <div className="page-panel">
          <div className="page-header" style={{ marginBottom: 12 }}>
            <div><h3 style={{ margin: 0 }}>Recent report history</h3></div>
          </div>
          <div style={{ display: 'grid', gap: 10 }}>
            {history.map((item) => (
              <div key={item._id || item.id} className="page-panel" style={{ padding: 12, margin: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong>{item.title}</strong>
                  <span>{item.type || 'esg_summary'}</span>
                </div>
                <div style={{ color: '#64748b', fontSize: 13, marginTop: 6 }}>Status: {item.status || 'draft'}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <ResourcePage
        title="Reports"
        description="Review generated reports and archived ESG reporting outputs."
        resource="reports"
        defaults={form}
        columns={[
          { key: 'title', label: 'Title' },
          { key: 'type', label: 'Type' },
          { key: 'status', label: 'Status' },
          { key: 'createdAt', label: 'Created' },
        ]}
        fields={[
          { name: 'title', label: 'Title' },
          { name: 'type', label: 'Type', type: 'select', options: ['esg_summary', 'sdg_alignment', 'kpi_performance', 'policy_compliance'] },
          { name: 'periodStart', label: 'Period start', type: 'date' },
          { name: 'periodEnd', label: 'Period end', type: 'date' },
        ]}
      />
    </>
  );
}
