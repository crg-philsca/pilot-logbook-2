import { ArrowLeft, Trash2, Moon, Sun, Monitor, AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { toast } from 'sonner';
import { motion } from 'motion/react';
import { FlightEntry } from './LogbookDashboard';

interface SettingsScreenProps {
    onBack: () => void;
    onClearData: () => void;
}

export function SettingsScreen({ onBack, onClearData }: SettingsScreenProps) {
    const handleRefresh = () => {
        // Force reset all service workers and caches
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistrations().then(function (registrations) {
                for (let registration of registrations) {
                    registration.unregister();
                }
            });
        }
        localStorage.clear();
        sessionStorage.clear();
        caches.keys().then(names => {
            for (let name of names) {
                caches.delete(name);
            }
        });
        window.location.reload();
        toast.success('App fully reset');
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
                        <div className="text-[10px] text-blue-400 font-bold tracking-[0.2em] uppercase mb-1">Configuration</div>
                        <h1 className="text-2xl font-black tracking-tight text-white">SETTINGS</h1>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 pb-32 z-10">

                {/* Appearance */}
                <section>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1 mb-3">Appearance</h3>
                    <Card className="bg-slate-800/50 backdrop-blur-md border border-slate-700 shadow-xl overflow-hidden">
                        <CardContent className="p-0">
                            <div className="flex items-center justify-between p-4 border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors cursor-pointer group">
                                <div className="flex items-center gap-3">
                                    <div className="bg-slate-900 p-2 rounded-lg text-blue-400 group-hover:text-blue-300 transition-colors">
                                        <Moon className="h-5 w-5" />
                                    </div>
                                    <span className="text-white font-medium">Dark Mode</span>
                                </div>
                                <div className="text-xs text-blue-400 font-mono tracking-wider uppercase bg-blue-500/10 px-2 py-1 rounded border border-blue-500/20">Active</div>
                            </div>
                            <div className="flex items-center justify-between p-4 hover:bg-slate-700/30 transition-colors cursor-not-allowed opacity-50">
                                <div className="flex items-center gap-3">
                                    <div className="bg-slate-900 p-2 rounded-lg text-slate-400">
                                        <Sun className="h-5 w-5" />
                                    </div>
                                    <span className="text-slate-400 font-medium">Light Mode</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                {/* Data Management */}
                <section>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1 mb-3">Data Management</h3>
                    <Card className="bg-slate-800/50 backdrop-blur-md border border-slate-700 shadow-xl overflow-hidden">
                        <CardContent className="p-0">
                            <div
                                onClick={onClearData}
                                className="flex items-center justify-between p-4 hover:bg-red-500/10 transition-colors cursor-pointer group active:bg-red-500/20"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="bg-red-500/10 p-2 rounded-lg text-red-400 group-hover:text-red-300 transition-colors border border-red-500/20">
                                        <Trash2 className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <span className="text-red-400 font-medium block">Clear All Flight Data</span>
                                        <span className="text-slate-500 text-xs">Permanently delete all logs</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                {/* Troubleshooting */}
                <section>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1 mb-3">Troubleshooting</h3>
                    <Card className="bg-slate-800/50 backdrop-blur-md border border-slate-700 shadow-xl overflow-hidden">
                        <CardContent className="p-0">
                            <div
                                onClick={handleRefresh}
                                className="flex items-center justify-between p-4 hover:bg-orange-500/10 transition-colors cursor-pointer group active:bg-orange-500/20"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="bg-orange-500/10 p-2 rounded-lg text-orange-400 group-hover:text-orange-300 transition-colors border border-orange-500/20">
                                        <RefreshCw className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <span className="text-orange-400 font-medium block">Hard Reset App</span>
                                        <span className="text-slate-500 text-xs">Fix "Nothing Changed" issues</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <p className="text-[10px] text-slate-600 mt-2 px-2">
                        Use Hard Reset if the app isn't updating or features are missing. This will force a fresh download of the latest version.
                    </p>
                </section>

                <div className="text-center pt-8 pb-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">System Online v4.0.0</span>
                    </div>
                </div>

            </div>
        </div>
    );
}
