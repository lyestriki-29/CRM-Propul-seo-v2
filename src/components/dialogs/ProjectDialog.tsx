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
import { Textarea } from '../ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { useStore } from '../../store/useStore';
import { addActivity } from '../../services/activityService';
import { parisToUtc } from '../../utils/timezone';
import { ProjectBudgetInput } from '../projects/ProjectBudgetInput';
import { Euro } from 'lucide-react';

const projectSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  description: z.string().optional(),
  clientId: z.string().min(1, 'Client requis'),
  status: z.enum(['planning', 'in_progress', 'review', 'completed', 'on_hold'] as const),
  priority: z.enum(['low', 'medium', 'high', 'urgent'] as const),
  assignedTo: z.string().min(1, 'Assignation requise'),
  startDate: z.string().min(1, 'Date de début requise'),
  endDate: z.string().optional(),
  budget: z.number().optional(),
  progress: z.number().min(0).max(100).optional(),
});

type ProjectFormData = z.infer<typeof projectSchema>;

interface ProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedProject?: string | null;
  initialData?: Partial<ProjectFormData>;
  onSubmit?: (data: ProjectFormData) => Promise<void>;
}

export function ProjectDialog({ open, onOpenChange, selectedProject, initialData, onSubmit }: ProjectDialogProps) {
  const { users, clients, projects, addProject, updateProject } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  
  const project = selectedProject ? projects.find(p => p.id === selectedProject) : null;
  const isEditing = !!selectedProject && !!project;

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: '',
      description: '',
      clientId: '',
      status: 'planning',
      priority: 'medium',
      assignedTo: '',
      startDate: '',
      endDate: '',
      budget: undefined,
      progress: 0,
      ...initialData,
    },
  });

  useEffect(() => {
    if (project) {
      form.reset({
        name: project.name,
        description: project.description || '',
        clientId: project.clientId,
        status: project.status as any,
        priority: project.priority as any,
        assignedTo: project.assignedTo,
        startDate: project.startDate,
        endDate: project.endDate || '',
        budget: project.budget,
        progress: project.progress,
      });
    } else if (initialData) {
      form.reset({
        name: '',
        description: '',
        clientId: '',
        status: 'planning',
        priority: 'medium',
        assignedTo: '',
        startDate: '',
        endDate: '',
        budget: undefined,
        progress: 0,
        ...initialData,
      });
    } else {
      form.reset({
        name: '',
        description: '',
        clientId: '',
        status: 'planning',
        priority: 'medium',
        assignedTo: '',
        startDate: '',
        endDate: '',
        budget: undefined,
        progress: 0,
      });
    }
  }, [project, initialData, form]);

  const handleSubmit = async (data: ProjectFormData) => {
    setIsLoading(true);
    try {
      if (onSubmit) {
        await onSubmit(data);
      } else {
      const projectData = {
        ...data,
        clientName: clients.find(c => c.id === data.clientId)?.nom || 'Client inconnu',
        category: 'general',
        progress: data.progress || 0,
      };
      let projectId: string;
      if (isEditing && selectedProject) {
        updateProject(selectedProject, projectData);
        projectId = selectedProject;
      } else {
        await addProject(projectData);
        // Le projet sera ajouté au store, on peut récupérer son ID depuis le store
        const addedProject = projects.find(p => p.name === data.name && p.clientId === data.clientId);
        projectId = addedProject?.id || '';
      }
      // Synchronisation avec le calendrier : créer une activité pour la deadline
      if (data.endDate) {
        const priorityMap = {
          'low': 'basse' as const,
          'medium': 'moyenne' as const,
          'high': 'haute' as const,
          'urgent': 'haute' as const,
        };
        const statusMap = {
          'planning': 'a_faire' as const,
          'in_progress': 'en_cours' as const,
          'review': 'en_cours' as const,
          'completed': 'termine' as const,
          'on_hold': 'a_faire' as const,
        };
        const endDateUtc = parisToUtc(`${data.endDate}T23:59:59`).toISOString();
        await addActivity({
          title: `Deadline: ${data.name}`,
          description: `Échéance du projet "${data.name}" pour le client ${projectData.clientName}`,
          date_utc: endDateUtc,
          type: 'projet',
          priority: priorityMap[data.priority],
          status: statusMap[data.status],
          related_id: projectId,
          related_module: 'projet',
        });
      }
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
            {isEditing ? 'Modifier le projet' : 'Nouveau projet'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom du projet</FormLabel>
                  <FormControl>
                    <Input placeholder="Nom du projet" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Description du projet" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                        <SelectItem value="planning">Planification</SelectItem>
                        <SelectItem value="in_progress">En cours</SelectItem>
                        <SelectItem value="review">En révision</SelectItem>
                        <SelectItem value="completed">Terminé</SelectItem>
                        <SelectItem value="on_hold">En attente</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priorité</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Priorité" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Faible</SelectItem>
                        <SelectItem value="medium">Moyen</SelectItem>
                        <SelectItem value="high">Élevé</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="assignedTo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assigné à</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un utilisateur" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {users.map((user) => (
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

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date de début</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date de fin</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Budget</FormLabel>
                    <FormControl>
                      {isEditing && project && selectedProject ? (
                        <ProjectBudgetInput
                          projectId={selectedProject}
                          projectName={project.name}
                          clientId={project.clientId}
                          clientName={project.clientName}
                          initialBudget={field.value || 0}
                          onBudgetChange={(newBudget) => {
                            field.onChange(newBudget);
                          }}
                          className="w-full"
                        />
                      ) : (
                        <div className="relative">
                          <Input 
                            type="number" 
                            placeholder="Montant en €" 
                            {...field}
                            onChange={(e) => {
                              const value = Number(e.target.value);
                              field.onChange(value >= 0 ? value : undefined);
                            }}
                            className="pl-10 pr-8"
                            min="0"
                            step="100"
                          />
                          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                            <Euro className="h-4 w-4" />
                          </div>
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm">
                            €
                          </div>
                        </div>
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="progress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Progression (%)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0"
                        max="100"
                        placeholder="0-100" 
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : 0)}
                      />
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