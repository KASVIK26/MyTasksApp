import React, { useEffect } from 'react';
import { StyleSheet, View, StatusBar, SafeAreaView, Text } from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import TaskInput from './components/TaskInput';
import TaskList from './components/TaskList';
import { useTasks } from './hooks/useTasks';
import { useNotifications } from './hooks/useNotifications';

export default function App() {
  const {
    tasks,
    addTask,
    toggleTask,
    deleteTask,
    editTask,
    loadTasks
  } = useTasks();

  const { scheduleTaskNotification, cancelTaskNotification } = useNotifications();

  useEffect(() => {
    loadTasks();
  }, []);

  const handleAddTask = async (taskText, priority = 'medium') => {
    const newTask = await addTask(taskText, priority);
    if (newTask) {
      // Schedule notification for new task (5 minutes from now)
      await scheduleTaskNotification(newTask);
    }
  };

  const handleToggleTask = async (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (task && !task.completed) {
      // Cancel notification when task is completed
      await cancelTaskNotification(taskId);
    }
    await toggleTask(taskId);
  };

  const handleDeleteTask = async (taskId) => {
    await cancelTaskNotification(taskId);
    await deleteTask(taskId);
  };

  const handleEditTask = async (taskId, newText) => {
    await editTask(taskId, newText);
  };

  const completedTasks = tasks.filter(task => task.completed);
  const incompleteTasks = tasks.filter(task => !task.completed);

  return (
    <SafeAreaView style={styles.container}>
      <ExpoStatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.headerText}>My Tasks</Text>
        <View style={styles.statsContainer}>
          <Text style={styles.statsText}>
            {incompleteTasks.length} pending • {completedTasks.length} completed
          </Text>
        </View>
      </View>
      
      <TaskInput onAddTask={handleAddTask} />
      
      <TaskList
        tasks={tasks}
        onToggleTask={handleToggleTask}
        onDeleteTask={handleDeleteTask}
        onEditTask={handleEditTask}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingTop: StatusBar.currentHeight || 0,
  },
  header: {
    backgroundColor: '#6c5ce7',
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginBottom: 10,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  statsContainer: {
    marginTop: 8,
  },
  statsText: {
    fontSize: 14,
    color: '#ddd6fe',
    textAlign: 'center',
  },
});