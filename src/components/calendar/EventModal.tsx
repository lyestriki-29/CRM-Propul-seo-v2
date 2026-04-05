import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CalendarEvent, CalendarEventType, CalendarPriority, CalendarStatus } from '@/types/calendar';
import { useCalendarTheme } from '@/hooks/useCalendarTheme';
import { Calendar, Clock, AlertTriangle, Trash2, Save, CheckCircle, Loader2 } from 'lucide-react';

// Schéma de validation
const eventSchema = z.object({
  title: z.string().min(1, 'Le titre est requis'),
  description: z.string().optional(),
  start_date: z.string().min(1, 'Date de début requise'),
  end_date: z.string().min(1, 'Date de fin requise'),
  type: z.enum(['task', 'lead', 'project', 'meeting', 'reminder'] as const),
  priority: z.enum(['high', 'medium', 'low'] as const),
  status: z.enum(['pending', 'in_progress', 'completed', 'cancelled'] as const),
  all_day: z.boolean().default(false),
  location: z.string().optional(),
});

type EventFormData = z.infer<typeof eventSchema>;

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event?: CalendarEvent | null;
  onSave: (data: EventFormData) => Promise<void>;
  onDelete?: (eventId: string) => Promise<void>;
}

export function EventModal({ 
  isOpen, 
  onClose, 
  event, 
  onSave, 
  onDelete 
}: EventModalProps) {
  const theme = useCalendarTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const form = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: '',
      description: '',
      start_date: '',
      end_date: '',
      type: 'meeting',
      priority: 'medium',
      status: 'pending',
      all_day: false,
      location: '',
    },
  });

  // Initialiser le formulaire avec les données de l'événement
  useEffect(() => {
    if (event) {
      form.reset({
        title: event.title,
        description: event.description || '',
        start_date: new Date(event.start_date).toISOString().slice(0, 16),
        end_date: new Date(event.end_date).toISOString().slice(0, 16),
        type: event.type,
        priority: event.priority,
        status: event.status,
        all_day: event.all_day,
        location: event.location || '',
      });
    } else {
      // Valeurs par défaut pour un nouvel événement
      const now = new Date();
      const endTime = new Date(now.getTime() + 60 * 60 * 1000); // +1 heure
      
      form.reset({
        title: '',
        description: '',
        start_date: now.toISOString().slice(0, 16),
        end_date: endTime.toISOString().slice(0, 16),
        type: 'meeting',
        priority: 'medium',
        status: 'pending',
        all_day: false,
        location: '',
      });
    }
  }, [event, form]);

  // Gérer la soumission du formulaire
  const onSubmit = async (data: EventFormData) => {
    try {
      setIsSubmitting(true);
      
      // Convertir les dates en format ISO
      const startDate = new Date(data.start_date);
      const endDate = new Date(data.end_date);
      
      if (data.all_day) {
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
      }
      
      await onSave({
        ...data,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
      });
      
      onClose();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Gérer la suppression
  const handleDelete = async () => {
    if (!event || !onDelete) return;
    
    try {
      setIsDeleting(true);
      await onDelete(event.id);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Gérer le changement de type d'événement
  const handleTypeChange = (type: CalendarEventType) => {
    form.setValue('type', type);
    
    // Ajuster automatiquement les valeurs par défaut selon le type
    if (type === 'task') {
      form.setValue('status', 'pending');
      form.setValue('priority', 'medium');
    } else if (type === 'lead') {
      form.setValue('status', 'pending');
      form.setValue('priority', 'medium');
    } else if (type === 'project') {
      form.setValue('status', 'in_progress');
      form.setValue('priority', 'high');
    } else if (type === 'meeting') {
      form.setValue('status', 'pending');
      form.setValue('priority', 'medium');
    }
  };

  // Gérer le changement de date de début
  const handleStartDateChange = (date: string) => {
    form.setValue('start_date', date);
    
    // Ajuster automatiquement la date de fin si elle est antérieure
    const startDate = new Date(date);
    const endDate = new Date(form.getValues('end_date'));
    
    if (endDate <= startDate) {
      const newEndDate = new Date(startDate.getTime() + 60 * 60 * 1000); // +1 heure
      form.setValue('end_date', newEndDate.toISOString().slice(0, 16));
    }
  };

  const isEditing = !!event;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>{isEditing ? 'Modifier l\'événement' : 'Nouvel événement'}</span>
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Titre */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titre *</FormLabel>
                  <FormControl>
                    <Input placeholder="Titre de l'événement" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Type d'événement */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type *</FormLabel>
                  <Select onValueChange={handleTypeChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="task">
                        <span className="flex items-center space-x-2">
                          <span>📋</span>
                          <span>Tâche</span>
                        </span>
                      </SelectItem>
                      <SelectItem value="lead">
                        <span className="flex items-center space-x-2">
                          <span>👤</span>
                          <span>Lead</span>
                        </span>
                      </SelectItem>
                      <SelectItem value="project">
                        <span className="flex items-center space-x-2">
                          <span>📁</span>
                          <span>Projet</span>
                        </span>
                      </SelectItem>
                      <SelectItem value="meeting">
                        <span className="flex items-center space-x-2">
                          <span>🤝</span>
                          <span>Réunion</span>
                        </span>
                      </SelectItem>
                      <SelectItem value="reminder">
                        <span className="flex items-center space-x-2">
                          <span>⏰</span>
                          <span>Rappel</span>
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Dates et heures */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Début *</FormLabel>
                    <FormControl>
                      <Input
                        type="datetime-local"
                        {...field}
                        onChange={(e) => handleStartDateChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="end_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fin *</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Toute la journée */}
            <FormField
              control={form.control}
              name="all_day"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Toute la journée</FormLabel>
                    <FormDescription>
                      L'événement dure toute la journée
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            {/* Priorité et statut */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priorité *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une priorité" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">
                          <span className="flex items-center space-x-2">
                            <span className="w-3 h-3 rounded-full bg-muted-foreground"></span>
                            <span>Basse</span>
                          </span>
                        </SelectItem>
                        <SelectItem value="medium">
                          <span className="flex items-center space-x-2">
                            <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
                            <span>Moyenne</span>
                          </span>
                        </SelectItem>
                        <SelectItem value="high">
                          <span className="flex items-center space-x-2">
                            <span className="w-3 h-3 rounded-full bg-red-500"></span>
                            <span>Haute</span>
                          </span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Statut *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un statut" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pending">
                          <span className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-orange-500" />
                            <span>En attente</span>
                          </span>
                        </SelectItem>
                        <SelectItem value="in_progress">
                          <span className="flex items-center space-x-2">
                            <AlertTriangle className="h-4 w-4 text-blue-500" />
                            <span>En cours</span>
                          </span>
                        </SelectItem>
                        <SelectItem value="completed">
                          <span className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>Terminé</span>
                          </span>
                        </SelectItem>
                        <SelectItem value="cancelled">
                          <span className="flex items-center space-x-2">
                            <span className="h-4 w-4 text-red-500">✕</span>
                            <span>Annulé</span>
                          </span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Localisation */}
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Localisation</FormLabel>
                  <FormControl>
                    <Input placeholder="Lieu de l'événement" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Description de l'événement"
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Actions */}
            <DialogFooter className="flex justify-between">
              <div className="flex space-x-2">
                {isEditing && onDelete && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4 mr-2" />
                    )}
                    Supprimer
                  </Button>
                )}
              </div>
              
              <div className="flex space-x-2">
                <Button type="button" variant="outline" onClick={onClose}>
                  Annuler
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  {isEditing ? 'Modifier' : 'Créer'}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 