"use client";

import { useState } from "react";
import { GraduationCap, Loader2, CheckCircle, Shield, Zap, Mail, Lock, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLogin } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";

export default function LoginPage() {
    const router = useRouter();
    const { mutate: login, isPending: isLoading } = useLogin();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        login({ email, password }, {
            onSuccess: () => {
                router.push("/dashboard/profile");
            }
        });
    };

    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
            {/* Left Side - Information (Hidden on mobile) */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-sky-600 to-teal-600 p-12 flex-col justify-between text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-16 animate-in slide-in-from-left duration-700">
                        <div className="p-2 bg-white/20 rounded-lg backdrop-blur-md">
                            <GraduationCap className="h-10 w-10 text-white" />
                        </div>
                        <span className="text-3xl font-bold tracking-tight text-white">Edu Sekai</span>
                    </div>

                    <div className="space-y-10">
                        <div className="animate-in slide-in-from-left duration-700 delay-100">
                            <h1 className="text-5xl font-extrabold mb-6 leading-tight">
                                Manage Your Institution <br />
                                <span className="text-sky-200">With Confidence.</span>
                            </h1>
                            <p className="text-xl text-sky-50/80 max-w-lg leading-relaxed">
                                Access your personalized dashboard to manage students, staff, and institutional operations with ease.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-6 mt-12">
                            {[
                                { icon: Shield, title: "Secure Access", desc: "Multi-tenant isolation ensures your data stays private." },
                                { icon: Zap, title: "Instant Updates", desc: "Real-time tracking of attendance and performance." },
                                { icon: CheckCircle, title: "Verified Profiles", desc: "Role-based access control for every user." }
                            ].map((item, i) => (
                                <div key={i} className={`flex items-start gap-4 animate-in slide-in-from-left duration-700 delay-${(i + 2) * 100}`}>
                                    <div className="p-3 bg-white/10 rounded-xl backdrop-blur-md border border-white/20">
                                        <item.icon className="h-6 w-6 text-sky-200" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                                        <p className="text-sky-50/70">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="relative z-10 pt-12 border-t border-white/20 flex justify-between items-center text-sky-100/60 text-sm">
                    <p>© 2025 Edu Sekai Ltd.</p>
                    <div className="flex gap-4">
                        <a href="#" className="hover:text-white transition-colors">Privacy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms</a>
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex-1 flex items-center justify-center p-6 lg:p-12 animate-in fade-in zoom-in duration-500">
                <div className="w-full max-w-md space-y-8">
                    <div className="lg:hidden flex flex-col items-center text-center mb-8">
                        <div className="p-3 bg-sky-600 rounded-2xl shadow-lg shadow-sky-500/20 mb-4">
                            <GraduationCap className="h-10 w-10 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Edu Sekai</h2>
                        <p className="text-slate-500 dark:text-slate-400">Institutional Login</p>
                    </div>

                    <Card className="border-none shadow-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md outline outline-1 outline-slate-200/50 dark:outline-slate-800/50">
                        <CardHeader className="space-y-2 pb-6">
                            <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">Welcome Back</CardTitle>
                            <CardDescription className="text-slate-600 dark:text-slate-400">
                                Please enter your credentials to access your dashboard
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleLogin} className="space-y-6">
                                <FloatingLabelInput
                                    id="email"
                                    type="email"
                                    label="Work Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="h-12"
                                />

                                <div className="space-y-1">
                                    <FloatingLabelInput
                                        id="password"
                                        type="password"
                                        label="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="h-12"
                                    />
                                    <div className="flex justify-end pt-1">
                                        <a href="#" className="text-xs font-semibold text-sky-600 hover:text-sky-500 dark:text-sky-400">
                                            Forgot password?
                                        </a>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full h-12 text-base font-bold bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 transition-all duration-300 shadow-lg shadow-sky-500/25"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                            Authenticating...
                                        </>
                                    ) : (
                                        <>
                                            Login to Dashboard
                                            <ArrowRight className="ml-2 h-5 w-5" />
                                        </>
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    <p className="text-center text-sm text-slate-500 dark:text-slate-500">
                        Having trouble? <a href="#" className="font-bold text-sky-600 dark:text-sky-400">Contact Support</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
