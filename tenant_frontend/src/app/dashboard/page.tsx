"use client";

import { useMe } from "@/hooks/useAuth";
import {
    Users,
    Calendar,
    BookOpen,
    TrendingUp,
    Clock,
    Activity,
    ArrowUpRight,
    ArrowDownRight,
    Search
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DashboardOverview() {
    const { data: user } = useMe();

    const stats = [
        { label: "Total Students", value: "2,450", change: "+12.5%", trending: "up", icon: Users, color: "sky" },
        { label: "Course Active", value: "48", change: "+4.2%", trending: "up", icon: BookOpen, color: "teal" },
        { label: "Avg. Attendance", value: "94%", change: "-2.1%", trending: "down", icon: Activity, color: "indigo" },
        { label: "Faculty Members", value: "124", change: "+8.1%", trending: "up", icon: TrendingUp, color: "emerald" },
    ];

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Welcome Banner */}
            <div className="relative bg-gradient-to-r from-sky-600 to-teal-600 rounded-[2.5rem] p-10 md:p-14 text-white overflow-hidden shadow-2xl shadow-sky-500/20">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
                    <div className="space-y-4 text-center md:text-left">
                        <div className="inline-block bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest text-sky-50 border border-white/20">
                            Dashboard Overview
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                            Welcome back, <br />
                            <span className="text-sky-200">{user?.profile?.first_name}!</span>
                        </h1>
                        <p className="text-sky-50/80 text-lg max-w-md font-medium">
                            Here's what's happening at your institution today. All systems are running smoothly.
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <Button className="bg-white text-sky-600 hover:bg-sky-50 h-14 px-8 rounded-2xl font-bold shadow-xl">
                            Create Report
                        </Button>
                        <Button variant="outline" className="h-14 px-8 rounded-2xl font-bold bg-white/10 border-white/20 hover:bg-white/20 text-white backdrop-blur-md">
                            Settings
                        </Button>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                {stats.map((stat, i) => (
                    <Card key={i} className="border-none shadow-xl shadow-slate-200/50 dark:shadow-none dark:bg-slate-900 group h-full transition-all hover:-translate-y-1">
                        <CardContent className="p-8">
                            <div className="flex justify-between items-start mb-6">
                                <div className={`p-4 bg-${stat.color}-100 dark:bg-${stat.color}-500/10 text-${stat.color}-600 rounded-2xl group-hover:scale-110 transition-transform duration-300`}>
                                    <stat.icon className="h-7 w-7" />
                                </div>
                                <div className={`flex items-center gap-1 font-bold text-sm ${stat.trending === 'up' ? 'text-emerald-500' : 'text-red-500'}`}>
                                    {stat.change}
                                    {stat.trending === 'up' ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                                </div>
                            </div>
                            <h3 className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-xs mb-2">{stat.label}</h3>
                            <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">{stat.value}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <Card className="lg:col-span-2 border-none shadow-xl shadow-slate-200/50 dark:shadow-none dark:bg-slate-900">
                    <CardHeader className="flex flex-row items-center justify-between pb-8 border-b border-slate-50 dark:border-slate-800">
                        <div>
                            <CardTitle className="text-xl">Institutional Activity</CardTitle>
                            <CardDescription>Real-time updates across departments</CardDescription>
                        </div>
                        <Button variant="ghost" className="text-sky-600 font-bold text-sm">View Timeline</Button>
                    </CardHeader>
                    <CardContent className="pt-8 px-0">
                        <div className="space-y-0">
                            {[1, 2, 3, 4].map((item) => (
                                <div key={item} className="flex items-center gap-6 p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer border-b border-slate-50 dark:border-slate-800 last:border-0 relative">
                                    <div className="h-12 w-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                                        <Clock className="h-6 w-6 text-slate-400" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-slate-800 dark:text-slate-200">New student enrollment request</p>
                                        <p className="text-sm text-slate-500">Department of Computer Science • Grade 10</p>
                                    </div>
                                    <p className="text-xs font-bold text-slate-400 whitespace-nowrap">2m ago</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none bg-slate-900 text-white rounded-[2rem] shadow-2xl overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-10 opacity-10">
                        <Calendar className="h-40 w-40 rotate-12" />
                    </div>
                    <CardHeader className="p-10 space-y-2">
                        <div className="p-3 bg-white/10 w-fit rounded-2xl backdrop-blur-md mb-4 border border-white/20">
                            <Calendar className="h-6 w-6 text-sky-300" />
                        </div>
                        <CardTitle className="text-2xl font-bold">Upcoming Events</CardTitle>
                        <CardDescription className="text-slate-400">School calendar for the week</CardDescription>
                    </CardHeader>
                    <CardContent className="px-10 pb-10 space-y-6">
                        {[
                            { day: "Mon", date: "Jan 12", event: "Staff Meeting" },
                            { day: "Wed", date: "Jan 14", event: "Annual Sports Day" },
                            { day: "Fri", date: "Jan 16", event: "Quarterly Exams" },
                        ].map((event, i) => (
                            <div key={i} className="flex items-center gap-6 p-4 rounded-[1.5rem] bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                <div className="text-center w-12 border-r border-white/10 pr-6">
                                    <p className="text-[10px] font-black uppercase text-sky-400">{event.day}</p>
                                    <p className="text-lg font-black">{event.date.split(' ')[1]}</p>
                                </div>
                                <p className="font-bold text-slate-200">{event.event}</p>
                            </div>
                        ))}
                        <Button className="w-full h-12 rounded-xl bg-sky-500 hover:bg-sky-400 font-bold mt-4 shadow-lg shadow-sky-500/20">
                            Open Calendar
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
