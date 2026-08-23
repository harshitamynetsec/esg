import { useCallback, useEffect, useMemo, useState } from 'react';
import { Edit3, Plus, RefreshCw, UserCheck, UserX } from 'lucide-react';
import PageHeader from '../../components/platform/PageHeader';
import { teamApi } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

export default function TeamManagementPage() {
  const { user: currentUser } = useAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusMsg, setStatusMsg] = useState('');
  const [devSetupUrl, setDevSetupUrl] = useState('');

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    roleKey: 'subscriber',
    title: '',
    phone: '',
  });

  const [editMember, setEditMember] = useState(null);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    roleKey: 'subscriber',
    title: '',
    phone: '',
  });

  const [actionLoadingId, setActionLoadingId] = useState(null);

  const isAdmin = useMemo(() => {
    const role = currentUser?.roleKey;
    return role === 'organization_admin' || role === 'platform_super_admin';
  }, [currentUser]);

  const loadMembers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await teamApi.list();
      setMembers(response.data || []);
      setError('');
    } catch (err) {
      setError(err.displayMessage || err.message || 'Failed to load team members');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  const handleInviteSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setStatusMsg('');
    setDevSetupUrl('');

    try {
      const response = await teamApi.invite(inviteForm);
      const data = response.data || {};
      setStatusMsg(`Invitation sent to ${inviteForm.email}`);
      if (data.setupUrl) {
        setDevSetupUrl(data.setupUrl);
      }
      setShowInviteModal(false);
      setInviteForm({ firstName: '', lastName: '', email: '', roleKey: 'subscriber', title: '', phone: '' });
      await loadMembers();
    } catch (err) {
      setError(err.displayMessage || err.message || 'Failed to send invitation');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editMember) return;
    setError('');
    setStatusMsg('');

    try {
      await teamApi.update(editMember._id || editMember.id, editForm);
      setStatusMsg(`Updated member details for ${editForm.firstName} ${editForm.lastName}`);
      setEditMember(null);
      await loadMembers();
    } catch (err) {
      setError(err.displayMessage || err.message || 'Failed to update member');
    }
  };

  const handleResendInvite = async (memberId) => {
    setActionLoadingId(memberId);
    setError('');
    setStatusMsg('');
    setDevSetupUrl('');

    try {
      const response = await teamApi.resendInvite(memberId);
      const data = response.data || {};
      setStatusMsg('Invitation resent successfully.');
      if (data.setupUrl) {
        setDevSetupUrl(data.setupUrl);
      }
    } catch (err) {
      setError(err.displayMessage || err.message || 'Failed to resend invitation');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleToggleStatus = async (member) => {
    const memberId = member._id || member.id;
    const nextStatus = member.status === 'active' || member.isActive ? 'inactive' : 'active';
    setActionLoadingId(memberId);
    setError('');
    setStatusMsg('');

    try {
      await teamApi.updateStatus(memberId, { status: nextStatus });
      setStatusMsg(`Member status set to ${nextStatus}`);
      await loadMembers();
    } catch (err) {
      setError(err.displayMessage || err.message || 'Failed to change member status');
    } finally {
      setActionLoadingId(null);
    }
  };

  const openEditModal = (member) => {
    setEditMember(member);
    setEditForm({
      firstName: member.firstName || '',
      lastName: member.lastName || '',
      roleKey: member.roleKey || 'subscriber',
      title: member.title || '',
      phone: member.phone || '',
    });
  };

  const renderStatusBadge = (member) => {
    const status = member.status || (member.isActive ? 'active' : 'inactive');
    if (status === 'invited') {
      return (
        <span style={{ background: '#fef3c7', color: '#b45309', padding: '2px 8px', borderRadius: 12, fontSize: 12, fontWeight: 600 }}>
          Invited
        </span>
      );
    }
    if (status === 'active' || member.isActive) {
      return (
        <span style={{ background: '#d1fae5', color: '#047857', padding: '2px 8px', borderRadius: 12, fontSize: 12, fontWeight: 600 }}>
          Active
        </span>
      );
    }
    return (
      <span style={{ background: '#f1f5f9', color: '#64748b', padding: '2px 8px', borderRadius: 12, fontSize: 12, fontWeight: 600 }}>
        Inactive
      </span>
    );
  };

  return (
    <section className="page-panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginBottom: 16 }}>
        <PageHeader title="Team Management" description="Invite and manage users responsible for ESG implementation." />
        {isAdmin ? (
          <button type="button" className="primary-button" onClick={() => setShowInviteModal(true)}>
            <Plus size={16} /> Invite Member
          </button>
        ) : null}
      </div>

      {statusMsg ? <p className="status-line" style={{ marginBottom: 12 }}>{statusMsg}</p> : null}
      {error ? <p className="error-line" style={{ marginBottom: 12 }}>{error}</p> : null}

      {devSetupUrl ? (
        <div style={{ background: '#e0f2fe', border: '1px solid #7dd3fc', padding: 14, borderRadius: 8, marginBottom: 16 }}>
          <strong style={{ color: '#0369a1', fontSize: 14 }}>[Development Setup Link]</strong>
          <p style={{ margin: '4px 0 8px', fontSize: 13, color: '#0c4a6e' }}>
            Invitation email link for testing:
          </p>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input type="text" readOnly value={devSetupUrl} style={{ width: '100%', padding: '6px 10px', fontSize: 12, background: '#ffffff', border: '1px solid #bae6fd', borderRadius: 4 }} />
            <a href={devSetupUrl} target="_blank" rel="noopener noreferrer" className="primary-button" style={{ padding: '6px 12px', fontSize: 12, whiteSpace: 'nowrap' }}>
              Open Setup Link
            </a>
          </div>
        </div>
      ) : null}

      <div style={{ overflowX: 'auto' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Member</th>
              <th>Role</th>
              <th>Title</th>
              <th>Status</th>
              {isAdmin ? <th>Actions</th> : null}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={isAdmin ? 5 : 4} style={{ textAlign: 'center', color: '#64748b', padding: 24 }}>
                  Loading team members...
                </td>
              </tr>
            ) : members.length ? (
              members.map((member) => {
                const memberId = member._id || member.id;
                const isSelf = String(currentUser?._id) === String(memberId);
                const isInvited = member.status === 'invited';

                return (
                  <tr key={memberId}>
                    <td>
                      <div>
                        <strong style={{ color: '#0f172a' }}>{member.firstName} {member.lastName}</strong>
                        <div style={{ color: '#64748b', fontSize: 13 }}>{member.email}</div>
                      </div>
                    </td>
                    <td>
                      <span style={{ textTransform: 'capitalize', fontWeight: 500, color: '#334155' }}>
                        {(member.roleKey || 'subscriber').replaceAll('_', ' ')}
                      </span>
                    </td>
                    <td>{member.title || '-'}</td>
                    <td>{renderStatusBadge(member)}</td>
                    {isAdmin ? (
                      <td>
                        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                          <button
                            type="button"
                            className="secondary-button"
                            style={{ padding: '4px 8px', fontSize: 12 }}
                            onClick={() => openEditModal(member)}
                            title="Edit Member"
                          >
                            <Edit3 size={14} /> Edit
                          </button>

                          {isInvited ? (
                            <button
                              type="button"
                              className="secondary-button"
                              style={{ padding: '4px 8px', fontSize: 12 }}
                              onClick={() => handleResendInvite(memberId)}
                              disabled={actionLoadingId === memberId}
                              title="Resend Invite"
                            >
                              <RefreshCw size={14} /> Resend
                            </button>
                          ) : null}

                          {!isSelf ? (
                            <button
                              type="button"
                              className={member.isActive ? 'danger-button' : 'primary-button'}
                              style={{ padding: '4px 8px', fontSize: 12 }}
                              onClick={() => handleToggleStatus(member)}
                              disabled={actionLoadingId === memberId}
                              title={member.isActive ? 'Deactivate Member' : 'Activate Member'}
                            >
                              {member.isActive ? <UserX size={14} /> : <UserCheck size={14} />}
                              {member.isActive ? 'Deactivate' : 'Activate'}
                            </button>
                          ) : null}
                        </div>
                      </td>
                    ) : null}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={isAdmin ? 5 : 4} style={{ textAlign: 'center', color: '#64748b', padding: 24 }}>
                  No team members found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showInviteModal ? (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 }}>
          <div style={{ background: '#ffffff', borderRadius: 8, padding: 24, maxWidth: 480, width: '100%', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ margin: 0, color: '#0f172a' }}>Invite Team Member</h3>
              <button type="button" onClick={() => setShowInviteModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b', fontSize: 18 }}>✕</button>
            </div>

            <form onSubmit={handleInviteSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <label className="field">
                  <span>First Name *</span>
                  <input type="text" value={inviteForm.firstName} onChange={(e) => setInviteForm({ ...inviteForm, firstName: e.target.value })} required />
                </label>
                <label className="field">
                  <span>Last Name *</span>
                  <input type="text" value={inviteForm.lastName} onChange={(e) => setInviteForm({ ...inviteForm, lastName: e.target.value })} required />
                </label>
              </div>

              <label className="field">
                <span>Email Address *</span>
                <input type="email" value={inviteForm.email} onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })} placeholder="user@company.com" required />
              </label>

              <label className="field">
                <span>Role *</span>
                <select value={inviteForm.roleKey} onChange={(e) => setInviteForm({ ...inviteForm, roleKey: e.target.value })} required>
                  <option value="subscriber">Subscriber</option>
                  <option value="esg_manager">ESG Manager</option>
                  <option value="organization_admin">Organization Admin</option>
                </select>
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <label className="field">
                  <span>Title / Position</span>
                  <input type="text" value={inviteForm.title} onChange={(e) => setInviteForm({ ...inviteForm, title: e.target.value })} placeholder="e.g. ESG Lead" />
                </label>
                <label className="field">
                  <span>Phone Number</span>
                  <input type="text" value={inviteForm.phone} onChange={(e) => setInviteForm({ ...inviteForm, phone: e.target.value })} />
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
                <button type="button" className="secondary-button" onClick={() => setShowInviteModal(false)}>Cancel</button>
                <button type="submit" className="primary-button">Send Invitation</button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {editMember ? (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 }}>
          <div style={{ background: '#ffffff', borderRadius: 8, padding: 24, maxWidth: 480, width: '100%', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ margin: 0, color: '#0f172a' }}>Edit Team Member</h3>
              <button type="button" onClick={() => setEditMember(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b', fontSize: 18 }}>✕</button>
            </div>

            <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <label className="field">
                  <span>First Name *</span>
                  <input type="text" value={editForm.firstName} onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })} required />
                </label>
                <label className="field">
                  <span>Last Name *</span>
                  <input type="text" value={editForm.lastName} onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })} required />
                </label>
              </div>

              <label className="field">
                <span>Role *</span>
                <select value={editForm.roleKey} onChange={(e) => setEditForm({ ...editForm, roleKey: e.target.value })} required>
                  <option value="subscriber">Subscriber</option>
                  <option value="esg_manager">ESG Manager</option>
                  <option value="organization_admin">Organization Admin</option>
                </select>
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <label className="field">
                  <span>Title / Position</span>
                  <input type="text" value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} />
                </label>
                <label className="field">
                  <span>Phone Number</span>
                  <input type="text" value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} />
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
                <button type="button" className="secondary-button" onClick={() => setEditMember(null)}>Cancel</button>
                <button type="submit" className="primary-button">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </section>
  );
}
