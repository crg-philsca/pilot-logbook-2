import { useState } from 'react';
import { Plus, Search, Plane, Clock, MapPin, Calendar as CalendarIcon } from 'lucide-react';
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
      {/* Header with Summary Stats */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 pt-8 pb-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl mb-1">Pilot Logbook</h1>
            <p className="text-blue-100 text-sm">Track your flight hours</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-5 py-3 text-center">
            <div className="text-3xl mb-1">{totalHours.toFixed(1)}</div>
            <div className="text-xs text-blue-100">Total Hours</div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            type="text"
            placeholder="Search flights, routes, aircraft..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-4 py-6 rounded-2xl border-0 shadow-md bg-white text-base"
            aria-label="Search flights"
          />
        </div>
      </div>

      {/* Flight List */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {filteredFlights.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center px-6">
            <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-full p-8 mb-6 shadow-md">
              <Plane className="h-16 w-16 text-blue-600" />
            </div>
            <h3 className="text-xl mb-3 text-gray-800">
              {searchQuery ? 'No flights found' : 'No flights logged yet'}
            </h3>
            <p className="text-gray-600 mb-8 px-4 leading-relaxed">
              {searchQuery
                ? 'Try adjusting your search criteria'
                : 'Start building your logbook by adding your first flight'}
            </p>
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
                className="cursor-pointer hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-600 active:scale-98"
                onClick={() => onFlightClick(flight)}
                role="button"
                tabIndex={0}
                aria-label={`Flight from ${flight.departure} to ${flight.arrival}`}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="h-4 w-4 text-blue-600 flex-shrink-0" />
                        <span className="text-lg">
                          {flight.departure} → {flight.arrival}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1.5">
                          <CalendarIcon className="h-4 w-4" />
                          <span>{formatDate(flight.date)}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-4 w-4" />
                          <span>{formatTime(flight.flightTime)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100 px-3 py-1">
                      {flight.aircraft}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      {/* Floating Add Button */}
      <div className="fixed bottom-24 right-6 z-10 flex flex-col items-center gap-2">
        <Button
          onClick={() => window.location.reload()}
          size="sm"
          variant="ghost"
          className="text-xs text-blue-400 hover:text-blue-600 bg-white/80 backdrop-blur-sm shadow-sm rounded-full px-3 py-1"
        >
          Update App
        </Button>
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