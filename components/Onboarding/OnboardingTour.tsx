"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowRight, FiCheck, FiX, FiArrowLeft } from 'react-icons/fi';
import { FaMoneyBillWave, FaChartLine, FaPiggyBank, FaCog } from 'react-icons/fa';

interface OnboardingTourProps {
  isNew: boolean;
  onComplete: () => void;
}

interface TourStep {
  id: number;
  title: string;
  content: React.ReactNode;
  icon: React.ReactNode;
  color: string;
}

const tourSteps: TourStep[] = [
  {
    id: 1,
    title: "Welcome to Your Expense Tracker! 🎉",
    icon: <FaMoneyBillWave size={28} />,
    color: "var(--color-primary)",
    content: (
      <div>
        <p className="text-[var(--text)]/80 mb-6 leading-relaxed text-base">
          This powerful expense tracking app helps you take control of your finances by tracking spending, 
          managing budgets, and providing insights into your financial habits.
        </p>
        <div className="bg-[var(--bgSecondary)] p-6 rounded-lg">
          <p className="text-base font-medium text-[var(--text)] mb-3">🎯 What this app offers:</p>
          <ul className="text-base text-[var(--text)]/70 space-y-2">
            <li>• Complete expense tracking and categorization</li>
            <li>• Multiple money source management</li>
            <li>• Visual analytics and spending insights</li>
            <li>• Budget monitoring and financial trends</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: 2,
    title: "Step 1: Set Up Your Money Sources",
    icon: <FaPiggyBank size={28} />,
    color: "var(--color-secondary)",
    content: (
      <div>
        <p className="text-[var(--text)]/80 mb-6 leading-relaxed text-base">
          Start by adding your financial accounts - bank accounts, cash, credit cards, savings, or any money source you use.
          This creates the foundation for accurate expense tracking.
        </p>
        <div className="bg-[var(--bgSecondary)] p-6 rounded-lg mb-6">
          <p className="text-base font-medium text-[var(--text)] mb-3">💡 Examples of money sources:</p>
          <ul className="text-base text-[var(--text)]/70 space-y-2">
            <li>• Checking Account, Savings Account</li>
            <li>• Credit Cards, Debit Cards</li>
            <li>• Cash Wallet, Investment Accounts</li>
            <li>• Digital Wallets (PayPal, Venmo, etc.)</li>
          </ul>
        </div>
        <div className="flex items-center gap-3 text-base text-[var(--color-secondary)]">
          <span>📍</span>
          <span>Navigate to: Money Sources to get started</span>
        </div>
      </div>
    ),
  },
  {
    id: 3,
    title: "Step 2: Organize with Categories",
    icon: <FaChartLine size={28} />,
    color: "var(--color-tertiary)",
    content: (
      <div>
        <p className="text-[var(--text)]/80 mb-6 leading-relaxed text-base">
          Create expense categories that match your lifestyle. Good categorization helps you understand 
          where your money goes and identify spending patterns.
        </p>
        <div className="bg-[var(--bgSecondary)] p-6 rounded-lg mb-6">
          <p className="text-base font-medium text-[var(--text)] mb-3">🏷️ Popular categories:</p>
          <div className="grid grid-cols-2 gap-2 text-base text-[var(--text)]/70">
            <div>• Food & Dining</div>
            <div>• Transportation</div>
            <div>• Entertainment</div>
            <div>• Utilities & Bills</div>
            <div>• Shopping</div>
            <div>• Healthcare</div>
          </div>
        </div>
        <div className="flex items-center gap-3 text-base text-[var(--color-tertiary)]">
          <span>📍</span>
          <span>Navigate to: Categories to create yours</span>
        </div>
      </div>
    ),
  },
  {
    id: 4,
    title: "Step 3: Track Every Expense",
    icon: <FaMoneyBillWave size={28} />,
    color: "var(--color-primary)",
    content: (
      <div>
        <p className="text-[var(--text)]/80 mb-6 leading-relaxed text-base">
          The core feature! Record expenses as they happen by specifying the amount, category, 
          money source, and optional description. Consistency is key to meaningful insights.
        </p>
        <div className="bg-[var(--bgSecondary)] p-6 rounded-lg mb-6">
          <p className="text-base font-medium text-[var(--text)] mb-3">⚡ Best practices:</p>
          <ul className="text-base text-[var(--text)]/70 space-y-2">
            <li>• Record expenses immediately after spending</li>
            <li>• Use descriptive notes for future reference</li>
            <li>• Don&apos;t skip small purchases - they add up!</li>
            <li>• Review and edit if you make mistakes</li>
          </ul>
        </div>
        <div className="flex items-center gap-3 text-base text-[var(--color-primary)]">
          <span>📍</span>
          <span>Navigate to: Expenses → Add Expense</span>
        </div>
      </div>
    ),
  },
  {
    id: 5,
    title: "Monitor Your Financial Health",
    icon: <FaChartLine size={28} />,
    color: "var(--color-secondary)",
    content: (
      <div>
        <p className="text-[var(--text)]/80 mb-6 leading-relaxed text-base">
          Your Dashboard provides a complete overview of your finances with real-time charts, 
          trends, and insights that update automatically as you add expenses.
        </p>
        <div className="bg-[var(--bgSecondary)] p-6 rounded-lg mb-6">
          <p className="text-base font-medium text-[var(--text)] mb-3">📊 What you&apos;ll see:</p>
          <ul className="text-base text-[var(--text)]/70 space-y-2">
            <li>• Total balance across all money sources</li>
            <li>• Spending breakdown by category</li>
            <li>• Budget vs actual spending comparisons</li>
            <li>• Weekly and monthly spending trends</li>
          </ul>
        </div>
        <div className="flex items-center gap-3 text-base text-[var(--color-secondary)]">
          <span>📍</span>
          <span>Navigate to: Dashboard (your financial hub)</span>
        </div>
      </div>
    ),
  },
  {
    id: 6,
    title: "Advanced Features & Insights",
    icon: <FaCog size={28} />,
    color: "var(--color-tertiary)",
    content: (
      <div>
        <p className="text-[var(--text)]/80 mb-6 leading-relaxed text-base">
          Beyond basic tracking, discover powerful features that help you understand your financial patterns 
          and make smarter money decisions.
        </p>
        <div className="grid grid-cols-1 gap-4 mb-6">
          <div className="bg-[var(--bgSecondary)] p-4 rounded-lg">
            <p className="text-base font-medium text-[var(--text)]">🧠 User Insights</p>
            <p className="text-sm text-[var(--text)]/70">AI-powered analysis with personalized spending recommendations</p>
          </div>
          <div className="bg-[var(--bgSecondary)] p-4 rounded-lg">
            <p className="text-base font-medium text-[var(--text)]">🎨 Customization</p>
            <p className="text-sm text-[var(--text)]/70">Themes, currency settings, and personal preferences</p>
          </div>
          <div className="bg-[var(--bgSecondary)] p-4 rounded-lg">
            <p className="text-base font-medium text-[var(--text)]">📈 Spending Comparison</p>
            <p className="text-sm text-[var(--text)]/70">Compare spending patterns across different time periods</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-base text-[var(--color-tertiary)]">
          <span>✨</span>
          <span>Explore: User Insights & Settings when ready</span>
        </div>
      </div>
    ),
  },
  {
    id: 7,
    title: "You're Ready to Take Control! 🚀",
    icon: <FaChartLine size={28} />,
    color: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))",
    content: (
      <div>
        <p className="text-[var(--text)]/80 mb-6 leading-relaxed text-base">
          You now understand how to use this expense tracker effectively. Remember: consistent tracking 
          leads to better insights and smarter financial decisions.
        </p>
        <div className="bg-gradient-to-r from-[var(--color-primary)]/10 to-[var(--color-secondary)]/10 p-6 rounded-lg mb-6 border border-[var(--color-primary)]/20">
          <p className="text-base font-medium text-[var(--text)] mb-3">🎯 Your action plan:</p>
          <ol className="text-base text-[var(--text)]/70 space-y-2 list-decimal list-inside">
            <li>Set up your money sources (bank accounts, cards, cash)</li>
            <li>Create 5-8 expense categories that fit your lifestyle</li>
            <li>Start tracking expenses immediately</li>
            <li>Check your dashboard weekly to review patterns</li>
            <li>Explore insights after a few weeks of data</li>
          </ol>
        </div>
        <div className="text-center">
          <p className="text-base text-[var(--color-primary)] font-medium">
            💡 Remember: You can restart this tour anytime from Settings
          </p>
        </div>
      </div>
    ),
  },
];

