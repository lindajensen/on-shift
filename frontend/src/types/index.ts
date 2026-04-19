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
  isUrgent: boolean;
  requiresExperience: boolean;
  description?: string;
  postedAt: string;
  tags: string[];
}
