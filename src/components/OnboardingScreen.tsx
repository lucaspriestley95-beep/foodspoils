import React, { useState } from 'react';

interface OnboardingStep {
  title: string;
  description: string;
  illustration: React.ReactNode;
}

const steps: OnboardingStep[] = [
  {
    title: 'Track Your Food',
    description: 'Add items from your fridge and pantry by name — or just scan the barcode. Know exactly what you have at a glance.',
    illustration: (
      <svg className="h-32 w-32 text-fresh-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
  },
  {
    title: 'Never Waste Again',
    description: 'Get friendly reminders before food expires. FoodSpoils tells you what to use up first — so nothing goes to waste.',
    illustration: (
      <svg className="h-32 w-32 text-coral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: 'Save Money & Planet',
    description: 'The average household wastes $1,500/year on spoiled food. FoodSpoils helps you cut that down — for your wallet and the Earth.',
    illustration: (
      <svg className="h-32 w-32 text-fresh-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
      </svg>
    ),
  },
];

export function OnboardingScreen({ onComplete }: { onComplete?: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const step = steps[currentStep];
  const isLast = currentStep === steps.length - 1;

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-gray-800 font-sans">
      {/* Top progress dots */}
      <div className="flex justify-center gap-2 pt-12 pb-8">
        {steps.map((_, i) => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all ${
              i === currentStep ? 'w-8 bg-fresh-500' : 'w-2 bg-gray-200'
            }`}
          />
        ))}
      </div>

      {/* Illustration area */}
      <div className="flex flex-1 items-center justify-center px-8">
        <div className="flex flex-col items-center text-center animate-fade-in">
          <div className="mb-8 flex h-48 w-48 items-center justify-center rounded-full bg-fresh-950/30">
            {step.illustration}
          </div>
          <h2 className="text-2xl font-bold text-gray-100">{step.title}</h2>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-gray-400">{step.description}</p>
        </div>
      </div>

      {/* Bottom actions */}
      <div className="px-6 pb-10">
        <button
          onClick={() => {
            if (isLast) {
              onComplete?.();
            } else {
              setCurrentStep(currentStep + 1);
            }
          }}
          className="w-full rounded-sm bg-fresh-500 py-3.5 text-base font-semibold text-white transition-colors hover:bg-fresh-600 active:bg-fresh-700 min-h-touch"
        >
          {isLast ? 'Get Started' : 'Continue'}
        </button>
        {!isLast && (
          <button
            onClick={onComplete}
            className="mt-3 w-full py-3 text-sm font-medium text-gray-400 transition-colors hover:text-gray-300 min-h-touch"
          >
            Skip
          </button>
        )}
      </div>
    </div>
  );
}