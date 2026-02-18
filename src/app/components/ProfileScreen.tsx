import { useState, useEffect } from 'react';
import { User, Award, FileDown, Settings, Save, ShieldCheck, LogOut } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner';
import { FlightEntry } from './LogbookDashboard';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ProfileScreenProps {
  flights: FlightEntry[];
  onOpenSettings: () => void;
  onLogout: () => void;
}

export function ProfileScreen({ flights, onOpenSettings, onLogout }: ProfileScreenProps) {
  const [name, setName] = useState(() => localStorage.getItem('pilot_name') || 'Captain Pilot');
  const [license, setLicense] = useState(() => localStorage.getItem('pilot_license') || 'ATP-123456');
  const [rank, setRank] = useState(() => localStorage.getItem('pilot_rank') || 'Captain');
  const [isEditing, setIsEditing] = useState(false);

  const handleSaveProfile = () => {
    try {
      localStorage.setItem('pilot_name', name);
      localStorage.setItem('pilot_license', license);
      localStorage.setItem('pilot_rank', rank);
      setIsEditing(false);
      toast.success('Pilot profile updated');
    } catch (error) {
      console.error('Failed to save profile', error);
      toast.error('Failed to save profile');
    }
  };

  // Ensure changes persist by saving on unmount as well
  useEffect(() => {
    return () => {
      if (isEditing) {
        localStorage.setItem('pilot_name', name);
        localStorage.setItem('pilot_license', license);
        localStorage.setItem('pilot_rank', rank);
      }
    };
  }, [name, license, rank, isEditing]);

  const handleExportPDF = () => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(22);
    doc.setTextColor(40, 40, 40);
    doc.text('PILOT LOGBOOK', 14, 20);

    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`Pilot: ${name}`, 14, 30);
    doc.text(`License: ${license}`, 14, 36);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 42);

    // Table
    const tableColumn = ["Date", "Aircraft", "Route", "Time", "Notes"];
    const tableRows = flights.map(flight => [
      flight.date,
      flight.aircraft,
      `${flight.departure} -> ${flight.arrival}`,
      flight.flightTime.toFixed(1),
      flight.notes
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 50,
      theme: 'grid',
      headStyles: { fillColor: [37, 99, 235] }, // Blue header
    });

    doc.save(`Pilot_Logbook_${new Date().toISOString().split('T')[0]}.pdf`);
    toast.success('Logbook exported to PDF');
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 pb-20 relative overflow-hidden transition-colors duration-500">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-blue-500/10 dark:from-blue-900/20 to-transparent pointer-events-none" />

      {/* Header */}
      <div className="px-6 pt-safe pb-4 z-10">
        <div className="flex justify-between items-start mt-2">
          <div>
            <div className="text-[10px] text-blue-500 font-bold tracking-[0.2em] uppercase mb-1 transition-colors">Commander Info</div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white transition-colors">PROFILE</h1>
          </div>
          <Button
            onClick={() => {
              if (isEditing) {
                handleSaveProfile();
              } else {
                setIsEditing(true);
              }
            }}
            variant="outline"
            size="sm"
            className="bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-blue-600 dark:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-blue-500 dark:hover:text-blue-300 transition-colors"
          >
            {isEditing ? <Save className="h-4 w-4 mr-2" /> : <Settings className="h-4 w-4 mr-2" />}
            {isEditing ? 'SAVE' : 'EDIT'}
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 space-y-6 pb-40 z-10">
        {/* Profile Card */}
        <Card className="bg-white dark:bg-slate-800/50 backdrop-blur-md border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden transition-colors">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
                <div className="bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 rounded-full p-6 border border-slate-200 dark:border-slate-600 relative z-10 transition-colors">
                  <User className="h-12 w-12 text-blue-500 dark:text-blue-400" />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-blue-600 rounded-full p-1.5 border-4 border-white dark:border-slate-800 transition-colors z-20">
                  <ShieldCheck className="h-4 w-4 text-white" />
                </div>
              </div>

              {isEditing ? (
                <div className="w-full space-y-4">
                  <div>
                    <Label className="text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider mb-1 block text-left transition-colors">Pilot Name</Label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-blue-500 transition-all font-mono"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider mb-1 block text-left transition-colors">Rank / Title</Label>
                    <Input
                      value={rank}
                      onChange={(e) => setRank(e.target.value)}
                      className="bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-blue-500 transition-all font-mono"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider mb-1 block text-left transition-colors">License Number</Label>
                    <Input
                      value={license}
                      onChange={(e) => setLicense(e.target.value)}
                      className="bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-blue-500 transition-all font-mono uppercase"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1 tracking-tight transition-colors">{name}</h2>
                  <p className="text-blue-500 dark:text-blue-400 text-sm font-medium tracking-wide mb-4 uppercase transition-colors">{rank}</p>
                  <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900/50 text-slate-600 dark:text-slate-300 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700/50 transition-colors">
                    <Award className="h-4 w-4 text-yellow-500" />
                    <span className="text-xs font-mono tracking-wider">{license}</span>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-500 dark:text-slate-500 uppercase tracking-widest px-1 transition-colors">Actions</h3>

          <Button
            onClick={handleExportPDF}
            className="w-full h-14 text-base bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20 dark:shadow-blue-900/20 active:scale-98 transition-all rounded-xl justify-between px-6"
          >
            <span className="flex items-center gap-3">
              <FileDown className="h-5 w-5" />
              Export Logbook
            </span>
            <span className="bg-blue-700/50 px-2 py-0.5 rounded text-xs font-mono">PDF</span>
          </Button>

          <Button
            variant="outline"
            className="w-full h-14 text-base bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 active:scale-98 transition-all rounded-xl justify-start px-6 gap-3"
            onClick={onOpenSettings}
          >
            <Settings className="h-5 w-5" />
            System Settings
          </Button>

          <Button
            variant="outline"
            className="w-full h-14 text-base bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 active:scale-98 transition-all rounded-xl justify-start px-6 gap-3"
            onClick={() => {
              if (confirm('Are you sure you want to sign out?')) {
                onLogout();
              }
            }}
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </Button>
        </div>

      </div>
    </div>
  );
}
