import { User } from "@/types/users";
import { apiFetch } from "./api-fetch";

export function getUsers(token:string) {
  return apiFetch<User[]>("/users", token);
}

export function registerUser(data: Partial<User>) {
    return apiFetch<User>("/auth/register", "", {
        method: "POST",
        body: JSON.stringify(data),
    });
}