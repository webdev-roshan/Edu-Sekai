"use client";

import { useEffect, useState } from "react";
import { useCheckSubdomain } from "@/hooks/useProfile";
import { Loader2, AlertTriangle, ExternalLink } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SubdomainGuard({ children }: { children: React.ReactNode }) {
    const [isVerified, setIsVerified] = useState<boolean | null>(null);
    const { mutate: checkDomain, isPending } = useCheckSubdomain();
    const [subdomain, setSubdomain] = useState("");

    useEffect(() => {
        if (typeof window !== "undefined") {
            const host = window.location.hostname;
            const parts = host.split(".");
            if (parts.length >= 2) {
                const sub = parts[0];
                setSubdomain(sub);
                checkDomain(sub, {
                    onSuccess: (exists) => {
                        setIsVerified(exists);
                    },
                    onError: () => {
                        setIsVerified(false);
                    }
                });
            } else {
                setIsVerified(false);
            }
        }
    }, [checkDomain]);

    if (isPending || isVerified === null) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-[#F8FAFC]">
                <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-4" />
                <p className="text-zinc-500 font-medium">Verifying your institution...</p>
            </div>
        );
    }

    if (isVerified === false) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#F8FAFC] p-4">
                <Card className="max-w-md w-full border-none shadow-2xl text-center p-6">
                    <CardHeader>
                        <div className="flex justify-center mb-4">
                            <div className="p-4 bg-amber-100 rounded-full">
                                <AlertTriangle className="h-10 w-10 text-amber-600" />
                            </div>
                        </div>
                        <CardTitle className="text-2xl font-bold text-zinc-800">Institution Not Found</CardTitle>
                        <CardDescription className="text-zinc-500">
                            The subdomain <span className="font-bold text-blue-600">{subdomain}</span> does not exist or has been deactivated.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-zinc-600">
                            Please check the URL for typos or contact your institution administrator for access.
                        </p>
                        <div className="pt-4 space-y-2">
                            <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => window.location.href = "http://localhost:3000"}>
                                Go to EDU Sekai Home
                                <ExternalLink className="ml-2 h-4 w-4" />
                            </Button>
                            <Button variant="ghost" className="w-full text-zinc-500" onClick={() => window.location.reload()}>
                                Try Again
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return <>{children}</>;
}
