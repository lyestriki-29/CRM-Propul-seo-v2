import React, { useState, useEffect } from 'react';
import { Bell, X, MessageCircle, Users, Hash, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useTeamChatSimple } from '../../hooks/useTeamChatSimple';
import { useStore } from '../../store/useStore';

interface GlobalNotification {
  id: string;
  type: 'chat' | 'info' | 'success' | 'warning';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    module: string;
    data?: Record<string, unknown>;
  };
  userAvatar?: string;
  userName?: string;
}

export const GlobalNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<GlobalNotification[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { messages, channels, users } = useTeamChatSimple();
  const { setActiveModule } = useStore();

  // Formater le nom d'utilisateur
  const formatUserName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user?.name || user?.email?.split('@')[0] || 'Utilisateur';
  };

  // Formater l'avatar
  const formatUserAvatar = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user?.avatar_url) {
      return user.avatar_url;
    }
    const name = formatUserName(userId);
    return `https://ui-avatars.com/api/?name=${name}&background=random`;
  };

  // Obtenir le nom du canal
  const getChannelName = (channelId: string) => {
    const channel = channels.find(c => c.id === channelId);
    return channel?.name || 'Canal inconnu';
  };

  // Obtenir l'icône selon le type de notification
  const getNotificationIcon = (type: GlobalNotification['type']) => {
    switch (type) {
      case 'chat':
        return <MessageCircle className="h-4 w-4" />;
      case 'success':
        return <CheckCircle className="h-4 w-4" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4" />;
      case 'info':
        return <Info className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  // Obtenir la couleur selon le type de notification
  const getNotificationColor = (type: GlobalNotification['type']) => {
    switch (type) {
      case 'chat':
        return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20';
      case 'success':
        return 'text-green-600 bg-green-50 dark:bg-green-900/20';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
      case 'info':
        return 'text-muted-foreground bg-surface-1';
      default:
        return 'text-muted-foreground bg-surface-1';
    }
  };

  // Ajouter une nouvelle notification de chat
  const addChatNotification = (message: { id: string; user_id: string; content: string; created_at: string }) => {
    const newNotification: GlobalNotification = {
      id: `chat-${message.id}`,
      type: 'chat',
      title: `Nouveau message de ${formatUserName(message.user_id)}`,
      message: message.content,
      timestamp: new Date(message.created_at),
      read: false,
      action: {
        label: 'Voir le chat',
        module: 'team-chat'
      },
      userAvatar: formatUserAvatar(message.user_id),
      userName: formatUserName(message.user_id)
    };

    setNotifications(prev => [newNotification, ...prev.slice(0, 19)]); // Garder max 20 notifications
    setUnreadCount(prev => prev + 1);

    // Notification toast
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(newNotification.title, {
        body: newNotification.message,
        icon: newNotification.userAvatar,
        tag: 'global-notification'
      });
    }
  };

  // Marquer une notification comme lue
  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  // Marquer toutes les notifications comme lues
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  // Exécuter l'action d'une notification
  const executeNotificationAction = (notification: GlobalNotification) => {
    if (notification.action) {
      setActiveModule(notification.action.module);
      if (notification.action.data) {
        // Gérer les données supplémentaires si nécessaire
      }
      markAsRead(notification.id);
      setShowDropdown(false);
    }
  };

  // Supprimer une notification
  const removeNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  // Demander la permission pour les notifications
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Surveiller les nouveaux messages
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      const lastNotification = notifications.find(n => n.id === `chat-${lastMessage.id}`);
      
      // Vérifier si c'est un nouveau message (pas déjà notifié)
      if (!lastNotification) {
        addChatNotification(lastMessage);
      }
    }
  }, [messages]);

  // Calculer le nombre de notifications non lues
  useEffect(() => {
    const unread = notifications.filter(n => !n.read).length;
    setUnreadCount(unread);
  }, [notifications]);

  return (
    <div className="relative">
      {/* Bouton de notifications */}
      <Button
        variant="ghost"
        size="sm"
        className="relative p-2"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
      </Button>

      {/* Dropdown des notifications */}
      {showDropdown && (
        <div className="absolute right-0 top-12 w-96 bg-surface-2 border border-border rounded-lg shadow-lg z-50">
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">
                Notifications ({unreadCount})
              </h3>
              <div className="flex gap-2">
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="text-xs"
                  >
                    Tout marquer comme lu
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDropdown(false)}
                  className="p-1 h-6 w-6"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Aucune notification</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-border hover:bg-surface-3 transition-colors ${
                    !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {notification.userAvatar && (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={notification.userAvatar} />
                        <AvatarFallback>
                          {notification.userName?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`p-1 rounded ${getNotificationColor(notification.type)}`}>
                          {getNotificationIcon(notification.type)}
                        </div>
                        <span className="font-medium text-sm text-foreground">
                          {notification.title}
                        </span>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2">
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {notification.timestamp.toLocaleTimeString('fr-FR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                        
                        <div className="flex gap-1">
                          {notification.action && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => executeNotificationAction(notification)}
                              className="text-xs h-6 px-2"
                            >
                              {notification.action.label}
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeNotification(notification.id)}
                            className="text-xs h-6 px-2 text-red-600 hover:text-red-700"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <div className="p-3 border-t border-border">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDropdown(false)}
                className="w-full"
              >
                Fermer
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
