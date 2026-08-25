export default function PageHeader({ title, description, action }) {
  return (
    <div className="app-page-header">
      <div className="app-page-header-text">
        <h2>{title}</h2>
        {description ? <p>{description}</p> : null}
      </div>
      {action ? <div className="app-page-header-action">{action}</div> : null}
    </div>
  );
}
