import axios from 'axios';
import { DashboardStats, LibraryResource } from '../types';

const API_BASE = '/api';

export const fetchDashboardStats = async (): Promise<DashboardStats> => {
  const res = await axios.get(`${API_BASE}/analytics/dashboard`);
  return res.data;
};

export const fetchResources = async (category?: string): Promise<LibraryResource[]> => {
  const res = await axios.get(`${API_BASE}/resources`, { params: { category } });
  return res.data.resources;
};

export const triggerScraperJob = async () => {
  const res = await axios.post(`${API_BASE}/scraper/trigger`);
  return res.data;
};

export const fetchScraperLogs = async () => {
  const res = await axios.get(`${API_BASE}/scraper/status`);
  return res.data.logs;
};

export const uploadKnowledgeDocument = async (doc: { title: string; category: string; content: string; url?: string }) => {
  const res = await axios.post(`${API_BASE}/scraper/upload`, doc);
  return res.data;
};
