import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { HiCheck, HiOutlineSparkles } from 'react-icons/hi2';

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    description: 'Perfect for occasional conversions.',
    features: [
      'Up to 10 conversions per day',
      'Max file size: 50MB',
      'Standard processing speed',
      'Community support',
      'Ad-supported experience'
    ],
    buttonText: 'Get Started',
    premium: false
  },
  {
    name: 'Pro',
    price: '$9.99',
    period: '/mo',
    description: 'Best for power users and creators.',
    features: [
      'Unlimited conversions',
      'Max file size: 2GB',
      'Priority cloud processing',
      'Email support',
      'Ad-free experience',
      'API access (1k req/mo)'
    ],
    buttonText: 'Go Pro',
    premium: true
  },
  {
    name: 'Business',
    price: '$29.99',
    period: '/mo',
    description: 'For teams and high-volume needs.',
    features: [
      'Everything in Pro',
      'Max file size: 10GB',
      'Dedicated cloud instance',
      '24/7 Priority support',
      'Unlimited API access',
      'Team management'
    ],
    buttonText: 'Contact Sales',
    premium: false
  }
];

export default function PricingPage() {
  const { darkMode } = useTheme();

  return (
    <div className={`min-h-screen pt-32 pb-24 ${darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-6xl font-black mb-6"
          >
            Simple, Transparent <span className="gradient-text">Pricing</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`text-xl max-w-2xl mx-auto ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}
          >
            Choose the plan that fits your needs. Scale your workflow with our powerful cloud infrastructure.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`relative flex flex-col p-8 rounded-[2.5rem] border transition-all duration-300 ${
                plan.premium 
                  ? 'bg-slate-900 border-primary-500/50 shadow-2xl shadow-primary-500/20 scale-105 z-10' 
                  : darkMode 
                    ? 'bg-slate-900/50 border-white/5' 
                    : 'bg-white border-slate-200 shadow-xl shadow-slate-200/50'
              }`}
            >
              {plan.premium && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-primary-600 text-white text-xs font-bold rounded-full flex items-center gap-1.5 shadow-lg">
                  <HiOutlineSparkles className="w-4 h-4" />
                  MOST POPULAR
                </div>
              )}

              <div className="mb-8">
                <h3 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-slate-800'}`}>{plan.name}</h3>
                <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{plan.description}</p>
              </div>

              <div className="mb-8">
                <span className="text-5xl font-black">{plan.price}</span>
                {plan.period && <span className={`text-xl ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{plan.period}</span>}
              </div>

              <ul className="space-y-4 mb-10 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm font-medium">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${plan.premium ? 'bg-primary-500 text-white' : 'bg-emerald-500/10 text-emerald-500'}`}>
                      <HiCheck className="w-3.5 h-3.5" />
                    </div>
                    <span className={darkMode ? 'text-slate-300' : 'text-slate-600'}>{feature}</span>
                  </li>
                ))}
              </ul>

              <button className={`w-full py-4 rounded-2xl font-bold transition-all ${
                plan.premium 
                  ? 'gradient-bg text-white shadow-xl shadow-primary-500/25' 
                  : darkMode 
                    ? 'bg-white text-slate-900 hover:bg-slate-100' 
                    : 'bg-slate-900 text-white hover:bg-slate-800'
              }`}>
                {plan.buttonText}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
