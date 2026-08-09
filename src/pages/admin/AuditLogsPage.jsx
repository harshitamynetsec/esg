import ResourcePage from '../../components/platform/ResourcePage';

export default function AuditLogsPage() {
  return (
    <ResourcePage
      title="Audit Logs"
      description="Read-only trail of platform and organization actions for security review."
      resource="audit-logs"
      allowCreate={false}
      allowDelete={false}
      columns={[
        { key: 'action', label: 'Action' },
        { key: 'resource', label: 'Resource' },
        { key: 'outcome', label: 'Outcome' },
        { key: 'ipAddress', label: 'IP' },
        { key: 'createdAt', label: 'Time' },
      ]}
    />
  );
}
