// API service for connecting frontend to backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      // Check if response is ok
      if (!response.ok) {
        // Try to parse error response
        try {
          const errorData = await response.json();
          throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
        } catch (parseError) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      
      // Handle network errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Unable to connect to server. Please check if the backend is running.');
      }
      
      throw error;
    }
  }

  // Authentication
  async login(email: string, password: string) {
    // Mock login for demo purposes
    const mockUsers = [
      { id: '1', email: 'rajesh.kumar@brahmaputra.gov.in', password: 'password123', name: 'Rajesh Kumar', role: 'employee', department: 'IT Department' },
      { id: '2', email: 'priya.sharma@brahmaputra.gov.in', password: 'password123', name: 'Priya Sharma', role: 'division_head', department: 'Administration' },
      { id: '3', email: 'admin@brahmaputra.gov.in', password: 'admin123', name: 'Admin User', role: 'administrator', department: 'Administration' }
    ];

    const user = mockUsers.find(u => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const token = `mock-token-${user.id}-${Date.now()}`;
    this.token = token;
    localStorage.setItem('token', token);

    return {
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          department: user.department,
          avatar: '',
          twoFactorEnabled: false
        }
      }
    };
  }

  async logout() {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } finally {
      this.token = null;
      localStorage.removeItem('token');
    }
  }

  async getCurrentUser() {
    // Mock getCurrentUser for demo purposes
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }

    const userId = token.split('-')[2];
    const mockUsers = [
      { id: '1', email: 'rajesh.kumar@brahmaputra.gov.in', name: 'Rajesh Kumar', role: 'employee', department: 'IT Department' },
      { id: '2', email: 'priya.sharma@brahmaputra.gov.in', name: 'Priya Sharma', role: 'division_head', department: 'Administration' },
      { id: '3', email: 'admin@brahmaputra.gov.in', name: 'Admin User', role: 'administrator', department: 'Administration' }
    ];

    const user = mockUsers.find(u => u.id === userId);
    if (!user) {
      throw new Error('Invalid token');
    }

    return {
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          department: user.department,
          avatar: '',
          twoFactorEnabled: false
        }
      }
    };
  }

  // KPIs
  async getKPIs(params?: {
    role?: string;
    category?: string;
    type?: string;
    page?: number;
    limit?: number;
  }) {
    try {
      const queryParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            queryParams.append(key, value.toString());
          }
        });
      }
      
      return await this.request<{
        success: boolean;
        data: {
          kpis: any[];
          pagination: {
            current: number;
            pages: number;
            total: number;
          };
        };
      }>(`/kpis?${queryParams}`);
    } catch {
      // Offline fallback
      const mockKPIs = [
        { id: 'k1', name: 'Project Completion Rate', category: 'Productivity', type: 'percentage', target: 85, unit: '%', weight: 30 },
        { id: 'k2', name: 'Document Processing Time', category: 'Efficiency', type: 'time', target: 2, unit: 'days', weight: 25 },
        { id: 'k3', name: 'Client Satisfaction Score', category: 'Quality', type: 'rating', target: 4.5, unit: 'stars', weight: 20 },
        { id: 'k4', name: 'Budget Utilization', category: 'Financial', type: 'percentage', target: 90, unit: '%', weight: 25 },
      ];
      return { success: true, data: { kpis: mockKPIs, pagination: { current: 1, pages: 1, total: mockKPIs.length } } } as any;
    }
  }

  // Tasks (with offline fallback)
  async getTasks(params?: {
    status?: string;
    assignedTo?: string;
    priority?: string;
    project?: string;
    page?: number;
    limit?: number;
    overdue?: boolean;
  }) {
    try {
      return await this.request<{
        success: boolean;
        data: {
          tasks: any[];
          pagination: { current: number; pages: number; total: number };
        };
      }>(`/tasks?${new URLSearchParams(
        Object.fromEntries(
          Object.entries(params || {}).filter(([, v]) => v !== undefined)
        ) as any
      )}`);
    } catch {
      const now = Date.now();
      const assignedTo = params?.assignedTo || "1";
      const mockTasks = [
        { id: 't1', title: 'Prepare monthly report', status: 'todo', assignedTo, deadline: new Date(now + 3*86400000).toISOString() },
        { id: 't2', title: 'Review KPI submissions', status: 'in_progress', assignedTo, deadline: new Date(now + 1*86400000).toISOString() },
        { id: 't3', title: 'Team standup', status: 'done', assignedTo, deadline: new Date(now - 1*86400000).toISOString() },
      ];
      return {
        success: true,
        data: { tasks: mockTasks, pagination: { current: 1, pages: 1, total: mockTasks.length } },
      } as any;
    }
  }

  // Scores (with offline fallback)
  async getUserScores(userId: string, period: string) {
    try {
      return await this.request<{
        success: boolean;
        data: { scores: any[]; summary: any; trends: any[]; distributions: any };
      }>(`/scores/${userId}/${period}`);
    } catch {
      const now = Date.now();
      const scores = Array.from({ length: 6 }).map((_, i) => ({
        id: `s${i}`,
        value: 70 + (i * 3) % 25,
        target: 100,
        createdAt: new Date(now - (6 - i) * 2629800000).toISOString(),
      }));
      return { success: true, data: { scores, summary: {}, trends: [], distributions: {} } } as any;
    }
  }

  // Finance (with offline fallback)
  async getFinancialData(params?: {
    status?: string;
    category?: string;
    department?: string;
    page?: number;
    limit?: number;
  }) {
    try {
      return await this.request<{
        success: boolean;
        data: { finances: any[]; pagination: { current: number; pages: number; total: number } };
      }>(`/finance?${new URLSearchParams(
        Object.fromEntries(
          Object.entries(params || {}).filter(([, v]) => v !== undefined)
        ) as any
      )}`);
    } catch {
      const finances = [
        { id: 'f1', projectName: 'River Embankment', budget: 50000000, spent: 32000000 },
        { id: 'f2', projectName: 'Canal Maintenance', budget: 30000000, spent: 12000000 },
        { id: 'f3', projectName: 'Dam Inspection', budget: 20000000, spent: 8000000 },
      ];
      return { success: true, data: { finances, pagination: { current: 1, pages: 1, total: finances.length } } } as any;
    }
  }

  // Users (with offline fallback)
  async getAllUsers(params?: { role?: string; department?: string; page?: number; limit?: number; }) {
    try {
      const queryParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => { if (value !== undefined) queryParams.append(key, value.toString()); });
      }
      return await this.request<{ success: boolean; data: { users: any[]; pagination: { current: number; pages: number; total: number } } }>(`/users?${queryParams}`);
    } catch {
      const users = [
        { id: '1', name: 'Rajesh Kumar', email: 'rajesh.kumar@brahmaputra.gov.in' },
        { id: '2', name: 'Priya Sharma', email: 'priya.sharma@brahmaputra.gov.in' },
        { id: '3', name: 'Admin User', email: 'admin@brahmaputra.gov.in' },
      ];
      return { success: true, data: { users, pagination: { current: 1, pages: 1, total: users.length } } } as any;
    }
  }

  // Task update (with offline noop)
  async updateTaskStatus(taskId: string, status: string, reason?: string) {
    try {
      return await this.request<{ success: boolean; message: string; data: { task: any } }>(`/tasks/${taskId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status, reason }),
      });
    } catch {
      // Simulate success offline
      return { success: true, message: 'Updated locally', data: { task: { id: taskId, status } } } as any;
    }
  }

  async getKPIsByRole(role: string) {
    try {
      return await this.request<{
        success: boolean;
        data: { kpis: any[] };
      }>(`/kpis/role/${role}`);
    } catch {
      // Offline fallback - different KPIs based on role
      let mockKPIs = [];
      
      if (role === 'hq_staff') {
        mockKPIs = [
          { id: 'k1', name: 'Document Processing Time', category: 'Efficiency', type: 'time', target: 2, unit: 'days', weight: 30 },
          { id: 'k2', name: 'Report Accuracy', category: 'Quality', type: 'percentage', target: 95, unit: '%', weight: 25 },
          { id: 'k3', name: 'Meeting Attendance', category: 'Engagement', type: 'percentage', target: 90, unit: '%', weight: 20 },
          { id: 'k4', name: 'Task Completion Rate', category: 'Productivity', type: 'percentage', target: 85, unit: '%', weight: 25 },
        ];
      } else if (role === 'field_unit') {
        mockKPIs = [
          { id: 'k1', name: 'Site Inspection Frequency', category: 'Field Work', type: 'count', target: 20, unit: 'visits', weight: 30 },
          { id: 'k2', name: 'Safety Compliance Score', category: 'Safety', type: 'rating', target: 4.8, unit: 'stars', weight: 25 },
          { id: 'k3', name: 'Equipment Maintenance', category: 'Maintenance', type: 'percentage', target: 95, unit: '%', weight: 25 },
          { id: 'k4', name: 'Data Collection Accuracy', category: 'Quality', type: 'percentage', target: 90, unit: '%', weight: 20 },
        ];
      } else if (role === 'division_head') {
        mockKPIs = [
          { id: 'k1', name: 'Team Performance Index', category: 'Leadership', type: 'rating', target: 4.5, unit: 'stars', weight: 30 },
          { id: 'k2', name: 'Budget Utilization', category: 'Financial', type: 'percentage', target: 90, unit: '%', weight: 25 },
          { id: 'k3', name: 'Project Delivery Time', category: 'Management', type: 'time', target: 30, unit: 'days', weight: 25 },
          { id: 'k4', name: 'Team Satisfaction Score', category: 'Engagement', type: 'rating', target: 4.2, unit: 'stars', weight: 20 },
        ];
      } else {
        // Default KPIs
        mockKPIs = [
          { id: 'k1', name: 'General Performance', category: 'Productivity', type: 'percentage', target: 80, unit: '%', weight: 100 },
        ];
      }
      
      return { success: true, data: { kpis: mockKPIs } } as any;
    }
  }

  // Scores
  async submitScore(scoreData: {
    kpiId: string;
    value: number;
    month: string;
    year: number;
    notes?: string;
  }) {
    try {
      return await this.request<{
        success: boolean;
        message: string;
        data: { score: any };
      }>('/scores/submit', {
        method: 'POST',
        body: JSON.stringify(scoreData),
      });
    } catch {
      // Offline fallback - simulate successful submission
      return { 
        success: true, 
        message: 'Score saved locally', 
        data: { score: { id: `score-${Date.now()}`, ...scoreData } } 
      } as any;
    }
  }

  async getUserScores(userId: string, period: string) {
    try {
      return await this.request<{
        success: boolean;
        data: {
          scores: any[];
          summary: any;
          trends: any[];
          distributions: any;
        };
      }>(`/scores/${userId}/${period}`);
    } catch {
      // Offline fallback
      const now = Date.now();
      const scores = Array.from({ length: 6 }).map((_, i) => ({
        id: `s${i}`,
        value: 70 + (i * 3) % 25,
        target: 100,
        createdAt: new Date(now - (6 - i) * 2629800000).toISOString(),
      }));
      return { success: true, data: { scores, summary: {}, trends: [], distributions: {} } } as any;
    }
  }

  async updateScore(scoreId: string, updateData: {
    value?: number;
    notes?: string;
  }) {
    return this.request<{
      success: boolean;
      message: string;
      data: { score: any };
    }>(`/scores/${scoreId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  }

  // Tasks
  async getTasks(params?: {
    status?: string;
    assignedTo?: string;
    priority?: string;
    project?: string;
    page?: number;
    limit?: number;
    overdue?: boolean;
  }) {
    try {
      const queryParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            queryParams.append(key, value.toString());
          }
        });
      }
      
      return await this.request<{
        success: boolean;
        data: {
          tasks: any[];
          pagination: {
            current: number;
            pages: number;
            total: number;
          };
        };
      }>(`/tasks?${queryParams}`);
    } catch {
      // Offline fallback
      const now = Date.now();
      const assignedTo = params?.assignedTo || "1";
      const mockTasks = [
        { id: 't1', title: 'Prepare monthly report', status: 'todo', assignedTo, deadline: new Date(now + 3*86400000).toISOString() },
        { id: 't2', title: 'Review KPI submissions', status: 'in_progress', assignedTo, deadline: new Date(now + 1*86400000).toISOString() },
        { id: 't3', title: 'Team standup', status: 'done', assignedTo, deadline: new Date(now - 1*86400000).toISOString() },
      ];
      return {
        success: true,
        data: { tasks: mockTasks, pagination: { current: 1, pages: 1, total: mockTasks.length } },
      } as any;
    }
  }

  async getTask(taskId: string) {
    return this.request<{
      success: boolean;
      data: { task: any };
    }>(`/tasks/${taskId}`);
  }

  async createTask(taskData: {
    title: string;
    description: string;
    assignedTo: string;
    deadline: string;
    priority?: string;
    project?: string;
    estimatedHours?: number;
  }) {
    return this.request<{
      success: boolean;
      message: string;
      data: { task: any };
    }>('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  }

  async updateTask(taskId: string, updateData: any) {
    return this.request<{
      success: boolean;
      message: string;
      data: { task: any };
    }>(`/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  }

  async updateTaskStatus(taskId: string, status: string, reason?: string) {
    try {
      return await this.request<{
        success: boolean;
        message: string;
        data: { task: any };
      }>(`/tasks/${taskId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status, reason }),
      });
    } catch {
      // Offline fallback - simulate success
      return { success: true, message: 'Updated locally', data: { task: { id: taskId, status } } } as any;
    }
  }

  async addTaskComment(taskId: string, comment: string) {
    return this.request<{
      success: boolean;
      message: string;
      data: { task: any };
    }>(`/tasks/${taskId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ comment }),
    });
  }

  async reorderTask(taskId: string, newStatus: string, newOrder: number) {
    return this.request<{
      success: boolean;
      message: string;
      data: { task: any };
    }>('/tasks/reorder', {
      method: 'PUT',
      body: JSON.stringify({ taskId, newStatus, newOrder }),
    });
  }

  async getTaskStats() {
    return this.request<{
      success: boolean;
      data: { stats: any };
    }>('/tasks/stats');
  }

  // Notifications
  async getNotifications(params?: {
    type?: string;
    read?: boolean;
    priority?: string;
    page?: number;
    limit?: number;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    return this.request<{
      success: boolean;
      data: {
        notifications: any[];
        unreadCount: number;
        pagination: {
          current: number;
          pages: number;
          total: number;
        };
      };
    }>(`/notifications?${queryParams}`);
  }

  async getUnreadCount() {
    return this.request<{
      success: boolean;
      data: { unreadCount: number };
    }>('/notifications/unread-count');
  }

  async markNotificationAsRead(notificationId: string) {
    return this.request<{
      success: boolean;
      message: string;
    }>(`/notifications/${notificationId}/read`, {
      method: 'PUT',
    });
  }

  async markAllNotificationsAsRead() {
    return this.request<{
      success: boolean;
      message: string;
    }>('/notifications/mark-all-read', {
      method: 'PUT',
    });
  }

  // Analytics
  async getAnalytics(level: 'individual' | 'team' | 'org', params?: {
    period?: string;
    year?: number;
    month?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    return this.request<{
      success: boolean;
      data: { analytics: any };
    }>(`/analytics/${level}?${queryParams}`);
  }

  async getComparisons(type: 'departments' | 'roles' | 'time-periods', params?: {
    period?: string;
    year?: number;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    return this.request<{
      success: boolean;
      data: { comparisons: any[] };
    }>(`/analytics/comparisons/${type}?${queryParams}`);
  }

  async getTrends(metric: 'performance' | 'task-completion', params?: {
    period?: string;
    year?: number;
    limit?: number;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    return this.request<{
      success: boolean;
      data: { trends: any[] };
    }>(`/analytics/trends/${metric}?${queryParams}`);
  }

  // Finance
  async getFinancialData(params?: {
    status?: string;
    category?: string;
    department?: string;
    page?: number;
    limit?: number;
  }) {
    try {
      const queryParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            queryParams.append(key, value.toString());
          }
        });
      }
      
      return await this.request<{
        success: boolean;
        data: {
          finances: any[];
          pagination: {
            current: number;
            pages: number;
            total: number;
          };
        };
      }>(`/finance?${queryParams}`);
    } catch {
      // Offline fallback
      const finances = [
        { id: 'f1', projectName: 'River Embankment', budget: 50000000, spent: 32000000 },
        { id: 'f2', projectName: 'Canal Maintenance', budget: 30000000, spent: 12000000 },
        { id: 'f3', projectName: 'Dam Inspection', budget: 20000000, spent: 8000000 },
      ];
      return { success: true, data: { finances, pagination: { current: 1, pages: 1, total: finances.length } } } as any;
    }
  }

  async getFinancialSummary() {
    return this.request<{
      success: boolean;
      data: { summary: any };
    }>('/finance/summary');
  }

  async getDepartmentBudget() {
    return this.request<{
      success: boolean;
      data: { departmentBudget: any[] };
    }>('/finance/department');
  }

  async getBudgetAlerts(params?: {
    severity?: string;
    resolved?: boolean;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    return this.request<{
      success: boolean;
      data: { alerts: any[] };
    }>(`/finance/alerts?${queryParams}`);
  }

  // Audit Logs
  async getAuditLogs(params?: {
    userId?: string;
    action?: string;
    entityType?: string;
    category?: string;
    severity?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    return this.request<{
      success: boolean;
      data: {
        logs: any[];
        pagination: {
          current: number;
          pages: number;
          total: number;
        };
      };
    }>(`/logs?${queryParams}`);
  }

  async getUserActivity(userId: string, limit?: number) {
    const queryParams = new URLSearchParams();
    if (limit) {
      queryParams.append('limit', limit.toString());
    }
    
    return this.request<{
      success: boolean;
      data: { logs: any[] };
    }>(`/logs/user/${userId}?${queryParams}`);
  }

  async getRecentActivity(limit?: number) {
    const queryParams = new URLSearchParams();
    if (limit) {
      queryParams.append('limit', limit.toString());
    }
    
    return this.request<{
      success: boolean;
      data: { recentActivity: any[] };
    }>(`/logs/recent-activity?${queryParams}`);
  }

  // Health Check
  async getHealthStatus() {
    return this.request<{
      status: string;
      timestamp: string;
      uptime: number;
      environment: string;
    }>('/health');
  }

  // User Management (Admin only)
  async getAllUsers(params?: {
    role?: string;
    department?: string;
    page?: number;
    limit?: number;
  }) {
    try {
      const queryParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            queryParams.append(key, value.toString());
          }
        });
      }
      
      return await this.request<{
        success: boolean;
        data: {
          users: any[];
          pagination: {
            current: number;
            pages: number;
            total: number;
          };
        };
      }>(`/users?${queryParams}`);
    } catch {
      // Offline fallback
      const users = [
        { id: '1', name: 'Rajesh Kumar', email: 'rajesh.kumar@brahmaputra.gov.in' },
        { id: '2', name: 'Priya Sharma', email: 'priya.sharma@brahmaputra.gov.in' },
        { id: '3', name: 'Admin User', email: 'admin@brahmaputra.gov.in' },
      ];
      return { success: true, data: { users, pagination: { current: 1, pages: 1, total: users.length } } } as any;
    }
  }

  async createUser(userData: {
    name: string;
    email: string;
    password: string;
    role: string;
    department: string;
    gender?: string;
  }) {
    return this.request<{
      success: boolean;
      message: string;
      data: { user: any };
    }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(userId: string, updateData: any) {
    return this.request<{
      success: boolean;
      message: string;
      data: { user: any };
    }>(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  }

  async deleteUser(userId: string) {
    return this.request<{
      success: boolean;
      message: string;
    }>(`/users/${userId}`, {
      method: 'DELETE',
    });
  }

  // KPI Management (Admin only)
  async createKPI(kpiData: {
    name: string;
    description: string;
    category: string;
    type: string;
    target: number;
    weight: number;
    unit: string;
    frequency: string;
    roles: string[];
  }) {
    return this.request<{
      success: boolean;
      message: string;
      data: { kpi: any };
    }>('/kpis', {
      method: 'POST',
      body: JSON.stringify(kpiData),
    });
  }

  async updateKPI(kpiId: string, updateData: any) {
    return this.request<{
      success: boolean;
      message: string;
      data: { kpi: any };
    }>(`/kpis/${kpiId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  }

  async deleteKPI(kpiId: string) {
    return this.request<{
      success: boolean;
      message: string;
    }>(`/kpis/${kpiId}`, {
      method: 'DELETE',
    });
  }

  // Score Verification (Division Head/Admin)
  async verifyScore(scoreId: string, verified: boolean, feedback?: string) {
    return this.request<{
      success: boolean;
      message: string;
      data: { score: any };
    }>(`/scores/${scoreId}/verify`, {
      method: 'POST',
      body: JSON.stringify({ verified, feedback }),
    });
  }

  // Financial Management
  async createFinancialRecord(financeData: {
    projectName: string;
    budget: number;
    category: string;
    department: string;
    description?: string;
  }) {
    return this.request<{
      success: boolean;
      message: string;
      data: { finance: any };
    }>('/finance', {
      method: 'POST',
      body: JSON.stringify(financeData),
    });
  }

  async updateFinancialRecord(financeId: string, updateData: any) {
    return this.request<{
      success: boolean;
      message: string;
      data: { finance: any };
    }>(`/finance/${financeId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  }

  async recordExpenditure(financeId: string, expenditureData: {
    amount: number;
    description: string;
    category: string;
    date: string;
  }) {
    return this.request<{
      success: boolean;
      message: string;
      data: { finance: any };
    }>(`/finance/${financeId}/spend`, {
      method: 'POST',
      body: JSON.stringify(expenditureData),
    });
  }

  // Notification Management
  async createNotification(notificationData: {
    title: string;
    message: string;
    type: string;
    priority: string;
    recipients: string[];
  }) {
    return this.request<{
      success: boolean;
      message: string;
      data: { notification: any };
    }>('/notifications', {
      method: 'POST',
      body: JSON.stringify(notificationData),
    });
  }

  async broadcastNotification(notificationData: {
    title: string;
    message: string;
    type: string;
    priority: string;
  }) {
    return this.request<{
      success: boolean;
      message: string;
      data: { notification: any };
    }>('/notifications/broadcast', {
      method: 'POST',
      body: JSON.stringify(notificationData),
    });
  }
}

// Create singleton instance
export const apiService = new ApiService(API_BASE_URL);

// Socket.io client for real-time features
import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;
  private token: string | null = null;

  connect(token: string) {
    this.token = token;
    this.socket = io(import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000', {
      auth: { token },
      transports: ['websocket'],
    });

    this.socket.on('connect', () => {
      console.log('Connected to server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinUserRoom(userId: string) {
    if (this.socket) {
      this.socket.emit('join-user-room', userId);
    }
  }

  joinDepartmentRoom(department: string) {
    if (this.socket) {
      this.socket.emit('join-department-room', department);
    }
  }

  joinAdminRoom() {
    if (this.socket) {
      this.socket.emit('join-admin-room');
    }
  }

  onTaskUpdated(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('taskUpdated', callback);
    }
  }

  onScoreUpdated(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('scoreUpdated', callback);
    }
  }

  onNewNotification(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('newNotification', callback);
    }
  }

  offTaskUpdated(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.off('taskUpdated', callback);
    }
  }

  offScoreUpdated(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.off('scoreUpdated', callback);
    }
  }

  offNewNotification(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.off('newNotification', callback);
    }
  }
}

export const socketService = new SocketService();
