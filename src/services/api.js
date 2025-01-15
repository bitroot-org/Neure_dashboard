import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getWorkshopDates = async () => {
  const response = await api.get("/workshop/getWorkshopDates", {
    params: {
      company_id: 1,
    },
  });
  return response.data;
};

export const getWorkshops = async (params) => {
  const response = await api.get("/workshop/getWorkshopsByCompanyId", {
    params: {
      company_id: 1,
      page: params.currentPage,
      pageSize: params.pageSize,
      start_time: params.selectedDate,
    },
  });
  return response.data;
};
