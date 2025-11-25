
import { useEffect } from "react";
import { Assignment } from "../types/assignment";

export const useNotifications = (assignments: Assignment[]) => {
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      const currentTime = now.toTimeString().slice(0, 5); // HH:MM format
      const today = now.toDateString();

      assignments.forEach((assignment) => {
        if (assignment.reminderTime && !assignment.completed) {
          const assignmentDate = assignment.deadline.toDateString();
          
          // Check if it's the due date and reminder time matches
          if (assignmentDate === today && assignment.reminderTime === currentTime) {
            if ("Notification" in window && Notification.permission === "granted") {
              new Notification("Remind - Assignment Due", {
                body: `"${assignment.name}" for ${assignment.subject} is due today!`,
                icon: "/favicon.ico",
              });
            } else if ("Notification" in window && Notification.permission === "default") {
              Notification.requestPermission().then((permission) => {
                if (permission === "granted") {
                  new Notification("Remind - Assignment Due", {
                    body: `"${assignment.name}" for ${assignment.subject} is due today!`,
                    icon: "/favicon.ico",
                  });
                }
              });
            }
          }
        }
      });
    };

    // Check every minute
    const interval = setInterval(checkReminders, 60000);
    
    // Initial check
    checkReminders();

    return () => clearInterval(interval);
  }, [assignments]);
};
