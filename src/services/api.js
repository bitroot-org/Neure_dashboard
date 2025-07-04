import axios from "axios";

console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL);


const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
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
      `${import.meta.env.VITE_API_BASE_URL}/api/user/refresh-token`,
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
  console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL);

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

    // Check if this is a login request that failed
    if (originalRequest.url.includes('/user/login')) {
      // For login failures, don't redirect or refresh the page
      // Just pass the error through to be handled by the login component
      return Promise.reject(error);
    }

    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const response = await refreshToken();
        if (response.data?.accessToken) {
          localStorage.setItem("accessToken", response.data.accessToken);
          api.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${response.data.accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Don't use window.location.href for login redirects
        // Instead, let the component handle the redirect
        localStorage.clear();
        // Remove this line to prevent page refresh:
        // window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export const loginUser = async (email, password) => {
  try {
    console.log('Attempting login with URL:', import.meta.env.VITE_API_BASE_URL + '/user/login');

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
    return{
      status: false,
      message: error.response?.data?.message || "Login failed",
      error: true
    }
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

export const getWorkshopDetails = async (workshopId, companyId, scheduleId) => {
  const response = await api.get(`/workshop/getWorkshopDetails`, {
    params: {
      workshop_id: workshopId,
      company_id: companyId,
      schedule_id: scheduleId
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

export const updateCompanyInfo = async (formData) => {
  try {
    const response = await api.put(`/company/updateCompanyInfo`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
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
  const response = await api.get(`/qna/list`);
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
  try {
    const response = await api.get(`/company/getCompanyMetrics`, {
      params: {
        company_id: companyId,
      },
    });
    console.log('Raw getCompanyMetrics response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error in getCompanyMetrics:', error);
    throw error;
  }
};

export const getAllRewards = async (companyId) => {
  const response = await api.get(`/rewards/getAllRewards`, {
    params: {
      company_id: companyId,
    },
  });
  console.log('getAllRewards response:', response); // Debug log
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

export const bulkCreateEmployees = async (file, companyId) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("company_id", companyId);

    const response = await api.post("/company/bulkCreateEmployees", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const removeEmployee = async (data) => {
  const response = await api.delete(`/company/removeEmployee`, {data});
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

export const getSoundscapesByUserId = async (params) => {
  try {
    const response = await api.get("/soundscapes/getSoundscapeByUserId", {
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

export const getStressTrends = async (companyId, startDate, endDate) => {
  try {
    const params = {};
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;
    
    const response = await api.get(`/company/stress-trends/${companyId}`, {
      params
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}

export const markAttendance = async (data) => {
  try {
    const response = await api.post(`/workshop/mark-attendance`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}

export const getWorkshopAttendees = async (workshopId, companyId, scheduleId, params = {}) => {
  try {
    // Log the parameters being sent to the API
    console.log("getWorkshopAttendees params:", {
      workshopId,
      companyId,
      scheduleId,
      otherParams: params
    });
    
    const response = await api.get(`/workshop/attendance/${workshopId}`, {
      params: {
        company_id: companyId,
        schedule_id: scheduleId,
        page: params.page,
        limit: params.limit,
        status: params.status,
        all: params.all
      },
    });
    return response.data;
  } catch (error) {
    console.error("API error in getWorkshopAttendees:", error);
    throw error.response?.data || error;
  }
}


export const getAnnouncements = async (params) => {
  try {
    const response = await api.get(`announcements/list`, {
      params: {
        company_id: params.companyId,
        page: params.currentPage,
        limit: params.limit,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getNotifications = async (params) => {
  console.log("Params for notifications: ", params);
  try {
    const response = await api.get(`notifications/list`, {
      params: {
        user_id: params.userId,
        company_id: params.companyId,
        page: params.currentPage,
        limit: params.limit,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateDashboardTourStatus = async (userId) => {
  try {
    const response = await api.put("/user/updateDashboardTourStatus", {
      user_id: userId,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const acceptTermsAndConditions = async () => {
  try {
    const response = await api.put("/user/updateTermsAcceptance", {
      accepted_terms: 1,
    });
    return response.data;
  }
  catch (error) {
    throw error.response?.data || error;
  }
}

export const getLikedSoundscapes = async () => {
  try {
    const response = await api.get("/soundscapes/getLikedSoundscapes");
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}

export const likeSoundscape = async (soundscapeId) => {
  try {
    const response = await api.post(`/soundscapes/like/${soundscapeId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const unlikeSoundscape = async (soundscapeId) => {
  try {
    const response = await api.delete(`/soundscapes/unlike/${soundscapeId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const markReadAnnouncement = async (announcementIds, companyId) => {
  try {
    const response = await api.post("announcements/mark-all-read", {
      announcement_ids: announcementIds,
      company_id: companyId
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const markReadNotification = async (notificationIds) => {
  try {
    const response = await api.post("notifications/mark-all-read", {
      notification_ids: notificationIds
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getGalleryItems = async ({
  type,
  page = 1,
  limit = 10,
}) => {
  try {
    const response = await api.get("/getGalleryItems", {
      params: {
        type,
        page,
        limit,
      },
    });
    return response.data;
  } catch (error) {
    return {
      status: false,
      error: error.response?.data?.message || "Failed to fetch gallery items",
    };
  }
};

export const getMediaCounts = async (companyId) => {
  try {
    const response = await api.get(`/getMediaCounts`, {
      params: {
        companyId: null,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const trackResourceView = async (resourceId, resourceType) => {
  try {
    const response = await api.post(`/tracking/trackResourceView`, {
      resource_id: resourceId,
      resource_type: resourceType
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getUnreadNotificationCount = async (userId, companyId) => {
  try {
    const response = await api.get("notifications/unread-count", {
      params: {
        company_id: companyId
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getCompanyWellbeingTrends = async (companyId, startDate, endDate) => {
  try {
    const params = {};
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;
    
    const response = await api.get(`/company/wellbeing-trends/${companyId}`, {
      params
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}

export const forgotPassword = async (email) => {
  try {
    const response = await api.post("/user/forgotPassword", {
      email,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const resetPasswordWithToken = async (token, newPassword) => {
  try {
    const response = await api.post(`/user/resetPassword`, {
      token,
      new_password: newPassword,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
