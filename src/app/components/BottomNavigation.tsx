import { BookOpen, BarChart3, User } from 'lucide-react';
import { motion } from 'motion/react';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const tabs = [
    { id: 'logbook', label: 'Logbook', icon: BookOpen },
    { id: 'stats', label: 'Statistics', icon: BarChart3 },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shadow-[0_-5px_20px_rgba(0,0,0,0.1)] dark:shadow-[0_-5px_20px_rgba(0,0,0,0.5)] z-50 safe-area-bottom pb-safe transition-colors duration-500">
      <nav className="grid grid-cols-3 h-20" role="navigation" aria-label="Bottom navigation">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center py-2 px-4 transition-all duration-300 relative active:scale-95 touch-manipulation group ${isActive ? 'text-blue-500 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                }`}
              style={{ minWidth: '4rem' }}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
            >
              {/* Active Tab Indicator glow */}
              {isActive && (
                <motion.div
                  layoutId="activeTabGlow"
                  className="absolute inset-0 bg-blue-50 dark:bg-blue-500/10 rounded-xl mx-2 my-1"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}

              {/* Top Line Indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeTabLine"
                  className="absolute top-0 w-12 h-1 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.6)]"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}

              <div className="relative z-10 flex flex-col items-center">
                <Icon className={`h-6 w-6 mb-1.5 ${isActive ? 'scale-110 stroke-[2.5px] drop-shadow-sm dark:drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'stroke-2'} transition-all`} />
                <span className={`text-[9px] font-bold tracking-widest uppercase ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                  {tab.label}
                </span>
              </div>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
