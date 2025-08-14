export interface Profile {
  first_name: string | null;
  last_name: string | null;
  profile_picture: string | null;
  bio: string;
  location: string;
  role: 'student' | 'recruiter';
}

export interface User {
  id: number;
  username: string;
  email: string;
  profile: Profile;
}

export interface Internship {
  id: number;
  title: string;
  description: string;
  company: string;
  location: string;
  stipend: number | null;
  internship_type: string;
  apply_link?: string | null;
  posted_on: string; // ISO date string
  status: 'open' | 'closed' | 'archived';
  expiry_date?: string | null; // ISO date string
  recruiter: User;
  tech_stack?: string[]; // optional, if used in frontend
  tags?: string[];       // optional
}

export interface Application {
  id: number;
  user: User;
  internship: Internship;
  status: 'pending' | 'accepted' | 'rejected';
  applied_on: string; // ISO date string
  resume?: string | null; // URL or path
}

export interface Bookmark {
  id: number;
  user: User;
  internship: Internship;
  internship_title: string;
  internship_company: string;
  internship_location: string;
  bookmarked_on: string; // ISO date string
}

export type ActivityAction =
  | 'internship_posted'
  | 'internship_updated'
  | 'internship_deleted'
  | 'application_submitted'
  | 'application_status_changed'
  | 'application_withdrawn'
  | 'bookmark_added'
  | 'bookmark_removed'
  | 'profile_updated'
  | 'profile_picture_updated'
  | 'login'
  | 'logout'
  | 'password_changed';

export interface ActivityLog {
  id: number;
  user: User;
  action: ActivityAction;
  related_object_id?: number | null; // allow null from API
  timestamp: string; // ISO string
  details?: string;
}


export interface RatingReview {
  id: number;
  internship: Internship;
  user: User;
  rating: number; // PositiveSmallInteger
  review?: string | null;
  created_at: string; // ISO date string
}
