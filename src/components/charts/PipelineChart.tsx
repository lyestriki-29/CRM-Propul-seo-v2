import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useStore } from '@/store/useStore';

const COLORS = {
  prospect: '#f59e0b',
  devis: '#3b82f6',
  signe: '#10b981',
  livre: '#06b6d4',
  perdu: '#ef4444',
};

export function PipelineChart() {
  const { clients } = useStore();

  const pipelineData = [
    {
      name: 'Prospects',
      value: clients.filter(c => c.statut === 'prospect').length,
      color: COLORS.prospect,
    },
    {
      name: 'Devis',
      value: clients.filter(c => c.statut === 'devis').length,
      color: COLORS.devis,
    },
    {
      name: 'Signés',
      value: clients.filter(c => c.statut === 'signe').length,
      color: COLORS.signe,
    },
    {
      name: 'Livrés',
      value: clients.filter(c => c.statut === 'livre').length,
      color: COLORS.livre,
    },
    {
      name: 'Perdus',
      value: clients.filter(c => c.statut === 'perdu').length,
      color: COLORS.perdu,
    },
  ].filter(item => item.value > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pipeline Commercial</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pipelineData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              dataKey="value"
            >
              {pipelineData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
            />
            <Legend
              wrapperStyle={{
                fontSize: '12px',
                paddingTop: '20px',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}