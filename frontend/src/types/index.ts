export interface Worker {
  role: string;
  experience: string;
  availability: string;
  location: string;
  rating: number;
}

export interface Job {
  id: number;
  role: string;
  restaurantName: string;
  location: string;
  date: string;
  startTime: string;
  endTime: string;
  compensation: number;
  availableSlots: number;
  isUrgent: boolean;
  requiresExperience: boolean;
  requirements: string[];
  shiftType: "dag" | "kväll" | "helg";
  description?: string;
  postedAt: string;
  tags: string[];
}

export interface JobPreview {
  id: number;
  role: string;
  restaurantName: string;
  location: string;
  date: string;
  startTime: string;
  endTime: string;
  compensation: number;
}

export interface Restaurant {
  id: number;
  name: string;
  location: string;
  rating: number;
  jobsPosted: number;
}

export interface RegisterValidationErrors {
  firstName?: string;
  lastName?: string;
  restaurantName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export interface LoginValidationErrors {
  email?: string;
  password?: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    email: string;
    role: string;
  };
}

export interface AuthUser {
  id: number;
  email: string;
  role: string;
  name: string;
}

export interface WorkerProfile {
  id: number;
  name: string;
  bio: string;
  experienceLevel: string;
  education: string;
  email: string;
  phone: string;
  is_available: boolean;
}

export interface ApplicationPreview {
  id: number;
  restaurant_name: string;
  role: string;
  job_date: string;
  start_time: string;
  end_time: string;
  status: string;
}

export interface JobListingPreview {
  id: number;
  role: string;
  job_date: string;
  start_time: string;
  end_time: string;
  application_count: string;
}

export interface Review {
  id: number;
  rating: number;
  comment: string;
  created_at: string;
  reviewer_name: string;
  role: string;
  job_date: string;
}
