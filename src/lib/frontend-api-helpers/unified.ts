import axios from "axios";

const API_BASE_URL = "/api/unified";

interface UnifiedApiParams {
  model: string;
  connectionKey: string;
  id?: string;
  [key: string]: string | undefined;
}

interface UnifiedApiBody {
  [key: string]: any;
}

// GET request
export const listUnifiedData = async (params: UnifiedApiParams) => {
  const searchParams = new URLSearchParams(params as Record<string, string>);
  try {
    const response = await axios.get(`${API_BASE_URL}?${searchParams}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data || error.message;
    }
    throw new Error('An unexpected error occurred');
  }
};

// POST request
export const createUnifiedData = async (
  params: UnifiedApiParams,
  body: UnifiedApiBody
) => {
  const searchParams = new URLSearchParams(params as Record<string, string>);
  try {
    const response = await axios.post(`${API_BASE_URL}?${searchParams}`, body, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(error.response?.data, "<<<<<");
      throw error.response?.data || error.message;
    }
    console.log(error, "<<<<<");
    throw new Error('An unexpected error occurred');
  }
};

// PATCH request
export const updateUnifiedData = async (
  params: UnifiedApiParams,
  body: UnifiedApiBody
) => {
  const searchParams = new URLSearchParams(params as Record<string, string>);
  try {
    const response = await axios.patch(`${API_BASE_URL}?${searchParams}`, body, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data || error.message;
    }
    throw new Error('An unexpected error occurred');
  }
};

// DELETE request
export const deleteUnifiedData = async (params: UnifiedApiParams) => {
  const searchParams = new URLSearchParams(params as Record<string, string>);
  try {
    const response = await axios.delete(`${API_BASE_URL}?${searchParams}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data || error.message;
    }
    throw new Error('An unexpected error occurred');
  }
};
