# User System Guide

## Overview
The workout app now supports multiple users with persistent data storage using IndexedDB. Each user has their own workout progress, XP, and logs stored separately in a local database.

## Features

### 🔐 Simple User Management
- **No passwords required** - Just enter a username to create or access an account
- **Automatic data persistence** - All workout data is saved automatically to the database
- **User switching** - Easy logout and login to different accounts

### 💾 Database Storage
- **IndexedDB** - Uses browser's built-in database for reliable local storage
- **Automatic backups** - Data persists across browser sessions
- **Export/Import** - Individual user data can be exported as JSON files

### 👥 Multi-User Support
- **User list** - See all existing users with their levels and last activity
- **User deletion** - Remove users and all their data (with confirmation)
- **User stats** - Quick overview of each user's progress

## How to Use

### Creating a New User
1. Enter a username (2+ characters)
2. Click "Create User" 
3. Start logging workouts immediately

### Logging in as Existing User
1. Either:
   - Enter username and click "Login"
   - Or click "Login" button next to any user in the list
2. Continue with your saved progress

### Managing Data
- **Auto-save**: All progress is saved automatically as you log workouts
- **Export**: Use the save button to download your data as JSON
- **Import**: Upload a previously exported JSON file to restore data
- **Reset**: Clear all workout data (keeps user account)
- **Logout**: Return to user selection screen

## Technical Details

### Database Structure
```typescript
interface User {
  id: string;           // Unique identifier
  username: string;     // Display name
  createdAt: string;    // Account creation date
  lastActiveAt: string; // Last login/activity
  progressState: {      // All workout data
    currentStepByMovement: {...},
    currentStepBySkill: {...},
    logs: [...],
    xp: number
  }
}
```

### Storage Location
- **Local Database**: IndexedDB in your browser
- **Database Name**: `CelestialPulseDB`
- **No server required** - Everything runs locally

### Data Migration
The system automatically handles:
- Database initialization on first use
- Schema updates for future versions
- Error handling for corrupted data

## Benefits

### For Users
- **Personal Progress**: Each user maintains their own workout journey
- **Family Sharing**: Multiple people can use the same device/browser
- **Data Safety**: More reliable than localStorage with automatic persistence

### For Developers
- **Scalable**: Easy to migrate to server-side database later
- **Maintainable**: Clean separation between user management and workout logic
- **Extensible**: Simple to add features like user preferences, achievements, etc.

## Future Enhancements
This foundation enables:
- User profiles and preferences
- Workout sharing between users
- Achievement systems
- Progress comparisons
- Cloud sync (when server is added)
- User authentication (passwords, etc.)

## Troubleshooting

### Common Issues
- **"Database not initialized"**: Refresh the page, IndexedDB may need time to load
- **"Username already exists"**: Choose a different username
- **Data not saving**: Check browser storage permissions

### Browser Compatibility
- Works in all modern browsers that support IndexedDB
- Chrome, Firefox, Safari, Edge all supported
- Mobile browsers fully supported