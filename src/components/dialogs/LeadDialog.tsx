import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useStore } from '@/store/useStore';
import { addActivity } from '@/services/activityService';
import { parisToUtc } from '@/utils/timezone';

const leadSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  email: z.string().email('Email invalide'),
  phone: z.string().optional(),
  company: z.string().optional(),
  source: z.enum(['website', 'social', 'referral', 'ads', 'cold_outreach'] as const),
  status: z.enum(['new', 'contacted', 'qualified', 'converted', 'lost'] as const),
  score: z.number().min(0).max(100),
  notes: z.string().optional(),
  assignedTo: z.string().optional(),
});

type LeadFormData = z.infer<typeof leadSchema>;

interface LeadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leadId?: string | null;
}

export function LeadDialog({ open, onOpenChange, leadId }: LeadDialogProps) {
  const { leads, addLead, updateLead, users } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  
  const lead = leadId ? leads.find(l => l.id === leadId) : null;
  const isEditing = !!leadId && !!lead;

  const form = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      company: '',
      source: 'website',
      status: 'new',
      score: 50,
      notes: '',
      assignedTo: 'none',
    },
  });

  useEffect(() => {
    if (lead) {
      form.reset({
        name: lead.name,
        email: lead.email,
        phone: lead.phone || '',
        company: lead.company || '',
        source: lead.source,
        status: lead.status,
        score: lead.score,
        notes: lead.notes.join('\n'),
        assignedTo: lead.assignedTo || 'none',
      });
    } else {
      form.reset({
        name: '',
        email: '',
        phone: '',
        company: '',
        source: 'website',
        status: 'new',
        score: 50,
        notes: '',
        assignedTo: 'none',
      });
    }
  }, [lead, form]);

  const onSubmit = async (data: LeadFormData) => {
    setIsLoading(true);
    
    try {
      const leadData = {
        ...data,
        notes: data.notes ? [data.notes] : [],
        assignedTo: data.assignedTo === 'none' ? undefined : data.assignedTo,
      };

      let finalLeadId: string;
      if (isEditing && leadId) {
        updateLead(leadId, leadData);
        finalLeadId = leadId;
      } else {
        const newLead = addLead(leadData);
        finalLeadId = newLead.id;
      }

      // 🔥 SYNCHRONISATION AVEC LE CALENDRIER
      if (!isEditing) {
        // Créer une activité de suivi pour les nouveaux leads
        const followUpDate = new Date();
        followUpDate.setDate(followUpDate.getDate() + 3); // Suivi dans 3 jours
        const followUpDateUtc = parisToUtc(followUpDate).toISOString();

        const priorityMap = {
          'new': 'moyenne' as const,
          'contacted': 'moyenne' as const,
          'qualified': 'haute' as const,
          'converted': 'basse' as const,
          'lost': 'basse' as const,
        };

        await addActivity({
          title: `Suivi lead: ${data.name}`,
          description: `Relancer le lead ${data.name} (${data.company || 'entreprise non spécifiée'}) - Score: ${data.score}`,
          date_utc: followUpDateUtc,
          type: 'prospect',
          priority: priorityMap[data.status],
          status: 'a_faire',
          related_id: finalLeadId,
          related_module: 'crm',
        });

        console.log('✅ Activité créée pour le lead:', finalLeadId);
      }
      
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Modifier le lead' : 'Nouveau lead'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input placeholder="Nom du prospect" {...field} />
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

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phone"
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
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Entreprise</FormLabel>
                    <FormControl>
                      <Input placeholder="Nom de l'entreprise" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="source"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Source</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Source" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="website">Site web</SelectItem>
                        <SelectItem value="social">Réseaux sociaux</SelectItem>
                        <SelectItem value="referral">Recommandation</SelectItem>
                        <SelectItem value="ads">Publicité</SelectItem>
                        <SelectItem value="cold_outreach">Prospection</SelectItem>
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
                    <FormLabel>Statut</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Statut" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="new">Nouveau</SelectItem>
                        <SelectItem value="contacted">Contacté</SelectItem>
                        <SelectItem value="qualified">Qualifié</SelectItem>
                        <SelectItem value="converted">Converti</SelectItem>
                        <SelectItem value="lost">Perdu</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="score"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Score (0-100)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        max="100" 
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="assignedTo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assigné à</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Utilisateur" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">Non assigné</SelectItem>
                        {users.filter(u => u.role === 'sales' || u.role === 'admin').map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Notes sur le prospect" {...field} />
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