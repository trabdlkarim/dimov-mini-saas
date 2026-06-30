import { User } from "@/types/users";
import { apiFetch } from "./api-fetch";

export function getUsers(token:string) {
  return apiFetch<User[]>("/users", token);
}