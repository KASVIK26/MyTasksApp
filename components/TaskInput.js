import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  Modal,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const TaskInput = ({ onAddTask }) => {
  const [taskText, setTaskText] = useState('');
  const [priority, setPriority] = useState('medium');
  const [showPriorityModal, setShowPriorityModal] = useState(false);

  const priorities = [
    { value: 'high', label: 'High Priority', color: '#e74c3c', icon: '🔴' },
    { value: 'medium', label: 'Medium Priority', color: '#f39c12', icon: '🟡' },
    { value: 'low', label: 'Low Priority', color: '#27ae60', icon: '🟢' },
  ];

  const handleAddTask = () => {
    const trimmedText = taskText.trim();
    
    if (!trimmedText) {
      Alert.alert('Empty Task', 'Please enter a task description before adding.');
      return;
    }

    if (trimmedText.length > 100) {
      Alert.alert('Task Too Long', 'Please keep your task under 100 characters.');
      return;
    }

    onAddTask(trimmedText, priority);
    setTaskText('');
    setPriority('medium');
  };

  const getPriorityInfo = (priorityValue) => {
    return priorities.find(p => p.value === priorityValue) || priorities[1];
  };

  const currentPriority = getPriorityInfo(priority);

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Enter a new task..."
          value={taskText}
          onChangeText={setTaskText}
          multiline
          maxLength={100}
          returnKeyType="done"
          onSubmitEditing={handleAddTask}
        />
        <TouchableOpacity
          style={[styles.priorityButton, { backgroundColor: currentPriority.color }]}
          onPress={() => setShowPriorityModal(true)}
        >
          <Text style={styles.priorityEmoji}>{currentPriority.icon}</Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity
        style={[styles.addButton, !taskText.trim() && styles.addButtonDisabled]}
        onPress={handleAddTask}
        disabled={!taskText.trim()}
      >
        <MaterialIcons name="add" size={24} color="#ffffff" />
        <Text style={styles.addButtonText}>Add Task</Text>
      </TouchableOpacity>

      <Modal
        visible={showPriorityModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPriorityModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Priority</Text>
            {priorities.map((priorityOption) => (
              <TouchableOpacity
                key={priorityOption.value}
                style={[
                  styles.priorityOption,
                  priority === priorityOption.value && styles.priorityOptionSelected
                ]}
                onPress={() => {
                  setPriority(priorityOption.value);
                  setShowPriorityModal(false);
                }}
              >
                <Text style={styles.priorityOptionIcon}>{priorityOption.icon}</Text>
                <Text style={styles.priorityOptionText}>{priorityOption.label}</Text>
                {priority === priorityOption.value && (
                  <MaterialIcons name="check" size={20} color="#6c5ce7" />
                )}
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowPriorityModal(false)}
            >
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#ffffff',
    marginHorizontal: 10,
    marginBottom: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 50,
    maxHeight: 100,
    textAlignVertical: 'top',
  },
  priorityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  priorityEmoji: {
    fontSize: 20,
  },
  addButton: {
    backgroundColor: '#6c5ce7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
  },
  addButtonDisabled: {
    backgroundColor: '#bbb',
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
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
    width: '80%',
    maxWidth: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  priorityOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  priorityOptionSelected: {
    backgroundColor: '#f0efff',
  },
  priorityOptionIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  priorityOptionText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  modalCloseButton: {
    marginTop: 10,
    padding: 12,
    alignItems: 'center',
  },
  modalCloseText: {
    color: '#6c5ce7',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default TaskInput;