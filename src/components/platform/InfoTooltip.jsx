import { Info } from 'lucide-react';

export default function InfoTooltip({ text }) {
  return (
    <span className="info-tooltip" tabIndex={0}>
      <Info size={13} />
      <span className="info-tooltip-bubble" role="tooltip">{text}</span>
    </span>
  );
}
