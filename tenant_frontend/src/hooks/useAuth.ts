import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { AuthResponse, User } from "@/types/auth";
import { toast } from "sonner";

async function login(credentials: any): Promise<AuthResponse> {
    const { data } = await axiosInstance.post<AuthResponse>("/auth/login/", credentials);
    return data;
}

async function logout(): Promise<void> {
    await axiosInstance.post("/auth/logout/");
}

async function getMe(): Promise<User> {
    const { data } = await axiosInstance.get<User>("/auth/me/");
    return data;
}

export function useLogin() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: login,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["me"] });
            toast.success("Logged in successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.detail || "Login failed");
        }
    });
}

export function useLogout() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: logout,
        onSuccess: () => {
            queryClient.setQueryData(["me"], null);
            toast.success("Logged out successfully");
            window.location.href = "/login";
        }
    });
}

export function useMe() {
    return useQuery({
        queryKey: ["me"],
        queryFn: getMe,
        retry: false,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}
