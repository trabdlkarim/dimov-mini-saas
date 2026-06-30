
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;


export async function apiFetch<T>(
    path: string,
    token: string,
    init?: RequestInit
): Promise<T> {
    const response = await fetch(API_BASE_URL + path, {
        ...init,
        headers: {
            ...init?.headers,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error || "Something went wrong. The api request failed.");
    }

    return response.json();
}