import { Project } from './types';

interface ProjectsManagerListProps {
  projects: Project[];
  onSelect: (project: Project) => void;
}

export const ProjectsManagerList: React.FC<ProjectsManagerListProps> = ({ projects, onSelect }) => (
  <div>
    <h2>Liste des projets</h2>
    <ul>
      {projects.map(project => (
        <li key={project.id}>
          <button onClick={() => onSelect(project)}>{project.name} ({project.status})</button>
        </li>
      ))}
    </ul>
  </div>
); 