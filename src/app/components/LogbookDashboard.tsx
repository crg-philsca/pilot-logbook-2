import { useState, useRef, useEffect } from 'react';
import { Plus, Search, Plane, Clock, MapPin, Calendar as CalendarIcon, RefreshCw, Filter, X, ChevronDown } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { motion, AnimatePresence } from 'motion/react';

export interface FlightEntry {
  id: string;
  date: string;
  departure: string;
  arrival: string;
  aircraft: string;
  flightTime: number;
  notes: string;
}

interface LogbookDashboardProps {
  flights: FlightEntry[];
  onFlightClick: (flight: FlightEntry) => void;
  onAddFlight: () => void;
  totalHours: number;
}

export function LogbookDashboard({ flights, onFlightClick, onAddFlight, totalHours }: LogbookDashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const filterRef = useRef<HTMLDivElement>(null);

  // Close filter when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setShowFilter(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [filterRef]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  const filteredFlights = flights.filter(flight => {
    const matchesSearch = flight.departure.toLowerCase().includes(searchQuery.toLowerCase()) ||
      flight.arrival.toLowerCase().includes(searchQuery.toLowerCase()) ||
      flight.aircraft.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesDate = true;
    if (startDate && endDate) {
      matchesDate = flight.date >= startDate && flight.date <= endDate;
    } else if (startDate) {
      matchesDate = flight.date >= startDate;
    } else if (endDate) {
      matchesDate = flight.date <= endDate;
    }

    return matchesSearch && matchesDate;
  });

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase();
  };

  const formatTime = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}H ${m}M`;
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950 relative transition-colors duration-500">
      {/* Update Available Banner */}
      {isRefreshing && (
        <div className="bg-blue-600 text-white px-4 py-3 text-sm font-medium flex justify-between items-center animate-in slide-in-from-top-2 absolute top-0 left-0 right-0 z-50">
          <span className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4 animate-spin" />
            Updating cockpit systems...
          </span>
        </div>
      )}

      {/* Header with Cockpit Design */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 pt-14 pb-6 shadow-2xl z-20 sticky top-0 transition-colors duration-500">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-[10px] text-blue-500 font-bold tracking-[0.2em] uppercase mb-1 drop-shadow-sm">Flight Deck</div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white drop-shadow-sm transition-colors duration-500">LOGBOOK</h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Total Hours Badge */}
            <div className="bg-slate-100 dark:bg-slate-800/80 backdrop-blur-md rounded-xl px-4 py-2 text-right border border-slate-200 dark:border-slate-700/50 shadow-lg min-w-[90px] relative overflow-hidden group transition-colors duration-500">
              <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="text-2xl font-mono font-bold text-slate-900 dark:text-white tracking-tighter leading-none transition-colors duration-500">{totalHours.toFixed(1)}</div>
              <div className="text-[8px] uppercase tracking-widest text-slate-500 dark:text-slate-400 mt-1 font-bold">Hours</div>
            </div>
          </div>
        </div>

        {/* Search Bar & Filter */}
        <div className="flex gap-3 relative" ref={filterRef}>
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 h-5 w-5 group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400 transition-colors" />
            <Input
              type="text"
              placeholder="Search logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 h-12 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium"
            />
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowFilter(!showFilter)}
            className={`h-12 w-12 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-700 hover:text-blue-500 dark:hover:text-white transition-all ${showFilter || startDate || endDate ? 'border-blue-500 text-blue-500 dark:text-blue-400' : 'text-slate-400'}`}
          >
            <Filter className="h-5 w-5" />
          </Button>

          {/* Dropdown Filter */}
          <AnimatePresence>
            {showFilter && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute top-14 right-0 w-72 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl p-4 z-50"
              >
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Filter Date Range</span>
                  {(startDate || endDate) && (
                    <button onClick={() => { setStartDate(''); setEndDate(''); }} className="text-[10px] text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 font-bold uppercase">Clear</button>
                  )}
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] text-slate-500 uppercase font-bold mb-1 block">Start Date</label>
                    <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white h-9 text-xs" />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 uppercase font-bold mb-1 block">End Date</label>
                    <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white h-9 text-xs" />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Flight List */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 pb-32 bg-slate-50 dark:bg-slate-950/50 transition-colors duration-500">
        {filteredFlights.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-6 opacity-60">
            <Plane className="h-16 w-16 text-slate-300 dark:text-slate-700 mb-4 transition-colors" />
            <h3 className="text-lg font-bold text-slate-400 dark:text-slate-500 transition-colors">NO FLIGHTS RECORDED</h3>
          </div>
        ) : (
          filteredFlights.map((flight) => (
            <motion.div
              key={flight.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card
                className="cursor-pointer group hover:border-blue-400 dark:hover:border-blue-500/50 transition-all duration-300 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 backdrop-blur-sm overflow-hidden relative shadow-sm dark:shadow-lg hover:shadow-md dark:hover:shadow-blue-900/10"
                onClick={() => onFlightClick(flight)}
              >
                {/* Top Bar: Date & ID */}
                <div className="flex justify-between items-center px-5 py-3 border-b border-slate-100 dark:border-slate-800/50 bg-slate-50 dark:bg-slate-900/30 transition-colors">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-3 w-3 text-blue-500" />
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 tracking-widest uppercase">{formatDate(flight.date)}</span>
                  </div>
                  <Badge variant="outline" className="border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-[10px] font-mono bg-white dark:bg-slate-800/50 px-2 py-0.5">
                    {flight.aircraft}
                  </Badge>
                </div>

                {/* Main Content: Route Visualization */}
                <div className="px-5 py-6">
                  <div className="flex items-center justify-between">
                    {/* Departure */}
                    <div className="text-left w-24">
                      <span className="block text-3xl font-black text-slate-900 dark:text-white tracking-widest font-mono transition-colors">{flight.departure}</span>
                      <span className="text-[9px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider mt-1 block transition-colors">Departure</span>
                    </div>

                    {/* Center Visual */}
                    <div className="flex-1 flex flex-col items-center justify-center px-2 relative">
                      {/* Vector Line */}
                      <div className="w-full h-px bg-slate-200 dark:bg-slate-700 relative flex items-center justify-center transition-colors">
                        <div className="absolute left-0 w-1 h-1 bg-slate-300 dark:bg-slate-600 rounded-full transition-colors"></div>
                        <div className="absolute right-0 w-1 h-1 bg-slate-300 dark:bg-slate-600 rounded-full transition-colors"></div>

                        {/* Plane Icon */}
                        <div className="bg-white dark:bg-slate-900 px-2 z-10 transition-colors">
                          <Plane className="h-5 w-5 text-blue-500 rotate-90" />
                        </div>
                      </div>

                      {/* Flight Time Below Plane */}
                      <div className="mt-2 text-center">
                        <span className="text-sm font-bold text-slate-800 dark:text-white font-mono tracking-wide block transition-colors">{formatTime(flight.flightTime)}</span>
                        <span className="text-[8px] text-slate-400 dark:text-slate-500 uppercase tracking-widest block transition-colors">Total Time</span>
                      </div>
                    </div>

                    {/* Arrival */}
                    <div className="text-right w-24">
                      <span className="block text-3xl font-black text-slate-900 dark:text-white tracking-widest font-mono transition-colors">{flight.arrival}</span>
                      <span className="text-[9px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider mt-1 block transition-colors">Arrival</span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      {/* Floating Add Button */}
      <div className="fixed bottom-24 right-6 z-30">
        <Button
          onClick={onAddFlight}
          size="lg"
          className="h-14 w-14 rounded-full shadow-2xl bg-blue-600 hover:bg-blue-500 active:scale-95 transition-transform border border-blue-400/20"
          aria-label="Add new flight"
        >
          <Plus className="h-6 w-6 text-white" />
        </Button>
      </div>
    </div>
  );
}