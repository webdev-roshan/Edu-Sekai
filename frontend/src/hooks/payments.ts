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
