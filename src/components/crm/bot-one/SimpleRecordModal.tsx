import React, { useState, useEffect } from 'react';
import { 
  Save, 
  X, 
  Tag, 
  Calendar,
  User,
  Mail,
  Phone,
  Globe,
  Building2
} from 'lucide-react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '../../ui/dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../../ui/select';
import { Badge } from '../../ui/badge';
import { 
  CRMBotOneRecord, 
  CRMBotOneRecordForm 
} from '../../../types/crmBotOne';
import { formatDate } from '../../../lib/utils';

interface SimpleRecordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  record: CRMBotOneRecord | null;
  onSave: (record: CRMBotOneRecordForm) => Promise<void>;
  mode: 'create' | 'edit' | 'view';
}

export function SimpleRecordModal({
  open,
  onOpenChange,
  record,
  onSave,
  mode
}: SimpleRecordModalProps) {
  const [formData, setFormData] = useState<CRMBotOneRecordForm>({
    data: {},
    status: 'prospect',
    tags: []
  });
  const [newTag, setNewTag] = useState('');
  const [loading, setLoading] = useState(false);

  // Champs fixes pour le CRM Bot One
  const fields = [
    { key: 'Nom entreprise', label: 'Nom entreprise', type: 'text', required: true, icon: Building2 },
    { key: 'Nom contact', label: 'Nom contact', type: 'text', required: true, icon: User },
    { key: 'Email', label: 'Email', type: 'email', required: true, icon: Mail },
    { key: 'Telephone', label: 'Téléphone', type: 'text', required: false, icon: Phone },
    { key: 'Site web', label: 'Site web', type: 'url', required: false, icon: Globe },
    { key: 'Type contact', label: 'Type de contact', type: 'select', required: true, icon: User, options: ['particulier', 'entreprise', 'agence digital', 'autre'] },
    { key: 'Statut', label: 'Statut', type: 'select', required: true, icon: Tag, options: ['prospect', 'en discussion', 'Demo planifié', 'abonné', 'perdu'] }
  ];

  // Initialiser le formulaire
  useEffect(() => {
    if (record && mode !== 'create') {
      setFormData({
        data: record.data || {},
        status: record.status || 'prospect',
        tags: record.tags || []
      });
    } else {
      setFormData({
        data: {
          'Nom entreprise': '',
          'Nom contact': '',
          'Email': '',
          'Telephone': '',
          'Site web': '',
          'Type contact': 'entreprise',
          'Statut': 'prospect'
        },
        status: 'prospect',
        tags: []
      });
    }
  }, [record, mode]);

  const handleFieldChange = (fieldKey: string, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      data: {
        ...prev.data,
        [fieldKey]: value
      }
    }));
  };

  const handleStatusChange = (status: string) => {
    setFormData(prev => ({
      ...prev,
      status
    }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags?.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await onSave(formData);
      onOpenChange(false);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderField = (field: { key: string; label: string; type: string; icon: React.ComponentType<{ className?: string }>; required?: boolean; options?: { value: string; label: string }[] }) => {
    const value = formData.data[field.key] || '';
    const isReadOnly = mode === 'view';
    const Icon = field.icon;

    switch (field.type) {
      case 'text':
      case 'email':
      case 'url':
        return (
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Icon className="h-4 w-4" />
              {field.label}
              {field.required && <span className="text-red-500">*</span>}
            </Label>
            <Input
              type={field.type === 'email' ? 'email' : 'text'}
              value={value}
              onChange={(e) => handleFieldChange(field.key, e.target.value)}
              placeholder={`Saisir ${field.label.toLowerCase()}`}
              disabled={isReadOnly}
              required={field.required}
            />
          </div>
        );

      case 'select':
        return (
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Icon className="h-4 w-4" />
              {field.label}
              {field.required && <span className="text-red-500">*</span>}
            </Label>
            <Select
              value={value}
              onValueChange={(newValue) => handleFieldChange(field.key, newValue)}
              disabled={isReadOnly}
            >
              <SelectTrigger>
                <SelectValue placeholder={`Sélectionner ${field.label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                {field.options.map((option: string) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {mode === 'create' && 'Créer un nouveau lead'}
            {mode === 'edit' && 'Modifier le lead'}
            {mode === 'view' && 'Détails du lead'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Champs du formulaire */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map(field => (
              <div key={field.key}>
                {renderField(field)}
              </div>
            ))}
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Tags
            </Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tags?.map(tag => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  {mode !== 'view' && (
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:text-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </Badge>
              ))}
            </div>
            {mode !== 'view' && (
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Ajouter un tag"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                />
                <Button onClick={handleAddTag} size="sm">
                  Ajouter
                </Button>
              </div>
            )}
          </div>

          {/* Informations de création/modification */}
          {record && (
            <div className="text-sm text-muted-foreground space-y-1">
              <p>Créé le: {formatDate(record.created_at)}</p>
              <p>Modifié le: {formatDate(record.updated_at)}</p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4 mr-2" />
            {mode === 'view' ? 'Fermer' : 'Annuler'}
          </Button>
          {mode !== 'view' && (
            <Button
              onClick={handleSave}
              disabled={loading}
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Sauvegarde...' : 'Sauvegarder'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
