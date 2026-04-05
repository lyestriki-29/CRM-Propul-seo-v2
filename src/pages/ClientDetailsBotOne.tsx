import React from 'react';
import ContactDetailsBotOne from '../modules/ContactDetailsBotOne';
import { useStore } from '../store';

export function ClientDetailsBotOne() {
  const { navigationContext, navigateWithContext } = useStore();
  const recordId = navigationContext?.recordId;

  if (!recordId) {
    return (
      <div className="min-h-screen bg-surface-1 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-foreground mb-2">Record non trouve</h2>
          <p className="text-muted-foreground mb-4">Aucun ID de record fourni.</p>
        </div>
      </div>
    );
  }

  return (
    <ContactDetailsBotOne
      recordId={recordId}
      onBack={() => {
        // Retourner au CRM Bot One
        navigateWithContext('crm-bot-one');
      }}
    />
  );
}
