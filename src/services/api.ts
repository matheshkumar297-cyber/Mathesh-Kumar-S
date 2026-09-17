import { Course, CourseFilter, CourseFormData, CourseStats } from '../types';

const BASE_URL = '/api';

export class ApiError extends Error {
  status: number;
  data: any;
  fieldErrors?: Record<string, string[]>;

  constructor(message: string, status: number, data: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
    if (typeof data === 'object' && data !== null) {
      this.fieldErrors = data;
    }
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 204) {
      return {} as T;
    }

    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');
    const data = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      let errorMessage = `Request failed with status ${response.status}`;
      if (isJson && data) {
        if (data.detail) {
          errorMessage = data.detail;
        } else if (typeof data === 'object') {
          const firstKey = Object.keys(data)[0];
          if (firstKey && Array.isArray(data[firstKey])) {
            errorMessage = `${firstKey}: ${data[firstKey][0]}`;
          }
        }
      }
      throw new ApiError(errorMessage, response.status, data);
    }

    return data as T;
  } catch (err: any) {
    if (err instanceof ApiError) {
      throw err;
    }
    throw new ApiError(
      err.message || 'Network error: Backend server is unreachable',
      0,
      { detail: 'Network error: could not connect to API server.' }
    );
  }
}

export const courseApi = {
  async getAll(filter?: Partial<CourseFilter>): Promise<Course[]> {
    const params = new URLSearchParams();
    if (filter) {
      if (filter.search) params.append('search', filter.search);
      if (filter.department && filter.department !== 'All') params.append('department', filter.department);
      if (filter.category && filter.category !== 'All') params.append('category', filter.category);
      if (filter.level && filter.level !== 'All') params.append('level', filter.level);
      if (filter.status && filter.status !== 'All') params.append('status', filter.status);
      if (filter.ordering) params.append('ordering', filter.ordering);
    }
    const query = params.toString() ? `?${params.toString()}` : '';
    return request<Course[]>(`/courses/${query}`);
  },

  async getById(id: number): Promise<Course> {
    return request<Course>(`/courses/${id}/`);
  },

  async create(course: CourseFormData): Promise<Course> {
    return request<Course>('/courses/', {
      method: 'POST',
      body: JSON.stringify(course),
    });
  },

  async update(id: number, course: CourseFormData): Promise<Course> {
    return request<Course>(`/courses/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(course),
    });
  },

  async patch(id: number, partial: Partial<CourseFormData>): Promise<Course> {
    return request<Course>(`/courses/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(partial),
    });
  },

  async delete(id: number): Promise<void> {
    await request<void>(`/courses/${id}/`, {
      method: 'DELETE',
    });
  },

  async getStats(): Promise<CourseStats> {
    return request<CourseStats>('/stats/');
  },

  async reseed(): Promise<{ message: string; count: number }> {
    return request<{ message: string; count: number }>('/courses/seed/', {
      method: 'POST',
    });
  },

  async getPostmanCollection(): Promise<any> {
    return request<any>('/postman/');
  },
};
