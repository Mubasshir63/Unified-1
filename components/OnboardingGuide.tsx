import React, { useState, useLayoutEffect } from 'react';
import { useTranslation } from '../hooks/useTranslation';

interface OnboardingGuideProps {
  onFinish: () => void;
}

const OnboardingGuide: React.FC<OnboardingGuideProps> = ({ onFinish }) => {
  const { t } = useTranslation();
  const [stepIndex, setStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  const steps = [
    {
      title: t('onboardingWelcomeTitle'),
      content: t('onboardingWelcomeContent'),
      position: 'center',
    },
    {
      targetId: 'new-report-button',
      title: t('onboardingReportTitle'),
      content: t('onboardingReportContent'),
      position: 'bottom',
    },
    {
      targetId: 'services-nav-item',
      title: t('onboardingServicesTitle'),
      content: t('onboardingServicesContent'),
      position: 'top',
    },
    {
      targetId: 'map-nav-item',
      title: t('onboardingMapTitle'),
      content: t('onboardingMapContent'),
      position: 'top',
    },
    {
      targetId: 'profile-nav-item',
      title: t('onboardingProfileTitle'),
      content: t('onboardingProfileContent'),
      position: 'top',
    },
  ];

  const currentStep = steps[stepIndex];

  useLayoutEffect(() => {
    if (currentStep && currentStep.targetId) {
      const element = document.getElementById(currentStep.targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
        // Delay getting rect to allow for scrolling
        setTimeout(() => {
            const rect = element.getBoundingClientRect();
            setTargetRect(rect);
        }, 300);
      }
    } else {
      setTargetRect(null); // For centered modal
    }
  }, [stepIndex, currentStep]);

  const handleNext = () => {
    if (stepIndex < steps.length - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      onFinish();
    }
  };

  const getTooltipPosition = () => {
    if (!targetRect) { // Center the modal
        return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    }

    const PADDING = 15;
    switch (currentStep.position) {
        case 'top':
            return { bottom: `${window.innerHeight - targetRect.top + PADDING}px`, left: `${targetRect.left + targetRect.width / 2}px`, transform: 'translateX(-50%)' };
        case 'bottom':
            return { top: `${targetRect.bottom + PADDING}px`, left: `${targetRect.left + targetRect.width / 2}px`, transform: 'translateX(-50%)' };
        default:
             return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    }
  };

  return (
    <>
    <style>{`
        .onboarding-highlight {
            position: absolute;
            border-radius: 12px;
            box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.6), 0 0 15px rgba(255,255,255,0.5);
            transition: all 0.3s ease-in-out;
            pointer-events: none;
            z-index: 10000;
        }
        .onboarding-tooltip {
            position: absolute;
            background: white;
            color: black;
            padding: 1.25rem;
            border-radius: 12px;
            max-width: 320px;
            width: calc(100% - 2rem);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            z-index: 10001;
            transition: all 0.3s ease-in-out;
            opacity: 0;
            animation: fadeIn 0.3s forwards;
        }
        @keyframes fadeIn {
            to { opacity: 1; }
        }
    `}</style>
    <div className="fixed inset-0 z-[9999]" onClick={onFinish}>
      {targetRect && (
        <div
          className="onboarding-highlight"
          style={{
            width: `${targetRect.width + 8}px`,
            height: `${targetRect.height + 8}px`,
            top: `${targetRect.top - 4}px`,
            left: `${targetRect.left - 4}px`,
          }}
        />
      )}

      <div className="onboarding-tooltip" style={getTooltipPosition()} onClick={e => e.stopPropagation()}>
        <h3 className="text-xl font-bold text-gray-800 mb-2">{currentStep.title}</h3>
        <p className="text-gray-600 mb-4">{currentStep.content}</p>
        <div className="flex justify-between items-center">
            <button onClick={onFinish} className="text-sm font-semibold text-gray-500 hover:text-gray-700">
                {t('onboardingSkip')}
            </button>
            <button onClick={handleNext} className="px-5 py-2 text-white font-semibold rounded-lg bg-green-600 hover:bg-green-700 transition-colors">
                {stepIndex === steps.length - 1 ? t('onboardingFinish') : t('onboardingNext')}
            </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default OnboardingGuide;