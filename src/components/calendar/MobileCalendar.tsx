import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  MoreVertical,
  Trash2,
  Edit,
  Share,
  Bell,
  Wifi,
  WifiOff,
  RefreshCw,
  Swipe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';

// =====================================================
// COMPOSANT CALENDRIER MOBILE - OPTIMISÉ POUR MOBILE
// =====================================================

// Type pour les événements du calendrier
interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start_date: string;
  end_date: string;
  type: 'task' | 'lead' | 'meeting' | 'other';
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
}

interface MobileCalendarProps {
  events?: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
  onEventUpdate?: (event: CalendarEvent) => void;
  onEventDelete?: (eventId: string) => void;
  onWeekChange?: (weekStart: Date) => void;
}

interface TouchState {
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  isSwiping: boolean;
}

export function MobileCalendar({ 
  events = [], 
  onEventClick, 
  onEventUpdate, 
  onEventDelete,
  onWeekChange 
}: MobileCalendarProps) {
  // États locaux
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [touchState, setTouchState] = useState<TouchState>({
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    isSwiping: false
  });

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<HTMLDivElement>(null);

  // =====================================================
  // GESTION DU SWIPE ET TOUCH EVENTS
  // =====================================================

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchState({
      startX: touch.clientX,
      startY: touch.clientY,
      currentX: touch.clientX,
      currentY: touch.clientY,
      isSwiping: false
    });
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    const deltaX = touch.clientX - touchState.startX;
    const deltaY = touch.clientY - touchState.startY;

    // Détecter si c'est un swipe horizontal
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      e.preventDefault();
      setTouchState(prev => ({
        ...prev,
        currentX: touch.clientX,
        currentY: touch.clientY,
        isSwiping: true
      }));
    }
  }, [touchState.startX, touchState.startY]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const deltaX = touchState.currentX - touchState.startX;
    const deltaY = touchState.currentY - touchState.startY;

    // Swipe horizontal pour changer de semaine
    if (Math.abs(deltaX) > 100 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 0) {
        goToPreviousWeek();
      } else {
        goToNextWeek();
      }
    }

    // Pull to refresh
    if (deltaY > 100 && touchState.startY < 100) {
      handlePullToRefresh();
    }

    setTouchState({
      startX: 0,
      startY: 0,
      currentX: 0,
      currentY: 0,
      isSwiping: false
    });
  }, [touchState]);

  // =====================================================
  // NAVIGATION ET GESTES
  // =====================================================

  const goToPreviousWeek = useCallback(() => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(newWeek.getDate() - 7);
    setCurrentWeek(newWeek);
    onWeekChange?.(newWeek);
    toast.success('Semaine précédente');
  }, [currentWeek, onWeekChange]);

  const goToNextWeek = useCallback(() => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(newWeek.getDate() + 7);
    setCurrentWeek(newWeek);
    onWeekChange?.(newWeek);
    toast.success('Semaine suivante');
  }, [currentWeek, onWeekChange]);

  const goToToday = useCallback(() => {
    const today = new Date();
    setCurrentWeek(today);
    onWeekChange?.(today);
    toast.success('Aujourd\'hui');
  }, [onWeekChange]);

  const handlePullToRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      // Simulation de synchronisation
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Synchronisation terminée');
    } catch (error) {
      toast.error('Erreur de synchronisation');
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  // =====================================================
  // GESTION OFFLINE
  // =====================================================

  useEffect(() => {
    const handleOnlineStatus = () => {
      setIsOffline(!navigator.onLine);
    };

    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);
    setIsOffline(!navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);

  // =====================================================
  // GESTION DES ÉVÉNEMENTS
  // =====================================================

  const handleEventClick = useCallback((event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsBottomSheetOpen(true);
    onEventClick?.(event);
  }, [onEventClick]);

  const handleSwipeToComplete = useCallback((event: CalendarEvent) => {
    const updatedEvent: CalendarEvent = { ...event, status: 'completed' };
    onEventUpdate?.(updatedEvent);
    toast.success('Événement marqué comme terminé');
  }, [onEventUpdate]);

  const handleDeleteEvent = useCallback((eventId: string) => {
    onEventDelete?.(eventId);
    setIsBottomSheetOpen(false);
    toast.success('Événement supprimé');
  }, [onEventDelete]);

  // =====================================================
  // NOTIFICATIONS PUSH
  // =====================================================

  const requestNotificationPermission = useCallback(async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        toast.success('Notifications activées');
      } else {
        toast.error('Notifications refusées');
      }
    }
  }, []);

  const scheduleNotification = useCallback((event: CalendarEvent) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Rappel événement', {
        body: `${event.title} dans 15 minutes`,
        icon: '/icon.png',
        tag: event.id
      });
    }
  }, []);

  // =====================================================
  // UTILITAIRES
  // =====================================================

  const getWeekDays = useCallback(() => {
    const days = [];
    const startOfWeek = new Date(currentWeek);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1);

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(day.getDate() + i);
      days.push(day);
    }
    return days;
  }, [currentWeek]);

  const getEventsForDay = useCallback((date: Date) => {
    const dayKey = date.toISOString().split('T')[0];
    return events.filter(event => {
      const eventDate = new Date(event.start_date).toISOString().split('T')[0];
      return eventDate === dayKey;
    });
  }, [events]);

  const formatTime = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }, []);

  const isToday = useCallback((date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }, []);

  const weekDays = getWeekDays();

  return (
    <div className="h-screen flex flex-col bg-surface-1">
      {/* Header avec navigation */}
      <div className="bg-surface-2 shadow-sm border-b">
        <div className="flex items-center justify-between p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={goToPreviousWeek}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-primary" />
            <div className="text-center">
              <div className="font-semibold">
                {currentWeek.toLocaleDateString('fr-FR', { 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </div>
              <div className="text-sm text-muted-foreground">
                Semaine {Math.ceil(currentWeek.getDate() / 7)}
              </div>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={goToNextWeek}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        {/* Indicateur offline */}
        {isOffline && (
          <div className="bg-yellow-100 border-b border-yellow-300 px-4 py-2">
            <div className="flex items-center space-x-2 text-sm">
              <WifiOff className="h-4 w-4 text-yellow-600" />
              <span className="text-yellow-800">Mode hors ligne</span>
            </div>
          </div>
        )}
      </div>

      {/* Contenu principal avec swipe */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Pull to refresh indicator */}
        {isRefreshing && (
          <div className="flex items-center justify-center py-4 bg-blue-50">
            <RefreshCw className="h-5 w-5 animate-spin text-blue-600 mr-2" />
            <span className="text-sm text-blue-600">Synchronisation...</span>
          </div>
        )}

        {/* Vue liste des événements */}
        <div className="p-4 space-y-4">
          {weekDays.map((day, dayIndex) => {
            const dayEvents = getEventsForDay(day);
            
            return (
              <div key={day.toISOString()} className="space-y-2">
                {/* En-tête du jour */}
                <div className={`flex items-center space-x-3 ${
                  isToday(day) ? 'bg-blue-50 rounded-lg p-2' : ''
                }`}>
                  <div className="text-center min-w-[40px]">
                    <div className={`text-sm font-medium ${
                      isToday(day) ? 'text-primary' : 'text-foreground'
                    }`}>
                      {day.toLocaleDateString('fr-FR', { weekday: 'short' })}
                    </div>
                    <div className={`text-lg font-bold ${
                      isToday(day) ? 'text-primary' : 'text-foreground'
                    }`}>
                      {day.getDate()}
                    </div>
                  </div>

                  {dayEvents.length > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {dayEvents.length} événement{dayEvents.length > 1 ? 's' : ''}
                    </Badge>
                  )}
                </div>

                {/* Liste des événements */}
                <div className="space-y-2">
                  {dayEvents.map((event, eventIndex) => (
                    <Card
                      key={event.id}
                      className="cursor-pointer transition-all hover:shadow-md"
                      onClick={() => handleEventClick(event)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            <div className={`w-3 h-3 rounded-full ${
                              event.type === 'task' ? 'bg-blue-500' :
                              event.type === 'lead' ? 'bg-green-500' :
                              event.type === 'meeting' ? 'bg-purple-500' :
                              'bg-surface-3'
                            }`} />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-sm truncate">
                                {event.title}
                              </h4>
                              <div className="flex items-center space-x-1">
                                {event.status === 'completed' && (
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                )}
                                {event.priority === 'high' && (
                                  <AlertCircle className="h-4 w-4 text-red-500" />
                                )}
                              </div>
                            </div>

                            {event.description && (
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                {event.description}
                              </p>
                            )}

                            <div className="flex items-center space-x-2 mt-2">
                              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                <span>{formatTime(event.start_date)}</span>
                              </div>

                              <Badge 
                                variant="outline" 
                                className="text-xs"
                              >
                                {event.type}
                              </Badge>

                              <Badge 
                                variant="outline" 
                                className={`text-xs ${
                                  event.priority === 'high' ? 'text-red-600 border-red-300' :
                                  event.priority === 'medium' ? 'text-yellow-600 border-yellow-300' :
                                  'text-muted-foreground border-border'
                                }`}
                              >
                                {event.priority}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {dayEvents.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Aucun événement</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* FAB pour actions rapides */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          size="lg"
          className="h-14 w-14 rounded-full shadow-lg"
          onClick={() => setIsQuickActionOpen(true)}
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>

      {/* Bottom Sheet pour détails événement */}
      <Sheet open={isBottomSheetOpen} onOpenChange={setIsBottomSheetOpen}>
        <SheetContent side="bottom" className="h-[80vh]">
          <SheetHeader>
            <SheetTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Détails de l'événement</span>
            </SheetTitle>
          </SheetHeader>

          {selectedEvent && (
            <div className="mt-6 space-y-4">
              <div>
                <h3 className="text-lg font-semibold">{selectedEvent.title}</h3>
                {selectedEvent.description && (
                  <p className="text-muted-foreground mt-2">{selectedEvent.description}</p>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {formatTime(selectedEvent.start_date)} - {formatTime(selectedEvent.end_date)}
                  </span>
                </div>

                <div className="flex items-center space-x-3">
                  <Badge variant="outline">{selectedEvent.type}</Badge>
                  <Badge variant="outline">{selectedEvent.priority}</Badge>
                  <Badge variant="outline">{selectedEvent.status}</Badge>
                </div>
              </div>

              <div className="flex space-x-2 pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSwipeToComplete(selectedEvent)}
                  disabled={selectedEvent.status === 'completed'}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Marquer terminé
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => scheduleNotification(selectedEvent)}
                >
                  <Bell className="h-4 w-4 mr-2" />
                  Rappel
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                >
                  <Share className="h-4 w-4 mr-2" />
                  Partager
                </Button>
              </div>

              <div className="flex space-x-2 pt-4 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier
                </Button>

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteEvent(selectedEvent.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Modal actions rapides */}
      <Dialog open={isQuickActionOpen} onOpenChange={setIsQuickActionOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Actions rapides</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-2"
            >
              <Calendar className="h-6 w-6" />
              <span className="text-sm">Nouvelle tâche</span>
            </Button>

            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-2"
            >
              <Calendar className="h-6 w-6" />
              <span className="text-sm">Nouveau lead</span>
            </Button>

            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-2"
            >
              <Calendar className="h-6 w-6" />
              <span className="text-sm">Réunion</span>
            </Button>

            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-2"
              onClick={requestNotificationPermission}
            >
              <Bell className="h-6 w-6" />
              <span className="text-sm">Notifications</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 