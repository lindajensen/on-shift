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
  restaurant_name: string;
  location: string;
  job_date: string;
  start_time: string;
  end_time: string;
  compensation: number;
}

export interface EmployerJobListing {
  id: number;
  role: string;
  job_date: string;
  start_time: string;
  end_time: string;
  compensation: number;
  available_slots: number;
  status: string;
  application_count: string;
  description: string | null;
  is_urgent: boolean;
  requires_experience: boolean;
}

export interface Restaurant {
  id: number;
  name: string;
  location: string;
  rating: number;
  jobsPosted: number;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    email: string;
    role: string;
    name: string;
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

export interface WorkerApplicationPreview {
  id: number;
  restaurant_name: string;
  role: string;
  job_date: string;
  start_time: string;
  end_time: string;
  status: string;
}

export interface EmployerApplicationPreview {
  id: number;
  worker_name: string;
  role: string;
  job_date: string;
  start_time: string;
  end_time: string;
  status: string;
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

interface WorkerRole {
  role: string;
  experience_level: string;
}

export interface SavedWorkerPreview {
  id: number;
  worker_name: string;
  roles: WorkerRole[];
  rating: number | null;
}

export interface JobFormData {
  role: string;
  date: string;
  startTime: string;
  endTime: string;
  compensation: string;
  availableSlots: string;
  description: string;
  isUrgent: boolean;
  requires_experience: boolean;
}

// Errors
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

export interface JobModalErrors {
  role?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  compensation?: string;
  availableSlots?: string;
}
