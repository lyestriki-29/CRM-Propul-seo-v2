import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useSupabaseAccountingEntries } from '../../hooks/useSupabaseData';

interface RevenueChartProps {
  isPrivacyMode?: boolean;
}

export function RevenueChart({ isPrivacyMode = false }: RevenueChartProps) {
  const { data: accountingEntries, loading } = useSupabaseAccountingEntries();

  // Générer les données du graphique pour l'année en cours
  const chartData = useMemo(() => {
    if (!accountingEntries) return [];

    const currentYear = new Date().getFullYear();
    const months: Array<{
      month: string;
      revenue: number;
      fullMonth: string;
    }> = [];

    console.log('RevenueChart - Données comptables:', accountingEntries);

    // Initialiser tous les mois de l'année en cours (janvier à décembre)
    for (let month = 1; month <= 12; month++) {
      const monthKey = `${currentYear}-${month.toString().padStart(2, '0')}`;
      const monthDate = new Date(currentYear, month - 1, 1); // month - 1 car les mois commencent à 0

      // Filtrer les entrées de ce mois en utilisant month_key
      const monthEntries = accountingEntries.filter(entry => {
        return entry.month_key === monthKey && entry.type === 'revenue';
      });

      // Calculer le CA total du mois
      const totalRevenue = monthEntries.reduce((sum, entry) => sum + parseFloat(entry.amount || 0), 0);

      console.log(`CA total pour ${format(monthDate, 'MMMM yyyy', { locale: fr })} (${monthKey}):`, totalRevenue);

      months.push({
        month: isPrivacyMode ? '*****' : format(monthDate, 'MMM', { locale: fr }),
        revenue: totalRevenue,
        fullMonth: format(monthDate, 'MMMM yyyy', { locale: fr })
      });
    }

    console.log('RevenueChart - Données du graphique:', months);
    return months;
  }, [accountingEntries, isPrivacyMode]);

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Chargement des données...</p>
        </div>
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Aucune donnée disponible</p>
        </div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
        <XAxis 
          dataKey="month" 
          tick={{ fontSize: 12 }}
          className="text-muted-foreground"
          axisLine={true}
          tickLine={true}
        />
        <YAxis 
          tick={{ fontSize: 12 }}
          className="text-muted-foreground"
          axisLine={true}
          tickLine={true}
          tickFormatter={(value) => isPrivacyMode ? '*****' : `${value}€`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          }}
          formatter={(value: number) => isPrivacyMode ? ['*****', 'Chiffre d\'affaires'] : [`${value.toLocaleString()}€`, 'Chiffre d\'affaires']}
          labelFormatter={(label, payload) => {
            if (payload && payload[0]) {
              return payload[0].payload.fullMonth;
            }
            return label;
          }}
        />
        <Line
          type="monotone"
          dataKey="revenue"
          stroke="#9334e9"
          strokeWidth={3}
          dot={{ fill: '#9334e9', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, stroke: '#9334e9', strokeWidth: 2, fill: 'white' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}