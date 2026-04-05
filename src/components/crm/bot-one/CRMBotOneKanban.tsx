import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Building2,
  User,
  Mail,
  Phone,
  Globe,
  Tag,
  Calendar,
  Clock,
  MapPin,
  Briefcase,
  Award,
  Target,
  TrendingUp
} from 'lucide-react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Badge } from '../../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '../../ui/dropdown-menu';
import { 
  CRMBotOneRecord, 
  CRMBotOneColumn, 
  CRMBotOneFilters 
} from '../../../types/crmBotOne';
import { formatDate } from '../../../lib/utils';

interface CRMBotOneKanbanProps {
  records: CRMBotOneRecord[];
  columns: CRMBotOneColumn[];
  loading: boolean;
  onEditRecord: (record: CRMBotOneRecord) => void;
  onDeleteRecord: (id: string) => void;
  onViewRecord: (record: CRMBotOneRecord) => void;
  onCreateRecord: () => void;
  onFiltersChange: (filters: CRMBotOneFilters) => void;
  onUpdateRecord: (id: string, updates: Partial<CRMBotOneRecord>) => void;
  onOpenContactDetails?: (recordId: string) => void;
}

export function CRMBotOneKanban({
  records,
  columns,
  loading,
  onEditRecord,
  onDeleteRecord,
  onViewRecord,
  onCreateRecord,
  onFiltersChange,
  onUpdateRecord,
  onOpenContactDetails
}: CRMBotOneKanbanProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Configuration des colonnes Kanban (avec support dark mode)
  const kanbanColumns = [
    {
      key: 'prospect',
      label: 'Prospect',
      color: 'glass-surface-static',
      headerColor: 'bg-surface-3 text-foreground',
      count: 0
    },
    {
      key: 'en discussion',
      label: 'En Discussion',
      color: 'glass-surface-static',
      headerColor: 'bg-blue-600 text-white',
      count: 0
    },
    {
      key: 'Demo planifié',
      label: 'Demo Planifié',
      color: 'glass-surface-static',
      headerColor: 'bg-orange-600 text-white',
      count: 0
    },
    {
      key: 'abonné',
      label: 'Abonné',
      color: 'glass-surface-static',
      headerColor: 'bg-green-600 text-white',
      count: 0
    },
    {
      key: 'perdu',
      label: 'Perdu',
      color: 'glass-surface-static',
      headerColor: 'bg-red-600 text-white',
      count: 0
    }
  ];

  // Filtrer les enregistrements
  const filteredRecords = useMemo(() => {
    let filtered = records;

    if (searchTerm) {
      filtered = filtered.filter(record => 
        Object.values(record.data).some(value => 
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    return filtered;
  }, [records, searchTerm]);

  // Grouper les enregistrements par statut
  const recordsByStatus = useMemo(() => {
    const grouped: { [key: string]: CRMBotOneRecord[] } = {};
    
    kanbanColumns.forEach(col => {
      grouped[col.key] = filteredRecords.filter(record => 
        record.data['Statut'] === col.key
      );
    });

    return grouped;
  }, [filteredRecords]);

  // Mettre à jour les compteurs
  const columnsWithCounts = kanbanColumns.map(col => ({
    ...col,
    count: recordsByStatus[col.key]?.length || 0
  }));

  const handleStatusChange = async (recordId: string, newStatus: string) => {
    try {
      await onUpdateRecord(recordId, {
        data: { Statut: newStatus },
        status: newStatus
      });
    } catch (error) {
      console.error('Erreur lors du changement de statut:', error);
    }
  };

  const renderRecordCard = (record: CRMBotOneRecord) => {
    const data = record.data;
    const status = data['Statut'] as string;
    
    return (
      <Card 
        key={record.id} 
        className="cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => onOpenContactDetails?.(record.id)}
      >
        <CardContent className="p-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-foreground mb-1 text-sm truncate">
                {data['Nom de l\'entreprise'] || 'Sans nom'}
              </h4>
              <p className="text-xs text-muted-foreground mb-1 truncate">
                {data['Nom contact'] || 'Contact non renseigné'}
              </p>
              
              {/* Type de contact */}
              {data['Type contact'] && (
                <div className="flex items-center gap-1 mb-1">
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-primary/15 text-primary border border-primary/20 truncate">
                    {data['Type contact']}
                  </span>
                </div>
              )}
              
              {/* Email */}
              {data['Email'] && (
                <div className="flex items-center gap-2 mb-1">
                  <Mail className="h-3 w-3 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground truncate">
                    {data['Email']}
                  </p>
                </div>
              )}
              
              {/* Téléphone */}
              {data['Telephone'] && (
                <div className="flex items-center gap-2 mb-1">
                  <Phone className="h-3 w-3 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground truncate">
                    {data['Telephone']}
                  </p>
                </div>
              )}
              
              {/* Site web */}
              {data['Site web'] && (
                <div className="flex items-center gap-2 mb-1">
                  <Globe className="h-3 w-3 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground truncate">
                    {data['Site web']}
                  </p>
                </div>
              )}
              
              {/* Prochaine activité */}
              {record.next_activity_date && (
                <div className="mt-1">
                  {(() => {
                    // Fonction pour déterminer la couleur de la date
                    const getDateColor = (activityDate: string) => {
                      // Date de référence fixe du CRM : 20/10/2025
                      const today = new Date('2025-10-20');
                      const activity = new Date(activityDate);
                      
                      // Remettre les heures à 0 pour comparer seulement les dates
                      today.setHours(0, 0, 0, 0);
                      activity.setHours(0, 0, 0, 0);
                      
                      // Calculer la différence en jours
                      const diffTime = activity.getTime() - today.getTime();
                      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
                      
                      if (diffDays < 0) {
                        // Activité en retard (hier ou avant)
                        return "text-red-600 font-semibold"; // Rouge
                      } else if (diffDays === 0) {
                        // Activité d'aujourd'hui
                        return "text-green-600 font-semibold"; // Vert
                      } else {
                        // Activité future
                        return "text-orange-600"; // Orange normal
                      }
                    };

                    // Fonction pour formater la date avec contexte
                    const formatDateWithContext = (date: string) => {
                      // Date de référence fixe du CRM : 20/10/2025
                      const today = new Date('2025-10-20');
                      const activityDate = new Date(date);
                      
                      // Remettre les heures à 0 pour comparer seulement les dates
                      today.setHours(0, 0, 0, 0);
                      activityDate.setHours(0, 0, 0, 0);
                      
                      const diffDays = Math.round((activityDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                      
                      if (diffDays === 0) {
                        return "Aujourd'hui";
                      } else if (diffDays === -1) {
                        return "Hier";
                      } else if (diffDays < -1) {
                        return `Il y a ${Math.abs(diffDays)} jours`;
                      } else if (diffDays === 1) {
                        return "Demain";
                      } else {
                        return new Date(date).toLocaleDateString('fr-FR');
                      }
                    };

                    const dateColorClass = getDateColor(record.next_activity_date);
                    const formattedDate = formatDateWithContext(record.next_activity_date);
                    
                    return (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <p className={`text-xs font-medium ${dateColorClass}`}>
                          {formattedDate}
                        </p>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 w-6 p-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onViewRecord(record)}>
                  <Eye className="h-4 w-4 mr-2" />
                  Voir
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEditRecord(record)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => onDeleteRecord(record.id)}
                  className="text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 min-h-screen">
      {/* Barre de recherche */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher leads par nom, entreprise, email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>
              
              {/* Indicateur de résultats de recherche */}
              {searchTerm && (
                <div className="mt-4 mb-2 text-sm text-muted-foreground glass-surface-static px-3 py-2 rounded-lg">
                  <span className="font-medium">{filteredRecords.length}</span> résultat(s) 
                  pour "<span className="font-medium text-primary">{searchTerm}</span>"
                  {filteredRecords.length !== records.length && (
                    <span> sur {records.length} leads total</span>
                  )}
                </div>
              )}
            </div>
            
            {/* Bouton Nouveau Lead */}
            <Button 
              variant="outline" 
              onClick={onCreateRecord}
              className="border-border text-muted-foreground bg-surface-2/50 hover:bg-surface-3/50"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nouveau Lead
            </Button>
            
            {/* Bouton Filtres */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filtres
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Kanban Board - Scroll vertical uniquement */}
      <div className="flex gap-4 overflow-x-hidden pb-4 crm-kanban-board" style={{ minHeight: 'calc(100vh - 300px)' }}>
        {columnsWithCounts.map((column) => (
          <div key={column.key} className={`${column.color} rounded-xl p-3 flex flex-col w-[260px] h-full transition-all duration-200 hover:transform hover:-translate-y-1 hover:shadow-lg`}>
            {/* Column Header */}
            <div className={`${column.headerColor} text-white rounded-t-xl p-2 -mt-3 -mx-3 mb-3 flex-shrink-0`}>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-xs truncate">{column.label}</h3>
                <div className="flex flex-col items-end">
                  <Badge variant="secondary" className="bg-white/90 text-foreground text-xs mb-1">
                    {column.count}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Column Content - Scroll vertical uniquement */}
            <div className="space-y-2 flex-1 overflow-y-auto overflow-x-hidden min-h-0 crm-column-content">
              {loading ? (
                <div className="flex items-center justify-center py-6">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                </div>
              ) : recordsByStatus[column.key]?.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <div className="relative">
                    <Building2 className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-muted-foreground rounded-full"></div>
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">Aucun lead</p>
                </div>
              ) : (
                recordsByStatus[column.key]
                  ?.sort((a: CRMBotOneRecord, b: CRMBotOneRecord) => {
                    // Date de référence fixe du CRM : 20/10/2025
                    const today = new Date('2025-10-20');

                    // Fonction pour calculer la différence de jours par rapport à la date de référence
                    const getDaysDifference = (record: CRMBotOneRecord) => {
                      if (!record.next_activity_date) return 999999; // Pas de date = en bas (valeur très élevée)
                      const activity = new Date(record.next_activity_date);
                      today.setHours(0, 0, 0, 0);
                      activity.setHours(0, 0, 0, 0);
                      return Math.round((activity.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                    };
                    
                    const diffA = getDaysDifference(a);
                    const diffB = getDaysDifference(b);
                    
                    // Trier par différence de jours (plus négatif = plus en retard = plus haut)
                    return diffA - diffB;
                  })
                  ?.map(record => renderRecordCard(record))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
