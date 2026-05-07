// ============================================================
// AUTH
// ============================================================
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
  userId: number;
  email: string;
  role: string;
  name: string;
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

// ============================================================
// WORKER
// ============================================================
export interface Worker {
  id: number;
  name: string;
  roles: WorkerRole[];
  is_available: boolean;
  availability?: Availability[];
  location: string | null;
  rating: number | null;
  saved_at?: string;
}

export interface WorkerRole {
  role: string;
  experience_level: string;
}

export interface Availability {
  day_of_week: string;
  start_time: string;
  end_time: string;
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

// ============================================================
// EMPLOYER
// ============================================================
export interface EmployerProfile {
  user_id: number;
  name: string;
  email: string;
  phone: string;
  street: string | null;
  postal_code: string | null;
  city: string | null;
  description: string;
  rating: string;
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
  demands: string | null;
  is_urgent: boolean;
  requires_experience: boolean;
}

export interface EmployerJobDetails {
  id: number;
  role: string;
  job_date: string;
  start_time: string;
  end_time: string;
  compensation: number;
  available_slots: number;
  description: string | null;
  demands: string | null;
  is_urgent: boolean;
  requires_experience: boolean;
  status: string;
  applications: EmployerApplicationDetail[];
}

export interface EmployerApplicationDetail {
  id: number;
  worker_name: string;
  role: string;
  experience_level: string;
  status: string;
  rating: number | null;
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

export interface JobModalErrors {
  role?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  compensation?: string;
  availableSlots?: string;
}

// ============================================================
// JOBS
// ============================================================
export interface PublicJobListing {
  id: number;
  role: string;
  job_date: string;
  start_time: string;
  end_time: string;
  compensation: number;
  available_slots: number;
  description: string | null;
  demands: string | null;
  is_urgent: boolean;
  requires_experience: boolean;
  created_at: string;
  restaurant_name: string;
  location: string | null;
  rating: number | null;
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

export interface SavedJob {
  job_id: number;
  role: string;
  job_date: string;
  start_time: string;
  end_time: string;
  compensation: number;
  restaurant_name: string;
  location: string | null;
  is_urgent: boolean;
  requires_experience: boolean;
  created_at: string;
}

// ============================================================
// OTHER
// ============================================================
export interface Review {
  id: number;
  rating: number;
  comment: string;
  created_at: string;
  reviewer_name: string;
  role: string;
  job_date: string;
}
