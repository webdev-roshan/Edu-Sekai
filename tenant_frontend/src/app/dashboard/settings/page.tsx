"use client";

import { useInstitutionProfile, useUpdateInstitutionProfile } from "@/hooks/useProfile";
import { useMe } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import {
    Loader2,
    Globe,
    Save,
    Building2,
    Facebook,
    Instagram,
    Twitter,
    Linkedin,
    Info,
    Rocket,
    Target,
    Compass,
    Image as ImageIcon
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function InstitutionSettingsPage() {
    const { data: user } = useMe();
    const { data: profile, isLoading } = useInstitutionProfile();
    const { mutate: updateProfile, isPending: isUpdating } = useUpdateInstitutionProfile();
    const router = useRouter();

    const [formData, setFormData] = useState<any>({});

    useEffect(() => {
        if (profile) {
            setFormData(profile);
        }
    }, [profile]);

    // Role check: Only owners can edit
    const isOwner = user?.roles?.includes("owner") || user?.roles?.includes("staff");

    if (isLoading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-sky-600" />
            </div>
        );
    }

    if (!isOwner) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center max-w-md mx-auto">
                <div className="p-6 bg-red-50 dark:bg-red-500/10 rounded-full mb-6">
                    <Building2 className="h-16 w-16 text-red-500" />
                </div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">Access Denied</h1>
                <p className="text-slate-500 dark:text-slate-400 mb-8">
                    Only organization owners and authorized staff have permission to modify institutional settings.
                </p>
                <Button onClick={() => router.push("/dashboard")} className="bg-sky-600 px-8 h-12 rounded-xl">
                    Return to Dashboard
                </Button>
            </div>
        );
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateProfile(formData, {
            onSuccess: () => {
                toast.success("Institution details updated successfully!");
            },
            onError: () => {
                toast.error("Failed to update details.");
            }
        });
    };

    return (
        <div className="max-w-5xl mx-auto space-y-10">
            {/* Header info */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Institution Profile</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Manage your school's brand and public identity</p>
                </div>
                <Button
                    onClick={handleSubmit}
                    className="bg-sky-600 hover:bg-sky-500 h-14 px-10 rounded-2xl shadow-lg shadow-sky-500/20 text-base font-bold"
                    disabled={isUpdating}
                >
                    {isUpdating ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Save className="h-5 w-5 mr-2" />}
                    Save All Changes
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Left Side: Secondary Content */}
                <div className="lg:col-span-4 space-y-8">
                    <Card className="border-none shadow-xl shadow-slate-200/50 dark:shadow-none dark:bg-slate-900 overflow-hidden">
                        <div className="h-2 w-full bg-teal-500" />
                        <CardHeader>
                            <CardTitle className="text-lg">Logo & Banner</CardTitle>
                            <CardDescription>Visual identity of your school</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <Label className="text-xs uppercase font-extrabold text-slate-400 tracking-widest">School Logo</Label>
                                <div className="aspect-square bg-slate-50 dark:bg-slate-800 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center group relative cursor-pointer overflow-hidden">
                                    {formData.logo ? (
                                        <img src={formData.logo} alt="Logo" className="w-full h-full object-contain p-4" />
                                    ) : (
                                        <>
                                            <ImageIcon className="h-10 w-10 text-slate-300 mb-2 group-hover:scale-110 transition-transform" />
                                            <span className="text-xs font-bold text-slate-400">Click to upload</span>
                                        </>
                                    )}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                        <Button variant="secondary" size="sm" className="font-bold">Choose Image</Button>
                                    </div>
                                </div>
                            </div>

                            <Card className="bg-sky-600 border-none p-6 text-white rounded-[2rem] shadow-xl shadow-sky-500/20">
                                <Rocket className="h-10 w-10 mb-4 text-sky-200" />
                                <h3 className="text-xl font-bold mb-2">Build Your Brand</h3>
                                <p className="text-sky-100 text-sm leading-relaxed">
                                    These details appear on reports, student IDs, and public pages. Make sure they are accurate.
                                </p>
                            </Card>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Side: Main Forms */}
                <div className="lg:col-span-8 space-y-10">
                    {/* Basic Info */}
                    <Card className="border-none shadow-xl shadow-slate-200/50 dark:shadow-none dark:bg-slate-900">
                        <CardHeader className="border-b border-slate-50 dark:border-slate-800 pb-8">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-sky-100 dark:bg-sky-500/10 text-sky-600 rounded-2xl">
                                    <Info className="h-6 w-6" />
                                </div>
                                <CardTitle className="text-xl">Basic Information</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-10 space-y-8">
                            <FloatingLabelInput
                                id="tagline"
                                label="Institutional Tagline"
                                value={formData.tagline || ""}
                                onChange={handleChange}
                                placeholder="Empowering the leaders of tomorrow"
                            />

                            <div className="space-y-3">
                                <Label htmlFor="about" className="text-xs uppercase font-extrabold text-slate-400 tracking-widest pl-1">About the school</Label>
                                <Textarea
                                    id="about"
                                    className="min-h-[140px] bg-slate-50 dark:bg-slate-800/50 border-transparent focus:border-sky-500 dark:focus:border-sky-500 transition-all rounded-[1.5rem] p-6 text-base"
                                    placeholder="Write a brief introduction about your institution..."
                                    value={formData.about || ""}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <FloatingLabelInput
                                    id="website"
                                    label="Official Website"
                                    value={formData.website || ""}
                                    onChange={handleChange}
                                />
                                <FloatingLabelInput
                                    id="established_date"
                                    label="Established Date"
                                    type="date"
                                    value={formData.established_date || ""}
                                    onChange={handleChange}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Mission & Vision */}
                    <Card className="border-none shadow-xl shadow-slate-200/50 dark:shadow-none dark:bg-slate-900">
                        <CardHeader className="border-b border-slate-50 dark:border-slate-800 pb-8">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-teal-100 dark:bg-teal-500/10 text-teal-600 rounded-2xl">
                                    <Target className="h-6 w-6" />
                                </div>
                                <CardTitle className="text-xl">Core Values</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-10 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 mb-1 pl-1">
                                        <Compass className="h-4 w-4 text-sky-500" />
                                        <Label htmlFor="mission" className="text-xs uppercase font-extrabold text-slate-400 tracking-widest">Mission</Label>
                                    </div>
                                    <Textarea
                                        id="mission"
                                        className="min-h-[120px] bg-slate-50 dark:bg-slate-800/50 border-transparent focus:border-teal-500 transition-all rounded-[1.5rem] p-6"
                                        value={formData.mission || ""}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 mb-1 pl-1">
                                        <Globe className="h-4 w-4 text-teal-500" />
                                        <Label htmlFor="vision" className="text-xs uppercase font-extrabold text-slate-400 tracking-widest">Vision</Label>
                                    </div>
                                    <Textarea
                                        id="vision"
                                        className="min-h-[120px] bg-slate-50 dark:bg-slate-800/50 border-transparent focus:border-teal-500 transition-all rounded-[1.5rem] p-6"
                                        value={formData.vision || ""}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Social links */}
                    <Card className="border-none shadow-xl shadow-slate-200/50 dark:shadow-none dark:bg-slate-900 overflow-hidden">
                        <CardHeader className="border-b border-slate-50 dark:border-slate-800 pb-8">
                            <CardTitle className="text-xl">Social Presence</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="relative">
                                <Facebook className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-600" />
                                <FloatingLabelInput
                                    id="facebook_url"
                                    label="Facebook URL"
                                    className="pl-14"
                                    value={formData.facebook_url || ""}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="relative">
                                <Instagram className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-pink-600" />
                                <FloatingLabelInput
                                    id="instagram_url"
                                    label="Instagram URL"
                                    className="pl-14"
                                    value={formData.instagram_url || ""}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="relative">
                                <Twitter className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-sky-500" />
                                <FloatingLabelInput
                                    id="twitter_url"
                                    label="Twitter URL"
                                    className="pl-14"
                                    value={formData.twitter_url || ""}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="relative">
                                <Linkedin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-800" />
                                <FloatingLabelInput
                                    id="linkedin_url"
                                    label="LinkedIn URL"
                                    className="pl-14"
                                    value={formData.linkedin_url || ""}
                                    onChange={handleChange}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
