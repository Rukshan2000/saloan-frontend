// API utility functions for interacting with the Laravel backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.divisarana.org"

class ApiError extends Error {
  constructor(message, status, data) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.data = data
  }
}

// Generic API request function
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`
  const config = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...options.headers,
    },
    ...options,
  }

  // Add auth token if available
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("auth_token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }

  try {
    const response = await fetch(url, config)
    const data = await response.json()

    if (!response.ok) {
      throw new ApiError(data.message || "API request failed", response.status, data)
    }

    return data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError("Network error occurred", 0, null)
  }
}

// Authentication API calls
export const authApi = {
  // Register user
  register: async (userData) => {
    return apiRequest("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    })
  },

  // Send OTP
  sendOtp: async (email, name) => {
    return apiRequest("/api/auth/send-otp", {
      method: "POST",
      body: JSON.stringify({ email, name }),
    })
  },

  // Verify OTP
  verifyOtp: async (email, otp, userData) => {
    return apiRequest("/api/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({ email, otp, userData }),
    })
  },

  // Login
  login: async (email, password, recaptchaToken) => {
    return apiRequest("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password, recaptcha_token: recaptchaToken }),
    })
  },

  // Logout
  logout: async () => {
    return apiRequest("/api/auth/logout", {
      method: "POST",
    })
  },

  // Get user profile
  getProfile: async () => {
    return apiRequest("/api/auth/profile")
  },

  // Update profile
  updateProfile: async (profileData) => {
    return apiRequest("/api/auth/profile", {
      method: "PUT",
      body: JSON.stringify(profileData),
    })
  },
}

// Donations API calls
export const donationsApi = {
  // Get all campaigns
  getCampaigns: async (page = 1, limit = 10) => {
    return apiRequest(`/api/campaigns?page=${page}&limit=${limit}`)
  },

  // Get single campaign
  getCampaign: async (id) => {
    return apiRequest(`/api/campaigns/${id}`)
  },

  // Create donation
  createDonation: async (donationData) => {
    return apiRequest("/api/donations", {
      method: "POST",
      body: JSON.stringify(donationData),
    })
  },

  // Get donation history
  getDonationHistory: async (userId, page = 1) => {
    return apiRequest(`/api/donations/history/${userId}?page=${page}`)
  },

  // Get donation receipt
  getDonationReceipt: async (donationId) => {
    return apiRequest(`/api/donations/${donationId}/receipt`)
  },
}

// Content API calls
export const contentApi = {
  // Get homepage content
  getHomepage: async () => {
    return apiRequest("/api/content/homepage")
  },

  // Get about page content
  getAbout: async () => {
    return apiRequest("/api/content/about")
  },

  // Get team members
  getTeam: async () => {
    return apiRequest("/api/content/team")
  },

  // Get services
  getServices: async () => {
    return apiRequest("/api/content/services")
  },

  // Get events
  getEvents: async (page = 1) => {
    return apiRequest(`/api/events?page=${page}`)
  },

  // Get single event
  getEvent: async (id) => {
    return apiRequest(`/api/events/${id}`)
  },

  // Get gallery
  getGallery: async (page = 1) => {
    return apiRequest(`/api/gallery?page=${page}`)
  },
}

// Contact API calls
export const contactApi = {
  // Send contact message
  sendMessage: async (messageData, recaptchaToken) => {
    return apiRequest("/api/contact", {
      method: "POST",
      body: JSON.stringify({
        ...messageData,
        recaptcha_token: recaptchaToken,
      }),
    })
  },

  // Subscribe to newsletter
  subscribe: async (email, recaptchaToken) => {
    return apiRequest("/api/newsletter/subscribe", {
      method: "POST",
      body: JSON.stringify({
        email,
        recaptcha_token: recaptchaToken,
      }),
    })
  },
}

// Volunteer API calls
export const volunteerApi = {
  // Submit volunteer application
  apply: async (applicationData, recaptchaToken) => {
    return apiRequest("/api/volunteer/apply", {
      method: "POST",
      body: JSON.stringify({
        ...applicationData,
        recaptcha_token: recaptchaToken,
      }),
    })
  },

  // Get volunteer opportunities
  getOpportunities: async () => {
    return apiRequest("/api/volunteer/opportunities")
  },
}

// Utility function to verify reCAPTCHA on server side
export const verifyRecaptcha = async (token) => {
  try {
    const response = await fetch("/api/verify-recaptcha", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    })

    const data = await response.json()
    return data.success
  } catch (error) {
    console.error("reCAPTCHA verification failed:", error)
    return false
  }
}

export { ApiError }
