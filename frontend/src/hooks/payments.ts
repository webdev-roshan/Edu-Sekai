import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { RegisterOrganizationPayload, RegisterOrganizationResponse, InitPaymentPayload, InitPaymentResponse } from "@/types/payment";
import axiosInstance from "@/lib/axios";

async function registerOrganization(payload: RegisterOrganizationPayload): Promise<RegisterOrganizationResponse> {
    const { data } = await axiosInstance.post<RegisterOrganizationResponse>("/auth/register-organization/", payload);
    return data;
}

async function initPayment(payload: InitPaymentPayload): Promise<InitPaymentResponse> {
    const { data } = await axiosInstance.post<InitPaymentResponse>("/payments/init/", payload);
    return data;
}

export function useRegisterOrganization() {
    return useMutation({
        mutationFn: registerOrganization,
        onError: (error: Error) => {
            toast.error(error.message || "Registration failed. Please try again.");
        },
        onSuccess: (data) => {
            toast.success("Registration Successful!");
        },
    });
}

export function useInitPayment() {
    return useMutation({
        mutationFn: initPayment,
        onError: (error: Error) => {
            toast.error(error.message || "Payment initialization failed. Please try again.");
        },
    });
}

async function verifyPayment(dataString: string): Promise<any> {
    const { data } = await axiosInstance.get(`/payments/verify/?data=${dataString}`);
    return data;
}

export function useVerifyPayment() {
    return useMutation({
        mutationFn: verifyPayment,
        onError: (error: Error) => {
            toast.error(error.message || "Payment verification failed.");
        },
    });
}

async function verifyEmail(payload: { email: string; password?: string }): Promise<{ exists: boolean; valid_password: boolean }> {
    const { data } = await axiosInstance.post<{ exists: boolean; valid_password: boolean }>("/auth/verify-email/", payload);
    return data;
}

export function useVerifyEmail() {
    return useMutation({
        mutationFn: verifyEmail,
    });
}

async function checkDomain(subdomain: string): Promise<{ exists: boolean }> {
    const { data } = await axiosInstance.get<{ exists: boolean }>(`/organizations/check-domain/?domain=${subdomain}`);
    return data;
}

export function useCheckDomain() {
    return useMutation({
        mutationFn: checkDomain,
    });
}
