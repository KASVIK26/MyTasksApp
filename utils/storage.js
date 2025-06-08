import AsyncStorage from '@react-native-async-storage/async-storage';

const TASKS_STORAGE_KEY = '@MyTasksApp:tasks';

export const saveTasks = async (tasks) => {
  try {
    const jsonValue = JSON.stringify(tasks);
    await AsyncStorage.setItem(TASKS_STORAGE_KEY, jsonValue);
    console.log('Tasks saved successfully');
  } catch (error) {
    console.error('Error saving tasks:', error);
    throw error;
  }
};

export const loadTasksFromStorage = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(TASKS_STORAGE_KEY);
    if (jsonValue !== null) {
      const tasks = JSON.parse(jsonValue);
      console.log('Tasks loaded successfully:', tasks.length, 'tasks');
      return tasks;
    }
    console.log('No tasks found in storage');
    return [];
  } catch (error) {
    console.error('Error loading tasks:', error);
    return [];
  }
};

export const clearAllTasks = async () => {
  try {
    await AsyncStorage.removeItem(TASKS_STORAGE_KEY);
    console.log('All tasks cleared from storage');
  } catch (error) {
    console.error('Error clearing tasks:', error);
    throw error;
  }
};

export const getStorageInfo = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const taskKeys = keys.filter(key => key.startsWith('@MyTasksApp:'));
    
    let totalSize = 0;
    for (const key of taskKeys) {
      const value = await AsyncStorage.getItem(key);
      if (value) {
        totalSize += value.length;
      }
    }

    return {
      totalKeys: taskKeys.length,
      totalSize,
      keys: taskKeys,
    };
  } catch (error) {
    console.error('Error getting storage info:', error);
    return null;
  }
};

// Backup and restore functionality
export const exportTasks = async () => {
  try {
    const tasks = await loadTasksFromStorage();
    const exportData = {
      tasks,
      exportDate: new Date().toISOString(),
      version: '1.0',
    };
    return JSON.stringify(exportData, null, 2);
  } catch (error) {
    console.error('Error exporting tasks:', error);
    throw error;
  }
};

export const importTasks = async (importData) => {
  try {
    const data = JSON.parse(importData);
    if (data.tasks && Array.isArray(data.tasks)) {
      await saveTasks(data.tasks);
      console.log('Tasks imported successfully:', data.tasks.length, 'tasks');
      return data.tasks;
    } else {
      throw new Error('Invalid import data format');
    }
  } catch (error) {
    console.error('Error importing tasks:', error);
    throw error;
  }
};