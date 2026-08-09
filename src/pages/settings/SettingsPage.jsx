import PageHeader from '../../components/platform/PageHeader';

export default function SettingsPage() {
  return (
    <section className="page-panel">
      <PageHeader title="Settings" description="Manage organization defaults for reporting, fiscal year, frameworks, and workspace preferences." />
      <div className="form-grid">
        <label className="field"><span>Fiscal year start month</span><select defaultValue="4"><option value="1">January</option><option value="4">April</option></select></label>
        <label className="field"><span>Reporting currency</span><input defaultValue="USD" /></label>
        <label className="field"><span>Default frameworks</span><input defaultValue="GRI, SDGs, BRSR" /></label>
        <label className="field"><span>Notification cadence</span><select defaultValue="monthly"><option value="monthly">Monthly</option><option value="quarterly">Quarterly</option></select></label>
      </div>
      <button className="primary-button" type="button">Save settings</button>
    </section>
  );
}
