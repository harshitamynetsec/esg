import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { TOUR_STEPS } from '../data/tourSteps';

const STORAGE_KEY = 'esg_guided_tour_completed';

const TourContext = createContext(null);

export function TourProvider({ children }) {
  const [isActive, setIsActive] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const location = useLocation();

  const startTour = useCallback(() => {
    setCurrentStepIndex(0);
    setIsActive(true);
  }, []);

  const skipTour = useCallback(() => {
    setIsActive(false);
    localStorage.setItem(STORAGE_KEY, 'true');
  }, []);

  const finishTour = useCallback(() => {
    setIsActive(false);
    localStorage.setItem(STORAGE_KEY, 'true');
  }, []);

  const nextStep = useCallback(() => {
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      finishTour();
    }
  }, [currentStepIndex, finishTour]);

  const prevStep = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  }, [currentStepIndex]);

  // Auto-start for first-time users visiting dashboard
  useEffect(() => {
    const isCompleted = localStorage.getItem(STORAGE_KEY) === 'true';
    if (!isCompleted && location.pathname.includes('/app/dashboard')) {
      const timer = setTimeout(() => {
        setIsActive(true);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  const currentStep = TOUR_STEPS[currentStepIndex] || null;

  const value = useMemo(
    () => ({
      isActive,
      currentStepIndex,
      currentStep,
      totalSteps: TOUR_STEPS.length,
      startTour,
      skipTour,
      nextStep,
      prevStep,
      finishTour,
    }),
    [isActive, currentStepIndex, currentStep, startTour, skipTour, nextStep, prevStep, finishTour]
  );

  return <TourContext.Provider value={value}>{children}</TourContext.Provider>;
}

export function useTour() {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error('useTour must be used within a TourProvider');
  }
  return context;
}
