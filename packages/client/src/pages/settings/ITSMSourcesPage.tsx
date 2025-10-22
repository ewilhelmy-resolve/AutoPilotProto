/**
 * ITSMSourcesPage - ITSM Sources connections page
 *
 * Design source: https://www.figma.com/design/TBw4XFq0g6o1S0y8xt5tLK/AutoPilot?node-id=25-10539
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Header from '@/components/Header'

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

  const handleConfigure = (source: ITSMSource) => {
    // Navigate to detail page for configuration (fake flow)
    navigate(`/settings/connections/${source.id}`)
  }

  return (
    <div className="w-full">
      <div className="flex flex-col gap-8">
        <Header
          title="ITSM Sources"
          description="Connect your ticketing sources to help Rita resolve IT issues faster."
        />

        <div className="w-full max-w-4xl mx-auto flex flex-col gap-4">
          <h3 className="text-sm font-medium text-foreground">Connections</h3>

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
                    className="w-5 h-5 flex-shrink-0"
                    onError={(e) => {
                      // Fallback to a placeholder if icon doesn't exist
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                  <div className="flex flex-col">
                    <p className="text-base font-semibold text-foreground">
                      {source.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Last sync: {source.lastSync}
                    </p>
                  </div>
                </div>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleConfigure(source)}
                >
                  Configure
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
