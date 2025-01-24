import axiosInstance, { handleError } from "./axiosInstance";

// Generic GET requests
export const get = async <T>(
  url: string,
  params?: Record<string, any>
): Promise<T> => {
  try {
    const response = await axiosInstance.get<T>(url, { params });
    return response.data;
  } catch (error: any) {
    throw handleError(error);
  }
};

// Generic POST request
export const post = async <T>(
  url: string,
  data: Record<string, any>,
  config = {}
): Promise<T> => {
  try {
    const response = await axiosInstance.post<T>(url, data, config);
    return response.data;
  } catch (error: any) {
    throw handleError(error);
  }
};

// Generic PUT request
export const put = async <T>(
  url: string,
  data: Record<string, any>,
  config = {}
): Promise<T> => {
  try {
    const response = await axiosInstance.put<T>(url, data, config);
    return response.data;
  } catch (error: any) {
    throw handleError(error);
  }
};

// Generic DELETE request
export const del = async <T>(url:string):Promise<T> => {
    try {
        const response = await axiosInstance.delete<T>(url);
        return response.data;
    } catch (error:any) {
        throw handleError(error);
    }
}
