import { NextRequest } from 'next/server';
import { GET } from '@/app/api/projects/route';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

// Setup NextRequest mock
jest.mock('next/server', () => {
  return {
    NextRequest: class MockNextRequest {
      url: string;
      constructor(url: string) {
        this.url = url;
      }
      json() {
        return Promise.resolve({});
      }
    },
    NextResponse: {
      json: jest.fn((body, init) => {
        return {
          status: init?.status || 200,
          json: async () => body,
        };
      }),
    },
  };
});

// Mock dependencies
jest.mock('@supabase/auth-helpers-nextjs', () => ({
  createRouteHandlerClient: jest.fn(),
}));

jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}));

describe('/api/projects', () => {
  let mockSupabase: any;

  beforeEach(() => {
    jest.clearAllMocks();

    mockSupabase = {
      auth: {
        getSession: jest.fn(),
      },
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      range: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      single: jest.fn(),
    };

    (createRouteHandlerClient as jest.Mock).mockReturnValue(mockSupabase);
  });

  describe('GET', () => {
    it('should return 401 if user is not authenticated', async () => {
      mockSupabase.auth.getSession.mockResolvedValueOnce({ data: { session: null } });

      const request = new NextRequest('http://localhost:3000/api/projects');
      const response: any = await GET(request);

      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data).toEqual({ error: 'Unauthorized' });
    });

    it('should return projects for the authenticated user', async () => {
      const mockSession = { user: { id: 'user-123' } };
      const mockProjects = [
        { id: '1', client_name: 'Client A' },
        { id: '2', client_name: 'Client B' },
      ];

      mockSupabase.auth.getSession.mockResolvedValueOnce({ data: { session: mockSession } });

      // Setup the query chain mock
      const mockQueryPromise = Promise.resolve({ data: mockProjects, error: null });
      mockSupabase.order.mockReturnValueOnce(mockQueryPromise);

      const request = new NextRequest('http://localhost:3000/api/projects');
      const response: any = await GET(request);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toEqual({ data: mockProjects });

      // Verify Supabase was called correctly
      expect(mockSupabase.from).toHaveBeenCalledWith('projects');
      expect(mockSupabase.select).toHaveBeenCalledWith('*');
      expect(mockSupabase.eq).toHaveBeenCalledWith('user_id', 'user-123');
      expect(mockSupabase.order).toHaveBeenCalledWith('created_at', { ascending: false });
    });

    it('should apply stage filter when provided', async () => {
      const mockSession = { user: { id: 'user-123' } };
      mockSupabase.auth.getSession.mockResolvedValueOnce({ data: { session: mockSession } });

      const mockQueryPromise = Promise.resolve({ data: [], error: null });

      // Override the order method to return an object with eq method
      const mockEq = jest.fn().mockReturnValue(mockQueryPromise);
      mockSupabase.order.mockReturnValueOnce({ eq: mockEq });

      const request = new NextRequest('http://localhost:3000/api/projects?stage=active');
      const response: any = await GET(request);

      expect(response.status).toBe(200);
      expect(mockEq).toHaveBeenCalledWith('stage', 'active');
    });

    it('should apply limit and offset when provided', async () => {
      const mockSession = { user: { id: 'user-123' } };
      mockSupabase.auth.getSession.mockResolvedValueOnce({ data: { session: mockSession } });

      const mockQueryPromise = Promise.resolve({ data: [], error: null });

      const mockRange = jest.fn().mockReturnValue(mockQueryPromise);
      const mockLimit = jest.fn().mockReturnValue({ range: mockRange });
      mockSupabase.order.mockReturnValueOnce({ limit: mockLimit });

      const request = new NextRequest('http://localhost:3000/api/projects?limit=5&offset=10');
      const response: any = await GET(request);

      expect(response.status).toBe(200);
      expect(mockLimit).toHaveBeenCalledWith(5);
      expect(mockRange).toHaveBeenCalledWith(10, 14); // 10 + 5 - 1
    });

    it('should handle database errors', async () => {
      const mockSession = { user: { id: 'user-123' } };
      mockSupabase.auth.getSession.mockResolvedValueOnce({ data: { session: mockSession } });

      const mockQueryPromise = Promise.resolve({ data: null, error: { message: 'Database error' } });
      mockSupabase.order.mockReturnValueOnce(mockQueryPromise);

      const request = new NextRequest('http://localhost:3000/api/projects');
      const response: any = await GET(request);

      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data).toEqual({ error: 'Database error' });
    });

    it('should handle unexpected errors', async () => {
      mockSupabase.auth.getSession.mockRejectedValueOnce(new Error('Unexpected failure'));

      const request = new NextRequest('http://localhost:3000/api/projects');
      const response: any = await GET(request);

      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data).toEqual({ error: 'Internal server error' });
    });
  });
});
