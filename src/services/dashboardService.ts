import { supabase } from '../lib/supabase';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  school_id: string | null;
  school_name: string | null;
  role: 'student' | 'teacher' | 'admin';
  eco_score: number;
  carbon_saved: number;
  profile_photo: string | null;
  created_at: string;
}

export interface Activity {
  id: string;
  user_id: string;
  type: 'pesanan' | 'pengiriman' | 'diterima' | 'batal';
  description: string;
  school_name: string;
  created_at: string;
}

export interface Assignment {
  id: string;
  title: string;
  deadline: string;
  assigned_to: string[];
  role_filter: string[];
  description: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  deadline: string | null;
  is_read: boolean;
  created_at: string;
}

export const dashboardService = {
  // Get user profile with school info
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select(`
          id,
          email,
          full_name,
          school_id,
          role,
          eco_score,
          carbon_saved,
          profile_photo,
          created_at,
          schools:school_id (
            name
          )
        `)
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      return {
        ...data,
        school_name: data.schools?.[0]?.name || null
      };
    } catch (error) {
      console.error('Get user profile error:', error);
      return null;
    }
  },

  // Get user activities
  async getUserActivities(userId: string, limit = 10): Promise<Activity[]> {
    try {
      const { data, error } = await supabase
        .from('activities')
        .select(`
          id,
          user_id,
          type,
          description,
          created_at,
          schools:school_id (
            name
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching activities:', error);
        return [];
      }

      return data.map(activity => ({
        ...activity,
        school_name: activity.schools?.[0]?.name || 'N/A'
      }));
    } catch (error) {
      console.error('Get activities error:', error);
      return [];
    }
  },

  // Get user assignments based on role
  async getUserAssignments(userId: string, userRole: string): Promise<Assignment[]> {
    try {
      const { data, error } = await supabase
        .from('assignments')
        .select('*')
        .or(`assigned_to.cs.{${userId}},role_filter.cs.{${userRole}}`)
        .order('deadline', { ascending: true });

      if (error) {
        console.error('Error fetching assignments:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Get assignments error:', error);
      return [];
    }
  },

  // Get user notifications
  async getUserNotifications(userId: string, limit = 10): Promise<Notification[]> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching notifications:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Get notifications error:', error);
      return [];
    }
  },

  // Mark notification as read
  async markNotificationAsRead(notificationId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) {
        console.error('Error marking notification as read:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Mark notification error:', error);
      return false;
    }
  },

  // Get user statistics
  async getUserStats(userId: string): Promise<{
    eco_score: number;
    carbon_saved: number;
    total_activities: number;
    pending_assignments: number;
    unread_notifications: number;
  }> {
    try {
      // Get base stats from user profile
      const { data: userData } = await supabase
        .from('users')
        .select('eco_score, carbon_saved')
        .eq('id', userId)
        .single();

      // Count activities
      const { count: activitiesCount } = await supabase
        .from('activities')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      // Count pending assignments
      const { count: assignmentsCount } = await supabase
        .from('assignments')
        .select('*', { count: 'exact', head: true })
        .or(`assigned_to.cs.{${userId}}`)
        .gte('deadline', new Date().toISOString());

      // Count unread notifications
      const { count: notificationsCount } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      return {
        eco_score: userData?.eco_score || 0,
        carbon_saved: userData?.carbon_saved || 0,
        total_activities: activitiesCount || 0,
        pending_assignments: assignmentsCount || 0,
        unread_notifications: notificationsCount || 0
      };
    } catch (error) {
      console.error('Get user stats error:', error);
      return {
        eco_score: 0,
        carbon_saved: 0,
        total_activities: 0,
        pending_assignments: 0,
        unread_notifications: 0
      };
    }
  },

  // Update user eco score (after completing activities)
  async updateEcoScore(userId: string, points: number): Promise<boolean> {
    try {
      const { data: currentData } = await supabase
        .from('users')
        .select('eco_score')
        .eq('id', userId)
        .single();

      const newScore = (currentData?.eco_score || 0) + points;

      const { error } = await supabase
        .from('users')
        .update({ eco_score: newScore })
        .eq('id', userId);

      if (error) {
        console.error('Error updating eco score:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Update eco score error:', error);
      return false;
    }
  },

  // Create activity
  async createActivity(
    userId: string,
    type: Activity['type'],
    description: string,
    schoolId: string
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('activities')
        .insert({
          user_id: userId,
          type,
          description,
          school_id: schoolId,
          created_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error creating activity:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Create activity error:', error);
      return false;
    }
  },

  // Subscribe to real-time updates for user data
  subscribeToUserUpdates(
    userId: string,
    onUpdate: (payload: Record<string, unknown>) => void
  ) {
    const channel = supabase
      .channel('user-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'users',
          filter: `id=eq.${userId}`
        },
        onUpdate
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'activities',
          filter: `user_id=eq.${userId}`
        },
        onUpdate
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        onUpdate
      )
      .subscribe();

    return channel;
  }
};