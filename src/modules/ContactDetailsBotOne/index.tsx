import React, { useState, useEffect, useLayoutEffect } from 'react';
import { 
  ArrowLeft, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Building, 
  Edit, 
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  User,
  CalendarDays,
  Activity,
  Trash2,
  Globe,
  Copy,
  Bot
} from 'lucide-react';
import { useCRMBotOne } from '../../hooks/useCRMBotOne';
import { supabase } from '../../lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';
import { toast } from 'sonner';
import { formatTextWithLineBreaks } from '../../utils/textFormatting.tsx';
import { ActivityModal } from '../../components/crm/ActivityModal';

interface BotOneActivity {
  id: string;
  record_id: string;
  title: string;
  description?: string;
  activity_date: string;
  type: 'call' | 'email' | 'meeting' | 'note' | 'task';
  status: 'completed' | 'scheduled' | 'cancelled';
  created_at: string;
}

interface ContactDetailsBotOneProps {
  recordId: string;
  onBack: () => void;
}

export default function ContactDetailsBotOne({ recordId, onBack }: ContactDetailsBotOneProps) {
  const { records, updateRecord, createActivity, getActivities } = useCRMBotOne();
  
  const [record, setRecord] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [editingActivity, setEditingActivity] = useState<BotOneActivity | null>(null);
  const [editingRecord, setEditingRecord] = useState(false);
  const [activities, setActivities] = useState<BotOneActivity[]>([]);
  const [activitiesLoading, setActivitiesLoading] = useState(false);
  

  const [editForm, setEditForm] = useState({
    company_name: '',
    contact_name: '',
    email: '',
    phone: '',
    website: '',
    status: 'prospect',
  });

  // Charger les détails du record
  useLayoutEffect(() => {
    const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => {
        const firstElement = document.querySelector('h1, .scroll-top-target');
        if (firstElement) {
          firstElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    };
    
    scrollToTop();
    loadRecordDetails();
  }, [recordId]);

  const loadActivities = async () => {
    if (!recordId) return;
    
    setActivitiesLoading(true);
    try {
      const activitiesData = await getActivities(recordId);
      setActivities(activitiesData);
    } catch (error) {
      console.error('Erreur lors du chargement des activités:', error);
    } finally {
      setActivitiesLoading(false);
    }
  };

  const loadRecordDetails = async () => {
    if (!recordId) return;
    
    console.log('🔍 Chargement du record avec ID:', recordId);
    setLoading(true);
    try {
      // Charger directement depuis Supabase
      const { data: recordData, error } = await supabase
        .from('crm_bot_one_records')
        .select('*')
        .eq('id', recordId)
        .single();
      
      console.log('📊 Données reçues:', recordData);
      console.log('❌ Erreur:', error);
      
      if (error) {
        console.error('Erreur lors du chargement du record:', error);
        toast.error(`Erreur lors du chargement du record: ${error.message}`);
        return;
      }
      
      if (recordData) {
        console.log('✅ Record trouvé:', recordData);
        setRecord(recordData);
        setEditForm({
          company_name: recordData.data?.['Nom de l\'entreprise'] || '',
          contact_name: recordData.data?.['Nom contact'] || '',
          email: recordData.data?.Email || '',
          phone: recordData.data?.Téléphone || '',
          website: recordData.data?.['Site web'] || '',
          status: recordData.data?.Statut || 'prospect',
        });
        
        // Charger les activités
        loadActivities();
      } else {
        console.log('❌ Aucun record trouvé');
      }
    } catch (error) {
      console.error('Erreur lors du chargement du record:', error);
      toast.error('Erreur lors du chargement du record');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRecord = async () => {
    if (!record) return;
    
    try {
      const updatedData = {
        ...record.data,
        'Nom de l\'entreprise': editForm.company_name,
        'Nom contact': editForm.contact_name,
        Email: editForm.email,
        Téléphone: editForm.phone,
        'Site web': editForm.website,
        Statut: editForm.status,
      };
      
      await updateRecord(record.id, {
        data: updatedData,
        status: editForm.status,
      });
      
      setEditingRecord(false);
      toast.success('Record mis à jour avec succès');
      loadRecordDetails();
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const handleCreateActivity = async (activityData: { title: string; description?: string; activity_date: string; type: string; status: string }) => {
    if (!record) return;
    
    try {
      await createActivity(record.id, {
        title: activityData.title,
        description: activityData.description,
        activity_date: activityData.activity_date,
        type: activityData.type,
        status: activityData.status,
      });
      
      toast.success('Activité créée avec succès');
      
      // Recharger les activités
      loadActivities();
    } catch (error) {
      console.error('Erreur lors de la création de l\'activité:', error);
      toast.error('Erreur lors de la création de l\'activité');
      throw error;
    }
  };

  const handleMarkActivityCompleted = async (activityId: string) => {
    try {
      // Marquer l'activité comme terminée en utilisant la fonction RPC
      const { error: updateError } = await supabase.rpc('update_bot_one_activity', {
        p_activity_id: activityId,
        p_status: 'completed'
      });

      if (updateError) {
        console.error('Erreur lors de la mise à jour:', updateError);
        toast.error('Erreur lors de la mise à jour de l\'activité');
        return;
      }

      toast.success('Activité marquée comme effectuée !');
      
      // Recharger les activités
      loadActivities();
      
      // Ouvrir automatiquement le modal pour créer une nouvelle activité
      setTimeout(() => {
        setShowActivityModal(true);
      }, 500); // Petit délai pour laisser le temps au toast de s'afficher
      
    } catch (error) {
      console.error('Erreur lors du marquage de l\'activité:', error);
      toast.error('Erreur lors du marquage de l\'activité');
    }
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${type} copié dans le presse-papiers !`);
    } catch (err) {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      toast.success(`${type} copié dans le presse-papiers !`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Chargement des détails...</p>
        </div>
      </div>
    );
  }

  if (!record) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">Record non trouvé</h2>
          <p className="text-muted-foreground mb-4">Le record demandé n'existe pas ou a été supprimé.</p>
          <Button onClick={onBack} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* En-tête */}
      <div className="glass-surface-static border-b border-border/30 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/20 rounded-lg">
                  <Bot className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-foreground scroll-top-target">
                    {record.data?.['Nom de l\'entreprise'] || 'Entreprise non spécifiée'}
                  </h1>
                  <p className="text-sm text-muted-foreground">CRM Bot One</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditingRecord(!editingRecord)}
                className="border-border text-foreground hover:bg-surface-3"
              >
                <Edit className="w-4 h-4 mr-2" />
                {editingRecord ? 'Annuler' : 'Modifier'}
              </Button>
              {editingRecord && (
                <Button
                  size="sm"
                  onClick={handleSaveRecord}
                  className="bg-primary hover:bg-primary/90 text-white"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Sauvegarder
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Informations principales */}
          <div className="lg:col-span-2 space-y-6">
            {/* Informations de contact */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Informations de contact</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="company_name">Nom de l'entreprise</Label>
                    {editingRecord ? (
                      <Input
                        id="company_name"
                        value={editForm.company_name}
                        onChange={(e) => setEditForm({ ...editForm, company_name: e.target.value })}
                        className="mt-1"
                      />
                    ) : (
                      <div className="mt-1 p-3 bg-surface-2/50 rounded-md flex items-center justify-between">
                        <span className="text-foreground">
                          {record.data?.['Nom de l\'entreprise'] || 'Non spécifié'}
                        </span>
                        {record.data?.['Nom de l\'entreprise'] && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(record.data?.['Nom de l\'entreprise'], 'Nom de l\'entreprise')}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="contact_name">Nom du contact</Label>
                    {editingRecord ? (
                      <Input
                        id="contact_name"
                        value={editForm.contact_name}
                        onChange={(e) => setEditForm({ ...editForm, contact_name: e.target.value })}
                        className="mt-1"
                      />
                    ) : (
                      <div className="mt-1 p-3 bg-surface-2/50 rounded-md flex items-center justify-between">
                        <span className="text-foreground">
                          {record.data?.['Nom contact'] || 'Non spécifié'}
                        </span>
                        {record.data?.['Nom contact'] && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(record.data?.['Nom contact'], 'Nom du contact')}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    {editingRecord ? (
                      <Input
                        id="email"
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        className="mt-1"
                      />
                    ) : (
                      <div className="mt-1 p-3 bg-surface-2/50 rounded-md flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          <span className="text-foreground">
                            {record.data?.Email || 'Non spécifié'}
                          </span>
                        </div>
                        {record.data?.Email && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(record.data?.Email, 'Email')}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="phone">Téléphone</Label>
                    {editingRecord ? (
                      <Input
                        id="phone"
                        type="tel"
                        value={editForm.phone}
                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                        className="mt-1"
                      />
                    ) : (
                      <div className="mt-1 p-3 bg-surface-2/50 rounded-md flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <span className="text-foreground">
                            {record.data?.Téléphone || 'Non spécifié'}
                          </span>
                        </div>
                        {record.data?.Téléphone && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(record.data?.Téléphone, 'Téléphone')}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="website">Site web</Label>
                    {editingRecord ? (
                      <Input
                        id="website"
                        type="url"
                        value={editForm.website}
                        onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
                        className="mt-1"
                      />
                    ) : (
                      <div className="mt-1 p-3 bg-surface-2/50 rounded-md flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Globe className="w-4 h-4 text-muted-foreground" />
                          <span className="text-foreground">
                            {record.data?.['Site web'] || 'Non spécifié'}
                          </span>
                        </div>
                        {record.data?.['Site web'] && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(record.data?.['Site web'], 'Site web')}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="status">Statut</Label>
                    {editingRecord ? (
                      <Select
                        value={editForm.status}
                        onValueChange={(value) => setEditForm({ ...editForm, status: value })}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="prospect">Prospect</SelectItem>
                          <SelectItem value="en discussion">En discussion</SelectItem>
                          <SelectItem value="demo planifié">Demo planifié</SelectItem>
                          <SelectItem value="abonné">Abonné</SelectItem>
                          <SelectItem value="perdu">Perdu</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="mt-1">
                        <Badge 
                          variant={
                            record.data?.Statut === 'abonné' ? 'default' :
                            record.data?.Statut === 'en discussion' ? 'secondary' :
                            record.data?.Statut === 'demo planifié' ? 'outline' :
                            record.data?.Statut === 'perdu' ? 'destructive' : 'secondary'
                          }
                        >
                          {record.data?.Statut || 'Prospect'}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>

              </CardContent>
            </Card>

            {/* Activités */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Activity className="w-5 h-5" />
                    <span>Activités</span>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => setShowActivityModal(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Nouvelle activité
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>

                {/* Liste des activités */}
                <div className="space-y-3">
                  {activitiesLoading ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                      <p className="text-sm text-muted-foreground mt-2">Chargement des activités...</p>
                    </div>
                  ) : activities.length > 0 ? (
                    activities.map((activity) => (
                      <div key={activity.id} className="p-3 glass-surface-static rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-foreground">{activity.title}</h4>
                            {activity.description && (
                              <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                            )}
                            <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                              <span className="flex items-center">
                                <Calendar className="w-3 h-3 mr-1" />
                                {new Date(activity.activity_date).toLocaleDateString('fr-FR')}
                              </span>
                              <Badge 
                                variant={
                                  activity.status === 'completed' ? 'default' :
                                  activity.status === 'cancelled' ? 'destructive' : 'secondary'
                                }
                              >
                                {activity.status === 'completed' ? 'Terminé' :
                                 activity.status === 'cancelled' ? 'Annulé' : 'Planifié'}
                              </Badge>
                              <Badge variant="outline">
                                {activity.type === 'call' ? 'Appel' :
                                 activity.type === 'email' ? 'Email' :
                                 activity.type === 'meeting' ? 'Rendez-vous' :
                                 activity.type === 'note' ? 'Note' : 'Tâche'}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            {activity.status === 'scheduled' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleMarkActivityCompleted(activity.id)}
                                className="text-green-600 hover:text-green-700 hover:bg-green-500/10"
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Effectué
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Aucune activité pour ce record
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

            {/* Sidebar */}
          <div className="space-y-6">
            {/* Informations générales */}
            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">Informations générales</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Créé le</span>
                  <span className="text-sm font-medium text-foreground">
                    {new Date(record.created_at).toLocaleDateString('fr-FR')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Modifié le</span>
                  <span className="text-sm font-medium text-foreground">
                    {new Date(record.updated_at).toLocaleDateString('fr-FR')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">ID</span>
                  <span className="text-sm font-mono text-muted-foreground">
                    {record.id.slice(0, 8)}...
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Actions rapides */}
            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">Actions rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => copyToClipboard(record.data?.Email || '', 'Email')}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Copier l'email
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => copyToClipboard(record.data?.Téléphone || '', 'Téléphone')}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Copier le téléphone
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => setShowActivityModal(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nouvelle activité
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modal d'activité */}
      <ActivityModal
        open={showActivityModal}
        onOpenChange={setShowActivityModal}
        onSave={handleCreateActivity}
      />
    </div>
  );
}
