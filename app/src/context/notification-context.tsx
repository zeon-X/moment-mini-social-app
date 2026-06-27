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
  error: string | null;
  connected: boolean;
  refreshNotifications: () => Promise<void>;
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
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);

  const loadNotificationsFromSocket = useCallback((socket: Socket) => {
    setLoading(true);
    setError(null);

    socket.emit("notifications:get", (res: NotificationsResponse) => {
      if (res?.success) {
        setNotifications(res.data ?? []);
        setUnreadCount(res.unreadCount ?? getUnreadCount(res.data ?? []));
        setError(null);
      } else {
        setError(res?.message ?? "Unable to load notifications.");
      }

      setLoading(false);
    });
  }, []);

  const refreshNotifications = useCallback(async () => {
    const socket = socketRef.current;

    if (socket?.connected) {
      loadNotificationsFromSocket(socket);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = (await getUserNotifications()) as NotificationsResponse;

      if (res.success) {
        setNotifications(res.data ?? []);
        setUnreadCount(res.unreadCount ?? getUnreadCount(res.data ?? []));
      } else {
        setError(res.message ?? "Unable to load notifications.");
      }
    } catch (err: any) {
      setError(err?.message ?? "Unable to load notifications.");
    } finally {
      setLoading(false);
    }
  }, [loadNotificationsFromSocket]);

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
  }, []);

  const markAsRead = useCallback(async (notificationId: string) => {
    const socket = socketRef.current;

    if (socket?.connected) {
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
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    const socket = io(getSocketUrl(), {
      auth: { token },
    });

    socketRef.current = socket;

    const handleConnect = () => {
      setConnected(true);
      loadNotificationsFromSocket(socket);
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
  }, [isAuthenticated, loadNotificationsFromSocket, token]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        error,
        connected,
        refreshNotifications,
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
