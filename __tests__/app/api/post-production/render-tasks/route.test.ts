/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';
import { GET, POST } from '@/app/api/post-production/render-tasks/route';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

// Mock dependencies
jest.mock('@supabase/auth-helpers-nextjs', () => ({
  createRouteHandlerClient: jest.fn(),
}));

jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}));

describe('/api/post-production/render-tasks', () => {
  let mockSupabase: any;

  beforeEach(() => {
    jest.clearAllMocks();

    mockSupabase = {
      auth: {
        getSession: jest.fn().mockResolvedValue({
          data: { session: { user: { id: 'user-123' } } },
        }),
      },
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      single: jest.fn(),
    };

    (createRouteHandlerClient as jest.Mock).mockReturnValue(mockSupabase);
  });

  describe('POST', () => {
    const mockRequest = (body: any) => {
      return new NextRequest('http://localhost/api/post-production/render-tasks', {
        method: 'POST',
        body: JSON.stringify(body),
      });
    };

    it('should return 401 if unauthorized', async () => {
      mockSupabase.auth.getSession.mockResolvedValueOnce({ data: { session: null } });

      const req = mockRequest({ projectId: '123' });
      const res = await POST(req);

      expect(res.status).toBe(401);
      const json = await res.json();
      expect(json).toEqual({ error: 'Unauthorized' });
    });

    it('should return 404 if project is not found or not owned by user', async () => {
      mockSupabase.single.mockResolvedValueOnce({ data: null }); // Project query

      const req = mockRequest({ projectId: 'non-existent', taskName: 'Task 1' });
      const res = await POST(req);

      expect(res.status).toBe(404);
      const json = await res.json();
      expect(json).toEqual({ error: 'Project not found' });
    });

    it('should return 201 and created task on success', async () => {
      // First single() for project verification
      mockSupabase.single.mockResolvedValueOnce({ data: { id: 'project-123' } });

      // Second single() for task insertion
      const mockTask = { id: 'task-1', task_name: 'Task 1', project_id: 'project-123' };
      mockSupabase.single.mockResolvedValueOnce({ data: mockTask, error: null });

      const req = mockRequest({ projectId: 'project-123', taskName: 'Task 1' });
      const res = await POST(req);

      expect(res.status).toBe(201);
      const json = await res.json();
      expect(json).toEqual({ data: mockTask });
    });

    it('should set default values if not provided', async () => {
      // First single() for project verification
      mockSupabase.single.mockResolvedValueOnce({ data: { id: 'project-123' } });

      // Second single() for task insertion
      const mockTask = { id: 'task-1', task_name: 'Task 1', project_id: 'project-123' };
      mockSupabase.single.mockResolvedValueOnce({ data: mockTask, error: null });

      const req = mockRequest({ projectId: 'project-123', taskName: 'Task 1' });
      const res = await POST(req);

      expect(res.status).toBe(201);

      // Verify insert was called with defaults
      expect(mockSupabase.insert).toHaveBeenCalledWith([{
        project_id: 'project-123',
        task_name: 'Task 1',
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

    it('should return 500 if insertion fails', async () => {
      // First single() for project verification
      mockSupabase.single.mockResolvedValueOnce({ data: { id: 'project-123' } });

      // Second single() for task insertion fails
      mockSupabase.single.mockResolvedValueOnce({ data: null, error: { message: 'Insert failed' } });

      const req = mockRequest({ projectId: 'project-123', taskName: 'Task 1' });
      const res = await POST(req);

      expect(res.status).toBe(500);
      const json = await res.json();
      expect(json).toEqual({ error: 'Insert failed' });
    });

    it('should handle general error', async () => {
      mockSupabase.auth.getSession.mockRejectedValueOnce(new Error('Some error'));

      const req = mockRequest({ projectId: '123' });
      const res = await POST(req);

      expect(res.status).toBe(500);
      const json = await res.json();
      expect(json).toEqual({ error: 'Internal server error' });
    });
  });
});
