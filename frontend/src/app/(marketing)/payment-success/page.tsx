"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function PaymentSuccessPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const subdomain = searchParams.get("subdomain");

    useEffect(() => {
        // After successful payment, redirect to tenant login
        if (subdomain) {
            const protocol = window.location.protocol;
            const host = window.location.host.split(":")[0];
            const port = window.location.host.includes(":") ? `:${window.location.host.split(":")[1]}` : "";
            const rootDomain = host === "localhost" ? `localhost${port}` : "schoolsansar.com";

            const tenantUrl = `${protocol}//${subdomain}.${rootDomain}/login`;

            // Redirect after 3 seconds
            setTimeout(() => {
                window.location.href = tenantUrl;
            }, 3000);
        }
    }, [subdomain]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/50 p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-center text-green-600">Payment Successful!</CardTitle>
                    <CardDescription className="text-center">
                        Your organization has been created successfully.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center space-y-4">
                    <div className="rounded-full bg-green-100 p-3">
                        <svg
                            className="h-12 w-12 text-green-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>
                    <p className="text-center text-sm text-muted-foreground">
                        Redirecting to your login page...
                    </p>
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </CardContent>
            </Card>
        </div>
    );
}
