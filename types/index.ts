export interface User {
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
  created_at: string;
}

export interface Contact {
  id: string;
  user_id: string;
  name: string;
  company: string | null;
  position: string | null;
  phone: string | null;
  email: string | null;
  memo: string | null;
  avatar_url: string | null;
  created_at: string;
  tags?: ContactTag[];
}

export interface ContactTag {
  id: string;
  contact_id: string;
  tag: string;
}

export interface Meeting {
  id: string;
  user_id: string;
  title: string | null;
  location: string | null;
  scheduled_at: string;
  status: "upcoming" | "completed" | "cancelled";
  notes: string | null;
  created_at: string;
  contacts?: Contact[];
  brief?: Brief;
}

export interface Brief {
  id: string;
  meeting_id: string;
  content: {
    attendees: AttendeeInfo[];
    news: NewsItem[];
    trends: string[];
    smalltalk: string[];
  } | null;
  generated_at: string;
  status: "pending" | "ready" | "failed";
}

export interface AttendeeInfo {
  contactId: string;
  name: string;
  company: string;
  position: string;
}

export interface NewsItem {
  title: string;
  summary: string;
  url: string;
  publishedAt: string;
  source: string;
}

export interface MeetingHistory {
  id: string;
  user_id: string;
  meeting_id: string;
  contact_id: string;
  food: string | null;
  topics: string[];
  notes: string | null;
  met_at: string;
}

// 미팅 생성 4단계 상태
export interface MeetingDraft {
  step: 1 | 2 | 3 | 4;
  contactIds: string[];
  title: string;
  scheduledAt: string;
  location: string;
  notes: string;
}
