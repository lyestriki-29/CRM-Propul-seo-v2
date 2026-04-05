import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Settings, 
  BarChart3, 
  Users,
  TrendingUp,
  Calendar,
  Tag,
  Plus,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { useCRMBotOne } from '../../hooks/useCRMBotOne';
import { CRMBotOneKanban } from '../../components/crm/bot-one/CRMBotOneKanban';
import { SimpleRecordModal } from '../../components/crm/bot-one/SimpleRecordModal';
import { 
  CRMBotOneRecord, 
  CRMBotOneRecordForm, 
  CRMBotOneFilters 
} from '../../types/crmBotOne';
import { useStore } from '../../store';

export function CRMBotOne() {
  const {
    records,
    columns,
    loading,
    error,
    stats,
    createRecord,
    updateRecord,
    deleteRecord,
    fetchRecords,
    fetchStats
  } = useCRMBotOne();

  const { navigateWithContext } = useStore();

  const [showRecordModal, setShowRecordModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<CRMBotOneRecord | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
  const [filters, setFilters] = useState<CRMBotOneFilters>({});

  // Forcer le rechargement des données au montage du composant
  useEffect(() => {
    fetchRecords(filters);
  }, [fetchRecords, filters]);

  const handleCreateRecord = () => {
    setSelectedRecord(null);
    setModalMode('create');
    setShowRecordModal(true);
  };

  const handleEditRecord = (record: CRMBotOneRecord) => {
    setSelectedRecord(record);
    setModalMode('edit');
    setShowRecordModal(true);
  };

  const handleViewRecord = (record: CRMBotOneRecord) => {
    setSelectedRecord(record);
    setModalMode('view');
    setShowRecordModal(true);
  };

  const handleOpenContactDetails = (recordId: string) => {
    // Naviguer vers la page de fiche client
    navigateWithContext('client-details-bot-one', { recordId });
  };

  const handleDeleteRecord = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet enregistrement ?')) {
      try {
        await deleteRecord(id);
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  const handleSaveRecord = async (recordData: CRMBotOneRecordForm) => {
    try {
      if (modalMode === 'create') {
        const newRecord = await createRecord(recordData);
        // Fermer le modal
        setShowRecordModal(false);
        // Rediriger vers la page client du nouveau lead
        if (newRecord && newRecord.id) {
          navigateWithContext('client-details-bot-one', { recordId: newRecord.id });
        }
      } else if (modalMode === 'edit' && selectedRecord) {
        await updateRecord(selectedRecord.id, recordData);
        // Fermer le modal après édition
        setShowRecordModal(false);
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const handleFiltersChange = (newFilters: CRMBotOneFilters) => {
    setFilters(newFilters);
    fetchRecords(newFilters);
  };

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-red-600 mb-2">
                Erreur de chargement
              </h2>
              <p className="text-muted-foreground">{error}</p>
              <Button 
                onClick={() => window.location.reload()} 
                className="mt-4"
              >
                Recharger la page
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* En-tête amélioré */}
      <div className="bg-gradient-to-r from-primary to-neon-light text-white">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <span className="text-2xl">🤖</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold">CRM - Bot One</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              onClick={() => fetchRecords(filters)} 
              variant="outline"
              className="flex items-center gap-2 bg-white/20 text-white border-white/30 hover:bg-white/30 px-4 py-2 rounded-lg font-semibold"
            >
              <RefreshCw className="h-4 w-4" /> 
              Actualiser
            </Button>
            <Button 
              onClick={handleCreateRecord} 
              className="flex items-center gap-2 bg-white text-primary hover:bg-white/90 px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              <Plus className="h-5 w-5" /> 
              Ajouter un Lead
            </Button>
          </div>
        </div>
      </div>

      {/* Contenu principal - Layout Kanban */}
      <CRMBotOneKanban
        records={records}
        columns={columns}
        loading={loading}
        onEditRecord={handleEditRecord}
        onDeleteRecord={handleDeleteRecord}
        onViewRecord={handleViewRecord}
        onCreateRecord={handleCreateRecord}
        onFiltersChange={handleFiltersChange}
        onUpdateRecord={updateRecord}
        onOpenContactDetails={handleOpenContactDetails}
      />

      {/* Modal d'enregistrement */}
      <SimpleRecordModal
        open={showRecordModal}
        onOpenChange={setShowRecordModal}
        record={selectedRecord}
        onSave={handleSaveRecord}
        mode={modalMode}
      />

    </div>
  );
}
