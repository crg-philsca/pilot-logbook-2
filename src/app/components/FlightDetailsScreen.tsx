import { ArrowLeft, Calendar, MapPin, Plane, Clock, FileText, Edit, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Separator } from './ui/separator';
import { motion } from 'motion/react';
import { FlightEntry } from './LogbookDashboard';

interface FlightDetailsScreenProps {
  flight: FlightEntry;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function FlightDetailsScreen({ flight, onBack, onEdit, onDelete }: FlightDetailsScreenProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).toUpperCase();
  };

  const formatTime = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}H ${m}M`;
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 pb-20 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-blue-900/20 to-transparent pointer-events-none" />

      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-6 pt-12 pb-6 shadow-2xl z-20 sticky top-0">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="h-10 w-10 rounded-full hover:bg-slate-800 text-white active:scale-95"
            aria-label="Go back"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div>
            <div className="text-[10px] text-blue-400 font-bold tracking-[0.2em] uppercase mb-1">Flight Record</div>
            <h1 className="text-2xl font-black tracking-tight text-white mb-0">LOG #{flight.id}</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 pb-32 z-10 space-y-6">

        {/* Main Flight Ticket */}
        <Card className="bg-slate-800/50 backdrop-blur-md border border-slate-700 shadow-xl overflow-hidden relative">
          {/* Ticket Cutout Effect */}
          <div className="absolute top-1/2 left-0 w-4 h-8 bg-slate-900 rounded-r-full -mt-4 border-r border-slate-700"></div>
          <div className="absolute top-1/2 right-0 w-4 h-8 bg-slate-900 rounded-l-full -mt-4 border-l border-slate-700"></div>

          <CardContent className="p-0">
            {/* Upper Section: Route */}
            <div className="p-6 border-b border-dashed border-slate-700">
              <div className="flex items-center justify-between gap-4">
                <div className="text-center flex-1">
                  <div className="text-4xl font-black text-white tracking-widest">{flight.departure}</div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Departure</div>
                </div>

                <div className="flex flex-col items-center">
                  <Plane className="h-6 w-6 text-blue-500 rotate-90 transform mb-2" />
                  <div className="h-px w-16 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>
                </div>

                <div className="text-center flex-1">
                  <div className="text-4xl font-black text-white tracking-widest">{flight.arrival}</div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Arrival</div>
                </div>
              </div>
            </div>

            {/* Lower Section: Details */}
            <div className="p-6 grid grid-cols-2 gap-6 bg-slate-900/30">
              <div>
                <div className="flex items-center gap-2 text-blue-400 mb-1">
                  <Calendar className="h-3 w-3" />
                  <span className="text-[10px] uppercase tracking-widest font-bold">Date</span>
                </div>
                <div className="text-lg font-mono text-white">{formatDate(flight.date)}</div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 text-orange-400 mb-1 justify-end">
                  <Clock className="h-3 w-3" />
                  <span className="text-[10px] uppercase tracking-widest font-bold">Duration</span>
                </div>
                <div className="text-lg font-mono text-white">{formatTime(flight.flightTime)}</div>
              </div>
              <div>
                <div className="flex items-center gap-2 text-purple-400 mb-1">
                  <Plane className="h-3 w-3" />
                  <span className="text-[10px] uppercase tracking-widest font-bold">Aircraft</span>
                </div>
                <div className="text-lg font-mono text-white">{flight.aircraft}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notes Section */}
        {flight.notes && (
          <Card className="bg-slate-800/50 backdrop-blur-md border border-slate-700 shadow-xl overflow-hidden">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="h-4 w-4 text-slate-400" />
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Remarks</span>
              </div>
              <div className="text-slate-300 text-sm leading-relaxed font-mono bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
                {flight.notes}
              </div>
            </CardContent>
          </Card>
        )}

      </div>

      {/* Fixed Action Buttons */}
      <div className="absolute bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-xl border-t border-slate-800 px-6 py-4 shadow-2xl z-20 pb-safe safe-area-bottom flex gap-3">
        <Button
          onClick={onDelete}
          variant="destructive"
          className="flex-1 h-12 bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20 border shadow-none"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          DELETE
        </Button>
        <Button
          onClick={onEdit}
          className="flex-[2] h-12 bg-blue-600 hover:bg-blue-500 text-white font-bold tracking-wide shadow-lg shadow-blue-900/20"
        >
          <Edit className="h-4 w-4 mr-2" />
          EDIT RECORD
        </Button>
      </div>

    </div>
  );
}
