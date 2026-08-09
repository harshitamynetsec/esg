import ResourcePage from '../../components/platform/ResourcePage';

export default function TeamManagementPage() {
  return (
    <ResourcePage
      title="Team Management"
      description="Invite and manage users responsible for ESG implementation."
      resource="users"
      defaults={{ firstName: '', lastName: '', email: '', password: 'Password@123', roleKey: 'subscriber' }}
      columns={[
        { key: 'firstName', label: 'First' },
        { key: 'lastName', label: 'Last' },
        { key: 'email', label: 'Email' },
        { key: 'roleKey', label: 'Role' },
      ]}
      fields={[
        { name: 'firstName', label: 'First name' },
        { name: 'lastName', label: 'Last name' },
        { name: 'email', label: 'Email', type: 'email' },
        { name: 'roleKey', label: 'Role', type: 'select', options: ['subscriber', 'esg_manager', 'organization_admin'] },
      ]}
    />
  );
}
