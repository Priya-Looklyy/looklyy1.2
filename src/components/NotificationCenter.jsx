import React, { useEffect, useState } from 'react'
import { useLook } from '../context/LookContext'
import './NotificationCenter.css'

const NotificationCenter = () => {
  const { notifications } = useLook()
  const [visibleNotifications, setVisibleNotifications] = useState([])

  useEffect(() => {
    // Add new notifications with animation
    notifications.forEach(notification => {
      if (!visibleNotifications.find(n => n.id === notification.id)) {
        setVisibleNotifications(prev => [...prev, { ...notification, visible: false }])
        
        // Trigger animation
        setTimeout(() => {
          setVisibleNotifications(prev =>
            prev.map(n =>
              n.id === notification.id ? { ...n, visible: true } : n
            )
          )
        }, 100)
        
        // Remove after 3 seconds
        setTimeout(() => {
          setVisibleNotifications(prev =>
            prev.map(n =>
              n.id === notification.id ? { ...n, visible: false } : n
            )
          )
          
          // Remove from array after animation
          setTimeout(() => {
            setVisibleNotifications(prev =>
              prev.filter(n => n.id !== notification.id)
            )
          }, 300)
        }, 3000)
      }
    })
  }, [notifications])

  return (
    <div className="notification-center">
      {visibleNotifications.map(notification => (
        <div
          key={notification.id}
          className={`notification ${notification.visible ? 'visible' : ''}`}
        >
          {notification.message}
        </div>
      ))}
    </div>
  )
}

export default NotificationCenter
