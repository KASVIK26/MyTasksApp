import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const useNotifications = () => {
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync();

    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
    });

    // This listener is fired whenever a user taps on or interacts with a notification
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response:', response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const registerForPushNotificationsAsync = async () => {
    let token;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        return;
      }
      
      try {
        const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
        if (!projectId) {
          throw new Error('Project ID not found');
        }
        token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
        console.log('Push token:', token);
      } catch (e) {
        console.log('Error getting push token:', e);
      }
    } else {
      console.log('Must use physical device for Push Notifications');
    }

    return token;
  };

  const scheduleTaskNotification = async (task) => {
    try {
      // Cancel any existing notification for this task
      await cancelTaskNotification(task.id);

      // Schedule notification for 5 minutes from now
      const trigger = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: '📋 Task Reminder',
          body: `Don't forget: ${task.text}`,
          data: { 
            taskId: task.id,
            taskText: task.text,
            priority: task.priority 
          },
          sound: true,
        },
        trigger,
        identifier: `task-${task.id}`,
      });

      console.log('Scheduled notification:', notificationId, 'for task:', task.text);
      return notificationId;
    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
  };

  const cancelTaskNotification = async (taskId) => {
    try {
      await Notifications.cancelScheduledNotificationAsync(`task-${taskId}`);
      console.log('Cancelled notification for task:', taskId);
    } catch (error) {
      console.error('Error cancelling notification:', error);
    }
  };

  const cancelAllNotifications = async () => {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log('Cancelled all notifications');
    } catch (error) {
      console.error('Error cancelling all notifications:', error);
    }
  };

  const scheduleTestNotification = async () => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '🧪 Test Notification',
          body: 'This is a test notification from My Tasks App!',
          data: { test: true },
        },
        trigger: { seconds: 2 },
      });
      console.log('Test notification scheduled');
    } catch (error) {
      console.error('Error scheduling test notification:', error);
    }
  };

  return {
    scheduleTaskNotification,
    cancelTaskNotification,
    cancelAllNotifications,
    scheduleTestNotification,
  };
};