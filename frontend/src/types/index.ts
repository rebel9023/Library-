export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  sources?: Array<{ title: string; url: string; category: string }>;
  intent?: string;
  toolUsed?: string;
  timestamp: string;
  isFallback?: boolean;
}

export interface DashboardStats {
  totalChats: number;
  totalUsers: number;
  avgResponseTimeMs: number;
  failedSearches: number;
  successfulSearches: number;
  popularSearches: Array<{ intent: string; count: number }>;
  documentDistribution: Array<{ category: string; count: number }>;
  recentActivity: Array<{
    id: string;
    question: string;
    response_time_ms: number;
    module: string;
    status: string;
    timestamp: string;
  }>;
}

export interface LibraryResource {
  id: string;
  title: string;
  url: string;
  category: string;
  type: string;
  summary: string;
  created_at: string;
}
