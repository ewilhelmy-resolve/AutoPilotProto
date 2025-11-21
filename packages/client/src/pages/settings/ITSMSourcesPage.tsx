/**
 * ITSMSourcesPage - ITSM Sources connections page
 *
 * Design source: https://www.figma.com/design/TBw4XFq0g6o1S0y8xt5tLK/AutoPilot?node-id=25-10539
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Share2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import RitaSettingsLayout from '@/components/layouts/RitaSettingsLayout'
import SettingsHeader from '@/pages/settings/SettingsHeader'
import DelegateConfigModal from '@/components/modals/ShareConfigModal'

// Mock ITSM source data
interface ITSMSource {
  id: string
  type: 'zendesk' | 'freshdesk' | 'servicenow'
  name: string
  lastSync: string
  icon: string
}

const MOCK_ITSM_SOURCES: ITSMSource[] = [
  {
    id: 'zendesk-1',
    type: 'zendesk',
    name: 'Zendesk',
    lastSync: '—',
    icon: '/connections/icon_zendesk.svg',
  },
  {
    id: 'freshdesk-1',
    type: 'freshdesk',
    name: 'Freshdesk',
    lastSync: '—',
    icon: '/connections/icon_freshdesk.svg',
  },
  {
    id: 'servicenow-1',
    type: 'servicenow',
    name: 'ServiceNow',
    lastSync: '—',
    icon: '/connections/icon_servicenow.svg',
  },
]

export default function ITSMSourcesPage() {
  const navigate = useNavigate()
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [selectedSource, setSelectedSource] = useState<ITSMSource | null>(null)

  const handleConfigure = (source: ITSMSource) => {
    // Navigate to detail page for configuration
    navigate(`/settings/itsm/${source.id}`)
  }

  const handleShare = (source: ITSMSource) => {
    setSelectedSource(source)
    setShareModalOpen(true)
  }

  return (
    <RitaSettingsLayout>
      <div className="flex flex-col gap-8 w-full">
        <SettingsHeader
          title="ITSM Sources"
          description="Connect your ticketing sources to help Rita resolve IT issues faster."
        />

        <div className="border-t" />

        <div className="w-full max-w-4xl flex flex-col gap-6">
          <h3 className="text-xl font-normal text-foreground">Connections</h3>

          <div className="flex flex-col gap-5">
            {MOCK_ITSM_SOURCES.map((source) => (
              <Card
                key={source.id}
                className="p-4 border border-border bg-popover hover:bg-accent transition-colors"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <img
                      src={source.icon}
                      alt={`${source.name} icon`}
                      className="w-4 h-4 flex-shrink-0"
                      onError={(e) => {
                        // Fallback to a placeholder if icon doesn't exist
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                    <div className="flex flex-col gap-2">
                      <p className="text-base font-semibold text-foreground">
                        {source.name}
                      </p>
                      <p className="text-sm text-foreground">
                        Last sync: {source.lastSync}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="default"
                      onClick={() => handleShare(source)}
                      className="gap-2"
                    >
                      <Share2 className="w-4 h-4" />
                      Share
                    </Button>
                    <Button
                      variant="secondary"
                      size="default"
                      onClick={() => handleConfigure(source)}
                    >
                      Configure
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Delegate Configuration Modal */}
      {shareModalOpen && selectedSource && (
        <DelegateConfigModal
          sourceName={selectedSource.name}
          sourceId={selectedSource.id}
          onClose={() => setShareModalOpen(false)}
        />
      )}
    </RitaSettingsLayout>
  )
}
