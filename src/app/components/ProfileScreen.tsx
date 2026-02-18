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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
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
  const [isExportPreviewOpen, setIsExportPreviewOpen] = useState(false);

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

    // Save PDF
    doc.save(`Pilot_Logbook_${new Date().toISOString().split('T')[0]}.pdf`);
    toast.success('Logbook exported to PDF');
    setIsExportPreviewOpen(false);
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 relative overflow-hidden transition-colors duration-500">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-blue-500/10 dark:from-blue-900/20 to-transparent pointer-events-none" />

      {/* Header */}
      <div className="px-6 pt-safe pb-4 z-50 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl sticky top-0">
        <div className="flex justify-between items-start mt-1">
          <div>
            <div className="text-[10px] text-blue-500 font-bold tracking-[0.2em] uppercase mb-1 transition-colors">Pilot Information</div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white transition-colors uppercase">PROFILE</h1>
          </div>
          <Button
            onClick={() => {
              if (isEditing) {
                handleSaveProfile();
              } else {
                setIsEditing(true);
              }
            }}
            variant="ghost"
            size="icon"
            className={`h-10 w-10 rounded-xl transition-all active:scale-95 ${isEditing
              ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/30'
              : 'bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
          >
            {isEditing ? <Save className="h-5 w-5" /> : <Settings className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 pt-3 space-y-3 pb-6 z-10 touch-pan-y" style={{ touchAction: 'pan-y' }}>
        {/* Profile Card */}
        <Card className="bg-white dark:bg-slate-800/50 backdrop-blur-md border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden transition-colors">
          <CardContent className="p-4">
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-4">
                <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
                <div className="bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 rounded-full p-4 border border-slate-200 dark:border-slate-600 relative z-10 transition-colors">
                  <User className="h-10 w-10 text-blue-500 dark:text-blue-400" />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-blue-600 rounded-full p-1 border-2 border-white dark:border-slate-800 transition-colors z-20">
                  <ShieldCheck className="h-3 w-3 text-white" />
                </div>
              </div>

              {isEditing ? (
                <div className="w-full space-y-3">
                  <div>
                    <Label className="text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider mb-0.5 block text-left transition-colors font-bold">Pilot Name</Label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-blue-500 transition-all font-mono h-10 text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider mb-0.5 block text-left transition-colors font-bold">Rank / Title</Label>
                    <Input
                      value={rank}
                      onChange={(e) => setRank(e.target.value)}
                      className="bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-blue-500 transition-all font-mono h-10 text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider mb-0.5 block text-left transition-colors font-bold">License Number</Label>
                    <Input
                      value={license}
                      onChange={(e) => setLicense(e.target.value)}
                      className="bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-blue-500 transition-all font-mono uppercase h-10 text-sm"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-0.5 tracking-tight transition-colors">{name}</h2>
                  <p className="text-blue-500 dark:text-blue-400 text-xs font-medium tracking-wide mb-3 uppercase transition-colors">{rank}</p>
                  <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900/50 text-slate-600 dark:text-slate-300 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700/50 transition-colors">
                    <Award className="h-3.5 w-3.5 text-yellow-500" />
                    <span className="text-[11px] font-mono tracking-wider">{license}</span>
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
            onClick={() => setIsExportPreviewOpen(true)}
            className="w-full h-14 text-base bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20 dark:shadow-blue-900/20 active:scale-98 transition-all rounded-xl justify-between px-6"
          >
            <span className="flex items-center gap-3">
              <FileDown className="h-5 w-5" />
              Export Logbook
            </span>
            <span className="bg-blue-700/50 px-2 py-0.5 rounded text-xs font-mono">PDF</span>
          </Button>

          <Button
            variant="default"
            className="w-full h-14 text-base bg-slate-100 dark:bg-slate-800 border-none text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-98 transition-all rounded-xl justify-start px-6 gap-3 shadow-lg"
            onClick={onOpenSettings}
          >
            <Settings className="h-5 w-5" />
            System Settings
          </Button>

          <Button
            variant="default"
            className="w-full h-14 text-base bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/20 active:scale-98 transition-all rounded-xl justify-start px-6 gap-3"
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

        <Dialog open={isExportPreviewOpen} onOpenChange={setIsExportPreviewOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 gap-0 bg-slate-100 dark:bg-slate-950 border-slate-200 dark:border-slate-800 outline-none">
            {/* Viewer Header */}
            <DialogHeader className="px-6 py-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 z-20 shrink-0">
              <DialogTitle className="text-lg font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                <FileDown className="h-5 w-5 text-blue-500" />
                Export Preview
              </DialogTitle>
            </DialogHeader>

            {/* Scrollable Document Viewer Area */}
            <div className="flex-1 overflow-auto p-2 md:p-8 flex flex-col items-center bg-slate-100 dark:bg-slate-950">
              {/* The "Paper" Sheet - Scaled for mobile */}
              <div className="bg-white text-slate-900 shadow-xl w-full max-w-[210mm] min-h-[min(500px,70vh)] md:min-h-[297mm] p-4 md:p-12 box-border mx-auto overflow-hidden">
                {/* PDF Document Header */}
                <div className="mb-4 md:mb-8 border-b-2 border-slate-900 pb-4">
                  <h1 className="text-xl md:text-3xl font-black text-slate-900 mb-4 tracking-tight">PILOT LOGBOOK</h1>
                  <div className="grid grid-cols-2 gap-2 md:gap-4 text-[10px] md:text-sm font-mono text-slate-600">
                    <div>
                      <span className="block text-[8px] md:text-[10px] uppercase font-bold text-slate-400">Pilot In Command</span>
                      <span className="font-bold text-slate-900 text-sm md:text-lg">{name}</span>
                    </div>
                    <div className="text-right">
                      <span className="block text-[8px] md:text-[10px] uppercase font-bold text-slate-400">License Number</span>
                      <span className="font-bold text-slate-900 text-sm md:text-lg">{license}</span>
                    </div>
                    <div className="mt-1 md:mt-2">
                      <span className="block text-[8px] md:text-[10px] uppercase font-bold text-slate-400">Generated On</span>
                      <span className="text-slate-900">{new Date().toLocaleDateString()}</span>
                    </div>
                    <div className="mt-1 md:mt-2 text-right">
                      <span className="block text-[8px] md:text-[10px] uppercase font-bold text-slate-400">Total Records</span>
                      <span className="text-slate-900">{flights.length} Flights</span>
                    </div>
                  </div>
                </div>

                {/* PDF Document Table */}
                <div className="w-full overflow-hidden">
                  <table className="w-full text-[10px] md:text-sm text-left border-collapse table-fixed">
                    <thead>
                      <tr className="bg-blue-600 text-white">
                        <th className="p-1 md:p-3 font-bold border border-blue-700 w-[20%]">Date</th>
                        <th className="p-1 md:p-3 font-bold border border-blue-700 w-[15%]">A/C</th>
                        <th className="p-1 md:p-3 font-bold border border-blue-700 w-[25%]">Route</th>
                        <th className="p-1 md:p-3 font-bold border border-blue-700 w-[15%] text-right">Time</th>
                        <th className="p-1 md:p-3 font-bold border border-blue-700 w-[25%]">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {flights.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-4 md:p-8 text-center text-slate-400 border border-slate-300 italic">
                            No flight records found.
                          </td>
                        </tr>
                      ) : (
                        flights.map((flight, i) => (
                          <tr key={i} className={`border border-slate-300 ${i % 2 === 0 ? 'bg-slate-50' : 'bg-white'}`}>
                            <td className="p-1 md:p-3 border-r border-slate-300 font-mono truncate">{flight.date}</td>
                            <td className="p-1 md:p-3 border-r border-slate-300 font-bold truncate">{flight.aircraft}</td>
                            <td className="p-1 md:p-3 border-r border-slate-300 truncate">
                              {flight.departure} <span className="text-slate-400">→</span> {flight.arrival}
                            </td>
                            <td className="p-1 md:p-3 border-r border-slate-300 text-right font-mono">{flight.flightTime.toFixed(1)}</td>
                            <td className="p-1 md:p-3 text-slate-600 italic text-[9px] md:text-xs truncate">{flight.notes}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* PDF Footer Simulator */}
                <div className="mt-8 md:mt-12 pt-4 border-t border-slate-100 flex justify-between text-[8px] md:text-[10px] text-slate-400 font-mono">
                  <span>Page 1 of 1</span>
                  <span>Pilot Logbook App &copy; 2026</span>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-end gap-3 z-20 shrink-0">
              <Button variant="ghost" onClick={() => setIsExportPreviewOpen(false)} className="text-slate-600 dark:text-slate-400">
                Cancel
              </Button>
              <Button onClick={handleExportPDF} className="bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-500/20 gap-2">
                <FileDown className="h-4 w-4" />
                Download PDF
              </Button>
            </div>
          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
}
