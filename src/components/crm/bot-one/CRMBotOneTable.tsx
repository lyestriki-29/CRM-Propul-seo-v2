import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Tag
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
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../../ui/table';
import { 
  CRMBotOneRecord, 
  CRMBotOneColumn, 
  CRMBotOneFilters 
} from '../../../types/crmBotOne';
import { formatDate } from '../../../lib/utils';

interface CRMBotOneTableProps {
  records: CRMBotOneRecord[];
  columns: CRMBotOneColumn[];
  loading: boolean;
  onEditRecord: (record: CRMBotOneRecord) => void;
  onDeleteRecord: (id: string) => void;
  onViewRecord: (record: CRMBotOneRecord) => void;
  onCreateRecord: () => void;
  onFiltersChange: (filters: CRMBotOneFilters) => void;
}

export function CRMBotOneTable({
  records,
  columns,
  loading,
  onEditRecord,
  onDeleteRecord,
  onViewRecord,
  onCreateRecord,
  onFiltersChange
}: CRMBotOneTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);

  // Colonnes fixes pour le CRM Bot One
  const fixedColumns = [
    { key: 'Nom de l\'entreprise', label: 'Entreprise', width: 'w-48' },
    { key: 'Nom contact', label: 'Contact', width: 'w-32' },
    { key: 'Email', label: 'Email', width: 'w-48' },
    { key: 'Téléphone', label: 'Tél', width: 'w-32' },
    { key: 'Site web', label: 'Site', width: 'w-32' },
    { key: 'Type de contact', label: 'Type', width: 'w-32' }
  ];

  // Statuts avec couleurs (avec support dark mode)
  const statusConfig = {
    'prospect': { label: 'Prospect', color: 'bg-surface-2/50 text-foreground', border: 'border-border' },
    'en discussion': { label: 'En Discussion', color: 'bg-blue-500/15 text-blue-400', border: 'border-blue-500/20' },
    'Demo planifié': { label: 'Demo Planifié', color: 'bg-orange-500/15 text-orange-400', border: 'border-orange-500/20' },
    'abonné': { label: 'Abonné', color: 'bg-green-500/15 text-green-400', border: 'border-green-500/20' },
    'perdu': { label: 'Perdu', color: 'bg-red-500/15 text-red-400', border: 'border-red-500/20' }
  };

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

    if (statusFilter) {
      filtered = filtered.filter(record => record.status === statusFilter);
    }

    return filtered;
  }, [records, searchTerm, statusFilter]);

  // Obtenir les statuts uniques
  const uniqueStatuses = useMemo(() => {
    const statuses = new Set(records.map(record => record.status));
    return Array.from(statuses);
  }, [records]);

  // Obtenir tous les tags uniques
  const uniqueTags = useMemo(() => {
    const tags = new Set<string>();
    records.forEach(record => {
      record.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags);
  }, [records]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    onFiltersChange({ search: value });
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    onFiltersChange({ status: status || undefined });
  };

  const renderCellValue = (record: CRMBotOneRecord, column: CRMBotOneColumn) => {
    const value = record.data[column.column_name];
    
    if (value === null || value === undefined) {
      return <span className="text-muted-foreground">-</span>;
    }

    switch (column.column_type) {
      case 'date':
        return <span>{formatDate(value)}</span>;
      case 'boolean':
        return (
          <Badge variant={value ? 'default' : 'secondary'}>
            {value ? 'Oui' : 'Non'}
          </Badge>
        );
      case 'email':
        return (
          <a 
            href={`mailto:${value}`} 
            className="text-primary hover:underline"
          >
            {value}
          </a>
        );
      case 'url':
        return (
          <a 
            href={value} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            {value}
          </a>
        );
      default:
        return <span>{String(value)}</span>;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Enregistrements CRM Bot One</CardTitle>
          <div className="flex items-center gap-2">
            <Button onClick={onCreateRecord} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Nouvel enregistrement
            </Button>
          </div>
        </div>
        
        {/* Barre de recherche et filtres */}
        <div className="flex items-center gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher dans les enregistrements..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            size="sm"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtres
          </Button>
          
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </div>

        {/* Filtres avancés */}
        {showFilters && (
          <div className="mt-4 p-4 glass-surface-static rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Statut</label>
                <select
                  value={statusFilter}
                  onChange={(e) => handleStatusFilter(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Tous les statuts</option>
                  {uniqueStatuses.map(status => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Tags</label>
                <div className="flex flex-wrap gap-1">
                  {uniqueTags.slice(0, 5).map(tag => (
                    <Badge key={tag} variant="secondary" className="cursor-pointer">
                      {tag}
                    </Badge>
                  ))}
                  {uniqueTags.length > 5 && (
                    <Badge variant="outline">+{uniqueTags.length - 5}</Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent>
        {filteredRecords.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              {searchTerm || statusFilter 
                ? 'Aucun enregistrement ne correspond aux critères de recherche'
                : 'Aucun enregistrement trouvé'
              }
            </p>
            {!searchTerm && !statusFilter && (
              <Button onClick={onCreateRecord}>
                <Plus className="h-4 w-4 mr-2" />
                Créer le premier enregistrement
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map(column => (
                    <TableHead key={column.id} className="min-w-[150px]">
                      {column.column_name}
                      {column.is_required && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </TableHead>
                  ))}
                  <TableHead className="w-[100px]">Statut</TableHead>
                  <TableHead className="w-[100px]">Tags</TableHead>
                  <TableHead className="w-[100px]">Créé le</TableHead>
                  <TableHead className="w-[50px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map(record => (
                  <TableRow key={record.id}>
                    {columns.map(column => (
                      <TableCell key={column.id}>
                        {renderCellValue(record, column)}
                      </TableCell>
                    ))}
                    <TableCell>
                      <Badge variant="outline">{record.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {record.tags?.slice(0, 2).map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {record.tags && record.tags.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{record.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(record.created_at, 'dd/MM/yyyy')}
                      </span>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
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
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
