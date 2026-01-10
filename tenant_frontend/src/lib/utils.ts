import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getMediaUrl(path: string | null | undefined) {
  if (!path) return null;
  if (path.startsWith("http") || path.startsWith("blob:")) return path;

  // Get base URL without /api if configured that way, or just use the domain
  // Assuming NEXT_PUBLIC_API_URL is like http://tenant.localhost:8000/api
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || '';

  // Ensure path starts with /
  const cleanPath = path.startsWith('/') ? path : `/${path}`;

  return `${baseUrl}${cleanPath}`;
}
