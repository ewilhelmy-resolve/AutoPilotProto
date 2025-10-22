/**
 * ConnectionSourceRouter - Routes to appropriate configuration page
 *
 * Routes ITSM sources to mock configuration page, others to real detail page
 */

import { useParams } from 'react-router-dom'
import ConnectionSourceDetailPage from './ConnectionSourceDetailPage'
import ITSMConfigurationPage from './settings/ITSMConfigurationPage'

const ITSM_SOURCE_IDS = ['zendesk-1', 'freshdesk-1', 'servicenow-1']

export default function ConnectionSourceRouter() {
  const { id } = useParams<{ id: string }>()

  // Route ITSM sources to mock configuration page
  if (id && ITSM_SOURCE_IDS.includes(id)) {
    return <ITSMConfigurationPage />
  }

  // Route all other sources to real detail page
  return <ConnectionSourceDetailPage />
}
