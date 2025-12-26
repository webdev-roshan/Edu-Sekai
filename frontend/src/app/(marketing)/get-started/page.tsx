"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { useInitPayment } from "@/hooks/payments";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

// Validation Schema
const formSchema = z.object({
    organizationName: z.string().min(2, "School name must be at least 2 characters."),
    subdomain: z.string()
        .min(3, "Subdomain must be at least 3 characters.")
        .regex(/^[a-z0-9]+$/, "Subdomain must be lowercase letters and numbers only."),
    email: z.string().email("Invalid email address."),
    password: z.string().min(8, "Password must be at least 8 characters."),
    phone: z.string().min(10, "Phone number must be at least 10 digits."),
});

type FormValues = z.infer<typeof formSchema>;

export default function GetStartedPage() {
    const router = useRouter();
    const [step, setStep] = useState<"form" | "payment">("form");
    const [formData, setFormData] = useState<FormValues | null>(null);
    const [paymentData, setPaymentData] = useState<any>(null);

    const { mutateAsync: initPayment, isPending: isInitializing } = useInitPayment();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            organizationName: "",
            subdomain: "",
            email: "",
            password: "",
            phone: "",
        },
    });

    async function onFormSubmit(values: FormValues) {
        // Initialize payment
        try {
            const payload = {
                organization_name: values.organizationName,
                subdomain: values.subdomain,
                email: values.email,
                password: values.password,
                phone: values.phone,
            };

            const response = await initPayment(payload);
            setFormData(values);
            setPaymentData(response);
            setStep("payment");
        } catch (error) {
            console.error("Payment initialization error", error);
        }
    }

    function handleEsewaPayment() {
        if (!paymentData || !formData) return;

        // Create a form and submit to eSewa
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = paymentData.url;

        const fields = {
            amount: paymentData.amount,
            tax_amount: '0',
            total_amount: paymentData.amount,
            transaction_uuid: paymentData.transaction_uuid,
            product_code: paymentData.product_code,
            product_service_charge: '0',
            product_delivery_charge: '0',
            success_url: `${window.location.origin}/payment-success?subdomain=${formData.subdomain}`,
            failure_url: `${window.location.origin}/get-started`,
            signed_field_names: 'total_amount,transaction_uuid,product_code',
            signature: paymentData.signature,
        };

        Object.entries(fields).forEach(([key, value]) => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = value;
            form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <Card className="w-full max-w-lg">
                <CardHeader>
                    <CardTitle>Create Your School</CardTitle>
                    <CardDescription>
                        {step === "form"
                            ? "Enter your organization details to get started."
                            : "Complete payment to activate your account."}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {step === "form" ? (
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="organizationName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <FloatingLabelInput label="School Name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="phone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <FloatingLabelInput label="Phone Number" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="subdomain"
                                        render={({ field }) => (
                                            <FormItem>
                                                {/* Subdomain has special layout, keeping standard input for now or need to adapt floating label to it. 
                                                   Floating label usually assumes it wraps the input. 
                                                   With the suffix .localhost, it's a flex container. 
                                                   Let's keep standard layout for subdomain but style it to match if possible, 
                                                   or just use FloatingLabelInput if the suffix can be handled? 
                                                   The user specifically asked for FloatingLabelInput. 
                                                   If I use it, the suffix might break the floating effect or position.
                                                   Better to keep it cleanly separate or stick to standard for this complex field.
                                                   I will use standard Input for subdomain as it's a composite field (input + .localhost).
                                               */}
                                                <FormLabel>Subdomain</FormLabel>
                                                <FormControl>
                                                    <div className="flex">
                                                        <Input placeholder="school1" {...field} className="rounded-r-none" />
                                                        <div className="flex items-center px-3 border border-l-0 rounded-r-md bg-secondary/10 text-sm text-muted-foreground">
                                                            .localhost
                                                        </div>
                                                    </div>
                                                </FormControl>
                                                <FormDescription className="text-xs">
                                                    Your unique URL.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <FloatingLabelInput label="Admin Email" type="email" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <FloatingLabelInput label="Password" type="password" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button type="submit" className="w-full">
                                    Proceed to Payment
                                </Button>
                            </form>
                        </Form>
                    ) : (
                        <div className="space-y-6">
                            <div className="bg-green-50 p-4 rounded-lg flex items-center justify-between border border-green-200">
                                <div>
                                    <p className="text-sm font-medium text-green-900">Total Amount</p>
                                    <p className="text-2xl font-bold text-green-700">Rs. 5,000</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-green-600">Lifetime Access</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">
                                    You are paying for <strong>{formData?.organizationName}</strong>.
                                    Please complete the payment using eSewa.
                                </p>
                            </div>

                            <Button
                                variant="default"
                                className="w-full bg-green-600 hover:bg-green-700 text-white"
                                onClick={handleEsewaPayment}
                                disabled={isInitializing}
                            >
                                {isInitializing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                Pay with eSewa
                            </Button>

                            <Button
                                variant="ghost"
                                className="w-full"
                                onClick={() => setStep("form")}
                                disabled={isInitializing}
                            >
                                Back to Details
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
