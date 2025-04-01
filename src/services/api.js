import axios from "axios";

console.log('API Base URL:', import.meta.env.VITE_API_URL);


const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Refresh token function
const refreshToken = async () => {
  const token = localStorage.getItem("refreshToken");
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/user/refresh-token`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Request interceptor
api.interceptors.request.use((config) => {
  console.log('API Base URL:', import.meta.env.VITE_API_URL);

  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      (error.response.status === 401 || error.response.status === 403) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const response = await refreshToken();
        if (response.data.accessToken) {
          localStorage.setItem("accessToken", response.data.accessToken);
          api.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${response.data.accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export const loginUser = async (email, password) => {
  try {
    console.log('Attempting login with URL:', import.meta.env.VITE_API_URL + '/user/login');

    const response = await api.post("/user/login", {
      email,
      password,
      role_id: 2,
    });
    if (response.data.data) {
      localStorage.setItem("accessToken", response.data.data.accessToken);
      localStorage.setItem("refreshToken", response.data.data.refreshToken);
      localStorage.setItem("expiresAt", response.data.data.expiresAt);
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const logoutUser = async () => {
  try {
    // No need to pass token explicitly since interceptor handles it
    const response = await api.post("/user/logout");
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getWorkshopDates = async (companyId) => {
  const response = await api.get(
    "/workshop/getWorkshopDatesByCompanyIdOrUserId",
    {
      params: {
        company_id: companyId,
      },
    }
  );
  return response.data;
};

export const getWorkshops = async (params) => {
  const response = await api.get("/workshop/getWorkshopsByCompanyIdOrUserId", {
    params: {
      company_id: params.companyId,
      page: params.currentPage,
      pageSize: params.pageSize,
      start_time: params.selectedDate,
    },
  });
  return response.data;
};

export const getWorkshopDetails = async (workshopId) => {
  const response = await api.get(`/workshop/getWorkshopDetails`, {
    params: {
      workshop_id: workshopId,
    },
  });
  return response.data;
};

export const getCompanyById = async (companyId) => {
  const response = await api.get(`/company/getCompanyInfo`, {
    params: {
      company_id: companyId,
    },
  });
  return response.data;
};

export const updateCompanyInfo = async (companyInfo) => {
  const response = await api.put(`/company/updateCompanyInfo`, companyInfo);
  return response.data;
};

export const getCompanyEmployees = async (companyId, params) => {
  const response = await api.get(`/company/getCompanyEmployees`, {
    params: {
      company_id: companyId,
      page: params.page,
      limit: params.limit,
    },
  });
  return response.data;
};

export const getTopPerformingEmployee = async (params) => {
  const response = await api.get(`/company/getTopPerformingEmployee`, {
    params: {
      company_id: params.companyId,
      page: params.page,
      limit: params.limit,
      search: params.search,
    },
  });
  return response.data;
};

export const getQna = async () => {
  const response = await api.get(`/company/getQna`);
  return response.data;
};

export const getNotificationAndAnnouncements = async ({
  company_id,
  page,
  limit,
}) => {
  console.log(company_id, page, limit);
  const response = await api.get(
    `/notifications/getNotificationAndAnnouncements`,
    {
      params: {
        company_id,
        page,
        limit,
      },
    }
  );
  return response.data;
};

export const getCompanyMetrics = async (companyId) => {
  const response = await api.get(`/company/getCompanyMetrics`, {
    params: {
      company_id: companyId,
    },
  });
  return response.data;
};

export const getAllRewards = async () => {
  const response = await api.get(`/rewards/getAllRewards`);
  return response.data;
};

export const assignReward = async (data) => {
  const response = await api.post(`/company/assignReward`, data);
  return response.data;
};

export const getEmployeeRewardHistory = async (data) => {
  const response = await api.get(`/company/getEmployeeRewardHistory`, {
    params: {
      company_id: data.company_id,
      reward_id: data.reward_id,
    },
  });
  return response.data;
};

export const createFeedback = async (data) => {
  const response = await api.post(`/company/createFeedback`, data);
  return response.data;
};

export const getCompanySubscription = async (companyId) => {
  const response = await api.get(`/company/getCompanySubscription`, {
    params: {
      company_id: companyId,
    },
  });
  return response.data;
};

export const updateCompanySubscription = async (data) => {
  const response = await api.put(`/company/updateCompanySubscription`, data);
  return response.data;
};

export const changePassword = async (data) => {
  console.log("Data for change password: ", data);
  const response = await api.post(`/user/changePassword`, data);
  return response.data;
};

export const requestDeactivation = async (data) => {
  const response = await api.post(`/company/requestDeactivation`, data);
  return response.data;
};

export const getCompanyInvoices = async (payload) => {
  console.log("Company id for invoice: ", payload);
  const response = await api.get(`/company/getCompanyInvoices`, {
    params: {
      company_id: payload.company_id,
      page: payload.page,
      limit: payload.limit,
    },
  });
  return response.data;
};

export const createEmployee = async (data) => {
  const response = await api.post(`/company/createEmployee`, data);
  return response.data;
};

export const removeEmployee = async (data) => {
  const response = await api.put(`/company/removeEmployee`, data);
  return response.data;
};

export const searchEmployees = async (data) => {
  const response = await api.get(`/company/searchEmployees`, {
    params: {
      company_id: data.company_id,
      search_term: data.search_term,
      page: data.page,
      limit: data.limit,
    },
  });
  return response.data;
};

export const getArticles = async (params) => {
  try {
    const response = await api.get("/article/getArticles", {
      params: {
        page: params.currentPage || 1,
        limit: 6,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getSoundscapes = async (params) => {
  try {
    const response = await api.get("/soundscapes/getSoundscapes", {
      params: {
        page: params.currentPage || 1,
        limit: 10,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getDepartments = async () => {
  try {
    const response = await api.get("/company/getDepartments");
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}
