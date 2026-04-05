import { CompletedProject } from './types';

interface CompletedProjectsManagerListProps {
  projects: CompletedProject[];
  onSelect: (project: CompletedProject) => void;
}

export const CompletedProjectsManagerList: React.FC<CompletedProjectsManagerListProps> = ({ projects, onSelect }) => (
  <div>
    <h2>Projets terminés</h2>
    <ul>
      {projects.map(project => (
        <li key={project.id}>
          <button onClick={() => onSelect(project)}>{project.name} ({project.status})</button>
        </li>
      ))}
    </ul>
  </div>
); 