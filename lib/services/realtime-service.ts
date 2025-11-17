import { createSupabaseClient } from '../supabase';
import { RealtimeChannel } from '@supabase/supabase-js';

type ChangeCallback = (payload: any) => void;

export class RealtimeService {
  private channels: Map<string, RealtimeChannel> = new Map();
  private supabase = createSupabaseClient();

  subscribeToProjects(userId: string, onChange: ChangeCallback): () => void {
    const channel = this.supabase
      .channel('projects-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'projects',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log('Project change:', payload);
          onChange(payload);
        }
      )
      .subscribe();

    this.channels.set('projects', channel);

    return () => {
      channel.unsubscribe();
      this.channels.delete('projects');
    };
  }

  subscribeToLeads(userId: string, onChange: ChangeCallback): () => void {
    const channel = this.supabase
      .channel('leads-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'leads',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log('Lead change:', payload);
          onChange(payload);
        }
      )
      .subscribe();

    this.channels.set('leads', channel);

    return () => {
      channel.unsubscribe();
      this.channels.delete('leads');
    };
  }

  subscribeToReviewComments(projectId: string, onChange: ChangeCallback): () => void {
    const channel = this.supabase
      .channel(`review-comments-${projectId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'review_comments',
        },
        async (payload) => {
          // Verify the comment belongs to a review version of this project
          const { data } = await this.supabase
            .from('review_versions')
            .select('project_id')
            .eq('id', payload.new?.review_version_id || payload.old?.review_version_id)
            .single();

          if (data?.project_id === projectId) {
            onChange(payload);
          }
        }
      )
      .subscribe();

    this.channels.set(`review-comments-${projectId}`, channel);

    return () => {
      channel.unsubscribe();
      this.channels.delete(`review-comments-${projectId}`);
    };
  }

  subscribeToRenderQueue(userId: string, onChange: ChangeCallback): () => void {
    const channel = this.supabase
      .channel('render-tasks-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'render_tasks',
        },
        async (payload) => {
          // Verify the task belongs to the user's project
          const { data } = await this.supabase
            .from('projects')
            .select('user_id')
            .eq('id', payload.new?.project_id || payload.old?.project_id)
            .single();

          if (data?.user_id === userId) {
            onChange(payload);
          }
        }
      )
      .subscribe();

    this.channels.set('render-tasks', channel);

    return () => {
      channel.unsubscribe();
      this.channels.delete('render-tasks');
    };
  }

  // Presence for collaboration
  createPresence(roomId: string, userMetadata: any) {
    const channel = this.supabase.channel(`presence-${roomId}`, {
      config: {
        presence: {
          key: userMetadata.userId,
        },
      },
    });

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        console.log('Presence sync:', state);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('User joined:', key, newPresences);
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('User left:', key, leftPresences);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track(userMetadata);
        }
      });

    this.channels.set(`presence-${roomId}`, channel);

    return {
      track: (metadata: any) => channel.track(metadata),
      untrack: () => channel.untrack(),
      getState: () => channel.presenceState(),
      cleanup: () => {
        channel.unsubscribe();
        this.channels.delete(`presence-${roomId}`);
      },
    };
  }

  unsubscribeAll() {
    this.channels.forEach((channel) => {
      channel.unsubscribe();
    });
    this.channels.clear();
  }
}

export const realtimeService = new RealtimeService();
