import { useState } from 'react';
import { ArrowLeft, Save, Plane, MapPin, Clock, Calendar as CalendarIcon, FileText } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent } from './ui/card';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { FlightEntry } from './LogbookDashboard';

interface AddFlightScreenProps {
  onBack: () => void;
  onSave: (flight: Omit<FlightEntry, 'id'>) => void;
  editingFlight?: FlightEntry;
}

export function AddFlightScreen({ onBack, onSave, editingFlight }: AddFlightScreenProps) {
  const [date, setDate] = useState(editingFlight?.date || new Date().toISOString().split('T')[0]);
  const [departure, setDeparture] = useState(editingFlight?.departure || '');
  const [arrival, setArrival] = useState(editingFlight?.arrival || '');
  const [aircraft, setAircraft] = useState(editingFlight?.aircraft || '');
  const [hours, setHours] = useState(editingFlight ? Math.floor(editingFlight.flightTime).toString() : '');
  const [minutes, setMinutes] = useState(editingFlight ? Math.round((editingFlight.flightTime % 1) * 60).toString() : '');
  const [notes, setNotes] = useState(editingFlight?.notes || '');

  const handleSave = () => {
    // Validation
    if (!date || !departure || !arrival || !aircraft || !hours) {
      toast.error('Please fill in all required fields');
      return;
    }

    const totalHours = parseFloat(hours) + (parseFloat(minutes || '0') / 60);

    if (totalHours <= 0 || totalHours > 24) {
      toast.error('Flight time must be between 0 and 24 hours');
      return;
    }

    const flightData: Omit<FlightEntry, 'id'> = {
      date,
      departure: departure.toUpperCase(),
      arrival: arrival.toUpperCase(),
      aircraft: aircraft.toUpperCase(),
      flightTime: totalHours,
      notes,
    };

    onSave(flightData);
    toast.success(editingFlight ? 'Flight updated successfully' : 'Flight added successfully');
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 pb-20 relative overflow-hidden transition-colors duration-500">
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
            <div className="text-[10px] text-blue-500 font-bold tracking-[0.2em] uppercase mb-1">Flight Data Recorder</div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white transition-colors">{editingFlight ? 'EDIT LOG' : 'NEW ENTRY'}</h1>
          </div>
        </div>
      </div>

      {/* Form Content - Scrollable */}
      <div className="flex-1 overflow-y-auto px-6 py-6 pb-40 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Date Card */}
          <Card className="bg-white dark:bg-slate-800/50 backdrop-blur-md border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden group hover:border-blue-400 dark:hover:border-blue-500/50 transition-all">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-100 dark:bg-blue-500/10 p-2 rounded-lg border border-blue-200 dark:border-blue-500/20 group-hover:bg-blue-200 dark:group-hover:bg-blue-500/20 transition-colors">
                  <CalendarIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <Label htmlFor="date" className="text-sm font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider m-0 transition-colors">Flight Date</Label>
              </div>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="h-12 bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-blue-500 focus:ring-blue-500/20 transition-all font-mono"
                max={new Date().toISOString().split('T')[0]}
                required
                aria-required="true"
              />
            </CardContent>
          </Card>

          {/* Route Card */}
          <Card className="bg-white dark:bg-slate-800/50 backdrop-blur-md border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden group hover:border-emerald-400 dark:hover:border-emerald-500/50 transition-all">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-emerald-100 dark:bg-emerald-500/10 p-2 rounded-lg border border-emerald-200 dark:border-emerald-500/20 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-500/20 transition-colors">
                  <MapPin className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <Label className="text-sm font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider m-0 transition-colors">Route</Label>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="departure" className="text-[10px] text-slate-500 dark:text-slate-500 uppercase tracking-widest mb-2 block font-bold transition-colors">Departure (ICAO/IATA)</Label>
                  <Input
                    id="departure"
                    type="text"
                    placeholder="e.g., KJFK"
                    value={departure}
                    onChange={(e) => setDeparture(e.target.value)}
                    className="h-12 bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-emerald-500 focus:ring-emerald-500/20 transition-all font-mono uppercase tracking-widest text-lg placeholder:text-slate-400 dark:placeholder:text-slate-600"
                    maxLength={4}
                    required
                    aria-required="true"
                  />
                </div>
                <div>
                  <Label htmlFor="arrival" className="text-[10px] text-slate-500 dark:text-slate-500 uppercase tracking-widest mb-2 block font-bold transition-colors">Arrival (ICAO/IATA)</Label>
                  <Input
                    id="arrival"
                    type="text"
                    placeholder="e.g., KLAX"
                    value={arrival}
                    onChange={(e) => setArrival(e.target.value)}
                    className="h-12 bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-emerald-500 focus:ring-emerald-500/20 transition-all font-mono uppercase tracking-widest text-lg placeholder:text-slate-400 dark:placeholder:text-slate-600"
                    maxLength={4}
                    required
                    aria-required="true"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Aircraft Card */}
          <Card className="bg-white dark:bg-slate-800/50 backdrop-blur-md border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden group hover:border-purple-400 dark:hover:border-purple-500/50 transition-all">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-purple-100 dark:bg-purple-500/10 p-2 rounded-lg border border-purple-200 dark:border-purple-500/20 group-hover:bg-purple-200 dark:group-hover:bg-purple-500/20 transition-colors">
                  <Plane className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <Label htmlFor="aircraft" className="text-sm font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider m-0 transition-colors">Aircraft Type</Label>
              </div>
              <Input
                id="aircraft"
                type="text"
                placeholder="e.g., B737"
                value={aircraft}
                onChange={(e) => setAircraft(e.target.value)}
                className="h-12 bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-purple-500 focus:ring-purple-500/20 transition-all font-mono uppercase text-lg placeholder:text-slate-400 dark:placeholder:text-slate-600"
                required
                aria-required="true"
              />
            </CardContent>
          </Card>

          {/* Flight Time Card */}
          <Card className="bg-white dark:bg-slate-800/50 backdrop-blur-md border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden group hover:border-orange-400 dark:hover:border-orange-500/50 transition-all">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-orange-100 dark:bg-orange-500/10 p-2 rounded-lg border border-orange-200 dark:border-orange-500/20 group-hover:bg-orange-200 dark:group-hover:bg-orange-500/20 transition-colors">
                  <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
                <Label className="text-sm font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider m-0 transition-colors">Flight Time</Label>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="hours" className="text-[10px] text-slate-500 dark:text-slate-500 uppercase tracking-widest mb-2 block font-bold transition-colors">Hours</Label>
                  <Input
                    id="hours"
                    type="number"
                    placeholder="0"
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                    className="h-12 bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-orange-500 focus:ring-orange-500/20 transition-all font-mono text-xl placeholder:text-slate-400 dark:placeholder:text-slate-600 text-center"
                    min="0"
                    max="23"
                    required
                    aria-required="true"
                  />
                </div>
                <div>
                  <Label htmlFor="minutes" className="text-[10px] text-slate-500 dark:text-slate-500 uppercase tracking-widest mb-2 block font-bold transition-colors">Minutes</Label>
                  <Input
                    id="minutes"
                    type="number"
                    placeholder="0"
                    value={minutes}
                    onChange={(e) => setMinutes(e.target.value)}
                    className="h-12 bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-orange-500 focus:ring-orange-500/20 transition-all font-mono text-xl placeholder:text-slate-400 dark:placeholder:text-slate-600 text-center"
                    min="0"
                    max="59"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes Card */}
          <Card className="bg-white dark:bg-slate-800/50 backdrop-blur-md border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden transition-colors">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-slate-100 dark:bg-slate-700/50 p-2 rounded-lg border border-slate-200 dark:border-slate-600 transition-colors">
                  <FileText className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                </div>
                <Label htmlFor="notes" className="text-sm font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider m-0 transition-colors">Notes</Label>
              </div>
              <Textarea
                id="notes"
                placeholder="Remarks..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-[120px] bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-blue-500 resize-none placeholder:text-slate-400 dark:placeholder:text-slate-600 text-sm leading-relaxed transition-all"
                maxLength={500}
              />
              <p className="text-[10px] text-slate-500 dark:text-slate-600 mt-2 text-right font-mono transition-colors">{notes.length}/500</p>
            </CardContent>
          </Card>

          {/* Spacer for bottom button */}
          <div className="h-24"></div>
        </motion.div>
      </div>

      {/* Fixed Save Button at Bottom */}
      <div className="absolute bottom-0 left-0 right-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 px-6 py-4 shadow-2xl z-20 pb-safe safe-area-bottom transition-colors">
        <Button
          onClick={handleSave}
          className="w-full h-14 text-base font-bold tracking-wide bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20 dark:shadow-blue-900/20 active:scale-98 transition-all rounded-xl uppercase"
          size="lg"
        >
          <Save className="h-5 w-5 mr-3" />
          {editingFlight ? 'Update Flight' : 'Save Entry'}
        </Button>
      </div>
    </div>
  );
}