const OnboardingTour: React.FC<OnboardingTourProps> = ({ isNew, onComplete }) => {
  const [showWelcome, setShowWelcome] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (isNew) {
      setShowWelcome(true);
    }
  }, [isNew]);

  const startTour = () => {
    setShowWelcome(false);
    setShowTour(true);
    setCurrentStep(0);
  };

  const skipTour = () => {
    setShowWelcome(false);
    setShowTour(false);
    onComplete();
  };

  const nextStep = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeTour();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeTour = () => {
    setShowTour(false);
    onComplete();
  };

  const currentTourStep = tourSteps[currentStep];

  return (
    <>
      {/* Welcome Modal */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 w-screen h-screen bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-[var(--bg)] rounded-[var(--border-radius)] p-10 w-full max-w-2xl border border-[var(--border-color)] shadow-2xl"
            >
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="mx-auto w-20 h-20 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-full flex items-center justify-center mb-6"
                >
                  <FaMoneyBillWave size={36} className="text-white" />
                </motion.div>
                
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl font-bold text-[var(--text)] mb-4"
                >
                  Welcome to Your Financial Journey! 🎉
                </motion.h2>
                
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-[var(--text)]/70 text-base leading-relaxed"
                >
                  You&apos;ve successfully joined our expense tracking platform! 
                  Let&apos;s take a quick tour to help you get started with managing your finances like a pro.
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-[var(--bgSecondary)] rounded-lg p-6 mb-8"
              >
                <h3 className="font-semibold text-[var(--text)] mb-4 flex items-center gap-2 text-lg">
                  <FiCheck className="text-[var(--color-primary)]" />
                  What you&apos;ll discover:
                </h3>
                <ul className="text-base text-[var(--text)]/70 space-y-3">
                  <li className="flex items-center gap-3">
                    <span className="w-3 h-3 bg-[var(--color-primary)] rounded-full flex-shrink-0"></span>
                    Complete app overview and financial management tools
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-3 h-3 bg-[var(--color-secondary)] rounded-full flex-shrink-0"></span>
                    Budget tracking and expense visualization
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-3 h-3 bg-[var(--color-tertiary)] rounded-full flex-shrink-0"></span>
                    Navigation and key features
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-3 h-3 bg-[var(--color-primary)] rounded-full flex-shrink-0"></span>
                    Tips for getting the most out of the platform
                  </li>
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex gap-3"
              >
                <button
                  onClick={startTour}
                  className="flex-1 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white py-3 px-6 rounded-[var(--border-radius)] font-medium transition-colors flex items-center justify-center gap-3 group text-base"
                >
                  Start Tour
                  <FiArrowRight className="transition-transform group-hover:translate-x-1" size={20} />
                </button>
                <button
                  onClick={skipTour}
                  className="px-6 py-3 text-[var(--text)]/70 hover:text-[var(--text)] transition-colors border border-[var(--border-color)] rounded-[var(--border-radius)] hover:bg-[var(--bgSecondary)] text-base"
                >
                  Skip
                </button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tour Steps Modal */}
      <AnimatePresence>
        {showTour && currentTourStep && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              key={currentStep}
              initial={{ scale: 0.9, opacity: 0, x: 50 }}
              animate={{ scale: 1, opacity: 1, x: 0 }}
              exit={{ scale: 0.9, opacity: 0, x: -50 }}
              className="bg-[var(--bg)] rounded-[var(--border-radius)] p-8 w-full max-w-2xl border border-[var(--border-color)] shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div 
                    className="p-4 rounded-full text-white flex-shrink-0"
                    style={{ backgroundColor: currentTourStep.color }}
                  >
                    {currentTourStep.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-[var(--text)]">
                      {currentTourStep.title}
                    </h3>
                    <p className="text-[var(--text)]/60 text-sm">
                      Step {currentStep + 1} of {tourSteps.length}
                    </p>
                  </div>
                </div>
                <button
                  onClick={skipTour}
                  className="p-2 hover:bg-[var(--bgSecondary)] rounded-full transition-colors"
                  title="Skip tour"
                >
                  <FiX size={20} className="text-[var(--text)]/60" />
                </button>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-xs text-[var(--text)]/60 mb-2">
                  <span>Progress</span>
                  <span>{Math.round(((currentStep + 1) / tourSteps.length) * 100)}%</span>
                </div>
                <div className="w-full bg-[var(--bgSecondary)] rounded-full h-2">
                  <motion.div
                    className="h-2 bg-[var(--color-primary)] rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentStep + 1) / tourSteps.length) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>

              {/* Content */}
              <div className="mb-8">
                {currentTourStep.content}
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="flex items-center gap-2 px-4 py-2 text-[var(--text)] border border-[var(--border-color)] rounded-[var(--border-radius)] hover:bg-[var(--bgSecondary)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiArrowLeft size={16} />
                  Back
                </button>

                <div className="flex gap-2">
                  {tourSteps.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentStep 
                          ? 'bg-[var(--color-primary)]' 
                          : index < currentStep 
                            ? 'bg-[var(--color-primary)]/50' 
                            : 'bg-[var(--bgSecondary)]'
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={nextStep}
                  className="flex items-center gap-2 px-6 py-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white rounded-[var(--border-radius)] transition-colors font-medium"
                >
                  {currentStep === tourSteps.length - 1 ? 'Finish' : 'Next'}
                  <FiArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default OnboardingTour;
