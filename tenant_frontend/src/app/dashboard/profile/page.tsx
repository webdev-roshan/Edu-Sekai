"use client";

import { useProfile, useUpdateProfile } from "@/hooks/useProfile";
import { useMe } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import { useState, useEffect } from "react";
import {
    Loader2,
    User,
    Save,
    Mail,
    Phone,
    Calendar,
    MapPin,
    Briefcase,
    BookOpen,
    Camera,
    ShieldCheck,
    BadgeCheck
} from "lucide-react";
import { toast } from "sonner";

export default function ProfilePage() {
    const { data: user } = useMe();
    const { data: profile, isLoading } = useProfile();
    const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();

    const [formData, setFormData] = useState<any>({});

    useEffect(() => {
        if (profile) {
            setFormData(profile);
        }
    }, [profile]);

    if (isLoading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-12 w-12 animate-spin text-sky-600" />
                    <p className="text-slate-500 font-medium animate-pulse">Loading your profile...</p>
                </div>
            </div>
        );
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateProfile(formData, {
            onSuccess: () => {
                toast.success("Profile updated successfully!");
            },
            onError: (err) => {
                toast.error("Failed to update profile.");
            }
        });
    };

    const role = user?.roles?.[0] || "member";
    const initials = `${user?.profile?.first_name?.[0] || ""}${user?.profile?.last_name?.[0] || ""}`.toUpperCase();

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="relative h-48 bg-gradient-to-r from-sky-600 to-teal-600 rounded-3xl overflow-hidden shadow-xl shadow-sky-500/10 mb-20 animate-in fade-in slide-in-from-top-4 duration-700">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="absolute -bottom-16 left-10 p-2 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl">
                    <div className="relative group">
                        <div className="h-40 w-40 rounded-[2rem] bg-gradient-to-br from-slate-200 to-slate-100 dark:from-slate-800 dark:to-slate-700 border-4 border-white dark:border-slate-900 flex items-center justify-center overflow-hidden shadow-inner">
                            {profile?.profile_image ? (
                                <img src={profile.profile_image} alt="Profile" className="h-full w-full object-cover" />
                            ) : (
                                <span className="text-5xl font-extrabold text-slate-400 dark:text-slate-500">{initials}</span>
                            )}
                        </div>
                        <button className="absolute bottom-2 right-2 p-3 bg-sky-600 hover:bg-sky-500 text-white rounded-2xl shadow-lg border-4 border-white dark:border-slate-900 transition-all transform hover:scale-110">
                            <Camera className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                <div className="absolute bottom-4 left-60 hidden md:block text-white">
                    <div className="flex items-center gap-2 mb-1">
                        <h1 className="text-3xl font-bold">{user?.profile?.first_name} {user?.profile?.last_name}</h1>
                        <BadgeCheck className="h-6 w-6 text-sky-200" />
                    </div>
                    <div className="flex items-center gap-4 text-sky-50/80 font-medium">
                        <span className="flex items-center gap-1.5 capitalize"><ShieldCheck className="h-4 w-4" /> {role}</span>
                        <div className="h-1 w-1 rounded-full bg-white/40" />
                        <span className="flex items-center gap-1.5"><Mail className="h-4 w-4" /> {user?.email}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
                {/* Left Column - Stats/Quick Info */}
                <div className="space-y-6">
                    <Card className="border-none shadow-xl shadow-slate-200/50 dark:shadow-none dark:bg-slate-900 overflow-hidden group">
                        <div className="h-2 w-full bg-sky-600" />
                        <CardHeader>
                            <CardTitle className="text-lg">Personal Rank</CardTitle>
                            <CardDescription>Role and Designation</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center gap-4">
                                <div className="p-3 bg-sky-100 dark:bg-sky-500/10 text-sky-600 rounded-xl">
                                    <Briefcase className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Designation</p>
                                    <p className="font-bold text-slate-700 dark:text-slate-200">{formData.designation || (role === 'student' ? 'Student' : 'Staff Member')}</p>
                                </div>
                            </div>

                            {profile?.employee_id && (
                                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center gap-4">
                                    <div className="p-3 bg-teal-100 dark:bg-teal-500/10 text-teal-600 rounded-xl">
                                        <BadgeCheck className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">ID Reference</p>
                                        <p className="font-bold text-slate-700 dark:text-slate-200">{profile.employee_id || profile.enrollment_id}</p>
                                    </div>
                                </div>
                            )}

                            {role === 'student' && (
                                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center gap-4">
                                    <div className="p-3 bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 rounded-xl">
                                        <BookOpen className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Level</p>
                                        <p className="font-bold text-slate-700 dark:text-slate-200">{formData.current_level || 'Not Set'}</p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Button
                        variant="outline"
                        className="w-full h-14 rounded-2xl border-slate-200 dark:border-slate-800 text-slate-500 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                    >
                        View Public Profile
                    </Button>
                </div>

                {/* Right Column - Main Form */}
                <div className="lg:col-span-2 space-y-8">
                    <Card className="border-none shadow-xl shadow-slate-200/50 dark:shadow-none dark:bg-slate-900">
                        <CardHeader className="border-b border-slate-50 dark:border-slate-800 pb-8">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-2xl font-bold">Profile Details</CardTitle>
                                    <CardDescription>Manage your personal information and contact details</CardDescription>
                                </div>
                                <div className="hidden sm:flex items-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl">
                                    <Button variant="ghost" size="sm" className="rounded-lg text-xs font-bold">Details</Button>
                                    <Button variant="ghost" size="sm" className="rounded-lg text-xs font-bold text-slate-400">Security</Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-10">
                            <form onSubmit={handleSubmit} className="space-y-10">
                                {/* Name Section */}
                                <div className="space-y-6">
                                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Full Identity</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <FloatingLabelInput
                                            id="first_name"
                                            label="First Name"
                                            value={formData.first_name || ""}
                                            onChange={handleChange}
                                            required
                                        />
                                        <FloatingLabelInput
                                            id="middle_name"
                                            label="Middle Name (Optional)"
                                            value={formData.middle_name || ""}
                                            onChange={handleChange}
                                        />
                                        <FloatingLabelInput
                                            id="last_name"
                                            label="Last Name"
                                            value={formData.last_name || ""}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Contact Section */}
                                <div className="space-y-6 pt-4 border-t border-slate-50 dark:border-slate-800">
                                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Communication</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="relative">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                            <FloatingLabelInput
                                                id="phone"
                                                label="Phone Number"
                                                className="pl-12"
                                                value={formData.phone || ""}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="relative">
                                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                            <FloatingLabelInput
                                                id="date_of_birth"
                                                label="Date of Birth"
                                                type="date"
                                                className="pl-12"
                                                value={formData.date_of_birth || ""}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-6 h-4 w-4 text-slate-400" />
                                        <FloatingLabelInput
                                            id="address"
                                            label="Current Address"
                                            className="pl-12"
                                            value={formData.address || ""}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                {/* Role-specific Section */}
                                {role === 'student' && (
                                    <div className="space-y-6 pt-4 border-t border-slate-50 dark:border-slate-800">
                                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Guardian details</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <FloatingLabelInput
                                                id="guardian_name"
                                                label="Guardian's Name"
                                                value={formData.guardian_name || ""}
                                                onChange={handleChange}
                                            />
                                            <FloatingLabelInput
                                                id="guardian_phone"
                                                label="Guardian's Phone"
                                                value={formData.guardian_phone || ""}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="flex justify-end pt-4">
                                    <Button
                                        type="submit"
                                        className="h-14 px-12 rounded-2xl bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 shadow-lg shadow-sky-500/25 transition-all text-base font-bold"
                                        disabled={isUpdating}
                                    >
                                        {isUpdating ? (
                                            <>
                                                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                                                Saving Changes...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="h-5 w-5 mr-2" />
                                                Update Profile
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
