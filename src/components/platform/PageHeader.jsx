export default function PageHeader({ title, description, action }) {
  return (
    <div className="page-header" style={{paddingTop: '24px', paddingBottom: '24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
      <div>
        <h2>{title}</h2>
        {description ? <p>{description}</p> : null}
      </div>
      {action}
    </div>
  );
}
