import axiosInstance from "@/lib/axiosInstance";
// import { LoginResponse } from "@/types";

async function fetchHandler<T>(
  url: string,
  method: "GET" | "POST" | "PUT" | "DELETE",
  options?: object
): Promise<T> {
  try {
    const response = await axiosInstance.request<T>({
      url,
      method,
      data: options,
    });
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === "object" && "response" in error) {
      const err = error as {
        response?: { status?: number; data?: { message?: string } };
      };
      return {
        success: false,
        statusCode: err.response?.status || 500,
        message: err.response?.data?.message || "An error occurred",
      } as T;
    }
    return {
      success: false,
      statusCode: 500,
      message: "An error occurred",
    } as T;
  }
}


export async function signIn(email: string, password: string): Promise<any> {
  return fetchHandler<any>("/auth/login", "POST", {
    email,
    password,
  });
}


export async function signup(data: any): Promise<any> {
  return fetchHandler<any>("/auth/signup", "POST", {
    first_name: data.first_name,
    last_name: data.last_name,
    email: data.email,
    password: data.password,
  });
}
