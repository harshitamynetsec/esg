import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Download, FileBarChart } from 'lucide-react';
import PageHeader from '../../components/platform/PageHeader';
import { reportApi } from '../../services/api';

export default function ReportViewerPage() {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [version, setVersion] = useState(null);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    reportApi.detail(id)
      .then((response) => {
        setReport(response.data?.report || null);
        setVersion(response.data?.version || null);
        setError('');
      })
      .catch((err) => setError(err.message));
  }, [id]);

  const handleDownload = async () => {
    setDownloading(true);
    setError('');
    try {
      const blob = await reportApi.downloadPdf(id);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${(report?.title || 'report').replace(/[^a-z0-9]+/gi, '-')}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message || 'Unable to download the PDF for this report.');
    } finally {
      setDownloading(false);
    }
  };

  const formatDate = (value) => (value ? new Date(value).toLocaleDateString() : 'N/A');
  const metrics = version?.content?.metricsSnapshot || report?.metricsSnapshot || {};
  const kpis = version?.content?.kpis || [];
  const policies = version?.content?.policies || [];

  return (
    <section>
      <PageHeader
        title={report?.title || 'Report'}
        description={report ? `${(report.type || '').replaceAll('_', ' ')} · ${formatDate(report.periodStart)} - ${formatDate(report.periodEnd)}` : 'Loading report...'}
        action={(
          <>
            <Link to="/app/reports" className="secondary-button"><ArrowLeft size={16} /> Back to reports</Link>
            <button className="primary-button" type="button" onClick={handleDownload} disabled={downloading || !version?.pdfFileId}>
              <Download size={16} /> {downloading ? 'Downloading...' : 'Download PDF'}
            </button>
          </>
        )}
      />
      {error ? <p className="error-line">{error}</p> : null}

      {report ? (
        <>
          <div className="metric-grid" style={{ marginBottom: 16 }}>
            <div className="metric-card"><span>Status</span><strong style={{ textTransform: 'capitalize' }}>{report.status}</strong></div>
            <div className="metric-card"><span>KPIs</span><strong>{metrics.kpis ?? kpis.length}</strong></div>
            <div className="metric-card"><span>Policies</span><strong>{metrics.policies ?? policies.length}</strong></div>
            <div className="metric-card"><span>Avg. KPI progress</span><strong>{metrics.averageKpiProgress ?? 0}%</strong></div>
          </div>

          <div className="page-panel" style={{ marginBottom: 16 }}>
            <div className="page-header" style={{ marginBottom: 12 }}>
              <div><h3 style={{ margin: 0 }}>Summary</h3></div>
            </div>
            <p style={{ margin: 0, color: '#334155', lineHeight: 1.6 }}>{report.summary || 'No summary available.'}</p>
          </div>

          <div className="page-panel" style={{ marginBottom: 16 }}>
            <div className="page-header" style={{ marginBottom: 12 }}>
              <div><h3 style={{ margin: 0 }}>KPIs included ({kpis.length})</h3></div>
            </div>
            {kpis.length ? (
              <table className="data-table">
                <thead>
                  <tr><th>Name</th><th>Pillar</th><th>Current</th><th>Target</th><th>Unit</th></tr>
                </thead>
                <tbody>
                  {kpis.map((kpi) => (
                    <tr key={kpi._id}>
                      <td>{kpi.name}</td>
                      <td style={{ textTransform: 'capitalize' }}>{kpi.pillar}</td>
                      <td>{kpi.currentValue ?? 0}</td>
                      <td>{kpi.targetValue ?? 0}</td>
                      <td>{kpi.unit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : <p style={{ margin: 0, color: '#64748b' }}>No KPIs were recorded at generation time.</p>}
          </div>

          <div className="page-panel">
            <div className="page-header" style={{ marginBottom: 12 }}>
              <div><h3 style={{ margin: 0 }}>Policies included ({policies.length})</h3></div>
            </div>
            {policies.length ? (
              <table className="data-table">
                <thead>
                  <tr><th>Title</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {policies.map((policy) => (
                    <tr key={policy._id}>
                      <td>{policy.title}</td>
                      <td style={{ textTransform: 'capitalize' }}>{policy.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : <p style={{ margin: 0, color: '#64748b' }}>No policies were recorded at generation time.</p>}
          </div>
        </>
      ) : !error ? (
        <div className="page-panel"><p style={{ margin: 0, color: '#64748b' }}><FileBarChart size={16} /> Loading report...</p></div>
      ) : null}
    </section>
  );
}
