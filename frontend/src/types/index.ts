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
}
