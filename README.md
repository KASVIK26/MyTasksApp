# My Tasks App 📋


A beautifully designed, feature-rich task management mobile application built with React Native and Expo. This app demonstrates modern mobile development practices with clean code architecture, smooth animations, and comprehensive functionality.

## 🌟 Features

### Core Functionality
- ✅ **Task Management**: Add, edit, delete, and toggle task completion
- 🔔 **Smart Notifications**: Automatic reminders based on task priority
- 💾 **Data Persistence**: Tasks saved locally using AsyncStorage
- 🎯 **Priority System**: High, Medium, and Low priority levels with visual indicators
- 📱 **Responsive Design**: Optimized for various screen sizes

### Advanced Features
- 🎨 **Modern UI/UX**: Clean design with smooth animations and micro-interactions
- 📊 **Task Statistics**: Real-time tracking of completed and pending tasks
- 🔄 **Smart Notifications**: Priority-based notification scheduling
- ✏️ **Inline Editing**: Edit tasks with intuitive modal interface
- 🗂️ **Task Organization**: Separate sections for pending and completed tasks
- 📅 **Timestamps**: Track when tasks were created and completed

## 🚀 Quick Start

### Prerequisites
- Node.js (14 or higher)
- Expo CLI
- Expo Go app on your mobile device

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/KASVIK26/my-tasks-app.git
   cd my-tasks-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npx expo start
   ```

4. **Run on your device**
   - Open Expo Go on your mobile device
   - Scan the QR code displayed in your terminal/browser
   - The app will load automatically

<img src="https://github.com/user-attachments/assets/34cb7f1b-908f-4626-9182-c43e40f15094" width="300"/>
<img src="https://github.com/user-attachments/assets/f2af1b56-dfd8-4b27-aff4-a6fe705fb5d9" width="300"/>
<img src="https://github.com/user-attachments/assets/004ab72d-114a-4993-a87f-1da8bcf7b611" width="300"/>
<img src="https://github.com/user-attachments/assets/961ae74a-a5f7-429c-a96a-3533f155c2b9" width="300"/>
<img src="https://github.com/user-attachments/assets/d8d5bbe5-81d9-4bfd-acbf-7930db1c5f00" width="300"/>

### Alternative Setup (From Scratch)

```bash
# Create new Expo project
npx create-expo-app MyTasksApp --template blank
cd MyTasksApp

# Install dependencies
npm install expo-notifications @expo/vector-icons @react-native-async-storage/async-storage expo-device expo-constants

# Start development server
npx expo start
```

## 📱 How to Use

### Adding Tasks
1. Type your task in the input field
2. Select priority level using the colored button (🔴 High, 🟡 Medium, 🟢 Low)
3. Tap "Add Task" to create the task
4. A notification reminder will be automatically scheduled

### Managing Tasks
- **Complete**: Tap the circular checkbox to mark as complete
- **Edit**: Tap the edit icon to modify task text
- **Delete**: Tap the delete icon and confirm removal
- **Priority**: Visual indicators show task priority levels

### Notifications
- **High Priority**: Reminders in 2 minutes with multiple follow-ups
- **Medium Priority**: Single reminder in 5 minutes
- **Low Priority**: Single reminder in 10 minutes
- **Auto-Cancel**: Notifications are cancelled when tasks are completed

- **Note**: For Expo Notifications - Expo Version 53.0.0 does'nt support notifications in Expo Go app you have to create a development build to use these feature. Or run cmd npx expo run:android/ios Or (Best) build eas then bundle with google bundler from github

## 🏗️ Project Structure

```
MyTasksApp/
├── App.js                 # Main application component
├── components/
│   ├── TaskInput.js       # Task creation with priority selection
│   ├── TaskItem.js        # Individual task component with animations
│   └── TaskList.js        # Task list with sections
├── hooks/
│   ├── useTasks.js        # Task management logic
│   └── useNotifications.js # Notification handling
├── utils/
│   ├── storage.js         # AsyncStorage operations
│   └── notifications.js   # Notification utilities
└── assets/                # Images and icons
```

## 🛠️ Technical Implementation

### State Management
- **Custom Hooks**: Separated business logic into reusable hooks
- **React Hooks**: useState, useEffect, useCallback for optimal performance
- **Local State**: Component-level state for UI interactions

### Data Persistence
- **AsyncStorage**: Reliable local storage for task data
- **Error Handling**: Graceful fallbacks for storage operations
- **Data Validation**: Input validation and sanitization

### Notifications
- **Expo Notifications**: Cross-platform notification system
- **Priority-Based Scheduling**: Different timings based on task importance
- **Automatic Cleanup**: Cancelled notifications for completed tasks

### UI/UX Design
- **Material Icons**: Consistent iconography
- **Smooth Animations**: Micro-interactions for better user experience
- **Responsive Layout**: Adapts to different screen sizes
- **Visual Hierarchy**: Clear priority indicators and status

## 🎯 Challenges Overcome

### 1. **Notification Permission Handling**
- Implemented robust permission request flow
- Graceful degradation when permissions are denied
- Cross-platform compatibility (iOS/Android)

### 2. **State Synchronization**
- Ensured UI updates immediately reflect in AsyncStorage
- Prevented race conditions in concurrent operations
- Maintained data consistency across app lifecycle

### 3. **Performance Optimization**
- Used useCallback to prevent unnecessary re-renders
- Implemented efficient list rendering with FlatList
- Optimized notification scheduling and cancellation

### 4. **User Experience**
- Created intuitive task editing with modal interface
- Added visual feedback for all user interactions
- Implemented smooth animations without performance impact

## 🧪 Testing

### Manual Testing Checklist
- [ ] Add tasks with different priorities
- [ ] Edit existing tasks
- [ ] Toggle task completion
- [ ] Delete tasks
- [ ] Verify notifications appear
- [ ] Test app persistence (close/reopen)
- [ ] Check responsive design on different devices

### Testing Notifications
```javascript
// Add this to App.js for testing
const testNotification = async () => {
  await scheduleTestNotification();
};
```

## 🚀 Deployment

### Building for Production
```bash
# Build for Android
npx expo build:android

# Build for iOS
npx expo build:ios

# Or use EAS Build (recommended)
npx eas build --platform all
```

### Environment Setup for EAS
```bash
npm install -g @expo/cli eas-cli
eas login
eas build:configure
```

## 📈 Future Enhancements

- [ ] **Cloud Sync**: Firebase integration for cross-device synchronization
- [ ] **Categories**: Task categorization and filtering
- [ ] **Due Dates**: Calendar integration and deadline management
- [ ] **Collaboration**: Share tasks with team members
- [ ] **Dark Mode**: Theme switching capability
- [ ] **Analytics**: Task completion insights and productivity metrics


*Built with ❤️ using React Native and Expo*
