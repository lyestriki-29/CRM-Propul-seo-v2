import { DashboardWidget } from './types';

interface DashboardListProps {
  widgets: DashboardWidget[];
  onSelect: (widget: DashboardWidget) => void;
}

export const DashboardList: React.FC<DashboardListProps> = ({ widgets, onSelect }) => (
  <div>
    <h2>Liste des widgets</h2>
    <ul>
      {widgets.map(widget => (
        <li key={widget.id}>
          <button onClick={() => onSelect(widget)}>{widget.title} ({widget.type})</button>
        </li>
      ))}
    </ul>
  </div>
); 