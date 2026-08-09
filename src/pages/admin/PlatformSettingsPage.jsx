import PageHeader from '../../components/platform/PageHeader';

export default function PlatformSettingsPage() {
  return (
    <section className="page-panel">
      <PageHeader title="Platform Configuration" description="Set defaults for plans, reporting frameworks, support routing, and admin controls." />
      <div className="form-grid">
        <label className="field"><span>Default plan</span><select defaultValue="starter"><option value="starter">Starter</option><option value="growth">Growth</option><option value="enterprise">Enterprise</option></select></label>
        <label className="field"><span>Primary reporting framework</span><select defaultValue="sdg"><option value="sdg">UN SDGs</option><option value="gri">GRI</option><option value="brsr">BRSR</option></select></label>
        <label className="field"><span>Support routing email</span><input type="email" defaultValue="support@esg-nss.local" /></label>
        <label className="field"><span>Admin review cadence</span><select defaultValue="monthly"><option value="weekly">Weekly</option><option value="monthly">Monthly</option><option value="quarterly">Quarterly</option></select></label>
      </div>
      <button className="primary-button" type="button">Save configuration</button>
    </section>
  );
}
