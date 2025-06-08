import { useState, useCallback } from 'react';
import { saveTasks, loadTasksFromStorage } from '../utils/storage';

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);

  const loadTasks = useCallback(async () => {
    try {
      const savedTasks = await loadTasksFromStorage();
      setTasks(savedTasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  }, []);

  const saveTasksToStorage = useCallback(async (newTasks) => {
    try {
      await saveTasks(newTasks);
      setTasks(newTasks);
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  }, []);

  const addTask = useCallback(async (text, priority = 'medium') => {
    const newTask = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      text: text.trim(),
      completed: false,
      priority,
      createdAt: new Date().toISOString(),
      completedAt: null,
    };

    const updatedTasks = [newTask, ...tasks];
    await saveTasksToStorage(updatedTasks);
    return newTask;
  }, [tasks, saveTasksToStorage]);

  const toggleTask = useCallback(async (taskId) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          completed: !task.completed,
          completedAt: !task.completed ? new Date().toISOString() : null,
        };
      }
      return task;
    });

    await saveTasksToStorage(updatedTasks);
  }, [tasks, saveTasksToStorage]);

  const deleteTask = useCallback(async (taskId) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    await saveTasksToStorage(updatedTasks);
  }, [tasks, saveTasksToStorage]);

  const editTask = useCallback(async (taskId, newText) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          text: newText.trim(),
        };
      }
      return task;
    });

    await saveTasksToStorage(updatedTasks);
  }, [tasks, saveTasksToStorage]);

  const clearCompletedTasks = useCallback(async () => {
    const updatedTasks = tasks.filter(task => !task.completed);
    await saveTasksToStorage(updatedTasks);
  }, [tasks, saveTasksToStorage]);

  const getTaskStats = useCallback(() => {
    const completed = tasks.filter(task => task.completed).length;
    const pending = tasks.length - completed;
    const highPriority = tasks.filter(task => task.priority === 'high' && !task.completed).length;
    
    return {
      total: tasks.length,
      completed,
      pending,
      highPriority,
    };
  }, [tasks]);

  return {
    tasks,
    addTask,
    toggleTask,
    deleteTask,
    editTask,
    loadTasks,
    clearCompletedTasks,
    getTaskStats,
  };
};