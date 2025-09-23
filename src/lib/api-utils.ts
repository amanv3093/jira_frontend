import axiosInstance from "@/lib/axiosInstance";
import { AxiosError } from "axios";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

export async function fetchHandler<T>(
  url: string,
  method: HttpMethod,
  options?: object
): Promise<T> {
  try {
    const response = await axiosInstance.request<T>({
      url,
      method,
      data: options,
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.data) {
      throw error.response.data;
    }
    throw new Error((error as Error).message || "An error occurred");
  }
}

export async function fetchHandlerWithFormData<T>(
  url: string,
  method: HttpMethod,
  options?: object
): Promise<T> {
  try {
    const headers =
      options instanceof FormData
        ? { "Content-Type": "multipart/form-data" }
        : { "Content-Type": "application/json" };

    const response = await axiosInstance.request<T>({
      url,
      method,
      data: options,
      headers,
    });

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.data) {
      throw error.response.data;
    }
    throw new Error((error as Error).message || "An error occurred");
  }
}
