import { POST } from '@/app/api/post-production/render-tasks/route';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

// Mock dependencies
jest.mock('@supabase/auth-helpers-nextjs', () => ({
  createRouteHandlerClient: jest.fn(),
}));

jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}));

// Mock NextResponse
jest.mock('next/server', () => {
  const originalModule = jest.requireActual('next/server');
  return {
    ...originalModule,
    NextResponse: {
      json: jest.fn((body, init) => ({
        status: init?.status || 200,
        json: async () => body,
      })),
    },
  };
});

describe('POST /api/post-production/render-tasks', () => {
  const mockSupabase = {
    auth: {
      getSession: jest.fn(),
    },
    from: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (createRouteHandlerClient as jest.Mock).mockReturnValue(mockSupabase);
  });

  const createRequest = (body: any, shouldThrowOnJson = false) => {
    return {
      json: jest.fn().mockImplementation(async () => {
        if (shouldThrowOnJson) throw new Error('Invalid JSON');
        return body;
      })
    } as any;
  };

  it('should create a render task with required data only', async () => {
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: { user: { id: 'user-1' } } },
    });

    // Mock project verification
    const mockSelect = jest.fn().mockReturnThis();
    const mockEq1 = jest.fn().mockReturnThis();
    const mockEq2 = jest.fn().mockReturnThis();
    const mockSingleProject = jest.fn().mockResolvedValue({ data: { id: 'project-1' } });

    // Mock task insertion
    const mockInsert = jest.fn().mockReturnThis();
    const mockSelectInsert = jest.fn().mockReturnThis();
    const mockSingleInsert = jest.fn().mockResolvedValue({
      data: { id: 'task-1', task_name: 'My Task', status: 'queued' },
      error: null,
    });

    mockSupabase.from.mockImplementation((table) => {
      if (table === 'projects') {
        return {
          select: mockSelect,
          eq: mockEq1.mockImplementation((field, val) => {
            if (field === 'id') return { eq: mockEq2.mockImplementation(() => ({ single: mockSingleProject })) };
            return { single: mockSingleProject };
          }),
        };
      }
      if (table === 'render_tasks') {
        return {
          insert: mockInsert.mockImplementation(() => ({
            select: mockSelectInsert.mockImplementation(() => ({
              single: mockSingleInsert,
            })),
          })),
        };
      }
    });

    const req = createRequest({ projectId: 'project-1', taskName: 'My Task' });
    const response = await POST(req);
    const json = await response.json();

    expect(response.status).toBe(201);
    expect(json.data).toBeDefined();
    expect(json.data.id).toBe('task-1');
    expect(mockInsert).toHaveBeenCalledWith([{
      project_id: 'project-1',
      task_name: 'My Task',
      format: 'MP4',
      resolution: '1920x1080',
      codec: 'H.264',
      estimated_size: '',
      estimated_time: '',
      status: 'queued',
      progress: 0,
      priority: 5,
      preset_name: undefined,
    }]);
  });

  it('should return 401 if unauthorized', async () => {
    mockSupabase.auth.getSession.mockResolvedValue({ data: { session: null } });

    const req = createRequest({ projectId: 'project-1', taskName: 'My Task' });
    const response = await POST(req);
    const json = await response.json();

    expect(response.status).toBe(401);
    expect(json.error).toBe('Unauthorized');
  });

  it('should return 404 if project not found or not owned by user', async () => {
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: { user: { id: 'user-1' } } },
    });

    const mockSelect = jest.fn().mockReturnThis();
    const mockEq1 = jest.fn().mockReturnThis();
    const mockEq2 = jest.fn().mockReturnThis();
    const mockSingleProject = jest.fn().mockResolvedValue({ data: null });

    mockSupabase.from.mockImplementation((table) => {
      if (table === 'projects') {
        return {
          select: mockSelect,
          eq: mockEq1.mockImplementation((field, val) => {
            if (field === 'id') return { eq: mockEq2.mockImplementation(() => ({ single: mockSingleProject })) };
            return { single: mockSingleProject };
          }),
        };
      }
    });

    const req = createRequest({ projectId: 'project-1', taskName: 'My Task' });
    const response = await POST(req);
    const json = await response.json();

    expect(response.status).toBe(404);
    expect(json.error).toBe('Project not found');
  });

  it('should return 500 if database insert fails', async () => {
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: { user: { id: 'user-1' } } },
    });

    const mockSelect = jest.fn().mockReturnThis();
    const mockEq1 = jest.fn().mockReturnThis();
    const mockEq2 = jest.fn().mockReturnThis();
    const mockSingleProject = jest.fn().mockResolvedValue({ data: { id: 'project-1' } });

    const mockInsert = jest.fn().mockReturnThis();
    const mockSelectInsert = jest.fn().mockReturnThis();
    const mockSingleInsert = jest.fn().mockResolvedValue({
      data: null,
      error: { message: 'Insert failed' },
    });

    mockSupabase.from.mockImplementation((table) => {
      if (table === 'projects') {
        return {
          select: mockSelect,
          eq: mockEq1.mockImplementation((field, val) => {
            if (field === 'id') return { eq: mockEq2.mockImplementation(() => ({ single: mockSingleProject })) };
            return { single: mockSingleProject };
          }),
        };
      }
      if (table === 'render_tasks') {
        return {
          insert: mockInsert.mockImplementation(() => ({
            select: mockSelectInsert.mockImplementation(() => ({
              single: mockSingleInsert,
            })),
          })),
        };
      }
    });

    const req = createRequest({ projectId: 'project-1', taskName: 'My Task' });
    const response = await POST(req);
    const json = await response.json();

    expect(response.status).toBe(500);
    expect(json.error).toBe('Insert failed');
  });

  it('should return 500 if an internal error occurs (e.g. invalid json)', async () => {
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: { user: { id: 'user-1' } } },
    });

    const req = createRequest({}, true); // will throw on json()
    const response = await POST(req);
    const json = await response.json();

    expect(response.status).toBe(500);
    expect(json.error).toBe('Internal server error');
  });
});
