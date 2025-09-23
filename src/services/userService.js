// User Service for Looklyy App
// Simple localStorage-based user management (can be upgraded to real database later)

const USER_STORAGE_KEY = 'looklyy_users'
const CURRENT_USER_KEY = 'looklyy_current_user'

// Initialize users storage if it doesn't exist
const initializeUsers = () => {
  if (!localStorage.getItem(USER_STORAGE_KEY)) {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify([]))
  }
}

// Get all users
export const getAllUsers = () => {
  initializeUsers()
  return JSON.parse(localStorage.getItem(USER_STORAGE_KEY) || '[]')
}

// Create a new user
export const createUser = (userData) => {
  const users = getAllUsers()
  
  // Check if user already exists
  const existingUser = users.find(user => user.email === userData.email)
  if (existingUser) {
    return { success: false, error: 'User with this email already exists' }
  }
  
  // Create new user
  const newUser = {
    id: Date.now().toString(),
    name: userData.name,
    email: userData.email,
    password: userData.password, // In production, this should be hashed
    createdAt: new Date().toISOString(),
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=f0f0f0&color=1a1a1a`,
    preferences: {
      theme: 'purple',
      notifications: true
    }
  }
  
  users.push(newUser)
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(users))
  
  return { success: true, user: newUser }
}

// Authenticate user
export const authenticateUser = (email, password) => {
  const users = getAllUsers()
  const user = users.find(u => u.email === email && u.password === password)
  
  if (user) {
    // Set current user
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
    return { success: true, user }
  }
  
  return { success: false, error: 'Invalid email or password' }
}

// Get current user
export const getCurrentUser = () => {
  const userData = localStorage.getItem(CURRENT_USER_KEY)
  return userData ? JSON.parse(userData) : null
}

// Logout user
export const logoutUser = () => {
  localStorage.removeItem(CURRENT_USER_KEY)
  return { success: true }
}

// Update user preferences
export const updateUserPreferences = (userId, preferences) => {
  const users = getAllUsers()
  const userIndex = users.findIndex(u => u.id === userId)
  
  if (userIndex !== -1) {
    users[userIndex].preferences = { ...users[userIndex].preferences, ...preferences }
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(users))
    
    // Update current user if it's the same user
    const currentUser = getCurrentUser()
    if (currentUser && currentUser.id === userId) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(users[userIndex]))
    }
    
    return { success: true, user: users[userIndex] }
  }
  
  return { success: false, error: 'User not found' }
}

// Delete user account
export const deleteUser = (userId) => {
  const users = getAllUsers()
  const filteredUsers = users.filter(u => u.id !== userId)
  
  if (filteredUsers.length < users.length) {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(filteredUsers))
    
    // Logout if current user is deleted
    const currentUser = getCurrentUser()
    if (currentUser && currentUser.id === userId) {
      logoutUser()
    }
    
    return { success: true }
  }
  
  return { success: false, error: 'User not found' }
}

// Initialize the service
initializeUsers()
