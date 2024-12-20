"use client";

import { useNotifications } from "@/components/notifications";

export default function Home() {
  const { NotificationsComponent, addNotification } = useNotifications();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addNotification({
      message: "Form submitted successfully!",
      variant: "success",
      duration: 5000,
    });
  };

  const showErrorNotification = () => {
    addNotification({
      message: "An error occurred while processing your request.",
      variant: "error",
      duration: 7000,
    });
  };

  const showWarningNotification = () => {
    addNotification({
      message: "Please review your input before proceeding.",
      variant: "warning",
      duration: 6000,
    });
  };

  const showInfoNotification = () => {
    addNotification({
      message: "Your session will expire in 5 minutes.",
      variant: "default",
      duration: 8000,
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Enhanced Notification Demo</h1>
      <div className="space-y-4">
        <form onSubmit={handleSubmit} className="space-x-2">
          <button type="submit">Submit Form</button>
        </form>
        <div className="space-x-2">
          <button onClick={showErrorNotification}>Show Error</button>
          <button onClick={showWarningNotification}>Show Warning</button>
          <button onClick={showInfoNotification}>Show Info</button>
        </div>
      </div>
      <NotificationsComponent />
    </div>
  );
}
