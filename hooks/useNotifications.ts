'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { createClient } from '@/lib/supabase/client';

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  linkUrl?: string;
  createdAt: string;
}

export function useNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (!error && data && data.length > 0) {
        const mapped = data.map((n: { id: string; user_id: string; title: string; message: string; type: string; is_read: boolean; link_url?: string; created_at: string }) => ({
          id: n.id,
          userId: n.user_id,
          title: n.title,
          message: n.message,
          type: n.type,
          isRead: n.is_read,
          linkUrl: n.link_url,
          createdAt: n.created_at,
        }));
        setNotifications(mapped);
        setUnreadCount(mapped.filter((n: NotificationItem) => !n.isRead).length);
      } else {
        // Fallback demo notifications
        const demoNotifs: NotificationItem[] = [
          {
            id: 'notif-1',
            userId: user.id,
            title: 'New Parcel Received',
            message: 'Your parcel from Amazon has arrived at Warden Desk. OTP: 4921',
            type: 'PARCEL',
            isRead: false,
            linkUrl: '/student/parcels',
            createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
          },
          {
            id: 'notif-2',
            userId: user.id,
            title: 'Leave Request Approved',
            message: 'Your weekend home leave for 12 Sep - 14 Sep has been approved by Warden.',
            type: 'LEAVE',
            isRead: false,
            linkUrl: '/student/leave',
            createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
          },
          {
            id: 'notif-3',
            userId: user.id,
            title: 'Mess Menu Update',
            message: 'Special dinner feast served tonight: Paneer Butter Masala & Halwa!',
            type: 'MESS',
            isRead: true,
            linkUrl: '/student/mess',
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
          },
        ];
        setNotifications(demoNotifs);
        setUnreadCount(demoNotifs.filter((n) => !n.isRead).length);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
    if (user) {
      try {
        const supabase = createClient();
        await supabase
          .from('notifications')
          .update({ is_read: true })
          .eq('user_id', user.id);
      } catch {
        // Ignore in demo
      }
    }
  };

  return {
    notifications,
    unreadCount,
    loading,
    refresh: fetchNotifications,
    markAllAsRead,
  };
}
