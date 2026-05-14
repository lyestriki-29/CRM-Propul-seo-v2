import { DashboardWidget } from './types';

interface DashboardDetailsProps {
  widget: DashboardWidget;
  onClose: () => void;
}

export const DashboardDetails: React.FC<DashboardDetailsProps> = ({ widget, onClose }) => (
  <div>
    <h2>Détails du widget</h2>
    <p><strong>Titre :</strong> {widget.title}</p>
    <p><strong>Valeur :</strong> {widget.value}</p>
    <p><strong>Type :</strong> {widget.type}</p>
    <button onClick={onClose}>Fermer</button>
  </div>
); 