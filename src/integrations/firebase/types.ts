// Firebase Firestore collection types

export interface Download {
  id?: string;
  platform: 'mac' | 'windows';
  downloaded_at: string;
  ip_hash?: string | null;
}

export interface BlogPost {
  id?: string;
  created_at: string;
  updated_at: string;
  title: string;
  content: string;
  author: string;
  author_id?: string | null;
  location?: string | null;
  published: boolean;
}

export interface BugReport {
  id?: string;
  created_at: string;
  report_type: 'quick' | 'detailed';
  quick_note?: string | null;
  title?: string | null;
  category?: string | null;
  platform?: string | null;
  description?: string | null;
  steps_to_reproduce?: string | null;
  expected_behavior?: string | null;
  actual_behavior?: string | null;
  email?: string | null;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
}

export interface UserRole {
  id?: string;
  user_id: string;
  role: 'admin' | 'moderator' | 'user';
  created_at: string;
}
