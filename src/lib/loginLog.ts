export interface LoginLog {
  username?: string;
  email?: string;
  ip: string;
  location?: string;
  org?: string;
  userAgent: string;
  path: string;
  isSuspicious: boolean;
  countryCode?: string;
  timestamp: string;
  success?: boolean;
}

/** Retrieve stored logs (array) from localStorage */
export const getLoginLogs = (): LoginLog[] => {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem('login_logs');
  return raw ? JSON.parse(raw) : [];
};

/** Append a new log entry */
export const pushLoginLog = (log: LoginLog) => {
  const logs = getLoginLogs();
  logs.push(log);
  localStorage.setItem('login_logs', JSON.stringify(logs));
};

/** Clear all logs (used on logout) */
export const clearLoginLogs = () => {
  localStorage.removeItem('login_logs');
};
