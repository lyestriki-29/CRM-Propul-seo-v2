import React, { useEffect, useState } from 'react';
import { X, MessageSquare, User } from 'lucide-react';
import { cn } from '../../lib/utils';

interface MentionNotificationProps {
  message: {
    id: string;
    content: string;
    user_id: string;
    channel_id: string;
    created_at: string;
    user?: {
      name?: string;
      avatar_url?: string;
    };
  };
  channelName: string;
  onClose: () => void;
  onOpenChat: () => void;
}

export const MentionNotification: React.FC<MentionNotificationProps> = ({
  message,
  channelName,
  onClose,
  onOpenChat
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animation d'entrée
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Auto-fermeture après 8 secondes
  useEffect(() => {
    const autoCloseTimer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Attendre la fin de l'animation
    }, 8000);

    return () => clearTimeout(autoCloseTimer);
  }, [onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const handleOpenChat = () => {
    onOpenChat();
    handleClose();
  };

  // Extraire le début du message (premières 50 caractères)
  const messagePreview = message.content.length > 50 
    ? message.content.substring(0, 50) + '...'
    : message.content;

  return (
    <div
      className={cn(
        "fixed top-4 right-4 z-50 w-80 bg-surface-2 rounded-lg shadow-lg border border-border transform transition-all duration-300",
        isVisible 
          ? "translate-x-0 opacity-100" 
          : "translate-x-full opacity-0"
      )}
    >
      {/* En-tête avec bouton fermer */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <MessageSquare className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <span className="text-sm font-semibold text-foreground">
            Nouvelle mention
          </span>
        </div>
        <button
          onClick={handleClose}
          className="p-1 hover:bg-surface-3 rounded-lg transition-colors"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Contenu de la notification */}
      <div className="p-4">
        {/* Informations sur l'expéditeur et le canal */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
            {message.user?.avatar_url ? (
              <img 
                src={message.user.avatar_url} 
                alt={message.user.name || 'Utilisateur'} 
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <User className="w-4 h-4 text-white" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {message.user?.name || 'Utilisateur'}
            </p>
            <p className="text-xs text-muted-foreground">
              dans #{channelName}
            </p>
          </div>
        </div>

        {/* Aperçu du message */}
        <div className="mb-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {messagePreview}
          </p>
        </div>

        {/* Boutons d'action */}
        <div className="flex gap-2">
          <button
            onClick={handleOpenChat}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-3 rounded-lg transition-colors"
          >
            Ouvrir le chat
          </button>
          <button
            onClick={handleClose}
            className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Plus tard
          </button>
        </div>
      </div>

      {/* Barre de progression pour l'auto-fermeture */}
      <div className="h-1 bg-surface-3 rounded-b-lg overflow-hidden">
        <div 
          className="h-full bg-blue-600 transition-all duration-100 ease-linear"
          style={{ 
            width: '100%',
            animation: 'shrink 8s linear forwards'
          }}
        />
      </div>

      <style jsx>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};
