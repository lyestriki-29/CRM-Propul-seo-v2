import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { routes } from '../../lib/routes';
import { useIsMobile } from '../../hooks/useMediaQuery';
import { ContactRow } from '../../types/supabase-types';
import { ContactFormData, INITIAL_CONTACT_FORM } from './types';
import { useCRMData } from './hooks/useCRMData';
import { useCRMFilters } from './hooks/useCRMFilters';
import { useCRMActions } from './hooks/useCRMActions';
import { CRMPage } from './CRMPage';

export function CRM() {
  console.log('CRM component rendered');

  const data = useCRMData();
  const isMobile = useIsMobile();

  console.log(`Contacts chargés: ${data.contacts?.length || 0}`);
  console.log(`Loading: ${data.contactsLoading}`);
  console.log(`Error: ${data.contactsError}`);

  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [editContactDialogOpen, setEditContactDialogOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<ContactRow | null>(null);
  const [showContactDetails, setShowContactDetails] = useState(false);
  const [showColumnManager, setShowColumnManager] = useState(false);
  const [contactForm, setContactForm] = useState<ContactFormData>({ ...INITIAL_CONTACT_FORM });
  const [mobilePreviewContact, setMobilePreviewContact] = useState<ContactRow | null>(null);
  const [showMobilePreview, setShowMobilePreview] = useState(false);

  const filters = useCRMFilters(data.contacts, data.customColumns, data.updateColumnCounts);
  const actions = useCRMActions({
    data, contactForm, setContactForm, selectedContact,
    setSelectedContact, setShowContactDetails,
    setContactDialogOpen, setEditContactDialogOpen,
  });

  const fromDashboard = data.fromDashboard;

  useEffect(() => {
    if (showContactDetails) { setShowContactDetails(false); setSelectedContact(null); }
  }, []);

  useEffect(() => {
    const handleNavigation = () => { if (showContactDetails) { setShowContactDetails(false); setSelectedContact(null); } };
    const sidebarItems = document.querySelectorAll('[data-module="crm"]');
    sidebarItems.forEach(item => { item.addEventListener('click', handleNavigation); });
    return () => { sidebarItems.forEach(item => { item.removeEventListener('click', handleNavigation); }); };
  }, [showContactDetails]);

  const onContactClick = (contact: ContactRow) => {
    const mainContainer = document.querySelector('main.overflow-y-auto');
    if (mainContainer) mainContainer.scrollTop = 0;
    window.scrollTo(0, 0);
    // Routing : ouvrir le détail via URL (/clients/:id) plutôt que via state local.
    data.navigate(routes.clientDetail(contact.id));
  };

  const onRefresh = async () => {
    await actions.forceRefreshContacts();
    await data.refetchRevenue();
    console.log('Contacts et revenus actualisés !');
  };

  if (data.contactsError) {
    return (
      <div className="p-6 space-y-8 min-h-screen">
        <Card className="border-l-4 border-l-red-500">
          <CardHeader><CardTitle className="text-red-600">Erreur de chargement</CardTitle></CardHeader>
          <CardContent>
            <p className="text-red-600">Erreur lors du chargement des contacts : {data.contactsError}</p>
            <Button onClick={data.refetchContacts} className="mt-4">Réessayer</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <CRMPage
      data={data} filters={filters} actions={actions} isMobile={isMobile}
      contactForm={contactForm} setContactForm={setContactForm}
      contactDialogOpen={contactDialogOpen} setContactDialogOpen={setContactDialogOpen}
      editContactDialogOpen={editContactDialogOpen} setEditContactDialogOpen={setEditContactDialogOpen}
      selectedContact={selectedContact} setSelectedContact={setSelectedContact}
      showContactDetails={showContactDetails} setShowContactDetails={setShowContactDetails}
      showColumnManager={showColumnManager} setShowColumnManager={setShowColumnManager}
      mobilePreviewContact={mobilePreviewContact} setMobilePreviewContact={setMobilePreviewContact}
      showMobilePreview={showMobilePreview} setShowMobilePreview={setShowMobilePreview}
      fromDashboard={fromDashboard} onBackToDashboard={() => data.navigate(routes.dashboard)}
      onContactClick={onContactClick} onRefresh={onRefresh}
    />
  );
}
