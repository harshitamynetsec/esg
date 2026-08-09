import ResourcePage from '../../components/platform/ResourcePage';

export default function CompaniesPage() {
  return (
    <ResourcePage
      title="Companies"
      description="Manage subscribed organizations and ESG workspaces."
      resource="organizations"
      defaults={{ name: '', legalName: '', industry: '', size: '51-250', contactEmail: '', country: '' }}
      columns={[
        { key: 'name', label: 'Company' },
        { key: 'industry', label: 'Industry' },
        { key: 'size', label: 'Size' },
        { key: 'contactEmail', label: 'Contact' },
      ]}
      fields={[
        { name: 'name', label: 'Company' },
        { name: 'legalName', label: 'Legal name' },
        { name: 'industry', label: 'Industry' },
        { name: 'contactEmail', label: 'Contact email', type: 'email' },
        { name: 'country', label: 'Country' },
        { name: 'size', label: 'Size', type: 'select', options: ['1-10', '11-50', '51-250', '251-1000', '1000+'] },
      ]}
    />
  );
}
