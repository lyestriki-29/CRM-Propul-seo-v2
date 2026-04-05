import React from 'react';
import { MentionNotification } from './MentionNotification';
import { useMentionNotifications } from '../../hooks/useMentionNotifications';

export const MentionNotificationCenter: React.FC = () => {
  const { notifications, removeNotification, openChat } = useMentionNotifications();

  if (notifications.length === 0) {
    return null;
  }

  return (
    <>
      {notifications.map((notification) => (
        <MentionNotification
          key={notification.id}
          message={notification.message}
          channelName={notification.channelName}
          onClose={() => removeNotification(notification.id)}
          onOpenChat={() => openChat(notification.message.channel_id)}
        />
      ))}
    </>
  );
};
