import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Plus, Filter, RefreshCw, BarChart3 } from 'lucide-react';
import { 
  CalendarEvent, 
  CalendarEventType, 
  CalendarPriority, 
  CalendarStatus,
  CALENDAR_LABELS,
  CALENDAR_COLORS
} from '@/types/calendar';

interface SimpleCalendarProps {
  events?: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
  onAddEvent?: () => void;
  onRefresh?: () => void;
}

export function SimpleCalendar({ 
  events = [], 
  onEventClick, 
  onAddEvent, 
  onRefresh 
}: SimpleCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [filterType, setFilterType] = useState<CalendarEventType | 'all'>('all');
  const [filterPriority, setFilterPriority] = useState<CalendarPriority | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<CalendarStatus | 'all'>('all');

  // Générer les jours du mois
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const firstDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Ajouter les jours vides du début
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }
    
    // Ajouter tous les jours du mois
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  // Filtrer les événements
  const filteredEvents = events.filter(event => {
    if (filterType !== 'all' && event.type !== filterType) return false;
    if (filterPriority !== 'all' && event.priority !== filterPriority) return false;
    if (filterStatus !== 'all' && event.status !== filterStatus) return false;
    return true;
  });

  // Obtenir les événements pour une date donnée
  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return filteredEvents.filter(event => {
      const eventDate = new Date(event.start_date).toISOString().split('T')[0];
      return eventDate === dateStr;
    });
  };

  // Navigation
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  // Formater la date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  // Obtenir la couleur d'un événement
  const getEventColor = (event: CalendarEvent) => {
    return CALENDAR_COLORS[event.type]?.[event.priority] || event.color;
  };

  // Obtenir le label d'un statut
  const getStatusLabel = (status: CalendarStatus) => {
    return CALENDAR_LABELS.statuses[status];
  };

  // Obtenir le label d'un type
  const getTypeLabel = (type: CalendarEventType) => {
    return CALENDAR_LABELS.types[type];
  };

  const days = getDaysInMonth(currentDate);

  return (
    <div className="space-y-6">
      {/* En-tête du calendrier */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Calendar className="h-6 w-6 text-violet-600" />
              <div>
                <CardTitle className="text-xl">{formatDate(currentDate)}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {filteredEvents.length} événement(s)
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={goToPreviousMonth}
              >
                ‹
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={goToToday}
              >
                Aujourd'hui
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={goToNextMonth}
              >
                ›
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Filtres */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Filter className="h-4 w-4 text-muted-foreground" />
              
              {/* Filtre par type */}
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as CalendarEventType | 'all')}
                className="border border-border rounded-md px-3 py-1 text-sm"
              >
                <option value="all">Tous les types</option>
                <option value="task">Tâches</option>
                <option value="lead">Leads</option>
                <option value="project">Projets</option>
                <option value="meeting">Réunions</option>
                <option value="reminder">Rappels</option>
              </select>

              {/* Filtre par priorité */}
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value as CalendarPriority | 'all')}
                className="border border-border rounded-md px-3 py-1 text-sm"
              >
                <option value="all">Toutes les priorités</option>
                <option value="high">Haute</option>
                <option value="medium">Moyenne</option>
                <option value="low">Basse</option>
              </select>

              {/* Filtre par statut */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as CalendarStatus | 'all')}
                className="border border-border rounded-md px-3 py-1 text-sm"
              >
                <option value="all">Tous les statuts</option>
                <option value="pending">En attente</option>
                <option value="in_progress">En cours</option>
                <option value="completed">Terminé</option>
                <option value="cancelled">Annulé</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onAddEvent}
              >
                <Plus className="h-4 w-4" />
                Ajouter
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grille du calendrier */}
      <Card>
        <CardContent className="pt-6">
          {/* En-têtes des jours */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map(day => (
              <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Grille des jours */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              const isToday = day && day.toDateString() === new Date().toDateString();
              const isSelected = selectedDate && day && day.toDateString() === selectedDate.toDateString();
              const dayEvents = day ? getEventsForDate(day) : [];

              return (
                <div
                  key={index}
                  className={`
                    min-h-[120px] p-2 border border-border rounded-lg cursor-pointer
                    hover:bg-surface-3 transition-colors
                    ${isToday ? 'bg-violet-50 border-violet-300' : ''}
                    ${isSelected ? 'bg-blue-50 border-blue-300' : ''}
                    ${!day ? 'bg-surface-2' : ''}
                  `}
                  onClick={() => day && setSelectedDate(day)}
                >
                  {day && (
                    <>
                      <div className="text-sm font-medium mb-2">
                        {day.getDate()}
                        {isToday && (
                          <Badge variant="secondary" className="ml-1 text-xs">
                            Aujourd'hui
                          </Badge>
                        )}
                      </div>
                      
                      <div className="space-y-1">
                        {dayEvents.slice(0, 3).map(event => (
                          <div
                            key={event.id}
                            className="text-xs p-1 rounded cursor-pointer"
                            style={{ backgroundColor: getEventColor(event) + '20' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              onEventClick?.(event);
                            }}
                          >
                            <div className="font-medium truncate" style={{ color: getEventColor(event) }}>
                              {event.title}
                            </div>
                            <div className="flex items-center space-x-1 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {getTypeLabel(event.type)}
                              </Badge>
                              <Badge 
                                variant="outline" 
                                className="text-xs"
                                style={{ 
                                  backgroundColor: getEventColor(event) + '20',
                                  color: getEventColor(event)
                                }}
                              >
                                {getStatusLabel(event.status)}
                              </Badge>
                            </div>
                          </div>
                        ))}
                        
                        {dayEvents.length > 3 && (
                          <div className="text-xs text-muted-foreground text-center">
                            +{dayEvents.length - 3} autres
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Événements du jour sélectionné */}
      {selectedDate && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Événements du {selectedDate.toLocaleDateString('fr-FR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {getEventsForDate(selectedDate).length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                Aucun événement pour cette date
              </p>
            ) : (
              <div className="space-y-3">
                {getEventsForDate(selectedDate).map(event => (
                  <div
                    key={event.id}
                    className="p-3 border rounded-lg cursor-pointer hover:bg-surface-3"
                    onClick={() => onEventClick?.(event)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">{event.title}</h4>
                        {event.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {event.description}
                          </p>
                        )}
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {getTypeLabel(event.type)}
                          </Badge>
                          <Badge 
                            variant="outline" 
                            className="text-xs"
                            style={{ 
                              backgroundColor: getEventColor(event) + '20',
                              color: getEventColor(event)
                            }}
                          >
                            {getStatusLabel(event.status)}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(event.start_date).toLocaleTimeString('fr-FR', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                        </div>
                      </div>
                      <div 
                        className="w-3 h-3 rounded-full ml-2"
                        style={{ backgroundColor: getEventColor(event) }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
} 