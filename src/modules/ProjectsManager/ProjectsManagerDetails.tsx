import { Project } from './types';

interface ProjectsManagerDetailsProps {
  project: Project;
  onClose: () => void;
}

export const ProjectsManagerDetails: React.FC<ProjectsManagerDetailsProps> = ({ project, onClose }) => (
  <div>
    <h2>Détails du projet</h2>
    <p><strong>Nom :</strong> {project.name}</p>
    <p><strong>Client :</strong> {project.client}</p>
    <p><strong>Statut :</strong> {project.status}</p>
    <p><strong>Date de début :</strong> {project.startDate}</p>
    <p><strong>Date de fin :</strong> {project.endDate || 'N/A'}</p>
    <button onClick={onClose}>Fermer</button>
  </div>
); 