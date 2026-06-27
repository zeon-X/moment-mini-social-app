import { firebaseAdmin } from "../../config/firebase.js";
import { prisma } from "../../config/prisma.js";
import { emitToUser } from "../../socket/emitter.js";
import { ApiError } from "../../utils/ApiError.js";

export const formatNotification = (notification) => ({
  id: notification.id,
  type: notification.type.toLowerCase(),
  user: {
    name: notification.sender.name,
    username: notification.sender.username,
  },
  postPreview: notification.post?.content?.slice(0, 50) || "",
  timestamp: notification.createdAt,
  read: notification.read,
});

export const createNotification = async ({
  type,
  recipientId,
  senderId,
  postId,
}) => {
  // Do not notify yourself
  if (recipientId === senderId) return;

  const notification = await prisma.notification.create({
    data: {
      type,
      recipientId,
      senderId,
      postId,
    },
    include: {
      sender: {
        select: {
          name: true,
          username: true,
        },
      },
      post: {
        select: {
          content: true,
        },
      },
    },
  });

  const unreadCount = await getUnreadCount(recipientId);
  const formattedNotification = formatNotification(notification);

  emitToUser(recipientId, "notification:new", {
    notification: formattedNotification,
    unreadCount,
  });

  return formattedNotification;
};

export const getNotifications = async (userId) => {
  const notifications = await prisma.notification.findMany({
    where: { recipientId: userId },
    include: {
      sender: {
        select: {
          name: true,
          username: true,
        },
      },
      post: {
        select: {
          content: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return notifications.map(formatNotification);
};

export const markAsRead = async (notificationId, userId) => {
  const result = await prisma.notification.updateMany({
    where: {
      id: notificationId,
      recipientId: userId,
    },
    data: { read: true },
  });

  if (result.count === 0) {
    throw new ApiError(404, "Notification not found");
  }

  const unreadCount = await getUnreadCount(userId);

  emitToUser(userId, "notification:read", {
    notificationId,
    unreadCount,
  });

  return {
    notificationId,
    unreadCount,
  };
};

export const getUnreadCount = async (userId) => {
  return prisma.notification.count({
    where: {
      recipientId: userId,
      read: false,
    },
  });
};

export const sendPushNotification = async ({
  token,
  title,
  body,
  badge,
  recipientId,
}) => {
  if (!token) return;

  try {
    await firebaseAdmin.messaging().send({
      token,
      notification: {
        title,
        body,
      },
      apns: {
        payload: {
          aps: {
            badge,
          },
        },
      },
      android: {
        notification: {
          notificationCount: badge,
        },
      },
    });
  } catch (error) {
    if (error.code === "messaging/registration-token-not-registered") {
      // Delete invalid token from DB
      await prisma.user.update({
        where: { id: recipientId },
        data: { fcmToken: null },
      });
    }
    console.error("FCM error:", error.message);
  }
};
