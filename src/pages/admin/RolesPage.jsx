import ResourcePage from '../../components/platform/ResourcePage';

export default function RolesPage() {
  return (
    <ResourcePage
      title="Roles"
      description="Manage role labels and permission groups used by organization admins and ESG managers."
      resource="roles"
      defaults={{ name: '', key: '', description: '', isSystem: false }}
      columns={[
        { key: 'name', label: 'Role' },
        { key: 'key', label: 'Key' },
        { key: 'isSystem', label: 'System' },
        { key: 'createdAt', label: 'Created' },
      ]}
      fields={[
        { name: 'name', label: 'Role name' },
        { name: 'key', label: 'Role key' },
        { name: 'description', label: 'Description' },
      ]}
    />
  );
}
