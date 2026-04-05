import { useState } from 'react';
import { createFrenchDateTime } from '../../utils/frenchDateUtils';

// Types d'activités locaux
type ActivityType = 'call' | 'meeting' | 'email' | 'follow_up' | 'demo' | 'proposal' | 'note' | 'reminder' | 'other';
type ActivityPriority = 'low' | 'medium' | 'high';
type ActivityStatus = 'pending' | 'completed' | 'cancelled';

// Labels français pour les types d'activités
const ACTIVITY_TYPE_LABELS: Record<ActivityType, string> = {
  call: '📞 Appel téléphonique',
  meeting: '📅 Rendez-vous',
  email: '📧 Email de suivi',
  follow_up: '🔄 Relance',
  demo: '💻 Démonstration',
  proposal: '📋 Proposition',
  note: '📝 Note/Mémo',
  reminder: '⏰ Rappel',
  other: '📌 Autre'
};

// Labels français pour les priorités
const ACTIVITY_PRIORITY_LABELS: Record<ActivityPriority, string> = {
  high: '🔴 Haute',
  medium: '🟡 Moyenne',
  low: '🟢 Basse'
};

// Labels français pour les statuts
const ACTIVITY_STATUS_LABELS: Record<ActivityStatus, string> = {
  pending: '⏳ Programmé',
  completed: '✅ Terminé',
  cancelled: '❌ Annulé'
};

interface ActivityFormData {
  title: string;
  description: string | null;
  activity_date: string;
  activity_type: ActivityType;
  priority: ActivityPriority;
  status: ActivityStatus;
  assigned_to: string | null;
}

interface ActivityInitialData {
  title?: string;
  description?: string;
  activity_date?: string;
  activity_type?: ActivityType;
  priority?: ActivityPriority;
  status?: ActivityStatus;
  assigned_to?: string;
}

interface ActivityFormProps {
  onSubmit: (data: ActivityFormData) => void;
  onCancel: () => void;
  initialData?: ActivityInitialData;
  loading?: boolean;
  users?: Array<{ id: string; name: string }>;
}

export const ActivityForm: React.FC<ActivityFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  loading = false,
  users = []
}) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    activity_date: initialData?.activity_date
      ? new Date(initialData.activity_date).toISOString().split('T')[0]
      : '',
    activity_time: initialData?.activity_date
      ? new Date(initialData.activity_date).toTimeString().slice(0, 5)
      : '09:00',
    activity_type: (initialData?.activity_type || 'call') as ActivityType,
    priority: (initialData?.priority || 'medium') as ActivityPriority,
    status: (initialData?.status || 'pending') as ActivityStatus,
    assigned_to: initialData?.assigned_to || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Le titre est requis';
    }

    if (!formData.activity_date) {
      newErrors.activity_date = 'La date est requise';
    }

    if (!formData.activity_time) {
      newErrors.activity_time = 'L\'heure est requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Créer une date en heure française
    const activityDate = createFrenchDateTime(formData.activity_date, formData.activity_time);

    // Convertir en ISO string pour l'API
    const submitData = {
      title: formData.title,
      description: formData.description || null,
      activity_date: activityDate,
      activity_type: formData.activity_type,
      priority: formData.priority,
      status: formData.status,
      assigned_to: formData.assigned_to || null,
    };

    onSubmit(submitData);
  };

  const inputClassName = (hasError: boolean) => `
    w-full px-3 py-2 border rounded-md
    focus:outline-none focus:ring-2 focus:ring-primary
    bg-surface-2
    text-foreground
    placeholder-muted-foreground
    ${hasError ? 'border-red-500' : 'border-border'}
    transition-colors duration-200
  `;

  const selectClassName = `
    w-full px-3 py-2 border border-border rounded-md
    focus:outline-none focus:ring-2 focus:ring-primary
    bg-surface-2
    text-foreground
    transition-colors duration-200
  `;

  const labelClassName = "block text-sm font-medium text-muted-foreground mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Titre */}
      <div>
        <label className={labelClassName}>
          Titre de l'activité *
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="Ex: Appel de découverte avec Christophe CTRP"
          className={inputClassName(!!errors.title)}
        />
        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
      </div>

      {/* Type d'activité */}
      <div>
        <label className={labelClassName}>
          Type d'activité *
        </label>
        <select
          value={formData.activity_type}
          onChange={(e) => handleChange('activity_type', e.target.value)}
          className={selectClassName}
        >
          {Object.entries(ACTIVITY_TYPE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Date et heure */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClassName}>
            Date *
          </label>
          <input
            type="date"
            value={formData.activity_date}
            onChange={(e) => handleChange('activity_date', e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className={inputClassName(!!errors.activity_date)}
          />
          {errors.activity_date && <p className="text-red-500 text-sm mt-1">{errors.activity_date}</p>}
        </div>

        <div>
          <label className={labelClassName}>
            Heure *
          </label>
          <input
            type="time"
            value={formData.activity_time}
            onChange={(e) => handleChange('activity_time', e.target.value)}
            className={inputClassName(!!errors.activity_time)}
          />
          {errors.activity_time && <p className="text-red-500 text-sm mt-1">{errors.activity_time}</p>}
        </div>
      </div>

      {/* Priorité */}
      <div>
        <label className={labelClassName}>
          Priorité
        </label>
        <select
          value={formData.priority}
          onChange={(e) => handleChange('priority', e.target.value)}
          className={selectClassName}
        >
          {Object.entries(ACTIVITY_PRIORITY_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Statut (optionnel pour modification) */}
      {initialData && (
        <div>
          <label className={labelClassName}>
            Statut
          </label>
          <select
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value)}
            className={selectClassName}
          >
            {Object.entries(ACTIVITY_STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Assigné à (si des utilisateurs sont disponibles) */}
      {users.length > 0 && (
        <div>
          <label className={labelClassName}>
            Assigné à
          </label>
          <select
            value={formData.assigned_to}
            onChange={(e) => handleChange('assigned_to', e.target.value)}
            className={selectClassName}
          >
            <option value="">Non assigné</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Description */}
      <div>
        <label className={labelClassName}>
          Description / Notes
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Ajoutez des détails sur cette activité..."
          rows={4}
          className={`${selectClassName} resize-none`}
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-4 py-2 border border-border rounded-md text-muted-foreground bg-surface-2 hover:bg-surface-3 disabled:opacity-50 transition-colors duration-200"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50 transition-colors duration-200"
        >
          {loading ? 'Sauvegarde...' : initialData ? 'Modifier' : 'Créer l\'activité'}
        </button>
      </div>
    </form>
  );
};
