"use client";

import { useState, useEffect } from 'react';
import Joyride, { STATUS, EVENTS, ACTIONS, Step, CallBackProps } from 'react-joyride';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowRight, FiCheck } from 'react-icons/fi';
import { FaMoneyBillWave, FaChartLine, FaPiggyBank, FaCog } from 'react-icons/fa';

interface OnboardingTourProps {
    isNew: boolean;
    onComplete: () => void;
}

const steps: Step[] = [
    {
        target: 'body', content: (
            <div className="p-8">
                <div className="flex items-center gap-4 mb-6">
                    <div className="p-4 rounded-full bg-[var(--color-primary)] text-white">
                        <FaMoneyBillWave size={28} />
                    </div>
                    <h3 className="text-2xl font-bold text-[var(--text)]">Welcome to Your Expense Tracker! 🎉</h3>
                </div>
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
        placement: 'center',
        disableBeacon: true,
    },
    {
        target: 'body', content: (
            <div className="p-8">
                <div className="flex items-center gap-4 mb-6">
                    <div className="p-4 rounded-full bg-[var(--color-secondary)] text-white">
                        <FaPiggyBank size={28} />
                    </div>
                    <h3 className="text-2xl font-bold text-[var(--text)]">Step 1: Set Up Your Money Sources</h3>
                </div>
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
        placement: 'center',
    },
    {
        target: 'body',
        content: (
            <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-full bg-[var(--color-tertiary)] text-white">
                        <FaChartLine size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-[var(--text)]">Step 2: Organize with Categories</h3>
                </div>
                <p className="text-[var(--text)]/80 mb-4 leading-relaxed">
                    Create expense categories that match your lifestyle. Good categorization helps you understand
                    where your money goes and identify spending patterns.
                </p>
                <div className="bg-[var(--bgSecondary)] p-4 rounded-lg mb-4">
                    <p className="text-sm font-medium text-[var(--text)] mb-2">🏷️ Popular categories:</p>
                    <div className="grid grid-cols-2 gap-2 text-sm text-[var(--text)]/70">
                        <div>• Food & Dining</div>
                        <div>• Transportation</div>
                        <div>• Entertainment</div>
                        <div>• Utilities & Bills</div>
                        <div>• Shopping</div>
                        <div>• Healthcare</div>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-[var(--color-tertiary)]">
                    <span>📍</span>
                    <span>Navigate to: Categories to create yours</span>
                </div>
            </div>
        ),
        placement: 'center',
    }, {
        target: 'body',
        content: (
            <div className="p-8">
                <div className="flex items-center gap-4 mb-6">
                    <div className="p-4 rounded-full bg-[var(--color-primary)] text-white">
                        <FaMoneyBillWave size={28} />
                    </div>
                    <h3 className="text-2xl font-bold text-[var(--text)]">Step 3: Track Every Expense</h3>
                </div>
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
        placement: 'center',
    }, {
        target: 'body',
        content: (
            <div className="p-8">
                <div className="flex items-center gap-4 mb-6">
                    <div className="p-4 rounded-full bg-[var(--color-secondary)] text-white">
                        <FaChartLine size={28} />
                    </div>
                    <h3 className="text-2xl font-bold text-[var(--text)]">Monitor Your Financial Health</h3>
                </div>        <p className="text-[var(--text)]/80 mb-6 leading-relaxed text-base">
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
        placement: 'center',
    }, {
        target: 'body',
        content: (
            <div className="p-8">
                <div className="flex items-center gap-4 mb-6">
                    <div className="p-4 rounded-full bg-[var(--color-tertiary)] text-white">
                        <FaCog size={28} />
                    </div>
                    <h3 className="text-2xl font-bold text-[var(--text)]">Advanced Features & Insights</h3>
                </div>
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
        placement: 'center',
    }, {
        target: 'body',
        content: (
            <div className="p-8">
                <div className="flex items-center gap-4 mb-6">
                    <div className="p-4 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] text-white">
                        <FaChartLine size={28} />
                    </div>
                    <h3 className="text-2xl font-bold text-[var(--text)]">You&apos;re Ready to Take Control! 🚀</h3>
                </div>        <p className="text-[var(--text)]/80 mb-6 leading-relaxed text-base">
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
        placement: 'center',
    },
];

const OnboardingTour = ({ isNew, onComplete }: OnboardingTourProps) => {
    const [runTour, setRunTour] = useState(false);
    const [stepIndex, setStepIndex] = useState(0);
    const [showWelcome, setShowWelcome] = useState(false);

    useEffect(() => {
        if (isNew) {
            setShowWelcome(true);
        }
    }, [isNew]);

    const handleJoyrideCallback = (data: CallBackProps) => {
        const { status, action, index, type } = data;

        if (type === EVENTS.STEP_AFTER || type === EVENTS.TARGET_NOT_FOUND) {
            setStepIndex(index + (action === ACTIONS.PREV ? -1 : 1));
        }

        if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
            setRunTour(false);
            onComplete();
        }
    };

    const startTour = () => {
        setShowWelcome(false);
        setRunTour(true);
        setStepIndex(0);
    };

    const skipTour = () => {
        setShowWelcome(false);
        setRunTour(false);
        onComplete();
    };

    return (
        <>
            <AnimatePresence>
                {showWelcome && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 h-screen w-screen bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.8, opacity: 0, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 400 }}
                            className="bg-[var(--bg)] rounded-[var(--border-radius)] p-10 max-w-3xl w-full border border-[var(--border-color)] shadow-2xl relative overflow-hidden"
                        >
                            {/* Background Decoration */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-full opacity-10 blur-3xl"></div>

                            <div className="relative z-10">
                                <div className="text-center mb-8">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.2, type: "spring", damping: 15 }}
                                        className="w-20 h-20 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-full flex items-center justify-center mx-auto mb-6"
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
                                            Dashboard overview and key financial metrics
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
                                >                  <button
                                    onClick={startTour}
                                    className="flex-1 btn flex items-center justify-center gap-3 group py-3 text-base font-medium"
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
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Joyride
                steps={steps}
                run={runTour}
                stepIndex={stepIndex}
                callback={handleJoyrideCallback}
                continuous
                showProgress
                showSkipButton
                scrollToFirstStep
                scrollDuration={1000}
                disableOverlayClose
                disableCloseOnEsc={false}
                styles={{
                    options: {
                        primaryColor: 'var(--color-primary)',
                        backgroundColor: 'var(--bg)',
                        textColor: 'var(--text)',
                        overlayColor: 'rgba(0, 0, 0, 0.8)',
                        zIndex: 1000,
                    },
                    tooltip: {
                        borderRadius: 'var(--border-radius)',
                        backgroundColor: 'var(--bg)',
                        border: '1px solid var(--border-color)',
                        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
                        minWidth: '500px',
                        width: '650px',
                        fontSize: '15px',
                        lineHeight: '1.6',
                        animation: 'fadeIn 0.3s ease-in-out',
                        padding: '20px',
                    },
                    tooltipContent: {
                        padding: '0',
                        color: 'var(--text)',
                    },
                    buttonNext: {
                        backgroundColor: 'var(--color-primary)',
                        borderRadius: 'var(--border-radius)',
                        fontSize: '15px',
                        padding: '10px 20px',
                        border: 'none',
                        fontWeight: '500',
                    },
                    buttonBack: {
                        color: 'var(--text)',
                        backgroundColor: 'transparent',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--border-radius)',
                        fontSize: '15px',
                        padding: '10px 20px',
                        marginRight: '12px',
                        fontWeight: '500',
                    },
                    buttonSkip: {
                        color: 'var(--text)',
                        backgroundColor: 'transparent',
                        fontSize: '15px',
                        padding: '10px 20px',
                        fontWeight: '500',
                    },
                    buttonClose: {
                        display: 'none',
                    },
                    spotlight: {
                        borderRadius: 'var(--border-radius)',
                    },
                }}
                locale={{
                    next: 'Next',
                    back: 'Back',
                    skip: 'Skip Tour',
                    last: 'Finish',
                }}
            />
        </>
    );
};

export default OnboardingTour;
