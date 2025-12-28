"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useVerifyPayment } from "@/hooks/payments";

export default function PaymentSuccessPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const dataParam = searchParams.get("data");
    const { mutate: verifyPayment, isPending, isSuccess, error } = useVerifyPayment();

    useEffect(() => {
        if (dataParam) {
            verifyPayment(dataParam, {
                onSuccess: (response) => {
                    // Redirect to tenant login
                    if (response.domain_url) {
                        setTimeout(() => {
                            window.location.href = response.domain_url;
                            // Note: response.domain_url from backend includes http://...:8000
                            // If backend logic is correct, it should work.
                        }, 3000);
                    }
                }
            });
        }
    }, [dataParam, verifyPayment]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/50 p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-center text-green-600">
                        {isPending && "Verifying Payment..."}
                        {isSuccess && "Payment Successful!"}
                        {error && "Payment Verification Failed"}
                        {!isPending && !isSuccess && !error && "Processing Payment..."}
                    </CardTitle>
                    <CardDescription className="text-center">
                        {isPending && "Please wait while we verify your payment and set up your school."}
                        {isSuccess && "Your organization has been created successfully. Redirecting..."}
                        {error && (error.message || "There was an issue verifying your payment. Please contact support.")}
                        {!isPending && !isSuccess && !error && "Waiting for payment data..."}
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center space-y-4">
                    {(isPending || (!isPending && !isSuccess && !error)) && (
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    )}

                    {isSuccess && (
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
                    )}

                    {error && (
                        <div className="text-red-500 text-sm p-4 bg-red-50 rounded-md">
                            {error.message || "An unexpected error occurred."}
                        </div>
                    )}

                    {isSuccess && (
                        <p className="text-center text-sm text-muted-foreground">
                            Redirecting to your login page...
                        </p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
