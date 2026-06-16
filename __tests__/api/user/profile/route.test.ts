import { GET, PUT } from '@/app/api/user/profile/route';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

// Mock console.error
console.error = jest.fn();

// Mock next/server completely
jest.mock('next/server', () => {
  return {
    NextResponse: {
      json: jest.fn((body, init) => ({ body, init })),
    },
  };
});

// Mock next/headers
jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}));

// Mock supabase auth-helpers
jest.mock('@supabase/auth-helpers-nextjs', () => ({
  createRouteHandlerClient: jest.fn(),
}));

describe('GET /api/user/profile', () => {
  let mockSupabase: any;
  let mockRequest: any;

  beforeEach(() => {
    jest.clearAllMocks();

    mockSupabase = {
      auth: {
        getSession: jest.fn(),
      },
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn(),
    };

    (createRouteHandlerClient as jest.Mock).mockReturnValue(mockSupabase);
    mockRequest = {};
  });

  it('returns user profile successfully', async () => {
    const mockSession = { user: { id: 'user-123' } };
    const mockProfile = { id: 'profile-123', full_name: 'Test User' };

    mockSupabase.auth.getSession.mockResolvedValueOnce({ data: { session: mockSession } });
    mockSupabase.single.mockResolvedValueOnce({ data: mockProfile, error: null });

    const response: any = await GET(mockRequest);

    expect(response.body).toEqual({ data: mockProfile });
    expect(response.init).toBeUndefined();
    expect(mockSupabase.from).toHaveBeenCalledWith('user_profiles');
    expect(mockSupabase.eq).toHaveBeenCalledWith('user_id', 'user-123');
  });

  it('returns 401 when no session exists', async () => {
    mockSupabase.auth.getSession.mockResolvedValueOnce({ data: { session: null } });

    const response: any = await GET(mockRequest);

    expect(response.body).toEqual({ error: 'Unauthorized' });
    expect(response.init).toEqual({ status: 401 });
  });

  it('handles missing profile gracefully (PGRST116)', async () => {
    const mockSession = { user: { id: 'user-123' } };

    mockSupabase.auth.getSession.mockResolvedValueOnce({ data: { session: mockSession } });
    mockSupabase.single.mockResolvedValueOnce({
      data: null,
      error: { code: 'PGRST116', message: 'Row not found' },
    });

    const response: any = await GET(mockRequest);

    expect(response.body).toEqual({ data: null });
  });

  it('returns 500 on database error', async () => {
    const mockSession = { user: { id: 'user-123' } };

    mockSupabase.auth.getSession.mockResolvedValueOnce({ data: { session: mockSession } });
    mockSupabase.single.mockResolvedValueOnce({
      data: null,
      error: { code: 'OTHER_CODE', message: 'Database error' },
    });

    const response: any = await GET(mockRequest);

    expect(response.body).toEqual({ error: 'Database error' });
    expect(response.init).toEqual({ status: 500 });
  });

  it('returns 500 on internal server error', async () => {
    mockSupabase.auth.getSession.mockRejectedValueOnce(new Error('Internal Error'));

    const response: any = await GET(mockRequest);

    expect(response.body).toEqual({ error: 'Internal server error' });
    expect(response.init).toEqual({ status: 500 });
  });
});

describe('PUT /api/user/profile', () => {
  let mockSupabase: any;
  let mockRequest: any;

  beforeEach(() => {
    jest.clearAllMocks();

    mockSupabase = {
      auth: {
        getSession: jest.fn(),
      },
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn(),
    };

    (createRouteHandlerClient as jest.Mock).mockReturnValue(mockSupabase);

    mockRequest = {
      json: jest.fn().mockResolvedValue({
        fullName: 'Test User',
        studioName: 'Test Studio',
        businessType: 'Photography',
        phone: '1234567890',
        avatarUrl: 'https://example.com/avatar.jpg',
        onboardingCompleted: true
      })
    };
  });

  it('updates an existing profile', async () => {
    const mockSession = { user: { id: 'user-123' } };
    const mockExisting = { id: 'profile-123' };
    const mockUpdated = { id: 'profile-123', full_name: 'Test User' };

    mockSupabase.auth.getSession.mockResolvedValueOnce({ data: { session: mockSession } });
    mockSupabase.single.mockResolvedValueOnce({ data: mockExisting }); // Profile exists
    mockSupabase.single.mockResolvedValueOnce({ data: mockUpdated, error: null }); // Update succeeds

    const response: any = await PUT(mockRequest);

    expect(response.body).toEqual({ data: mockUpdated });
    expect(mockSupabase.from).toHaveBeenCalledWith('user_profiles');
    expect(mockSupabase.update).toHaveBeenCalled();
    expect(mockSupabase.eq).toHaveBeenCalledWith('user_id', 'user-123');
  });

  it('creates a new profile if it does not exist', async () => {
    const mockSession = { user: { id: 'user-123' } };
    const mockCreated = { id: 'profile-123', full_name: 'Test User' };

    mockSupabase.auth.getSession.mockResolvedValueOnce({ data: { session: mockSession } });
    mockSupabase.single.mockResolvedValueOnce({ data: null }); // Profile doesn't exist
    mockSupabase.single.mockResolvedValueOnce({ data: mockCreated, error: null }); // Insert succeeds

    const response: any = await PUT(mockRequest);

    expect(response.body).toEqual({ data: mockCreated });
    expect(mockSupabase.from).toHaveBeenCalledWith('user_profiles');
    expect(mockSupabase.insert).toHaveBeenCalled();
  });

  it('returns 401 when no session exists for PUT', async () => {
    mockSupabase.auth.getSession.mockResolvedValueOnce({ data: { session: null } });

    const response: any = await PUT(mockRequest);

    expect(response.body).toEqual({ error: 'Unauthorized' });
    expect(response.init).toEqual({ status: 401 });
  });

  it('returns 500 on database error during PUT', async () => {
    const mockSession = { user: { id: 'user-123' } };

    mockSupabase.auth.getSession.mockResolvedValueOnce({ data: { session: mockSession } });
    mockSupabase.single.mockResolvedValueOnce({ data: { id: 'profile-123' } });
    mockSupabase.single.mockResolvedValueOnce({
      data: null,
      error: new Error('Failed to update profile'),
    });

    const response: any = await PUT(mockRequest);

    expect(response.body).toEqual({ error: 'Failed to update profile' });
    expect(response.init).toEqual({ status: 500 });
  });
});
