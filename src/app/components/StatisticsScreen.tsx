import { TrendingUp, Clock, Plane, MapPin } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { FlightEntry } from './LogbookDashboard';

interface StatisticsScreenProps {
  flights: FlightEntry[];
}

export function StatisticsScreen({ flights }: StatisticsScreenProps) {
  const totalFlights = flights.length;
  const totalHours = flights.reduce((sum, flight) => sum + flight.flightTime, 0);

  const uniqueAircraft = new Set(flights.map(f => f.aircraft)).size;
  const uniqueAirports = new Set([
    ...flights.map(f => f.departure),
    ...flights.map(f => f.arrival)
  ]).size;

  const aircraftBreakdown = flights.reduce((acc, flight) => {
    acc[flight.aircraft] = (acc[flight.aircraft] || 0) + flight.flightTime;
    return acc;
  }, {} as Record<string, number>);

  const topAircraft = Object.entries(aircraftBreakdown)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const stats = [
    {
      title: 'Total Hours',
      value: totalHours.toFixed(1),
      label: 'HOURS',
      icon: Clock,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20'
    },
    {
      title: 'Total Flights',
      value: totalFlights.toString(),
      label: 'FLIGHTS',
      icon: TrendingUp,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20'
    },
    {
      title: 'Aircraft Types',
      value: uniqueAircraft.toString(),
      label: 'TYPES',
      icon: Plane,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20'
    },
    {
      title: 'Airports',
      value: uniqueAirports.toString(),
      label: 'VISITED',
      icon: MapPin,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/20'
    }
  ];

  return (
    <div className="flex flex-col h-full bg-slate-900 pb-20 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-blue-900/20 to-transparent pointer-events-none" />

      {/* Header */}
      <div className="px-6 pt-12 pb-6 z-10">
        <div className="text-[10px] text-blue-400 font-bold tracking-[0.2em] uppercase mb-1">Performance Metrics</div>
        <h1 className="text-3xl font-black tracking-tight text-white mb-6">STATISTICS</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 pb-32 space-y-8 z-10">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <Card key={i} className={`border ${stat.borderColor} bg-slate-800/50 backdrop-blur-sm shadow-lg overflow-hidden relative group`}>
                <CardContent className="p-4 relative z-10">
                  <div className={`rounded-lg p-2 w-fit mb-3 ${stat.bgColor}`}>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <div className="text-2xl font-mono font-bold text-white tracking-tight mb-1">{stat.value}</div>
                  <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400">{stat.label}</div>
                </CardContent>
                {/* Hover Glow */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-${stat.color.split('-')[1]}-400`} />
              </Card>
            );
          })}
        </div>

        {/* Aircraft Breakdown */}
        {topAircraft.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Plane className="h-4 w-4" />
              Hours by Aircraft
            </h2>
            <Card className="bg-slate-800/50 border border-slate-700 backdrop-blur-sm overflow-hidden">
              <CardContent className="p-0">
                {topAircraft.map(([aircraft, hours], i) => {
                  const percentage = (hours / totalHours) * 100;
                  return (
                    <div key={aircraft} className="border-b border-slate-700/50 last:border-0 hover:bg-slate-700/30 transition-colors">
                      <div className="px-5 py-4">
                        <div className="flex justify-between items-end mb-2">
                          <span className="font-mono font-bold text-white text-lg">{aircraft}</span>
                          <div className="text-right">
                            <span className="text-blue-400 font-mono font-bold">{hours.toFixed(1)}h</span>
                            <span className="text-slate-500 text-xs ml-2">({percentage.toFixed(0)}%)</span>
                          </div>
                        </div>
                        <div className="w-full bg-slate-900/50 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-blue-500 h-full rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Empty State */}
        {totalFlights === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center opacity-50">
            <TrendingUp className="h-12 w-12 text-slate-600 mb-4" />
            <h3 className="text-lg font-bold text-slate-400">NO DATA AVAILABLE</h3>
            <p className="text-slate-500 text-sm px-8 mt-2">
              Log your first flight to generate analytics
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
