import { useState, useEffect } from 'react';
import { LogbookDashboard, FlightEntry } from './components/LogbookDashboard';
import { AddFlightScreen } from './components/AddFlightScreen';
import { FlightDetailsScreen } from './components/FlightDetailsScreen';
import { StatisticsScreen } from './components/StatisticsScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { BottomNavigation } from './components/BottomNavigation';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';
import { AnimatePresence, motion } from 'framer-motion';

type Screen = 'logbook' | 'add' | 'details' | 'stats' | 'profile' | 'settings';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('logbook');
  const [activeTab, setActiveTab] = useState('logbook');

  // Track direction for slide animation
  const [direction, setDirection] = useState(0);

  // Initialize flights from localStorage if available
  const [flights, setFlights] = useState<FlightEntry[]>(() => {
    const savedFlights = localStorage.getItem('pilot_flights');
    if (savedFlights) {
      try {
        return JSON.parse(savedFlights);
      } catch (e) {
        console.error('Failed to parse saved flights', e);
      }
    }
    return [
      {
        id: '1',
        date: '2026-02-08',
        departure: 'KJFK',
        arrival: 'KLAX',
        aircraft: 'B737',
        flightTime: 5.5,
        notes: 'Clear skies, smooth flight. Perfect weather conditions throughout.'
      },
      {
        id: '2',
        date: '2026-02-06',
        departure: 'KSFO',
        arrival: 'KORD',
        aircraft: 'A320',
        flightTime: 4.2,
        notes: 'Minor turbulence over the Rockies.'
      },
      {
        id: '3',
        date: '2026-02-03',
        departure: 'KMIA',
        arrival: 'KATL',
        aircraft: 'B737',
        flightTime: 1.8,
        notes: ''
      },
      {
        id: '4',
        date: '2026-01-28',
        departure: 'KBOS',
        arrival: 'KDFW',
        aircraft: 'A320',
        flightTime: 3.7,
        notes: 'Good passenger load, on-time departure and arrival.'
      },
      {
        id: '5',
        date: '2026-01-25',
        departure: 'KSEA',
        arrival: 'KPHX',
        aircraft: 'B737',
        flightTime: 2.9,
        notes: ''
      },
      {
        id: '6',
        date: '2026-01-20',
        departure: 'KLAS',
        arrival: 'KJFK',
        aircraft: 'B787',
        flightTime: 5.1,
        notes: 'Red-eye flight, minimal traffic. Excellent fuel efficiency.'
      }
    ];
  });

  // Save to localStorage whenever flights change
  useEffect(() => {
    localStorage.setItem('pilot_flights', JSON.stringify(flights));
  }, [flights]);

  const [selectedFlight, setSelectedFlight] = useState<FlightEntry | null>(null);
  const [editingFlight, setEditingFlight] = useState<FlightEntry | undefined>(undefined);

  const totalHours = flights.reduce((sum, flight) => sum + flight.flightTime, 0);

  const handleAddFlight = () => {
    setEditingFlight(undefined);
    setDirection(1);
    setCurrentScreen('add');
  };

  const handleFlightClick = (flight: FlightEntry) => {
    setSelectedFlight(flight);
    setDirection(1);
    setCurrentScreen('details');
  };

  const handleSaveFlight = (flightData: Omit<FlightEntry, 'id'>) => {
    if (editingFlight) {
      // Update existing flight
      setFlights(flights.map(f =>
        f.id === editingFlight.id
          ? { ...flightData, id: editingFlight.id }
          : f
      ));
    } else {
      // Add new flight
      const newFlight: FlightEntry = {
        ...flightData,
        id: Date.now().toString(),
      };
      setFlights([newFlight, ...flights]);
    }
    setDirection(-1);
    setCurrentScreen('logbook');
    setEditingFlight(undefined);
  };

  const handleEditFlight = () => {
    if (selectedFlight) {
      setEditingFlight(selectedFlight);
      setDirection(1);
      setCurrentScreen('add');
    }
  };

  const handleDeleteFlight = () => {
    if (selectedFlight) {
      setFlights(flights.filter(f => f.id !== selectedFlight.id));
      toast.success('Flight deleted from logbook');
      setDirection(-1);
      setCurrentScreen('logbook');
      setSelectedFlight(null);
    }
  };

  const handleBack = () => {
    setCurrentScreen('logbook');
    setEditingFlight(undefined);
  };

  const handleTabChange = (tab: string) => {
    const screens = ['logbook', 'stats', 'profile'];
    const oldIndex = screens.indexOf(activeTab);
    const newIndex = screens.indexOf(tab);
    setDirection(newIndex > oldIndex ? 1 : -1);

    setActiveTab(tab);
    setCurrentScreen(tab as Screen);
  };

  const [currentTheme, setCurrentTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('app_theme') as 'dark' | 'light') || 'dark';
  });

  const handleThemeChange = (theme: 'dark' | 'light') => {
    setCurrentTheme(theme);
    localStorage.setItem('app_theme', theme);
  };

  const handleOpenSettings = () => {
    setDirection(1);
    setCurrentScreen('settings');
  };

  return (
    <div className={`h-[100dvh] w-full max-w-[480px] mx-auto overflow-hidden flex flex-col relative shadow-2xl safe-area-top safe-area-bottom transition-colors duration-500 ${currentTheme === 'dark' ? 'bg-slate-950 dark' : 'bg-slate-50'}`}>
      {/* Main Content Area with Transitions */}
      <div className={`flex-1 overflow-hidden relative transition-colors duration-500 ${currentTheme === 'dark' ? 'bg-slate-900' : 'bg-white'}`}>
        <AnimatePresence initial={false} custom={direction} mode='popLayout'>
          <motion.div
            key={currentScreen}
            custom={direction}
            variants={{
              enter: (direction: number) => ({
                x: direction > 0 ? '100%' : '-100%',
                opacity: 0,
                zIndex: 1,
                scale: 0.95
              }),
              center: {
                x: 0,
                opacity: 1,
                zIndex: 2,
                scale: 1
              },
              exit: (direction: number) => ({
                x: direction < 0 ? '100%' : '-100%',
                opacity: 0,
                zIndex: 0,
                scale: 0.95
              })
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            className="absolute inset-0 w-full h-full bg-slate-900"
          >
            {currentScreen === 'logbook' && (
              <LogbookDashboard
                flights={flights}
                onFlightClick={handleFlightClick}
                onAddFlight={handleAddFlight}
                totalHours={totalHours}
              />
            )}

            {currentScreen === 'add' && (
              <AddFlightScreen
                onBack={() => {
                  setDirection(-1);
                  setCurrentScreen(editingFlight ? 'details' : 'logbook');
                }}
                onSave={handleSaveFlight}
                editingFlight={editingFlight}
              />
            )}

            {currentScreen === 'details' && selectedFlight && (
              <FlightDetailsScreen
                flight={selectedFlight}
                onBack={() => {
                  setDirection(-1);
                  setCurrentScreen('logbook');
                }}
                onEdit={handleEditFlight}
                onDelete={handleDeleteFlight}
              />
            )}

            {currentScreen === 'stats' && (
              <StatisticsScreen flights={flights} />
            )}

            {currentScreen === 'profile' && (
              <ProfileScreen flights={flights} onOpenSettings={handleOpenSettings} />
            )}

            {currentScreen === 'settings' && (
              <SettingsScreen
                currentTheme={currentTheme}
                onThemeChange={handleThemeChange}
                onBack={() => {
                  setDirection(-1);
                  setCurrentScreen('profile');
                }}
                onClearData={() => {
                  if (confirm('Are you sure? This will delete all flights permanently.')) {
                    setFlights([]);
                    localStorage.removeItem('pilot_flights');
                    toast.success('All data cleared');
                  }
                }}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Navigation - Hide on sub-screens */}
      {['logbook', 'stats', 'profile'].includes(currentScreen) && (
        <div className="absolute bottom-0 left-0 right-0 z-50">
          <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />
        </div>
      )}

      <Toaster position="top-center" />
    </div>
  );
}