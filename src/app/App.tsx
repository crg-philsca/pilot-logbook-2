import { useState, useEffect } from 'react';
import { LogbookDashboard, FlightEntry } from './components/LogbookDashboard';
import { AddFlightScreen } from './components/AddFlightScreen';
import { FlightDetailsScreen } from './components/FlightDetailsScreen';
import { StatisticsScreen } from './components/StatisticsScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { BottomNavigation } from './components/BottomNavigation';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';

type Screen = 'logbook' | 'add' | 'details' | 'stats' | 'profile';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('logbook');
  const [activeTab, setActiveTab] = useState('logbook');

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
    setCurrentScreen('add');
  };

  const handleFlightClick = (flight: FlightEntry) => {
    setSelectedFlight(flight);
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
    setCurrentScreen('logbook');
    setEditingFlight(undefined);
  };

  const handleEditFlight = () => {
    if (selectedFlight) {
      setEditingFlight(selectedFlight);
      setCurrentScreen('add');
    }
  };

  const handleDeleteFlight = () => {
    if (selectedFlight) {
      setFlights(flights.filter(f => f.id !== selectedFlight.id));
      toast.success('Flight deleted successfully');
      setCurrentScreen('logbook');
      setSelectedFlight(null);
    }
  };

  const handleBack = () => {
    setCurrentScreen('logbook');
    setEditingFlight(undefined);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'logbook') {
      setCurrentScreen('logbook');
    } else if (tab === 'stats') {
      setCurrentScreen('stats');
    } else if (tab === 'profile') {
      setCurrentScreen('profile');
    }
  };

  return (
    <div className="h-screen w-full max-w-[480px] mx-auto bg-white overflow-hidden flex flex-col relative shadow-2xl">
      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden">
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
            onBack={handleBack}
            onSave={handleSaveFlight}
            editingFlight={editingFlight}
          />
        )}

        {currentScreen === 'details' && selectedFlight && (
          <FlightDetailsScreen
            flight={selectedFlight}
            onBack={handleBack}
            onEdit={handleEditFlight}
            onDelete={handleDeleteFlight}
          />
        )}

        {currentScreen === 'stats' && (
          <StatisticsScreen flights={flights} />
        )}

        {currentScreen === 'profile' && (
          <ProfileScreen flights={flights} />
        )}
      </div>

      {/* Bottom Navigation - Only show on main screens */}
      {(currentScreen === 'logbook' || currentScreen === 'stats' || currentScreen === 'profile') && (
        <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />
      )}

      {/* Toast Notifications */}
      <Toaster position="top-center" />
    </div>
  );
}