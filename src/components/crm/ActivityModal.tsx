import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Calendar, Clock, User, FileText } from 'lucide-react';

interface ActivityFormData {
  type: 'call' | 'email' | 'meeting' | 'note' | 'task';
  title: string;
  description: string;
  activity_date: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

interface ActivityModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: ActivityFormData) => Promise<void>;
  loading?: boolean;
  initialData?: Partial<ActivityFormData>;
}

export function ActivityModal({ 
  open, 
  onOpenChange, 
  onSave, 
  loading = false,
  initialData 
}: ActivityModalProps) {
  const [formData, setFormData] = useState<ActivityFormData>({
    type: 'call',
    title: '',
    description: '',
    activity_date: new Date().toISOString().slice(0, 16),
    status: 'scheduled',
    ...initialData
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    setIsSubmitting(true);
    try {
      await onSave(formData);
      // Réinitialiser le formulaire après sauvegarde
      setFormData({
        type: 'call',
        title: '',
        description: '',
        activity_date: new Date().toISOString().slice(0, 16),
        status: 'scheduled'
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      type: 'call',
      title: '',
      description: '',
      activity_date: new Date().toISOString().slice(0, 16),
      status: 'scheduled'
    });
    onOpenChange(false);
  };

  const activityIcons = {
    call: '📞',
    email: '📧',
    meeting: '🤝',
    note: '📝',
    task: '✅'
  };

  const activityLabels = {
    call: 'Appel téléphonique',
    email: 'Email',
    meeting: 'Rendez-vous',
    note: 'Note',
    task: 'Tâche'
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            {initialData ? 'Modifier l\'activité' : 'Nouvelle activité'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="activity_title">Titre de l'activité *</Label>
            <Input
              id="activity_title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Ex: Appel de suivi, Rendez-vous client..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="activity_description">Description</Label>
            <Textarea
              id="activity_description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Détails de l'activité..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="activity_type">Type d'activité</Label>
              <Select
                value={formData.type}
                onValueChange={(value: ActivityFormData['type']) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(activityLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      <span className="flex items-center gap-2">
                        <span>{activityIcons[value as keyof typeof activityIcons]}</span>
                        {label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="activity_status">Statut</Label>
              <Select
                value={formData.status}
                onValueChange={(value: ActivityFormData['status']) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scheduled">
                    <span className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Planifié
                    </span>
                  </SelectItem>
                  <SelectItem value="completed">
                    <span className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Terminé
                    </span>
                  </SelectItem>
                  <SelectItem value="cancelled">
                    <span className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Annulé
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="activity_date">Date et heure</Label>
            <Input
              id="activity_date"
              type="datetime-local"
              value={formData.activity_date}
              onChange={(e) => setFormData({ ...formData, activity_date: e.target.value })}
              required
            />
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !formData.title.trim()}
              className="bg-primary hover:bg-primary/90"
            >
              {isSubmitting ? 'Sauvegarde...' : (initialData ? 'Modifier' : 'Créer l\'activité')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
