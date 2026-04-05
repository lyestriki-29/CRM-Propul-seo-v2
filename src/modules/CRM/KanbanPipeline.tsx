import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Plus, User, Building, Mail, Phone, Calendar, DollarSign, BarChart3 } from 'lucide-react';
import { useKanbanPipeline, type Lead } from '../../hooks/useKanbanPipeline';

export function KanbanPipeline() {
  const {
    columns,
    loading,
    error,
    addLead,
    updateLead,
    deleteLead,
    moveLead,
    getPipelineStats
  } = useKanbanPipeline();

  const [showAddLead, setShowAddLead] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showLeadDetails, setShowLeadDetails] = useState(false);
  const [showStats, setShowStats] = useState(false);

  // État pour le nouveau lead
  const [newLead, setNewLead] = useState({
    company_name: '',
    contact_name: '',
    email: '',
    phone: '',
    value: 0,
    notes: ''
  });

  // Gérer le drag & drop
  const handleDragEnd = async (result: { source: { droppableId: string; index: number }; destination: { droppableId: string; index: number } | null; draggableId: string }) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    const sourceColumnId = source.droppableId;
    const destinationColumnId = destination.droppableId;
    const destinationIndex = destination.index;

    try {
      await moveLead(draggableId, sourceColumnId, destinationColumnId, destinationIndex);
    } catch (error) {
      console.error('Erreur lors du déplacement:', error);
    }
  };

  // Ajouter un nouveau lead
  const handleAddLead = async () => {
    try {
      await addLead({
        ...newLead,
        status: 'presentation_envoyee',
        pipeline_stage: 'presentation_envoyee',
        position: 0
      });

      setShowAddLead(false);
      setNewLead({ company_name: '', contact_name: '', email: '', phone: '', value: 0, notes: '' });
    } catch (error) {
      console.error('Erreur lors de l\'ajout du lead:', error);
    }
  };

  // Mettre à jour un lead
  const handleUpdateLead = async (leadId: string, updates: Partial<Lead>) => {
    try {
      await updateLead(leadId, updates);
      setShowLeadDetails(false);
      setSelectedLead(null);
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    }
  };

  // Supprimer un lead
  const handleDeleteLead = async (leadId: string) => {
    try {
      await deleteLead(leadId);
      setShowLeadDetails(false);
      setSelectedLead(null);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  // Obtenir les statistiques
  const stats = getPipelineStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-4">Erreur: {error}</p>
          <Button onClick={() => window.location.reload()}>
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header avec statistiques */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Pipeline Kanban</h1>
          <p className="text-muted-foreground">Gérez vos prospects avec le pipeline de vente</p>
        </div>
        <div className="flex space-x-2">
          <Dialog open={showStats} onOpenChange={setShowStats}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <BarChart3 className="w-4 h-4 mr-2" />
                Statistiques
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Statistiques du Pipeline</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-primary/10 rounded-lg">
                    <p className="text-2xl font-bold text-primary">{stats.totalLeads}</p>
                    <p className="text-sm text-muted-foreground">Total Leads</p>
                  </div>
                  <div className="text-center p-4 bg-green-900/20 rounded-lg">
                    <p className="text-2xl font-bold text-green-400">
                      {stats.totalValue.toLocaleString('fr-FR')} €
                    </p>
                    <p className="text-sm text-muted-foreground">Valeur Totale</p>
                  </div>
                </div>
                <div className="text-center p-4 bg-purple-900/20 rounded-lg">
                  <p className="text-2xl font-bold text-purple-400">
                    {stats.conversionRate.toFixed(1)}%
                  </p>
                  <p className="text-sm text-muted-foreground">Taux de Conversion</p>
                </div>
                <div className="space-y-2">
                  {columns.map(column => (
                    <div key={column.id} className="flex justify-between items-center p-2 bg-surface-2 rounded">
                      <span className="font-medium text-foreground">{column.title}</span>
                      <div className="flex space-x-4 text-sm">
                        <span className="text-muted-foreground">{stats.columnStats[column.id]?.count || 0} leads</span>
                        <span className="text-green-400">
                          {stats.columnStats[column.id]?.value.toLocaleString('fr-FR') || 0} €
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <Dialog open={showAddLead} onOpenChange={setShowAddLead}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un lead
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter un nouveau lead</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="company_name">Entreprise</Label>
                  <Input
                    id="company_name"
                    value={newLead.company_name}
                    onChange={(e) => setNewLead({ ...newLead, company_name: e.target.value })}
                    placeholder="Nom de l'entreprise"
                  />
                </div>
                <div>
                  <Label htmlFor="contact_name">Contact</Label>
                  <Input
                    id="contact_name"
                    value={newLead.contact_name}
                    onChange={(e) => setNewLead({ ...newLead, contact_name: e.target.value })}
                    placeholder="Nom du contact"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newLead.email}
                    onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                    placeholder="email@entreprise.com"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    value={newLead.phone}
                    onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                    placeholder="0123456789"
                  />
                </div>
                <div>
                  <Label htmlFor="value">Valeur estimée (€)</Label>
                  <Input
                    id="value"
                    type="number"
                    value={newLead.value}
                    onChange={(e) => setNewLead({ ...newLead, value: parseFloat(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={newLead.notes}
                    onChange={(e) => setNewLead({ ...newLead, notes: e.target.value })}
                    placeholder="Informations supplémentaires..."
                  />
                </div>
                <Button onClick={handleAddLead} className="w-full">
                  Ajouter le lead
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Pipeline Kanban */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {columns.map((column) => (
            <div key={column.id} className="space-y-4">
              {/* Header de la colonne */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-foreground">{column.title}</h3>
                  <Badge variant="secondary" className="mt-1">
                    {column.leads.length} lead{column.leads.length > 1 ? 's' : ''}
                  </Badge>
                </div>
              </div>

              {/* Zone de drop */}
              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`min-h-[400px] p-4 rounded-lg border-2 border-dashed ${
                      snapshot.isDraggingOver
                        ? 'border-primary bg-primary/10'
                        : column.color
                    }`}
                  >
                    {column.leads.map((lead, index) => (
                      <Draggable key={lead.id} draggableId={lead.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`mb-3 ${
                              snapshot.isDragging ? 'rotate-2 shadow-lg' : ''
                            }`}
                          >
                            <Card 
                              className="cursor-pointer hover:shadow-md transition-shadow"
                              onClick={() => {
                                setSelectedLead(lead);
                                setShowLeadDetails(true);
                              }}
                            >
                              <CardContent className="p-4">
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                      <User className="w-4 h-4 text-muted-foreground" />
                                      <span className="font-medium text-sm">{lead.contact_name}</span>
                                    </div>
                                    <Badge variant="outline" className="text-xs">
                                      {lead.position}
                                    </Badge>
                                  </div>
                                  
                                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                                    <Building className="w-3 h-3" />
                                    <span>{lead.company_name}</span>
                                  </div>
                                  
                                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                                    <Mail className="w-3 h-3" />
                                    <span>{lead.email}</span>
                                  </div>
                                  
                                  {lead.phone && (
                                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                                      <Phone className="w-3 h-3" />
                                      <span>{lead.phone}</span>
                                    </div>
                                  )}
                                  
                                  {lead.value && (
                                    <div className="flex items-center space-x-2 text-xs text-green-600">
                                      <DollarSign className="w-3 h-3" />
                                      <span>{lead.value.toLocaleString('fr-FR')} €</span>
                                    </div>
                                  )}
                                  
                                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                                    <Calendar className="w-3 h-3" />
                                    <span>
                                      {new Date(lead.created_at).toLocaleDateString('fr-FR')}
                                    </span>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      {/* Modal de détails du lead */}
      <Dialog open={showLeadDetails} onOpenChange={setShowLeadDetails}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Détails du lead</DialogTitle>
          </DialogHeader>
          {selectedLead && (
            <div className="space-y-4">
              <div>
                <Label>Entreprise</Label>
                <Input
                  value={selectedLead.company_name}
                  onChange={(e) => setSelectedLead({ ...selectedLead, company_name: e.target.value })}
                />
              </div>
              <div>
                <Label>Contact</Label>
                <Input
                  value={selectedLead.contact_name}
                  onChange={(e) => setSelectedLead({ ...selectedLead, contact_name: e.target.value })}
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={selectedLead.email}
                  onChange={(e) => setSelectedLead({ ...selectedLead, email: e.target.value })}
                />
              </div>
              <div>
                <Label>Téléphone</Label>
                <Input
                  value={selectedLead.phone}
                  onChange={(e) => setSelectedLead({ ...selectedLead, phone: e.target.value })}
                />
              </div>
              <div>
                <Label>Valeur estimée (€)</Label>
                <Input
                  type="number"
                  value={selectedLead.value || ''}
                  onChange={(e) => setSelectedLead({ 
                    ...selectedLead, 
                    value: parseFloat(e.target.value) || 0 
                  })}
                  placeholder="0"
                />
              </div>
              <div>
                <Label>Statut</Label>
                <Select
                  value={selectedLead.pipeline_stage}
                  onValueChange={(value) => setSelectedLead({ 
                    ...selectedLead, 
                    pipeline_stage: value,
                    status: value 
                  })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="presentation_envoyee">Présentation envoyée</SelectItem>
                    <SelectItem value="rdv_booke">RDV booké</SelectItem>
                    <SelectItem value="en_attente">En attente</SelectItem>
                    <SelectItem value="offre_envoyee">Offre envoyée</SelectItem>
                    <SelectItem value="gagne">Gagné</SelectItem>
                    <SelectItem value="perdu">Perdu</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Notes</Label>
                <Textarea
                  value={selectedLead.notes || ''}
                  onChange={(e) => setSelectedLead({ ...selectedLead, notes: e.target.value })}
                  placeholder="Notes sur le prospect..."
                />
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  onClick={() => handleUpdateLead(selectedLead.id, selectedLead)}
                  className="flex-1"
                >
                  Mettre à jour
                </Button>
                <Button 
                  variant="destructive"
                  onClick={() => handleDeleteLead(selectedLead.id)}
                >
                  Supprimer
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 