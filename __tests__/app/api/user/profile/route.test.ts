/**
 * @jest-environment node
 */
import { GET, PUT } from '@/app/api/user/profile/route';
import { NextRequest } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

// Mock Next.js headers
jest.mock('next/headers', () => ({
  cookies: jest.fn(() => ({})),
}));

// Mock Supabase Route Handler Client
jest.mock('@supabase/auth-helpers-nextjs', () => ({
  createRouteHandlerClient: jest.fn(),
}));

describe('Profile API', () => {
  let mockSupabase: any;

  beforeEach(() => {
    jest.clearAllMocks();

    // Create a mock single response
    const mockSingle = jest.fn();

    // Create mock chainable query builder
    const mockEq = jest.fn(() => ({ single: mockSingle, select: jest.fn(() => ({ single: mockSingle })) }));
    const mockSelect = jest.fn(() => ({ eq: mockEq, single: mockSingle }));

    mockSupabase = {
      auth: {
        getSession: jest.fn(),
      },
      from: jest.fn(() => ({
        select: mockSelect,
        insert: jest.fn(() => ({ select: jest.fn(() => ({ single: mockSingle })) })),
        update: jest.fn(() => ({ eq: mockEq })),
      })),
    };

    // Expose the mocked chain methods for tests to define implementations
    mockSupabase._mockSelect = mockSelect;
    mockSupabase._mockEq = mockEq;
    mockSupabase._mockSingle = mockSingle;

    (createRouteHandlerClient as jest.Mock).mockReturnValue(mockSupabase);

    // Suppress console.error in tests
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });

  describe('GET /api/user/profile', () => {
    it('should return 401 Unauthorized when session is missing', async () => {
      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: null,
      });

      const req = new NextRequest('http://localhost:3000/api/user/profile');
      const response = await GET(req);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data).toEqual({ error: 'Unauthorized' });
      expect(mockSupabase.auth.getSession).toHaveBeenCalledTimes(1);
    });

    it('should return profile data when session exists and profile is found', async () => {
      const mockSession = {
        user: { id: 'test-user-id' }
      };

      const mockProfileData = {
        id: 'profile-id',
        user_id: 'test-user-id',
        full_name: 'Test User'
      };

      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: mockSession },
        error: null,
      });

      mockSupabase._mockSingle.mockResolvedValue({
        data: mockProfileData,
        error: null
      });

      const req = new NextRequest('http://localhost:3000/api/user/profile');
      const response = await GET(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({ data: mockProfileData });
      expect(mockSupabase.from).toHaveBeenCalledWith('user_profiles');
    });

    it('should handle PGRST116 (not found) without returning 500', async () => {
      const mockSession = {
        user: { id: 'test-user-id' }
      };

      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: mockSession },
        error: null,
      });

      mockSupabase._mockSingle.mockResolvedValue({
        data: null,
        error: { code: 'PGRST116', message: 'Not found' }
      });

      const req = new NextRequest('http://localhost:3000/api/user/profile');
      const response = await GET(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({ data: null });
    });

    it('should return 500 on database error', async () => {
      const mockSession = {
        user: { id: 'test-user-id' }
      };

      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: mockSession },
        error: null,
      });

      mockSupabase._mockSingle.mockResolvedValue({
        data: null,
        error: { code: 'OTHER_ERR', message: 'Database failure' }
      });

      const req = new NextRequest('http://localhost:3000/api/user/profile');
      const response = await GET(req);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ error: 'Database failure' });
    });

    it('should return 500 on unexpected exception', async () => {
      mockSupabase.auth.getSession.mockRejectedValue(new Error('Unexpected failure'));

      const req = new NextRequest('http://localhost:3000/api/user/profile');
      const response = await GET(req);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ error: 'Internal server error' });
    });
  });

  describe('PUT /api/user/profile', () => {
    it('should return 401 Unauthorized when session is missing', async () => {
      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: null,
      });

      const req = new NextRequest('http://localhost:3000/api/user/profile', {
        method: 'PUT',
        body: JSON.stringify({ fullName: 'Test Name' }),
      });
      const response = await PUT(req);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data).toEqual({ error: 'Unauthorized' });
      expect(mockSupabase.auth.getSession).toHaveBeenCalledTimes(1);
    });

    it('should return 500 on unexpected exception', async () => {
      mockSupabase.auth.getSession.mockRejectedValue(new Error('Unexpected failure'));

      const req = new NextRequest('http://localhost:3000/api/user/profile', {
        method: 'PUT',
        body: JSON.stringify({ fullName: 'Test Name' }),
      });
      const response = await PUT(req);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ error: 'Failed to update profile' });
      expect(console.error).toHaveBeenCalled();
    });
  });
});
