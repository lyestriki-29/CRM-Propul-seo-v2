import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { useStore } from '../../store/useStore';
import { ClientStatus } from '../../types';
import { addActivity } from '../../services/activityService';
import { parisToUtc } from '../../utils/timezone';

const clientSchema = z.object({
  nom: z.string().min(1, 'Le nom est requis'),
  email: z.string().email('Email invalide'),
  telephone: z.string().min(1, 'Le téléphone est requis'),
  adresse: z.string().min(1, 'L\'adresse est requise'),
  secteur: z.string().min(1, 'Le secteur est requis'),
  statut: z.enum(['prospect', 'devis', 'signe', 'livre', 'perdu'] as const),
  ca_total: z.number().min(0, 'Montant requis'),
});

type ClientFormData = z.infer<typeof clientSchema>;

interface ClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientId?: string | null;
  statusOptions?: { value: string; label: string }[];
}

export function ClientDialog({ open, onOpenChange, clientId, statusOptions }: ClientDialogProps) {
  const { clients, addClient, updateClient } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  
  const client = clientId ? clients.find(c => c.id === clientId) : null;
  const isEditing = !!clientId && !!client;

  const form = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      nom: '',
      email: '',
      telephone: '',
      adresse: '',
      secteur: '',
      statut: 'prospect',
      ca_total: 0,
    },
  });

  useEffect(() => {
    if (client) {
      form.reset({
        nom: client.nom,
        email: client.email,
        telephone: client.telephone,
        adresse: client.adresse,
        secteur: client.secteur,
        statut: client.statut,
        ca_total: client.ca_total || 0,
      });
    } else {
      form.reset({
        nom: '',
        email: '',
        telephone: '',
        adresse: '',
        secteur: '',
        statut: 'prospect',
        ca_total: 0,
      });
    }
  }, [client, form]);

  const onSubmit = async (data: ClientFormData) => {
    setIsLoading(true);
    
    try {
      let finalClientId: string;
      if (isEditing && clientId) {
        updateClient(clientId, {
          ...data,
          dernier_contact: new Date().toISOString(),
        });
        finalClientId = clientId;
      } else {
        addClient({
          ...data,
          ca_total: 0,
          date_creation: new Date().toISOString(),
          dernier_contact: new Date().toISOString(),
          projets: [],
          notes: [],
          documents: [],
        });
      }

      // Synchronisation avec le calendrier : créer une activité de suivi pour les prospects
      if (data.statut === 'prospect' && isEditing && clientId) {
        // Créer une activité de suivi dans 7 jours
        const followUpDate = new Date();
        followUpDate.setDate(followUpDate.getDate() + 7);
        const followUpDateUtc = parisToUtc(followUpDate).toISOString();

        await addActivity({
          title: `Suivi prospect: ${data.nom}`,
          description: `Relancer le prospect ${data.nom} (${data.secteur})`,
          date_utc: followUpDateUtc,
          type: 'prospect',
          priority: 'moyenne',
          status: 'a_faire',
          related_id: clientId,
          related_module: 'crm',
        });
      }
      
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Modifier le client' : 'Nouveau client'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input placeholder="Nom du client" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="email@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="telephone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Téléphone</FormLabel>
                  <FormControl>
                    <Input placeholder="01 23 45 67 89" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="adresse"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adresse</FormLabel>
                  <FormControl>
                    <Input placeholder="Adresse complète" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="secteur"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Secteur d'activité</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Restauration" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="statut"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Statut</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un statut" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {(statusOptions || [
                        { value: 'prospect', label: 'Prospect' },
                        { value: 'devis', label: 'Devis' },
                        { value: 'signe', label: 'Signé' },
                        { value: 'livre', label: 'Livré' },
                        { value: 'perdu', label: 'Perdu' }
                      ]).map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ca_total"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Montant du service (€)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      step={1}
                      placeholder="Montant en euros"
                      value={field.value}
                      onChange={e => field.onChange(e.target.value === '' ? '' : Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Sauvegarde...' : isEditing ? 'Modifier' : 'Créer'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}