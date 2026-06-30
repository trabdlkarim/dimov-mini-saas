import { Project, ProjectQueryParams } from "@/types/projects";
import { apiFetch } from "./api-fetch";


export function getProjects(token: string, params: ProjectQueryParams) {
    const query = new URLSearchParams();
    if (params.search) {
        query.append("search", params.search);
    }
    if (params.status) {
        query.append("filter", `status:${params.status}`);
    }
    if (params.page) {
        query.append("page", String(params.page));
    }
    if (params.limit) {
        query.append("limit", String(params.limit));
    }

    return apiFetch<Project[]>(`/projects?${query.toString()}`, token);
}

export function createProject(data: Partial<Project>, token: string) {
    return apiFetch<Project>("/projects", token, {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export function updateProject(
    id: number,
    data: Partial<Project>,
    token: string,
) {
    return apiFetch<Project>(`/projects/${id}`, token, {
        method: "PUT",
        body: JSON.stringify(data),
    });
}

export function deleteProject(id: number, token: string) {
    return apiFetch<void>(`/projects/${id}`, token, {
        method: "DELETE",
    });
}