import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
  Modal,
  Animated,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const TaskItem = ({ task, onToggle, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);
  const [scaleValue] = useState(new Animated.Value(1));

  const priorities = {
    high: { color: '#e74c3c', icon: '🔴', label: 'High' },
    medium: { color: '#f39c12', icon: '🟡', label: 'Medium' },
    low: { color: '#27ae60', icon: '🟢', label: 'Low' },
  };

  const priorityInfo = priorities[task.priority] || priorities.medium;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return 'Today';
    } else if (diffDays === 2) {
      return 'Yesterday';
    } else if (diffDays <= 7) {
      return `${diffDays - 1} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const handleToggle = () => {
    // Animate the toggle
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    onToggle();
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: onDelete
        }
      ]
    );
  };

  const handleEdit = () => {
    const trimmedText = editText.trim();
    if (!trimmedText) {
      Alert.alert('Empty Task', 'Task cannot be empty.');
      return;
    }
    if (trimmedText.length > 100) {
      Alert.alert('Task Too Long', 'Please keep your task under 100 characters.');
      return;
    }
    onEdit(trimmedText);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditText(task.text);
    setIsEditing(false);
  };

  return (
    <Animated.View style={[styles.container, { transform: [{ scale: scaleValue }] }]}>
      <View style={[
        styles.taskItem,
        task.completed && styles.taskItemCompleted
      ]}>
        {/* Priority Indicator */}
        <View style={[styles.priorityIndicator, { backgroundColor: priorityInfo.color }]}>
          <Text style={styles.priorityIcon}>{priorityInfo.icon}</Text>
        </View>

        {/* Task Content */}
        <View style={styles.taskContent}>
          <View style={styles.taskHeader}>
            <Text style={[
              styles.taskText,
              task.completed && styles.taskTextCompleted
            ]}>
              {task.text}
            </Text>
            <TouchableOpacity
              style={[
                styles.checkbox,
                task.completed && styles.checkboxCompleted
              ]}
              onPress={handleToggle}
            >
              {task.completed && (
                <MaterialIcons name="check" size={16} color="#ffffff" />
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.taskFooter}>
            <Text style={styles.taskDate}>
              Created {formatDate(task.createdAt)}
            </Text>
            <Text style={styles.priorityLabel}>
              {priorityInfo.label} Priority
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setIsEditing(true)}
            disabled={task.completed}
          >
            <MaterialIcons 
              name="edit" 
              size={20} 
              color={task.completed ? '#ccc' : '#6c5ce7'} 
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleDelete}
          >
            <MaterialIcons name="delete" size={20} color="#e74c3c" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Edit Modal */}
      <Modal
        visible={isEditing}
        transparent
        animationType="fade"
        onRequestClose={handleCancelEdit}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Task</Text>
            <TextInput
              style={styles.editInput}
              value={editText}
              onChangeText={setEditText}
              multiline
              maxLength={100}
              placeholder="Enter task description..."
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={handleCancelEdit}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleEdit}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  taskItem: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  taskItemCompleted: {
    backgroundColor: '#f8f9fa',
    opacity: 0.7,
  },
  priorityIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  priorityIcon: {
    fontSize: 16,
  },
  taskContent: {
    flex: 1,
    marginRight: 12,
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  taskText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
    marginRight: 12,
  },
  taskTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  checkboxCompleted: {
    backgroundColor: '#6c5ce7',
    borderColor: '#6c5ce7',
  },
  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskDate: {
    fontSize: 12,
    color: '#999',
  },
  priorityLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: 48,
  },
  actionButton: {
    padding: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  editInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 80,
    maxHeight: 120,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  saveButton: {
    backgroundColor: '#6c5ce7',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default TaskItem;