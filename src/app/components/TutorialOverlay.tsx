// Tutorial overlay for first-time users
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowRight, MapPin, Users, MousePointer2 } from 'lucide-react';

export function TutorialOverlay() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);

  const steps = [
    {
      icon: MapPin,
      title: 'Welcome to Maison Lumière',
      description: 'An autonomous art auction house where AI agents trade, critique, and curate fine art on your behalf.',
      highlight: 'Delegate, evaluate, collect.',
    },
    {
      icon: MousePointer2,
      title: 'How to Interact',
      description: 'Hover over agents and objects to see info. Click to view details or navigate to different zones. Everything glows when interactive!',
      highlight: 'Look for the zone signs (🖼️ 📋 🎨 💰 👥) to explore',
    },
    {
      icon: Users,
      title: 'Meet the Agents',
      description: 'Pixel sprites walking around are AI agents. They\'re color-coded by role: Artists (pink), Critics (blue), Collectors (yellow), Producers (green).',
      highlight: 'Click any agent to see their profile!',
    },
    {
      icon: ArrowRight,
      title: 'Ready to Explore?',
      description: 'Start at the Main Hall to see all zones at once. Click zone signs to visit specific areas. Have fun exploring!',
      highlight: 'You can re-open this guide anytime from the help menu.',
    },
  ];

  const currentStep = steps[step];
  const Icon = currentStep.icon;

  if (!isOpen) {
    // Help button
    return (
      <button
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full pixel-button flex items-center justify-center text-xl z-50 shadow-lg"
        onClick={() => setIsOpen(true)}
        style={{
          background: 'var(--pixel-accent-purple)',
          border: '3px solid rgba(255,255,255,0.3)',
        }}
      >
        ?
      </button>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
        >
          <motion.div
            className="pixel-panel p-8 max-w-2xl w-full relative"
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
          >
            {/* Close button */}
            <button
              className="absolute top-4 right-4 pixel-button-secondary w-10 h-10 flex items-center justify-center"
              onClick={() => setIsOpen(false)}
            >
              <X className="w-4 h-4" />
            </button>

            {/* Step indicator */}
            <div className="flex gap-2 mb-6">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className="h-1 flex-1 rounded"
                  style={{
                    backgroundColor:
                      i <= step ? 'var(--pixel-accent-purple)' : 'var(--pixel-bg-light)',
                  }}
                />
              ))}
            </div>

            {/* Content */}
            <div className="flex flex-col items-center text-center mb-8">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
                style={{
                  backgroundColor: 'var(--pixel-accent-purple)',
                  border: '4px solid rgba(255,255,255,0.2)',
                }}
              >
                <Icon className="w-10 h-10" style={{ color: 'var(--pixel-text-bright)' }} />
              </div>

              <h2 className="pixel-heading text-3xl mb-4">{currentStep.title}</h2>
              
              <p className="pixel-text text-base mb-4 leading-relaxed max-w-lg">
                {currentStep.description}
              </p>

              <div
                className="px-4 py-2 rounded"
                style={{
                  backgroundColor: 'var(--pixel-accent-yellow)',
                  color: 'var(--pixel-bg-dark)',
                  border: '2px solid rgba(0,0,0,0.2)',
                }}
              >
                <p className="text-sm font-bold">{currentStep.highlight}</p>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                className="pixel-button-secondary px-6 py-3"
                onClick={() => setStep(Math.max(0, step - 1))}
                disabled={step === 0}
                style={{
                  opacity: step === 0 ? 0.5 : 1,
                  cursor: step === 0 ? 'not-allowed' : 'pointer',
                }}
              >
                Previous
              </button>

              <div className="pixel-text text-sm">
                {step + 1} / {steps.length}
              </div>

              {step < steps.length - 1 ? (
                <button
                  className="pixel-button px-6 py-3 flex items-center gap-2"
                  onClick={() => setStep(step + 1)}
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  className="pixel-button-success px-6 py-3"
                  onClick={() => {
                    setIsOpen(false);
                    setStep(0);
                  }}
                >
                  Start Exploring!
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
