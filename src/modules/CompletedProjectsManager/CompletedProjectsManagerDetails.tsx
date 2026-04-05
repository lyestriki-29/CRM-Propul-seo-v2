import { CompletedProject } from './types';

interface CompletedProjectsManagerDetailsProps {
  project: CompletedProject;
  onClose: () => void;
}

export const CompletedProjectsManagerDetails: React.FC<CompletedProjectsManagerDetailsProps> = ({ project, onClose }) => (
  <div>
    <h2>Détails du projet terminé</h2>
    <p><strong>Nom :</strong> {project.name}</p>
    <p><strong>Client :</strong> {project.client}</p>
    <p><strong>Date de fin :</strong> {project.endDate}</p>
    <p><strong>Statut :</strong> {project.status}</p>
    <button onClick={onClose}>Fermer</button>
  </div>
); 