import ResourcePage from '../../components/platform/ResourcePage';

export default function PoliciesPage() {
  return (
    <ResourcePage
      title="Policies"
      description="Create, review, approve, and maintain ESG policy documents."
      resource="policies"
      defaults={{
        title: '',
        content: 'This policy defines ESG responsibilities, approval ownership, evidence requirements, and review cadence for the organization.',
        effectiveDate: '2026-07-01',
        reviewDate: '2027-07-01',
        status: 'draft',
      }}
      columns={[
        { key: 'title', label: 'Policy' },
        { key: 'status', label: 'Status' },
        { key: 'effectiveDate', label: 'Effective' },
        { key: 'reviewDate', label: 'Review' },
      ]}
      fields={[
        { name: 'title', label: 'Policy title' },
        { name: 'status', label: 'Status', type: 'select', options: ['draft', 'in_review', 'approved', 'active', 'archived'] },
        { name: 'effectiveDate', label: 'Effective date', type: 'date' },
        { name: 'reviewDate', label: 'Review date', type: 'date' },
      ]}
    />
  );
}
