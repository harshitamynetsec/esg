import { useState } from 'react';
import { HelpCircle } from 'lucide-react';

export default function InfoTooltip({ text, data, title, iconSize = 14, position = 'top' }) {
  const [isOpen, setIsOpen] = useState(false);

  const isRich = Boolean(data && typeof data === 'object');
  const tooltipTitle = title || (isRich ? data.title || data.prompt : null);

  return (
    <span
      className={`info-tooltip ${isOpen ? 'active' : ''}`}
      tabIndex={0}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onFocus={() => setIsOpen(true)}
      onBlur={() => setIsOpen(false)}
      onClick={(e) => {
        e.stopPropagation();
        setIsOpen((prev) => !prev);
      }}
      role="button"
      aria-expanded={isOpen}
    >
      <HelpCircle size={iconSize} className="info-tooltip-icon" />

      {(isOpen || text || isRich) && (
        <span className={`info-tooltip-bubble position-${position} ${isRich ? 'rich-bubble' : ''}`} role="tooltip">
          {isRich ? (
            <div className="tooltip-rich-content">
              {tooltipTitle && <div className="tooltip-header">{tooltipTitle}</div>}
              {data.pillar && <span className={`tooltip-badge badge-${data.pillar}`}>{data.pillar}</span>}

              {data.description && (
                <p className="tooltip-text">
                  <strong>Description:</strong> {data.description}
                </p>
              )}

              {data.whatIsThis && (
                <p className="tooltip-text">
                  <strong>What is this?</strong> {data.whatIsThis}
                </p>
              )}

              {data.whatItMeans && (
                <p className="tooltip-text">
                  <strong>What it means:</strong> {data.whatItMeans}
                </p>
              )}

              {data.whyItMatters && (
                <p className="tooltip-text highlight">
                  <strong>Why it matters:</strong> {data.whyItMatters}
                </p>
              )}

              {data.whyImportant && (
                <p className="tooltip-text highlight">
                  <strong>Why important:</strong> {data.whyImportant}
                </p>
              )}

              {data.whyTrack && (
                <p className="tooltip-text highlight">
                  <strong>Why track:</strong> {data.whyTrack}
                </p>
              )}

              {data.howToAchieve && (
                <p className="tooltip-text">
                  <strong>How to achieve:</strong> {data.howToAchieve}
                </p>
              )}

              {data.example && (
                <p className="tooltip-text example">
                  <strong>Example:</strong> {data.example}
                </p>
              )}

              {data.relevance && (
                <p className="tooltip-text">
                  <strong>Business Relevance:</strong> {data.relevance}
                </p>
              )}

              {data.relatedSDGs && (
                <div className="tooltip-meta">
                  <span className="tooltip-meta-label">Related SDGs:</span> {data.relatedSDGs}
                </div>
              )}

              {data.stakeholders && (
                <div className="tooltip-meta">
                  <span className="tooltip-meta-label">Stakeholders:</span> {data.stakeholders}
                </div>
              )}

              {data.metrics && (
                <div className="tooltip-meta">
                  <span className="tooltip-meta-label">Key Metrics:</span> {data.metrics}
                </div>
              )}

              {data.industry && (
                <div className="tooltip-meta">
                  <span className="tooltip-meta-label">Industry Focus:</span> {data.industry}
                </div>
              )}
            </div>
          ) : (
            text
          )}
        </span>
      )}
    </span>
  );
}
