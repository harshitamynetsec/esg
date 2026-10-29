import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { HelpCircle } from 'lucide-react';

export default function InfoTooltip({ text, data, title, iconSize = 14, position = 'top' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, actualPosition: position, arrowLeft: '50%' });
  const triggerRef = useRef(null);
  const bubbleRef = useRef(null);

  const isRich = Boolean(data && typeof data === 'object');
  const tooltipTitle = title || (isRich ? data.title || data.prompt : null);

  const updatePosition = () => {
    if (!triggerRef.current) return;
    const triggerRect = triggerRef.current.getBoundingClientRect();
    const bubbleRect = bubbleRef.current
      ? bubbleRef.current.getBoundingClientRect()
      : { width: isRich ? 340 : 260, height: 160 };

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const padding = 12;
    const offset = 8;

    let targetTop = 0;
    let targetLeft = triggerRect.left + triggerRect.width / 2 - bubbleRect.width / 2;
    let actualPos = position;

    if (position === 'bottom') {
      targetTop = triggerRect.bottom + offset;
      if (targetTop + bubbleRect.height > vh - padding && triggerRect.top - bubbleRect.height - offset >= padding) {
        targetTop = triggerRect.top - bubbleRect.height - offset;
        actualPos = 'top';
      }
    } else {
      // Default top
      targetTop = triggerRect.top - bubbleRect.height - offset;
      if (targetTop < padding && triggerRect.bottom + offset + bubbleRect.height <= vh - padding) {
        targetTop = triggerRect.bottom + offset;
        actualPos = 'bottom';
      }
    }

    // Horizontal shift middleware
    if (targetLeft < padding) {
      targetLeft = padding;
    } else if (targetLeft + bubbleRect.width > vw - padding) {
      targetLeft = Math.max(padding, vw - padding - bubbleRect.width);
    }

    // Calculate relative arrow placement
    const triggerCenter = triggerRect.left + triggerRect.width / 2;
    const relativeArrowLeft = triggerCenter - targetLeft;
    const clampedArrowLeft = Math.max(16, Math.min(bubbleRect.width - 16, relativeArrowLeft));

    setCoords({
      top: Math.max(padding, targetTop),
      left: Math.max(padding, targetLeft),
      actualPosition: actualPos,
      arrowLeft: `${clampedArrowLeft}px`,
    });
  };

  useEffect(() => {
    if (!isOpen) return;

    updatePosition();
    const animationFrame = requestAnimationFrame(updatePosition);

    const handleScrollOrResize = () => {
      updatePosition();
    };

    window.addEventListener('scroll', handleScrollOrResize, { capture: true, passive: true });
    window.addEventListener('resize', handleScrollOrResize, { passive: true });

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('scroll', handleScrollOrResize, { capture: true });
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, [isOpen, position, text, data, title]);

  return (
    <span
      ref={triggerRef}
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

      {isOpen &&
        createPortal(
          <div
            ref={bubbleRef}
            className={`info-tooltip-bubble position-${coords.actualPosition} ${isRich ? 'rich-bubble' : ''}`}
            role="tooltip"
            style={{
              top: `${coords.top}px`,
              left: `${coords.left}px`,
              '--arrow-left': coords.arrowLeft,
            }}
          >
            {isRich ? (
              <div className="tooltip-rich-content">
                {tooltipTitle && <div className="tooltip-header">{tooltipTitle}</div>}
                {data.pillar && (
                  <span className={`tooltip-badge badge-${data.pillar}`}>
                    {data.pillar}
                  </span>
                )}

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
          </div>,
          document.body
        )}
    </span>
  );
}

export const ESGTooltip = InfoTooltip;
