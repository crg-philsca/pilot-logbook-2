import { useState } from 'react';
import { LogIn, UserPlus, Plane, Mail, Lock, ArrowRight, Github } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

interface AuthScreenProps {
    onAuthSuccess: () => void;
}

export function AuthScreen({ onAuthSuccess }: AuthScreenProps) {
    const [mode, setMode] = useState<'signin' | 'signup'>('signin');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate auth
        setTimeout(() => {
            setIsLoading(false);
            localStorage.setItem('is_authenticated', 'true');
            if (mode === 'signup' && name) {
                localStorage.setItem('pilot_name', name);
            }
            onAuthSuccess();
            toast.success(mode === 'signin' ? 'Welcome back, Captain!' : 'Welcome to the Flight Deck!');
        }, 1500);
    };

    return (
        <div className="flex flex-col h-full bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 overflow-hidden relative transition-colors duration-500">
            {/* Animated Background Decor */}
            <div className="absolute top-0 left-0 right-0 h-full overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        opacity: [0.05, 0.1, 0.05],
                        scale: [1, 1.2, 1],
                        rotate: [0, 5, 0]
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-20 -right-20 w-96 h-96 bg-blue-500 rounded-full blur-[100px]"
                />
                <motion.div
                    animate={{
                        opacity: [0.03, 0.06, 0.03],
                        scale: [1, 1.1, 1],
                        rotate: [0, -5, 0]
                    }}
                    transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                    className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-600 rounded-full blur-[80px]"
                />
            </div>

            <div className="flex-1 overflow-y-auto z-10 flex flex-col items-center justify-center p-6 pb-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-sm"
                >
                    {/* Logo Section */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="relative mb-4">
                            <div className="absolute inset-0 bg-blue-500 rounded-2xl blur-lg opacity-20 animate-pulse"></div>
                            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl relative z-10 transition-colors">
                                <Plane className="h-10 w-10 text-blue-600 dark:text-blue-400 -rotate-45" />
                            </div>
                        </div>
                        <h1 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white transition-colors">
                            FLIGHT<span className="text-blue-600 dark:text-blue-400">LOG</span>
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium tracking-wide uppercase mt-1">Digital Logbook System</p>
                    </div>

                    <Card className="bg-white/80 dark:bg-slate-900/40 backdrop-blur-xl border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden transition-colors">
                        <CardContent className="p-8">
                            <div className="flex gap-4 mb-8">
                                <button
                                    onClick={() => setMode('signin')}
                                    className={`flex-1 pb-2 text-sm font-bold tracking-widest uppercase transition-all border-b-2 ${mode === 'signin' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400'}`}
                                >
                                    Sign In
                                </button>
                                <button
                                    onClick={() => setMode('signup')}
                                    className={`flex-1 pb-2 text-sm font-bold tracking-widest uppercase transition-all border-b-2 ${mode === 'signup' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400'}`}
                                >
                                    Sign Up
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <AnimatePresence mode="popLayout">
                                    {mode === 'signup' && (
                                        <motion.div
                                            key="name-field"
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                        >
                                            <Label className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 transition-colors">Pilot Name</Label>
                                            <div className="relative mt-1">
                                                <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                                <Input
                                                    placeholder="Captain John Doe"
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    className="pl-10 h-12 bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 focus:border-blue-500 transition-all"
                                                    required
                                                />
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div>
                                    <Label className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 transition-colors">Email Address</Label>
                                    <div className="relative mt-1">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                        <Input
                                            type="email"
                                            placeholder="captain@airline.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="pl-10 h-12 bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 focus:border-blue-500 transition-all"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 transition-colors">Access Code</Label>
                                    <div className="relative mt-1">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                        <Input
                                            type="password"
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="pl-10 h-12 bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 focus:border-blue-500 transition-all"
                                            required
                                        />
                                    </div>
                                </div>

                                {mode === 'signin' && (
                                    <div className="text-right">
                                        <button type="button" className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest hover:underline">Forgot Landing Perms?</button>
                                    </div>
                                )}

                                <Button
                                    disabled={isLoading}
                                    className="w-full h-12 bg-blue-600 hover:bg-blue-500 text-white font-bold tracking-widest uppercase shadow-lg shadow-blue-600/20 active:scale-95 transition-all mt-4"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            PROCESSING...
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            {mode === 'signin' ? 'AUTHORIZE ENTRY' : 'REGISTER LOGBOOK'}
                                            <ArrowRight className="h-4 w-4" />
                                        </div>
                                    )}
                                </Button>
                            </form>

                            <div className="relative my-8 text-center">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
                                </div>
                                <span className="relative px-4 bg-white dark:bg-slate-900/20 text-[10px] font-bold text-slate-400 uppercase tracking-widest transition-colors">Secure Connection</span>
                            </div>

                            <div className="flex gap-4">
                                <Button variant="outline" className="flex-1 h-12 bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                    <Github className="h-5 w-5 mr-2" />
                                    ID.ME
                                </Button>
                                <Button variant="outline" className="flex-1 h-12 bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                    <Plane className="h-5 w-5 mr-2" />
                                    FAA SSO
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <p className="mt-8 text-center text-[10px] text-slate-500 dark:text-slate-600 font-medium uppercase tracking-[0.2em] transition-colors">
                        System Online • Secure Auth v4.1.0
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
