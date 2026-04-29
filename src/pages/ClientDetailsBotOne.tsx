import { useNavigate, useParams } from 'react-router-dom';
import ContactDetailsBotOne from '../modules/ContactDetailsBotOne';
import { routes } from '../lib/routes';

export function ClientDetailsBotOne() {
  const navigate = useNavigate();
  const { recordId } = useParams<{ recordId: string }>();

  if (!recordId) {
    return (
      <div className="min-h-screen bg-surface-1 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-foreground mb-2">Record non trouvé</h2>
          <p className="text-muted-foreground mb-4">Aucun ID de record fourni.</p>
        </div>
      </div>
    );
  }

  return (
    <ContactDetailsBotOne
      recordId={recordId}
      onBack={() => navigate(routes.botOne)}
    />
  );
}
