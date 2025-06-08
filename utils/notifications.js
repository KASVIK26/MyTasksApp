import * as Notifications from 'expo-notifications';

// Notification templates for different priorities
export const getNotificationContent = (task) => {
  const priorityEmojis = {
    high: '🔴',
    medium: '🟡',
    low: '🟢',
  };

  const priorityMessages = {
    high: 'High priority task reminder!',
    medium: 'Task reminder',
    low: 'Gentle reminder',
  };

  const emoji = priorityEmojis[task.priority] || '📋';
  const message = priorityMessages[task.priority] || 'Task reminder';

  return {
    title: `${emoji} ${message}`,
    body: `Don't forget: ${task.text}`,
    data: {
      taskId: task.id,
      taskText: task.text,
      priority: task.priority,
      createdAt: task.createdAt,
    },
    sound: true,
    priority: task.priority === 'high' ? 'high' : 'normal',
  };
};

// Different notification schedules based on priority
export const getNotificationTrigger = (task) => {
  const now = new Date();
  let triggerTime;

  switch (task.priority) {
    case 'high':
      // High priority: 2 minutes
      triggerTime = new Date(now.getTime() + 2 * 60 * 1000);
      break;
    case 'medium':
      // Medium priority: 5 minutes
      triggerTime = new Date(now.getTime() + 5 * 60 * 1000);
      break;
    case 'low':
      // Low priority: 10 minutes
      triggerTime = new Date(now.getTime() + 10 * 60 * 1000);
      break;
    default:
      triggerTime = new Date(now.getTime() + 5 * 60 * 1000);
  }

  return triggerTime;
};

// Schedule multiple reminders for high priority tasks
export const scheduleMultipleReminders = async (task) => {
  if (task.priority === 'high') {
    const reminders = [
      { delay: 2 * 60 * 1000, suffix: 'first' },  // 2 minutes
      { delay: 10 * 60 * 1000, suffix: 'second' }, // 10 minutes
      { delay: 30 * 60 * 1000, suffix: 'third' },  // 30 minutes
    ];

    const notificationIds = [];

    for (const reminder of reminders) {
      try {
        const notificationId = await Notifications.scheduleNotificationAsync({
          content: {
            ...getNotificationContent(task),
            title: `🔴 High Priority Reminder`,
            body: `Important: ${task.text}`,
          },
          trigger: new Date(Date.now() + reminder.delay),
          identifier: `task-${task.id}-${reminder.suffix}`,
        });
        notificationIds.push(notificationId);
      } catch (error) {
        console.error('Error scheduling reminder:', error);
      }
    }

    return notificationIds;
  }

  return [];
};

// Cancel all reminders for a task
export const cancelAllTaskReminders = async (taskId) => {
  const suffixes = ['first', 'second', 'third'];
  
  try {
    // Cancel main notification
    await Notifications.cancelScheduledNotificationAsync(`task-${taskId}`);
    
    // Cancel all reminders
    for (const suffix of suffixes) {
      await Notifications.cancelScheduledNotificationAsync(`task-${taskId}-${suffix}`);
    }
    
    console.log('Cancelled all reminders for task:', taskId);
  } catch (error) {
    console.error('Error cancelling task reminders:', error);
  }
};

// Get all scheduled notifications (for debugging)
export const getAllScheduledNotifications = async () => {
  try {
    const notifications = await Notifications.getAllScheduledNotificationsAsync();
    console.log('Scheduled notifications:', notifications);
    return notifications;
  } catch (error) {
    console.error('Error getting scheduled notifications:', error);
    return [];
  }
};

// Notification categories for interactive notifications (iOS)
export const setupNotificationCategories = async () => {
  try {
    await Notifications.setNotificationCategoryAsync('TASK_REMINDER', [
      {
        identifier: 'COMPLETE_TASK',
        buttonTitle: 'Mark Complete',
        options: { opensAppToForeground: true },
      },
      {
        identifier: 'SNOOZE_TASK',
        buttonTitle: 'Remind Later',
        options: { opensAppToForeground: false },
      },
    ]);
    console.log('Notification categories set up');
  } catch (error) {
    console.error('Error setting up notification categories:', error);
  }
};

// Handle notification responses
export const handleNotificationResponse = (response) => {
  const { notification, actionIdentifier } = response;
  const taskData = notification.request.content.data;

  console.log('Notification response:', actionIdentifier, taskData);

  switch (actionIdentifier) {
    case 'COMPLETE_TASK':
      // Handle task completion
      return { action: 'complete', taskId: taskData.taskId };
    case 'SNOOZE_TASK':
      // Handle snooze
      return { action: 'snooze', taskId: taskData.taskId };
    default:
      // Default tap action
      return { action: 'open', taskId: taskData.taskId };
  }
};