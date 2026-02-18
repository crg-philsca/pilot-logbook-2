import { ArrowLeft, Trash2, Moon, Sun, Monitor, AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { toast } from 'sonner';
import { motion } from 'motion/react';
import { FlightEntry } from './LogbookDashboard';

interface SettingsScreenProps {
    onBack: () => void;
    onClearData: () => void;
    currentTheme: 'dark' | 'light';
    onThemeChange: (theme: 'dark' | 'light') => void;
}

export function SettingsScreen({ onBack, onClearData, currentTheme, onThemeChange }: SettingsScreenProps) {
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
        <div className={`flex flex-col h-full bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 pb-20 relative overflow-hidden transition-colors duration-500`}>
            {/* Background Decor */}
            <div className={`absolute top-0 left-0 right-0 h-64 bg-gradient-to-b pointer-events-none ${currentTheme === 'dark' ? 'from-blue-900/20' : 'from-blue-500/10'} to-transparent`} />

            {/* Header */}
            <div className={`border-b px-6 pt-12 pb-6 shadow-2xl z-20 sticky top-0 transition-colors duration-500 ${currentTheme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onBack}
                        className={`h-10 w-10 rounded-full active:scale-95 ${currentTheme === 'dark' ? 'hover:bg-slate-800 text-white' : 'hover:bg-slate-100 text-slate-800'}`}
                        aria-label="Go back"
                    >
                        <ArrowLeft className="h-6 w-6" />
                    </Button>
                    <div>
                        <div className="text-[10px] text-blue-500 font-bold tracking-[0.2em] uppercase mb-1">Configuration</div>
                        <h1 className={`text-2xl font-black tracking-tight ${currentTheme === 'dark' ? 'text-white' : 'text-slate-900'}`}>SETTINGS</h1>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 pt-safe z-10">
                <div className="mt-8 space-y-4 pb-16">

                    {/* Appearance */}
                    <section>
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1 mb-3">Appearance</h3>
                        <Card className={`backdrop-blur-md border shadow-xl overflow-hidden ${currentTheme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
                            <CardContent className="p-0">
                                <div
                                    onClick={() => onThemeChange('dark')}
                                    className={`flex items-center justify-between p-4 border-b transition-colors cursor-pointer group ${currentTheme === 'dark' ? 'bg-blue-500/10 border-blue-500/20' : 'hover:bg-slate-50 border-slate-100'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg transition-colors ${currentTheme === 'dark' ? 'bg-slate-900 text-blue-400' : 'bg-slate-100 text-slate-400 group-hover:text-slate-600'}`}>
                                            <Moon className="h-5 w-5" />
                                        </div>
                                        <span className={`font-medium ${currentTheme === 'dark' ? 'text-blue-400' : 'text-slate-600'}`}>Dark Mode</span>
                                    </div>
                                    {currentTheme === 'dark' && (
                                        <div className="text-xs text-blue-400 font-mono tracking-wider uppercase bg-blue-500/10 px-2 py-1 rounded border border-blue-500/20">Active</div>
                                    )}
                                </div>
                                <div
                                    onClick={() => onThemeChange('light')}
                                    className={`flex items-center justify-between p-4 transition-colors cursor-pointer group ${currentTheme === 'light' ? 'bg-blue-50 border-blue-200' : 'hover:bg-slate-700/30'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg transition-colors ${currentTheme === 'light' ? 'bg-white text-blue-500 shadow-sm' : 'bg-slate-900 text-slate-400'}`}>
                                            <Sun className="h-5 w-5" />
                                        </div>
                                        <span className={`font-medium ${currentTheme === 'light' ? 'text-blue-600' : 'text-slate-400'}`}>Light Mode</span>
                                    </div>
                                    {currentTheme === 'light' && (
                                        <div className="text-xs text-blue-600 font-mono tracking-wider uppercase bg-blue-100 px-2 py-1 rounded border border-blue-200">Active</div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </section>

                    {/* Data Management */}
                    <section>
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1 mb-3">Data Management</h3>
                        <Card className="bg-white dark:bg-slate-800/50 backdrop-blur-md border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden transition-colors">
                            <CardContent className="p-0">
                                <div
                                    onClick={onClearData}
                                    className="flex items-center justify-between p-4 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors cursor-pointer group active:bg-red-100 dark:active:bg-red-500/20"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="bg-red-100 dark:bg-red-500/10 p-2 rounded-lg text-red-600 dark:text-red-400 group-hover:text-red-700 dark:group-hover:text-red-300 transition-colors border border-red-200 dark:border-red-500/20">
                                            <Trash2 className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <span className="text-red-600 dark:text-red-400 font-medium block transition-colors">Clear All Flight Data</span>
                                            <span className="text-slate-500 text-xs transition-colors">Permanently delete all logs</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </section>

                    {/* Troubleshooting */}
                    <section>
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1 mb-3">Troubleshooting</h3>
                        <Card className="bg-white dark:bg-slate-800/50 backdrop-blur-md border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden transition-colors">
                            <CardContent className="p-0">
                                <div
                                    onClick={handleRefresh}
                                    className="flex items-center justify-between p-4 hover:bg-orange-50 dark:hover:bg-orange-500/10 transition-colors cursor-pointer group active:bg-orange-100 dark:active:bg-orange-500/20"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="bg-orange-100 dark:bg-orange-500/10 p-2 rounded-lg text-orange-600 dark:text-orange-400 group-hover:text-orange-700 dark:group-hover:text-orange-300 transition-colors border border-orange-200 dark:border-orange-500/20">
                                            <RefreshCw className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <span className="text-orange-600 dark:text-orange-400 font-medium block transition-colors">Hard Reset App</span>
                                            <span className="text-slate-500 text-xs transition-colors">Fix app issues</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <p className="text-[10px] text-slate-500 dark:text-slate-600 mt-2 px-2 transition-colors">
                            Use Hard Reset if the app isn't updating or features are missing. This will force a fresh download of the latest version.
                        </p>
                    </section>

                    <div className="text-center pt-8 pb-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest font-mono transition-colors">System Online v4.1.0</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
