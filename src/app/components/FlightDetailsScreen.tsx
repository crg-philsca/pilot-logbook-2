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
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 pb-20 relative overflow-hidden transition-colors duration-500">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-blue-500/10 dark:from-blue-900/20 to-transparent pointer-events-none" />

      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 pt-12 pb-6 shadow-xl z-20 sticky top-0 transition-colors">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="h-10 w-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-white active:scale-95 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div>
            <div className="text-[10px] text-blue-500 font-bold tracking-[0.2em] uppercase mb-1">Flight Record</div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white mb-0 transition-colors">LOG #{flight.id}</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 pb-40 z-10 space-y-6">

        {/* Main Flight Ticket */}
        <Card className="bg-white dark:bg-slate-800/50 backdrop-blur-md border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden relative transition-colors">
          {/* Ticket Cutout Effect */}
          <div className="absolute top-1/2 left-0 w-4 h-8 bg-slate-50 dark:bg-slate-900 rounded-r-full -mt-4 border-r border-slate-200 dark:border-slate-700 transition-colors"></div>
          <div className="absolute top-1/2 right-0 w-4 h-8 bg-slate-50 dark:bg-slate-900 rounded-l-full -mt-4 border-l border-slate-200 dark:border-slate-700 transition-colors"></div>

          <CardContent className="p-0">
            {/* Upper Section: Route */}
            <div className="p-6 border-b border-dashed border-slate-200 dark:border-slate-700 transition-colors">
              <div className="flex items-center justify-between gap-4">
                <div className="text-center flex-1">
                  <div className="text-4xl font-black text-slate-900 dark:text-white tracking-widest transition-colors">{flight.departure}</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-500 uppercase tracking-widest mt-1">Departure</div>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center px-4 relative">
                  {/* Vector Line */}
                  <div className="w-full h-px bg-slate-200 dark:bg-slate-700 relative flex items-center transition-colors">
                    <div className="absolute left-0 w-1.5 h-1.5 bg-slate-300 dark:bg-slate-600 rounded-full transition-colors"></div>
                    <div className="absolute right-0 w-1.5 h-1.5 bg-slate-300 dark:bg-slate-600 rounded-full transition-colors"></div>

                    {/* Animated Plane Icon */}
                    <motion.div
                      className="absolute bg-white dark:bg-slate-800/50 px-1 z-10 transition-colors rounded-full"
                      initial={{ left: "10%", opacity: 0 }}
                      animate={{
                        left: ["10%", "90%"],
                        opacity: [0, 1, 1, 0]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        repeatDelay: 0.5
                      }}
                    >
                      <Plane className="h-5 w-5 text-blue-500 rotate-90 drop-shadow-sm" />
                    </motion.div>
                  </div>
                </div>

                <div className="text-center flex-1">
                  <div className="text-4xl font-black text-slate-900 dark:text-white tracking-widest transition-colors">{flight.arrival}</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-500 uppercase tracking-widest mt-1">Arrival</div>
                </div>
              </div>
            </div>

            {/* Lower Section: Details */}
            <div className="p-6 grid grid-cols-2 gap-y-6 gap-x-4 bg-slate-50 dark:bg-slate-900/30 transition-colors">
              <div className="col-span-2">
                <div className="flex items-center gap-2 text-blue-500 dark:text-blue-400 mb-1">
                  <Calendar className="h-3 w-3" />
                  <span className="text-[10px] uppercase tracking-widest font-bold">Date</span>
                </div>
                <div className="text-lg font-mono text-slate-900 dark:text-white transition-colors">{formatDate(flight.date)}</div>
              </div>
              <div>
                <div className="flex items-center gap-2 text-purple-500 dark:text-purple-400 mb-1">
                  <Plane className="h-3 w-3" />
                  <span className="text-[10px] uppercase tracking-widest font-bold">Aircraft</span>
                </div>
                <div className="text-lg font-mono text-slate-900 dark:text-white transition-colors">{flight.aircraft}</div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 text-orange-500 dark:text-orange-400 mb-1 justify-end">
                  <Clock className="h-3 w-3" />
                  <span className="text-[10px] uppercase tracking-widest font-bold">Duration</span>
                </div>
                <div className="text-lg font-mono text-slate-900 dark:text-white transition-colors">{formatTime(flight.flightTime)}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Route Visualization Card */}
        <div className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <h2 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Route Visualization</h2>
          </div>

          <Card className="bg-white dark:bg-slate-800/50 backdrop-blur-md border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden transition-colors">
            <CardContent className="p-0">
              {/* Grid Background Area */}
              <div className="h-48 relative bg-slate-50 dark:bg-slate-900/50 overflow-hidden group">
                {/* Grid Pattern */}
                <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
                  style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                </div>

                {/* SVG Route */}
                <svg className="absolute inset-0 w-full h-full p-10" viewBox="0 0 400 200" preserveAspectRatio="xMidYMid meet">
                  {/* Path Arc */}
                  <path
                    d="M 50 120 Q 200 60 350 120"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-blue-500/30 dark:text-blue-400/20"
                  />

                  {/* Animated Path */}
                  <motion.path
                    d="M 50 120 Q 200 60 350 120"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeDasharray="1 10"
                    className="text-blue-500 dark:text-blue-400"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  />

                  {/* Departure Point */}
                  <g transform="translate(50, 120)">
                    <circle r="8" className="fill-emerald-500/20 animate-pulse" />
                    <circle r="4" className="fill-emerald-500" />
                    <text y="25" textAnchor="middle" className="text-[12px] font-bold fill-emerald-600 dark:fill-emerald-400 font-mono italic">{flight.departure}</text>
                  </g>

                  {/* Arrival Point */}
                  <g transform="translate(350, 120)">
                    <circle r="8" className="fill-red-500/20 animate-pulse" />
                    <circle r="4" className="fill-red-500" />
                    <text y="25" textAnchor="middle" className="text-[12px] font-bold fill-red-600 dark:fill-red-400 font-mono italic">{flight.arrival}</text>
                  </g>

                  {/* Moving Airplane on Path */}
                  <motion.g
                    initial={{ offsetDistance: "0%" }}
                    animate={{ offsetDistance: "100%" }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    style={{
                      offsetPath: "path('M 50 120 Q 200 60 350 120')",
                      offsetRotate: "auto 0deg"
                    }}
                  >
                    <Plane className="h-5 w-5 text-blue-500 -rotate-90" />
                  </motion.g>
                </svg>

                {/* Distance Badge */}
                <div className="absolute bottom-4 right-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 shadow-lg flex items-center gap-2">
                  <span className="text-[10px] text-slate-400">≈</span>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200 font-mono">{(flight.flightTime * 145).toFixed(0)} nm</span>
                </div>
              </div>

              {/* Bottom Info Section */}
              <div className="p-5 border-t border-slate-100 dark:border-slate-800 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="bg-slate-100 dark:bg-slate-900/50 p-2 rounded-lg mt-0.5">
                    <MapPin className="h-4 w-4 text-slate-400" />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Filed Route</div>
                    <div className="text-sm font-mono text-slate-700 dark:text-slate-300">
                      {flight.departure}-{flight.arrival} direct
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex justify-between items-center text-[8px] uppercase font-bold tracking-[0.2em]">
                  <div className="flex items-center gap-1.5 text-emerald-500">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                    Departure
                  </div>
                  <div className="flex items-center gap-1.5 text-red-500">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                    Arrival
                  </div>
                  <div className="text-slate-400 font-mono">SVG • OKB</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notes Section */}
        {flight.notes && (
          <Card className="bg-white dark:bg-slate-800/50 backdrop-blur-md border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden transition-colors">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="h-4 w-4 text-slate-400" />
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Remarks</span>
              </div>
              <div className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed font-mono bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-100 dark:border-slate-700/50 transition-colors">
                {flight.notes}
              </div>
            </CardContent>
          </Card>
        )}

      </div>

      {/* Fixed Action Buttons */}
      <div className="absolute bottom-0 left-0 right-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 px-6 py-6 shadow-2xl z-20 pb-safe safe-area-bottom flex gap-3 transition-colors">
        <Button
          onClick={() => {
            if (confirm('Are you sure you want to delete this flight log? This action cannot be undone.')) {
              onDelete();
            }
          }}
          variant="destructive"
          className="flex-1 h-12 bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-500 hover:bg-red-200 dark:hover:bg-red-500/20 border-red-200 dark:border-red-500/20 border shadow-none transition-colors"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          DELETE
        </Button>
        <Button
          onClick={onEdit}
          className="flex-[2] h-12 bg-blue-600 hover:bg-blue-500 text-white font-bold tracking-wide shadow-lg shadow-blue-500/20 dark:shadow-blue-900/20 transition-all"
        >
          <Edit className="h-4 w-4 mr-2" />
          EDIT
        </Button>
      </div>

    </div>
  );
}
