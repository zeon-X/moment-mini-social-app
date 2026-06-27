import config from "@/config";
import { useAuth } from "@/context/auth-context";
import {
  getUnreadNotificationCount,
  getUserNotifications,
  markNotificationAsRead as markNotificationAsReadRest,
} from "@/services/modules/notification.service";
import type {
  MarkNotificationReadResponse,
  Notification,
  NotificationsResponse,
  Pagination,
  UnreadNotificationCountResponse,
} from "@/types/notification";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";

type NotificationContextValue = {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  connected: boolean;
  refreshNotifications: () => Promise<void>;
  loadMoreNotifications: () => Promise<void>;
  refreshUnreadCount: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
};

type NewNotificationPayload = {
  notification: Notification;
  unreadCount: number;
};

type ReadNotificationPayload = {
  notificationId: string;
  unreadCount: number;
};

const NotificationContext = createContext<NotificationContextValue | undefined>(
  undefined,
);

const getSocketUrl = () =>
  config.apiUrl.replace(/\/api\/v\d+\/?$/, "").replace(/\/$/, "");

const applyReadState = (
  list: Notification[],
  notificationId: string,
): Notification[] =>
  list.map((notification) =>
    notification.id === notificationId
      ? { ...notification, read: true }
      : notification,
  );

const upsertNewNotification = (
  list: Notification[],
  notification: Notification,
): Notification[] => [
  notification,
  ...list.filter((item) => item.id !== notification.id),
];

const getUnreadCount = (list: Notification[]) =>
  list.filter((notification) => !notification.read).length;

const PAGE_LIMIT = 10;

export const NotificationProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { token, isAuthenticated } = useAuth();
  const socketRef = useRef<Socket | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const paginationRef = useRef<Pagination | null>(null);
  const loadingMoreRef = useRef(false);

  const loadNotificationsPage = useCallback(async (page = 1) => {
    const isFirstPage = page === 1;
    const shouldAppend = page > 1;

    if (shouldAppend && (loadingMoreRef.current || !paginationRef.current?.hasMore)) return;

    if (isFirstPage) {
      setLoading(true);
    } else {
      loadingMoreRef.current = true;
      setLoadingMore(true);
    }
    setError(null);

    try {
      const res = (await getUserNotifications({
        page,
        limit: PAGE_LIMIT,
      })) as NotificationsResponse;

      if (res.success) {
        setNotifications((prev) =>
          shouldAppend ? [...prev, ...(res.data ?? [])] : (res.data ?? []),
        );
        setUnreadCount((prev) =>
          res.unreadCount ??
          (isFirstPage ? getUnreadCount(res.data ?? []) : prev),
        );
        const nextPagination = res.pagination ?? null;
        paginationRef.current = nextPagination;
        setPagination(nextPagination);
      } else {
        setError(res.message ?? "Unable to load notifications.");
      }
    } catch (err: any) {
      setError(err?.message ?? "Unable to load notifications.");
    } finally {
      if (isFirstPage) {
        setLoading(false);
      } else {
        loadingMoreRef.current = false;
        setLoadingMore(false);
      }
    }
  }, []);

  const refreshNotifications = useCallback(async () => {
    await loadNotificationsPage(1);
  }, [loadNotificationsPage]);

  const loadMoreNotifications = useCallback(async () => {
    if (!pagination?.hasMore || !pagination.nextPage) return;

    await loadNotificationsPage(pagination.nextPage);
  }, [loadNotificationsPage, pagination?.hasMore, pagination?.nextPage]);

  const refreshUnreadCount = useCallback(async () => {
    const socket = socketRef.current;

    if (!socket?.connected) {
      try {
        const res =
          (await getUnreadNotificationCount()) as UnreadNotificationCountResponse;

        if (res.success) {
          setUnreadCount(res.unreadCount ?? 0);
          setError(null);
        } else {
          setError(res.message ?? "Unable to load unread notifications.");
        }
      } catch (err: any) {
        setError(err?.message ?? "Unable to load unread notifications.");
      }

      return;
    }

    try {
      socket.emit(
        "notifications:unread-count",
        (res: UnreadNotificationCountResponse) => {
          if (res?.success) {
            setUnreadCount(res.unreadCount ?? 0);
            setError(null);
          } else {
            setError(res?.message ?? "Unable to load unread notifications.");
          }
        },
      );
    } catch (err: any) {
      setError(err?.message ?? "Unable to load unread notifications.");
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated || !token) return;

    refreshUnreadCount();
  }, [isAuthenticated, refreshUnreadCount, token]);

  const markAsRead = useCallback(async (notificationId: string) => {
    const socket = socketRef.current;

    if (socket?.connected) {
      try {
        socket.emit(
          "notification:read",
          notificationId,
          (res: MarkNotificationReadResponse) => {
            if (res?.success) {
              setNotifications((prev) => applyReadState(prev, notificationId));
              setUnreadCount(res.unreadCount ?? 0);
              setError(null);
            } else {
              setError(res?.message ?? "Unable to mark notification as read.");
            }
          },
        );
      } catch (err: any) {
        setError(err?.message ?? "Unable to mark notification as read.");
      }

      return;
    }

    try {
      const res = (await markNotificationAsReadRest(
        notificationId,
      )) as MarkNotificationReadResponse;

      if (res.success) {
        setNotifications((prev) => applyReadState(prev, notificationId));
        setUnreadCount(res.unreadCount ?? 0);
        setError(null);
      } else {
        setError(res.message ?? "Unable to mark notification as read.");
      }
    } catch (err: any) {
      setError(err?.message ?? "Unable to mark notification as read.");
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      socketRef.current?.disconnect();
      socketRef.current = null;
      setConnected(false);
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
      setLoadingMore(false);
      setError(null);
      setPagination(null);
      paginationRef.current = null;
      loadingMoreRef.current = false;
      return;
    }

    setError(null);

    const socket = io(getSocketUrl(), {
      auth: { token },
    });

    socketRef.current = socket;

    const handleConnect = () => {
      setConnected(true);
      refreshUnreadCount();
    };

    const handleDisconnect = () => {
      setConnected(false);
    };

    const handleConnectError = (err: Error) => {
      setConnected(false);
      setLoading(false);
      setError(err.message || "Unable to connect to notifications.");
    };

    const handleNewNotification = (payload: NewNotificationPayload) => {
      if (!payload?.notification) return;

      setNotifications((prev) =>
        upsertNewNotification(prev, payload.notification),
      );
      setUnreadCount(payload.unreadCount ?? 0);
    };

    const handleReadSync = (payload: ReadNotificationPayload) => {
      if (!payload?.notificationId) return;

      setNotifications((prev) => applyReadState(prev, payload.notificationId));
      setUnreadCount(payload.unreadCount ?? 0);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);
    socket.on("notification:new", handleNewNotification);
    socket.on("notification:read", handleReadSync);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);
      socket.off("notification:new", handleNewNotification);
      socket.off("notification:read", handleReadSync);
      socket.disconnect();

      if (socketRef.current === socket) {
        socketRef.current = null;
      }
    };
  }, [isAuthenticated, refreshUnreadCount, token]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        loadingMore,
        error,
        connected,
        refreshNotifications,
        loadMoreNotifications,
        refreshUnreadCount,
        markAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error("useNotifications must be used within NotificationProvider");
  }

  return context;
};
