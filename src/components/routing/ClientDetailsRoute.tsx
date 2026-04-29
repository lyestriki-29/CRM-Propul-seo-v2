import { useNavigate, useParams } from 'react-router-dom'
import ContactDetails from '@/modules/ContactDetails'
import { routes } from '@/lib/routes'

/**
 * Route wrapper pour `/clients/:id` — détail d'un lead/contact CRM.
 * Lit l'id depuis l'URL, retour vers /crm.
 */
export function ClientDetailsRoute() {
  const { id = '' } = useParams<{ id: string }>()
  const navigate = useNavigate()

  if (!id) return null

  return (
    <ContactDetails
      contactId={id}
      onBack={() => navigate(routes.crm)}
    />
  )
}

export default ClientDetailsRoute
