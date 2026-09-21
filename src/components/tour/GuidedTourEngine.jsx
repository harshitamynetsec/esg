import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Sparkles, X } from 'lucide-react';
import { useTour } from '../../contexts/TourContext';

export default function GuidedTourEngine() {
  const { isActive, currentStep, currentStepIndex, totalSteps, nextStep, prevStep, skipTour, finishTour } = useTour();
  const [targetRect, setTargetRect] = useState(null);

  useEffect(() => {
    if (!isActive || !currentStep) return;

    if (!currentStep.target) {
      setTargetRect(null);
      return;
    }

    const updateRect = () => {
      const el = document.querySelector(currentStep.target);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        const rect = el.getBoundingClientRect();
        setTargetRect({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        });
      } else {
        setTargetRect(null);
      }
    };

    updateRect();
    const timer = setTimeout(updateRect, 300);
    window.addEventListener('resize', updateRect);
    window.addEventListener('scroll', updateRect, true);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateRect);
      window.removeEventListener('scroll', updateRect, true);
    };
  }, [isActive, currentStep]);

  // Keyboard navigation
  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        skipTour();
      } else if (e.key === 'ArrowRight') {
        nextStep();
      } else if (e.key === 'ArrowLeft') {
        prevStep();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActive, nextStep, prevStep, skipTour]);

  if (!isActive || !currentStep) return null;

  const isCenter = !currentStep.target || !targetRect;
  const isLast = currentStepIndex === totalSteps - 1;

  // Calculate card coordinates relative to target element
  let cardStyle = {};
  if (!isCenter && targetRect) {
    const spaceBelow = window.innerHeight - (targetRect.top + targetRect.height);
    const spaceRight = window.innerWidth - (targetRect.left + targetRect.width);

    if (currentStep.placement === 'right' && spaceRight > 320) {
      cardStyle = {
        top: Math.max(16, targetRect.top),
        left: targetRect.left + targetRect.width + 16,
      };
    } else if (currentStep.placement === 'bottom' || spaceBelow > 200) {
      cardStyle = {
        top: targetRect.top + targetRect.height + 12,
        left: Math.max(16, Math.min(targetRect.left, window.innerWidth - 360)),
      };
    } else {
      cardStyle = {
        top: Math.max(16, targetRect.top - 200),
        left: Math.max(16, Math.min(targetRect.left, window.innerWidth - 360)),
      };
    }
  }

  return (
    <div className="guided-tour-overlay">
      {/* Background Mask */}
      <div className="tour-backdrop" onClick={skipTour} />

      {/* Target Spotlight Highlight */}
      {!isCenter && targetRect ? (
        <div
          className="tour-spotlight"
          style={{
            top: targetRect.top - 6,
            left: targetRect.left - 6,
            width: targetRect.width + 12,
            height: targetRect.height + 12,
          }}
        />
      ) : null}

      {/* Floating Tour Card */}
      <div
        className={`tour-card ${isCenter ? 'tour-card-center' : ''}`}
        style={!isCenter ? cardStyle : {}}
        role="dialog"
        aria-modal="true"
      >
        <div className="tour-card-header">
          <div className="tour-card-badge">
            <Sparkles size={13} />
            <span>Step {currentStepIndex + 1} of {totalSteps}</span>
          </div>
          <button className="tour-close-btn" type="button" onClick={skipTour} aria-label="Skip tour" title="Skip tour">
            <X size={16} />
          </button>
        </div>

        <div className="tour-card-body">
          <h3 className="tour-card-title">{currentStep.title}</h3>
          <p className="tour-card-description">{currentStep.description}</p>
        </div>

        <div className="tour-card-footer">
          <button className="tour-skip-btn" type="button" onClick={skipTour}>
            Skip tour
          </button>
          <div className="tour-nav-btns">
            {currentStepIndex > 0 ? (
              <button className="secondary-button tour-btn-back" type="button" onClick={prevStep}>
                <ArrowLeft size={14} /> Back
              </button>
            ) : null}
            <button className="primary-button tour-btn-next" type="button" onClick={isLast ? finishTour : nextStep}>
              {isLast ? (
                <>
                  <span>Got it!</span> <CheckCircle2 size={15} />
                </>
              ) : (
                <>
                  <span>Next</span> <ArrowRight size={15} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
