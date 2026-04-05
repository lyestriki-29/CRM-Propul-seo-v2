import React, { useState } from 'react';
import { useSupabaseContacts, useContactsCRUD } from '../../hooks/useSupabaseData';
import { Contact, CreateContactData } from '../../hooks/useContacts';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Phone, 
  Mail, 
  Building, 
  MapPin,
  Calendar,
  User
} from 'lucide-react';
import { toast } from 'sonner';

export default function Contacts() {
  const { 
    data: contacts, 
    loading, 
    error, 
    refetch 
  } = useSupabaseContacts();
  
  const { 
    createContact, 
    updateContact, 
    deleteContact, 
    loading: crudLoading 
  } = useContactsCRUD();
  

  
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [formData, setFormData] = useState<CreateContactData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    company: '',
    sector: '',
    status: 'prospect' as const, // Type explicite pour éviter l'erreur
    project_price: undefined,
    source: 'website',
    notes: '',
    no_show: 'Non'
  });

  // Filtrer les contacts selon la recherche
  const filteredContacts = contacts?.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.company?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Gérer la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      toast.error('Le nom et l\'email sont obligatoires');
      return;
    }

    if (editingContact) {
      // Mise à jour
      const result = await updateContact(editingContact.id, formData);
      if (result.success) {
        setEditingContact(null);
        resetForm();
        refetch(); // Recharger les données
      }
    } else {
      // Création
      const result = await createContact(formData);
      if (result.success) {
        setShowCreateForm(false);
        resetForm();
        refetch(); // Recharger les données
      }
    }
  };

  // Réinitialiser le formulaire
  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      company: '',
      sector: '',
      status: 'prospect',
      project_price: undefined,
      source: 'website',
      notes: '',
      no_show: 'Non'
    });
  };

  // Éditer un contact
  const handleEdit = (contact: Contact) => {
    setEditingContact(contact);
    setFormData({
      name: contact.name,
      email: contact.email,
      phone: contact.phone || '',
      address: contact.address || '',
      company: contact.company || '',
      sector: contact.sector || '',
      status: contact.status,
      project_price: contact.project_price,
      source: contact.source || 'website',
      notes: contact.notes?.join('\n') || '',
      no_show: contact.no_show || 'Non'
    });
  };

  // Supprimer un contact
  const handleDelete = async (contactId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce contact ?')) {
      const result = await deleteContact(contactId);
      if (result.success) {
        refetch(); // Recharger les données
      }
    }
  };

  // Annuler l'édition
  const handleCancelEdit = () => {
    setEditingContact(null);
    resetForm();
  };

  // Obtenir la couleur du badge selon le statut
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'prospect': return 'bg-blue-500/15 text-blue-400';
      case 'proposition_envoyee': return 'bg-purple-500/15 text-purple-400';
      case 'meeting_booke': return 'bg-orange-500/15 text-orange-400';
      case 'offre_envoyee': return 'bg-yellow-500/15 text-yellow-400';
      case 'en_attente': return 'bg-surface-3/50 text-muted-foreground';
      case 'signe': return 'bg-emerald-500/15 text-emerald-400';
      default: return 'bg-surface-3/50 text-muted-foreground';
    }
  };

  if (loading && (!contacts || contacts.length === 0)) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Chargement des contacts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Contacts</h1>
          <p className="text-muted-foreground">
            {filteredContacts.length} contact{filteredContacts.length !== 1 ? 's' : ''} trouvé{filteredContacts.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nouveau contact
        </Button>
      </div>

      {/* Barre de recherche */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Rechercher un contact..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Formulaire de création/édition */}
      {(showCreateForm || editingContact) && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingContact ? 'Modifier le contact' : 'Nouveau contact'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nom *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="company">Entreprise</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="sector">Secteur</Label>
                  <Input
                    id="sector"
                    value={formData.sector}
                    onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="status">Statut</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                                       <SelectContent>
                     <SelectItem value="prospect">Prospects</SelectItem>
                     <SelectItem value="proposition_envoyee">Proposition Envoyée</SelectItem>
                     <SelectItem value="meeting_booke">Meeting Booké</SelectItem>
                     <SelectItem value="offre_envoyee">Offre Envoyée</SelectItem>
                     <SelectItem value="en_attente">En Attente</SelectItem>
                     <SelectItem value="signe">Signés</SelectItem>
                   </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="source">Source</Label>
                  <Select
                    value={formData.source}
                    onValueChange={(value) => setFormData({ ...formData, source: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="website">Site web</SelectItem>
                      <SelectItem value="referral">Recommandation</SelectItem>
                      <SelectItem value="ads">Publicité</SelectItem>
                      <SelectItem value="social">Réseaux sociaux</SelectItem>
                      <SelectItem value="other">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="project_price">Prix du projet (€)</Label>
                  <Input
                    id="project_price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.project_price || ''}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      project_price: e.target.value ? parseFloat(e.target.value) : undefined 
                    })}
                    placeholder="5000"
                  />
                </div>
                <div>
                  <Label htmlFor="no_show">No Show</Label>
                  <Select
                    value={formData.no_show}
                    onValueChange={(value) => setFormData({ ...formData, no_show: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Non">Non</SelectItem>
                      <SelectItem value="Oui">Oui</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="address">Adresse</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={crudLoading}>
                  {editingContact ? 'Mettre à jour' : 'Créer'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={editingContact ? handleCancelEdit : () => setShowCreateForm(false)}
                >
                  Annuler
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Liste des contacts */}
      <div className="grid gap-4">
        {filteredContacts.map((contact) => (
          <Card key={contact.id} className="hover:shadow-glow-sm transition-all hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{contact.name}</h3>
                    <Badge className={getStatusColor(contact.status)}>
                      {contact.status}
                    </Badge>
                    {contact.no_show === 'Oui' && (
                      <Badge className="bg-red-500/15 text-red-400">
                        No Show
                      </Badge>
                    )}
                  </div>
                  
                  <div className="space-y-1 text-sm text-muted-foreground">
                    {contact.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {contact.email}
                      </div>
                    )}
                    {contact.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        {contact.phone}
                      </div>
                    )}
                    {contact.company && (
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4" />
                        {contact.company}
                      </div>
                    )}
                    {contact.address && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {contact.address}
                      </div>
                    )}
                    {contact.project_price && (
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-400 font-semibold">💰 {contact.project_price.toLocaleString('fr-FR')}€</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Créé le {new Date(contact.created_at).toLocaleDateString('fr-FR')}
                    </div>
                  </div>

                  {contact.notes && contact.notes.length > 0 && (
                    <div className="mt-3 p-3 bg-surface-2/50 rounded-lg border border-border/50">
                      <p className="text-sm text-muted-foreground">
                        {contact.notes.join('\n')}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(contact)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(contact.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Message si aucun contact */}
      {filteredContacts.length === 0 && !loading && (
        <div className="text-center py-12">
          <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            {searchTerm ? 'Aucun contact trouvé' : 'Aucun contact'}
          </h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm 
              ? 'Essayez de modifier vos critères de recherche'
              : 'Commencez par créer votre premier contact'
            }
          </p>
          {!searchTerm && (
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Créer un contact
            </Button>
          )}
        </div>
      )}
    </div>
  );
} 