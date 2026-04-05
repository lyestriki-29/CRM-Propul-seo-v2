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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useStore } from '@/store/useStore';
import { QuoteStatus } from '@/types';
import { addDays } from 'date-fns';

const quoteSchema = z.object({
  clientId: z.string().min(1, 'Client requis'),
  title: z.string().min(1, 'Titre requis'),
  status: z.enum(['draft', 'sent', 'viewed', 'signed', 'rejected'] as const),
  validUntil: z.string().min(1, 'Date de validité requise'),
});

type QuoteFormData = z.infer<typeof quoteSchema>;

interface QuoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quoteId?: string | null;
}

export function QuoteDialog({ open, onOpenChange, quoteId }: QuoteDialogProps) {
  const { quotes, addQuote, updateQuote, clients } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  
  const quote = quoteId ? quotes.find(q => q.id === quoteId) : null;
  const isEditing = !!quoteId && !!quote;

  const form = useForm<QuoteFormData>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      clientId: '',
      title: '',
      status: 'draft',
      validUntil: addDays(new Date(), 30).toISOString().split('T')[0],
    },
  });

  useEffect(() => {
    if (quote) {
      form.reset({
        clientId: quote.clientId,
        title: quote.title,
        status: quote.status,
        validUntil: quote.validUntil.split('T')[0],
      });
    } else {
      form.reset({
        clientId: '',
        title: '',
        status: 'draft',
        validUntil: addDays(new Date(), 30).toISOString().split('T')[0],
      });
    }
  }, [quote, form]);

  const onSubmit = async (data: QuoteFormData) => {
    setIsLoading(true);
    
    try {
      const quoteData = {
        ...data,
        validUntil: new Date(data.validUntil).toISOString(),
        items: quote?.items || [
          {
            id: '1',
            description: 'Prestation de service',
            quantity: 1,
            unitPrice: 1000,
            total: 1000,
          }
        ],
        subtotal: quote?.subtotal || 1000,
        tax: quote?.tax || 200,
        total: quote?.total || 1200,
      };

      if (isEditing && quoteId) {
        updateQuote(quoteId, quoteData);
      } else {
        addQuote(quoteData);
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
            {isEditing ? 'Modifier le devis' : 'Nouveau devis'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="clientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un client" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.nom}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titre du devis</FormLabel>
                  <FormControl>
                    <Input placeholder="Titre du devis" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
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
                        <SelectItem value="draft">Brouillon</SelectItem>
                        <SelectItem value="sent">Envoyé</SelectItem>
                        <SelectItem value="viewed">Consulté</SelectItem>
                        <SelectItem value="signed">Signé</SelectItem>
                        <SelectItem value="rejected">Refusé</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="validUntil"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valide jusqu'au</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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