import { useEffect, useState } from 'react';
import PageHeader from '../../components/platform/PageHeader';
import { demoRequestApi } from '../../services/api';

const STATUS_OPTIONS = ['new', 'contacted', 'scheduled', 'closed'];

export default function DemoRequestsPage() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [updatingId, setUpdatingId] = useState('');

  useEffect(() => {
    demoRequestApi.list({ page, limit: 15 })
      .then((response) => {
        setItems(response.data || []);
        setPagination(response.meta || { page, pages: 1, total: response.data?.length || 0 });
        setError('');
      })
      .catch((err) => setError(err.message));
  }, [page]);

  const handleStatusChange = async (id, status) => {
    setUpdatingId(id);
    try {
      await demoRequestApi.updateStatus(id, status);
      setItems((current) => current.map((item) => (item._id === id ? { ...item, status } : item)));
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdatingId('');
    }
  };

  const formatDate = (value) => (value ? new Date(value).toLocaleDateString() : '—');

  return (
    <section className="page-panel">
      <PageHeader title="Demo Requests" description="Track requested demos and enterprise onboarding conversations." />
      {error ? <p className="error-line">{error}</p> : null}

      <table className="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Company</th>
            <th>Email</th>
            <th>Size</th>
            <th>Frameworks</th>
            <th>Submitted</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item._id}>
              <td>{item.fullName}{item.jobTitle ? <><br /><small>{item.jobTitle}</small></> : null}</td>
              <td>{item.company}{item.region ? <><br /><small>{item.region}</small></> : null}</td>
              <td>{item.workEmail}</td>
              <td>{item.companySize || '—'}</td>
              <td>{item.frameworks?.length ? item.frameworks.join(', ') : '—'}</td>
              <td>{formatDate(item.createdAt)}</td>
              <td>
                <select
                  value={item.status}
                  disabled={updatingId === item._id}
                  onChange={(event) => handleStatusChange(item._id, event.target.value)}
                >
                  {STATUS_OPTIONS.map((status) => <option key={status} value={status}>{status}</option>)}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {!items.length && !error ? <p>No demo requests yet.</p> : null}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '16px 0 4px', color: '#64748b', fontSize: '13px' }}>
        <button className="secondary-button" type="button" disabled={page === 1} onClick={() => setPage((current) => current - 1)}>Previous</button>
        <span>Page {page} of {pagination.pages}</span>
        <button className="secondary-button" type="button" disabled={page >= pagination.pages} onClick={() => setPage((current) => current + 1)}>Next</button>
      </div>
    </section>
  );
}
