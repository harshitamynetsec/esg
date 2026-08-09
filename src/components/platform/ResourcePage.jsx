import { useCallback, useEffect, useMemo, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { resourceApi } from '../../services/api';
import PageHeader from './PageHeader';

const readValue = (item, key) => {
  const value = key.split('.').reduce((current, part) => current?.[part], item);
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (value instanceof Date) return value.toLocaleDateString();
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(value)) return new Date(value).toLocaleDateString();
  if (Array.isArray(value)) return value.length;
  return value ?? '-';
};

export default function ResourcePage({
  title,
  description,
  resource,
  columns,
  fields = [],
  defaults = {},
  allowCreate = true,
  allowDelete = true,
}) {
  const api = useMemo(() => resourceApi(resource), [resource]);
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(defaults);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      const response = await api.list({ limit: 25 });
      setItems(response.data || []);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  }, [api]);

  useEffect(() => {
    load();
  }, [load]);

  const update = (name, value) => setForm((current) => ({ ...current, [name]: value }));

  const submit = async (event) => {
    event.preventDefault();
    setStatus('');
    try {
      await api.create(form);
      setForm(defaults);
      setStatus(`${title} record saved`);
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const remove = async (id) => {
    try {
      await api.remove(id);
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="page-panel">
      <PageHeader title={title} description={description} />
      {allowCreate && fields.length ? (
        <form onSubmit={submit}>
          <div className="form-grid">
            {fields.map((field) => (
              <label className="field" key={field.name}>
                <span>{field.label}</span>
                {field.type === 'select' ? (
                  <select value={form[field.name] || ''} onChange={(event) => update(field.name, event.target.value)} required>
                    <option value="">Select</option>
                    {field.options.map((option) => (
                      <option key={option.value || option} value={option.value || option}>
                        {option.label || option}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type || 'text'}
                    value={form[field.name] || ''}
                    min={field.min}
                    onChange={(event) => update(field.name, field.type === 'number' ? Number(event.target.value) : event.target.value)}
                    required
                  />
                )}
              </label>
            ))}
          </div>
          <button className="primary-button" type="submit">
            <Plus size={18} />
            Save
          </button>
        </form>
      ) : null}
      {status ? <p className="status-line">{status}</p> : null}
      {error ? <p className="error-line">{error}</p> : null}
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.label}</th>
            ))}
            {allowDelete ? <th>Actions</th> : null}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item._id || item.id}>
              {columns.map((column) => (
                <td key={column.key}>{readValue(item, column.key)}</td>
              ))}
              {allowDelete ? (
                <td>
                  <button className="danger-button" type="button" onClick={() => remove(item._id || item.id)}>
                    <Trash2 size={16} />
                    Delete
                  </button>
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
