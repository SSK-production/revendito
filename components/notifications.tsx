import React, { useState, useCallback } from "react";
import { NotificationItem, NotificationProps } from "./notification-item";

type Notification = Omit<NotificationProps, "onClose"> & { id: string };

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback(
    (notification: Omit<Notification, "id">) => {
      setNotifications((prev) => [
        { ...notification, id: Date.now().toString() },
        ...prev,
      ]);
    },
    []
  );

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  }, []);

  const NotificationsComponent: React.FC = useCallback(
    () => (
      <div className="fixed bg-white top-15 right-4 flex flex-col gap-2 w-full max-w-sm z-1000">
        {notifications.map((notification, index) => (
          <NotificationItem
            key={notification.id}
            {...notification}
            onClose={() => removeNotification(notification.id)}
            className="relative"
            style={{
              zIndex: 1000 - index,
            }}
          />
        ))}
      </div>
    ),
    [notifications, removeNotification]
  );

  return { NotificationsComponent, addNotification };
}
