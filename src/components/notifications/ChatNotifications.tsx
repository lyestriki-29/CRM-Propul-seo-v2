import React, { useState, useEffect } from 'react';
import { Bell, X, MessageCircle } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useTeamChatSimple } from '../../hooks/useTeamChatSimple';
import { useStore } from '../../store/useStore';
import { toast } from 'sonner';

interface ChatNotification {
  id: string;
  message: string;
  channelId: string; // Ajout de l'ID du canal
  channelName: string;
  userName: string;
  userAvatar?: string;
  timestamp: Date;
  read: boolean;
  isMention?: boolean;
}

export const ChatNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<ChatNotification[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { messages, channels, users } = useTeamChatSimple();
  const { setActiveModule, currentUser } = useStore();

  // Formater le nom d'utilisateur
  const formatUserName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user?.name) {
      return user.name;
    }
    return 'Utilisateur';
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

  // Extraire les mentions d'un message
  const extractMentions = (content: string) => {
    const mentionRegex = /@(\w+)/g;
    const mentions: Array<{ userId: string; userName: string }> = [];
    let match;

    while ((match = mentionRegex.exec(content)) !== null) {
      const mentionText = match[1];
      const mentionedUser = users.find(user => 
        user.name?.toLowerCase().includes(mentionText.toLowerCase())
      );

      if (mentionedUser) {
        mentions.push({
          userId: mentionedUser.id,
          userName: formatUserName(mentionedUser.id)
        });
      }
    }

    return mentions;
  };

  // Ajouter une nouvelle notification
  const addNotification = (message: { id: string; user_id: string; content: string; channel_id: string; created_at: string }) => {
    // Vérifier si le message contient des mentions
    const mentions = extractMentions(message.content);
    const isMentioned = mentions.some(mention => mention.userId === currentUser?.id);
    
    // Ne créer une notification QUE si l'utilisateur est mentionné
    if (!isMentioned) {
      return;
    }
    
    const newNotification: ChatNotification = {
      id: message.id,
      message: message.content,
      channelId: message.channel_id,
      channelName: getChannelName(message.channel_id),
      userName: formatUserName(message.user_id),
      userAvatar: formatUserAvatar(message.user_id),
      timestamp: new Date(message.created_at),
      read: false,
      isMention: true
    };

    setNotifications(prev => [newNotification, ...prev.slice(0, 9)]);
    setUnreadCount(prev => prev + 1);

    // Notification toast avec priorité pour les mentions
    if ('Notification' in window && Notification.permission === 'granted') {
      const title = `🔔 ${formatUserName(message.user_id)} vous a mentionné !`;
      
      new Notification(title, {
        body: message.content,
        icon: formatUserAvatar(message.user_id),
        tag: 'chat-notification',
        requireInteraction: true,
        badge: '🔔'
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

  // Aller au chat - DÉSACTIVÉ (module chat supprimé)
  const goToChat = (notification: ChatNotification) => {
    console.warn('Chat module supprimé - redirection désactivée');
    // setActiveModule('team-chat');
    // markAsRead(notification.id);
    // setShowDropdown(false);
    // localStorage.setItem('redirectToChannel', notification.channelId);
    // toast.info(`Redirection vers ${notification.channelName}`);
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
      const lastNotification = notifications[0];
      
      if (!lastNotification || lastNotification.id !== lastMessage.id) {
        addNotification(lastMessage);
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
        <div className="absolute right-0 top-12 w-80 bg-surface-2 border border-border rounded-lg shadow-lg z-50">
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
                <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Aucune notification</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 border-b border-border last:border-b-0 hover:bg-surface-3 transition-colors ${
                    notification.isMention ? 'bg-blue-50 dark:bg-blue-900/20 border-l-2 border-blue-500' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarImage src={notification.userAvatar} />
                      <AvatarFallback className="text-xs bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                        {notification.userName?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-foreground">
                          {notification.userName}
                        </span>
                        {notification.isMention && (
                          <Badge variant="secondary" className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                            🔔 Mention
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {notification.channelName}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {notification.timestamp.toLocaleTimeString('fr-FR', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => goToChat(notification)}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-primary hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeNotification(notification.id)}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <X className="w-4 h-4" />
                      </Button>
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
                onClick={() => setActiveModule('team-chat')}
                className="w-full"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Aller au chat
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
