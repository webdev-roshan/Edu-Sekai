import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";

async function getMyProfile() {
    const { data } = await axiosInstance.get("/profiles/me/");
    return data;
}

async function updateMyProfile(payload: any) {
    const { data } = await axiosInstance.patch("/profiles/me/", payload);
    return data;
}

export function useProfile() {
    return useQuery({
        queryKey: ["profile"],
        queryFn: getMyProfile,
        retry: false,
    });
}

export function useUpdateProfile() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateMyProfile,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["profile"] });
            toast.success("Profile updated successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.detail || "Update failed");
        }
    });
}

async function checkSubdomain(subdomain: string) {
    const { data } = await axiosInstance.get(`/organizations/check-domain/?domain=${subdomain}`);
    return data.exists;
}

export function useCheckSubdomain() {
    return useMutation({
        mutationFn: checkSubdomain,
    });
}

async function getInstitutionProfile() {
    const { data } = await axiosInstance.get("/profiles/institution/");
    return data;
}

async function updateInstitutionProfile(payload: any) {
    const { data } = await axiosInstance.patch("/profiles/institution/", payload);
    return data;
}

export function useInstitutionProfile() {
    return useQuery({
        queryKey: ["institution-profile"],
        queryFn: getInstitutionProfile,
        retry: false,
    });
}

export function useUpdateInstitutionProfile() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateInstitutionProfile,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["institution-profile"] });
            toast.success("Institution settings updated");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.detail || "Update failed");
        }
    });
}
