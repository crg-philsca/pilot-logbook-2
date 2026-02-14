import { useState } from 'react';
import { Plus, Search, Plane, Clock, MapPin, Calendar as CalendarIcon, RefreshCw } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { motion } from 'motion/react';

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

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  const filteredFlights = flights.filter(flight =>
    flight.departure.toLowerCase().includes(searchQuery.toLowerCase()) ||
    flight.arrival.toLowerCase().includes(searchQuery.toLowerCase()) ||
    flight.aircraft.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-blue-50 to-white">
      {/* Update Available Banner - Shows only when new version is ready */}
      {isRefreshing && (
        <div className="bg-blue-600 text-white px-4 py-3 text-sm font-medium flex justify-between items-center animate-in slide-in-from-top-2">
          <span className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4 animate-spin" />
            Updating flight deck...
          </span>
        </div>
      )}

      {/* Header with Cockpit Design */}
      <div className="bg-slate-900 text-white px-6 pt-12 pb-8 shadow-2xl z-10 sticky top-0 border-b border-slate-800">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="text-[10px] text-blue-400 font-bold tracking-[0.2em] uppercase mb-1">Flight Deck</div>
            <h1 className="text-3xl font-black tracking-tight text-white">LOGBOOK</h1>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleRefresh}
              className="p-3 rounded-full bg-slate-800 hover:bg-slate-700 active:scale-95 transition-all text-blue-400 border border-slate-700 shadow-inner"
              aria-label="Refresh App"
            >
              <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
            <div className="bg-slate-800/80 backdrop-blur-md rounded-xl px-4 py-2 text-right border border-slate-700 shadow-lg min-w-[100px]">
              <div className="text-3xl font-mono font-bold text-white tracking-tighter leading-none">{totalHours.toFixed(1)}</div>
              <div className="text-[9px] uppercase tracking-widest text-slate-400 mt-1 font-semibold">Total Hours</div>
            </div>
          </div>
        </div>

        {/* Search Bar - Integrated */}
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5 group-focus-within:text-blue-400 transition-colors" />
          <Input
            type="text"
            placeholder="Search logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-4 h-12 rounded-xl border-0 bg-slate-800/50 text-white placeholder:text-slate-500 focus:bg-slate-800 focus:ring-2 focus:ring-blue-500 transition-all font-medium"
            aria-label="Search flights"
          />
        </div>
      </div>

      {/* Flight List - Ticket Style */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 pb-32 bg-slate-50">
        {filteredFlights.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-6 opacity-60">
            <Plane className="h-16 w-16 text-slate-300 mb-4" />
            <h3 className="text-lg font-bold text-slate-400">NO FLIGHTS FOUND</h3>
          </div>
        ) : (
          filteredFlights.map((flight) => (
            <motion.div
              key={flight.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <Card
                className="cursor-pointer group hover:shadow-xl transition-all duration-300 border-0 shadow-sm bg-white overflow-hidden relative"
                onClick={() => onFlightClick(flight)}
                role="button"
                tabIndex={0}
              >
                {/* Decorative Side Bar */}
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-600 group-hover:bg-blue-500 transition-colors"></div>

                <div className="flex flex-col relative w-full">
                  {/* Ticket Header: Date & Aircraft */}
                  <div className="flex justify-between items-center px-5 py-3 bg-slate-50 border-b border-dashed border-slate-200">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-slate-300 group-hover:bg-blue-400 transition-colors"></div>
                      <span className="text-xs font-bold text-slate-500 tracking-wide uppercase font-mono">{formatDate(flight.date)}</span>
                    </div>
                    <Badge variant="outline" className="border-slate-200 text-slate-600 font-mono text-xs bg-white px-2 py-0.5 shadow-sm">
                      {flight.aircraft}
                    </Badge>
                  </div>

                  {/* Ticket Body: Route */}
                  <div className="px-5 py-5 flex justify-between items-center">
                    <div className="text-left">
                      <span className="block text-4xl font-black text-slate-800 tracking-tighter">{flight.departure}</span>
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Depart</span>
                    </div>

                    <div className="flex-1 px-6 flex flex-col items-center justify-center">
                      <Plane className="h-5 w-5 text-blue-500 rotate-90 mb-1" />
                      <div className="w-full h-px bg-slate-200 relative">
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="block text-4xl font-black text-slate-800 tracking-tighter">{flight.arrival}</span>
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Arrive</span>
                    </div>
                  </div>

                  {/* Ticket Footer: Time */}
                  <div className="bg-slate-900 px-5 py-3 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Clock className="h-3 w-3" />
                      <span className="text-[10px] uppercase tracking-wider font-bold">Total Duration</span>
                    </div>
                    <div className="text-blue-400 font-mono font-bold text-lg tracking-tight">
                      {formatTime(flight.flightTime)}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      {/* Floating Add Button */}
      <div className="fixed bottom-24 right-6 z-10">
        <Button
          onClick={onAddFlight}
          size="lg"
          className="h-16 w-16 rounded-full shadow-2xl bg-blue-600 hover:bg-blue-700 active:scale-95 transition-transform"
          aria-label="Add new flight"
        >
          <Plus className="h-7 w-7" />
        </Button>
      </div>
    </div>
  );
}