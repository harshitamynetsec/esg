import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Link2, Target, Gauge } from 'lucide-react';
import PageHeader from '../../components/platform/PageHeader';
import { kpiApi, objectiveApi } from '../../services/api';
import { assessmentApi } from '../../services/assessmentApi';
import './AddKpiPage.css';

const STATUS_OPTIONS = [
  { value: 'not_started', label: 'Not Started' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];

const STAGE_OPTIONS = [
  { value: 'early', label: 'Early' },
  { value: 'mid', label: 'Mid' },
  { value: 'late', label: 'Late' },
];

const OBJECTIVE_EXAMPLES = [
  'Reduce Scope 1 & 2 carbon emissions by 30% by 2030',
  'Achieve 50% board gender diversity by 2027',
  'Divert 75% of waste from landfill by 2028',
];

const KPI_EXAMPLES = [
  'Total Scope 1 & 2 emissions (tCO2e)',
  'Percentage of renewable energy used',
  'Waste diverted from landfill (tons)',
];

function Modal({ title, onCancel, onDone, children }) {
  return (
    <div className="addkpi-modal-backdrop">
      <div className="addkpi-modal">
        <h3><Link2 size={18} /> {title}</h3>
        <div className="addkpi-modal-body">{children}</div>
        <div className="addkpi-modal-actions">
          <button type="button" className="secondary-button" onClick={onCancel}>Cancel</button>
          <button type="button" className="primary-button" onClick={onDone}>Done</button>
        </div>
      </div>
    </div>
  );
}

export default function AddKpiPage() {
  const [objectivesCount, setObjectivesCount] = useState(null);
  const [kpisCount, setKpisCount] = useState(null);

  const [materialTopics, setMaterialTopics] = useState([]);
  const [objectives, setObjectives] = useState([]);

  const [objectiveTitle, setObjectiveTitle] = useState('');
  const [linkedTopicIds, setLinkedTopicIds] = useState([]);
  const [topicModalOpen, setTopicModalOpen] = useState(false);
  const [topicModalSelection, setTopicModalSelection] = useState([]);
  const [objectiveSubmitting, setObjectiveSubmitting] = useState(false);
  const [objectiveError, setObjectiveError] = useState('');
  const [objectiveSuccess, setObjectiveSuccess] = useState('');

  const [kpiName, setKpiName] = useState('');
  const [kpiStatus, setKpiStatus] = useState('not_started');
  const [kpiStage, setKpiStage] = useState('early');
  const [kpiStartDate, setKpiStartDate] = useState('');
  const [kpiTargetDate, setKpiTargetDate] = useState('');
  const [linkedObjectiveId, setLinkedObjectiveId] = useState('');
  const [objectiveModalOpen, setObjectiveModalOpen] = useState(false);
  const [objectiveModalSelection, setObjectiveModalSelection] = useState('');
  const [kpiSubmitting, setKpiSubmitting] = useState(false);
  const [kpiError, setKpiError] = useState('');
  const [kpiSuccess, setKpiSuccess] = useState('');

  const refreshCounts = () => {
    objectiveApi.list({ limit: 1 }).then((res) => setObjectivesCount(res.meta?.total ?? 0)).catch(() => {});
    kpiApi.list({ limit: 1 }).then((res) => setKpisCount(res.meta?.total ?? 0)).catch(() => {});
  };

  useEffect(() => {
    refreshCounts();
    assessmentApi.fetchMaterialTopics({ limit: 100 }).then((res) => setMaterialTopics(res.data || [])).catch(() => {});
    objectiveApi.list({ limit: 100 }).then((res) => setObjectives(res.data || [])).catch(() => {});
  }, []);

  const openTopicModal = () => {
    setTopicModalSelection(linkedTopicIds);
    setTopicModalOpen(true);
  };

  const toggleTopicSelection = (id) => {
    setTopicModalSelection((current) => (
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    ));
  };

  const openObjectiveModal = () => {
    setObjectiveModalSelection(linkedObjectiveId);
    setObjectiveModalOpen(true);
  };

  const linkedTopicNames = materialTopics
    .filter((topic) => linkedTopicIds.includes(topic._id))
    .map((topic) => topic.title);

  const linkedObjectiveTitle = objectives.find((item) => item._id === linkedObjectiveId)?.title || '';

  const handleAddObjective = async (event) => {
    event.preventDefault();
    setObjectiveSubmitting(true);
    setObjectiveError('');
    setObjectiveSuccess('');
    try {
      const response = await objectiveApi.quickAdd({ title: objectiveTitle, materialTopics: linkedTopicIds });
      setObjectives((current) => [...current, response.data]);
      setObjectiveTitle('');
      setLinkedTopicIds([]);
      setObjectiveSuccess('Objective added.');
      refreshCounts();
    } catch (err) {
      setObjectiveError(err.message || 'Failed to add objective');
    } finally {
      setObjectiveSubmitting(false);
    }
  };

  const handleAddKpi = async (event) => {
    event.preventDefault();
    setKpiSubmitting(true);
    setKpiError('');
    setKpiSuccess('');
    try {
      await kpiApi.quickAdd({
        name: kpiName,
        trackingStatus: kpiStatus,
        progressStage: kpiStage,
        startDate: kpiStartDate || undefined,
        targetDate: kpiTargetDate || undefined,
        objective: linkedObjectiveId || undefined,
      });
      setKpiName('');
      setKpiStatus('not_started');
      setKpiStage('early');
      setKpiStartDate('');
      setKpiTargetDate('');
      setLinkedObjectiveId('');
      setKpiSuccess('KPI added.');
      refreshCounts();
    } catch (err) {
      setKpiError(err.message || 'Failed to add KPI');
    } finally {
      setKpiSubmitting(false);
    }
  };

  return (
    <section>
      <PageHeader
        title="Add Objectives & KPIs"
        description="Quickly capture new ESG objectives and KPIs for your organization."
        action={<Link to="/app/kpis" className="secondary-button"><ArrowLeft size={16} /> Back to KPIs</Link>}
      />

      <div className="addkpi-counts-banner">
        <span>You currently have <strong>{objectivesCount ?? '—'}</strong> objectives</span>
        <span>You currently have <strong>{kpisCount ?? '—'}</strong> KPIs</span>
      </div>

      <div className="addkpi-columns">
        <div className="page-panel addkpi-panel">
          <div className="addkpi-panel-title"><Target size={18} /> Objectives</div>

          <div className="addkpi-examples">
            <strong>Examples</strong>
            {OBJECTIVE_EXAMPLES.map((example) => <p key={example}>· {example}</p>)}
          </div>

          <form onSubmit={handleAddObjective} className="addkpi-form">
            <label className="field">
              <span>Type an objective</span>
              <input
                type="text"
                value={objectiveTitle}
                onChange={(event) => setObjectiveTitle(event.target.value)}
                placeholder="e.g., Reduce water consumption by 20% by 2028"
                minLength={5}
                maxLength={160}
                required
              />
            </label>

            <button type="button" className="addkpi-link-button" onClick={openTopicModal}>
              <Link2 size={15} /> Link Material Topics
              {linkedTopicNames.length ? <span className="addkpi-link-count">{linkedTopicNames.length} linked</span> : null}
            </button>
            {linkedTopicNames.length ? <p className="addkpi-linked-summary">{linkedTopicNames.join(', ')}</p> : null}

            {objectiveError ? <p className="error-line">{objectiveError}</p> : null}
            {objectiveSuccess ? <p className="status-line">{objectiveSuccess}</p> : null}

            <button type="submit" className="primary-button" disabled={objectiveSubmitting}>
              {objectiveSubmitting ? 'Adding...' : 'Add Objective'}
            </button>
          </form>
        </div>

        <div className="page-panel addkpi-panel">
          <div className="addkpi-panel-title"><Gauge size={18} /> Key Performance Indicators</div>

          <div className="addkpi-examples">
            <strong>Examples</strong>
            {KPI_EXAMPLES.map((example) => <p key={example}>· {example}</p>)}
          </div>

          <form onSubmit={handleAddKpi} className="addkpi-form">
            <label className="field">
              <span>Type a KPI</span>
              <input
                type="text"
                value={kpiName}
                onChange={(event) => setKpiName(event.target.value)}
                placeholder="e.g., Increase social audit score from 75 to 90"
                minLength={2}
                maxLength={140}
                required
              />
            </label>

            <div className="addkpi-field-row">
              <label className="field">
                <span>Status</span>
                <select value={kpiStatus} onChange={(event) => setKpiStatus(event.target.value)}>
                  {STATUS_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
              </label>
              <label className="field">
                <span>Progress Stage</span>
                <select value={kpiStage} onChange={(event) => setKpiStage(event.target.value)}>
                  {STAGE_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
              </label>
            </div>

            <div className="addkpi-field-row">
              <label className="field">
                <span>Start Date</span>
                <input type="date" value={kpiStartDate} onChange={(event) => setKpiStartDate(event.target.value)} />
              </label>
              <label className="field">
                <span>Target Date</span>
                <input type="date" value={kpiTargetDate} onChange={(event) => setKpiTargetDate(event.target.value)} />
              </label>
            </div>

            <button type="button" className="addkpi-link-button" onClick={openObjectiveModal}>
              <Link2 size={15} /> Link Objective
            </button>
            {linkedObjectiveTitle ? <p className="addkpi-linked-summary">{linkedObjectiveTitle}</p> : null}

            {kpiError ? <p className="error-line">{kpiError}</p> : null}
            {kpiSuccess ? <p className="status-line">{kpiSuccess}</p> : null}

            <button type="submit" className="primary-button" disabled={kpiSubmitting}>
              {kpiSubmitting ? 'Adding...' : 'Add KPI'}
            </button>
          </form>
        </div>
      </div>

      {topicModalOpen ? (
        <Modal
          title="Link Material Topics"
          onCancel={() => setTopicModalOpen(false)}
          onDone={() => {
            setLinkedTopicIds(topicModalSelection);
            setTopicModalOpen(false);
          }}
        >
          <p className="addkpi-modal-hint">Choose the material topics that this objective relates to:</p>
          {materialTopics.length ? materialTopics.map((topic) => (
            <label key={topic._id} className="addkpi-checkbox-row">
              <input
                type="checkbox"
                checked={topicModalSelection.includes(topic._id)}
                onChange={() => toggleTopicSelection(topic._id)}
              />
              <span>{topic.title}</span>
            </label>
          )) : <p className="addkpi-modal-hint">No material topics available yet.</p>}
        </Modal>
      ) : null}

      {objectiveModalOpen ? (
        <Modal
          title="Link KPI to an Objective"
          onCancel={() => setObjectiveModalOpen(false)}
          onDone={() => {
            setLinkedObjectiveId(objectiveModalSelection);
            setObjectiveModalOpen(false);
          }}
        >
          {objectives.length ? objectives.map((objective) => (
            <label key={objective._id} className="addkpi-checkbox-row">
              <input
                type="radio"
                name="objective-link"
                checked={objectiveModalSelection === objective._id}
                onChange={() => setObjectiveModalSelection(objective._id)}
              />
              <span>{objective.title}</span>
            </label>
          )) : <p className="addkpi-modal-hint">No objectives available yet. Add one on the left first.</p>}
        </Modal>
      ) : null}
    </section>
  );
}
