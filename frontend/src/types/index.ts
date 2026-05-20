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
  user_id: number;
  name: string;
  bio: string | null;
  email: string | null;
  phone: string | null;
  city: string | null;
  experience: WorkerExperience[];
  education: WorkerEducation[];
  cv_url: string | null;
  cv_filename: string | null;
  cv_uploaded_at: string | null;
  is_available: boolean;
  roles: WorkerRole[];
  availability: Availability[];
  rating: string;
}

export interface WorkerExperience {
  id: number;
  job_title: string;
  workplace: string;
  start_date: string;
  end_date: string | null;
}

export interface WorkerEducation {
  id: number;
  program: string;
  school: string;
  graduation_year: string | null;
}

export interface WorkerContactFormData {
  name?: string;
  email: string | null;
  phone: string | null;
  city: string | null;
}

export interface WorkerAboutFormData {
  bio: string;
}

export interface DayAvailability {
  day_of_week: string;
  start_time: string;
  end_time: string;
  enabled: boolean;
}

export interface WorkerAvailabilityFormData {
  availability: Availability[];
}

export interface WorkerApplicationPreview {
  id: number;
  employer_id: number;
  job_id: number;
  restaurant_name: string;
  role: string;
  job_date: string;
  start_time: string;
  end_time: string;
  status: string;
  has_review: boolean;
}

export interface SavedEmployer {
  id: number;
  name: string;
  city: string | null;
  description: string | null;
  rating: string | null;
}

export interface WorkerContactValidationErrors {
  name?: string;
  email?: string;
  phone?: string;
  city?: string;
}

export interface WorkerExperienceValidationErrors {
  job_title?: string;
  workplace?: string;
  start_date?: string;
}

export interface WorkerEducationValidationErrors {
  school?: string;
  program?: string;
}

// ============================================================
// EMPLOYER
// ============================================================
export interface EmployerProfile {
  id: number;
  user_id: number;
  name: string;
  email: string | null;
  phone: string | null;
  street: string | null;
  postal_code: string | null;
  city: string | null;
  description: string | null;
  rating: string | null;
}

export interface EditContactFormData {
  email: string;
  phone: string;
  street: string;
  postal_code: string;
  city: string;
}

export interface EditAboutFormData {
  description: string;
}

export interface EditContactValidationErrors {
  name?: string;
  email?: string;
  phone?: string;
  postalCode?: string;
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
  worker_id: number;
  worker_name: string;
  role: string;
  experience_level: string;
  status: string;
}

export interface EmployerApplicationPreview {
  id: number;
  worker_id: number;
  worker_name: string;
  role: string;
  job_date: string;
  start_time: string;
  end_time: string;
  status: string;
  job_id: number;
  has_review: boolean;
}

export interface EmployerPublicJob {
  id: number;
  role: string;
  restaurant_name: string;
  job_date: string;
  start_time: string;
  end_time: string;
  compensation: number;
  is_urgent: boolean;
  requires_experience: boolean;
  created_at: string;
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
  employer_id: number;
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
  city: string | null;
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
  is_urgent?: boolean;
  requires_experience?: boolean;
  created_at: string;
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
// SHARED
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

export interface ReviewData {
  jobId: number;
  revieweeId: number;
  rating: number;
  comment: string;
}
