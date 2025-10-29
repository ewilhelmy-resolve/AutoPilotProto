/**
 * ITSMConfigurationPage - Mock configuration page for ITSM sources
 *
 * This is a simplified mock configuration page for design prototype purposes.
 */

import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { RefreshCw, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Header from '@/components/Header'
import RitaSettingsLayout from '@/components/layouts/RitaSettingsLayout'
import { toast } from '@/lib/toast'

// Mock ITSM source metadata
const ITSM_SOURCES: Record<string, { name: string; icon: string }> = {
  'zendesk-1': { name: 'Zendesk', icon: '/connections/icon_zendesk.svg' },
  'freshdesk-1': { name: 'Freshdesk', icon: '/connections/icon_freshdesk.svg' },
  'servicenow-1': { name: 'ServiceNow', icon: '/connections/icon_servicenow.svg' },
}

type ConnectionState = 'configure' | 'connected' | 'importing' | 'imported'

export default function ITSMConfigurationPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const source = id ? ITSM_SOURCES[id] : null

  const [connectionState, setConnectionState] = useState<ConnectionState>('configure')
  const [formData, setFormData] = useState({
    instanceUrl: '',
    apiKey: '',
    email: '',
  })
  const [timeRange, setTimeRange] = useState('90')
  const [importProgress, setImportProgress] = useState(0)
  const [importedCount, setImportedCount] = useState(0)
  const totalTickets = 2000

  const [isSaving, setIsSaving] = useState(false)

  if (!source) {
    return (
      <RitaSettingsLayout>
        <div className="flex-1 inline-flex flex-col items-center gap-8 w-full">
          <div className="text-center py-8">Source not found</div>
        </div>
      </RitaSettingsLayout>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSaving(false)
    setConnectionState('connected')

    // Show success toast
    toast.success('Connection successful', {
      description: `Successfully connected to ${source?.name}`,
    })
  }

  const handleCancel = () => {
    navigate('/settings/connections')
  }

  const handleImportTickets = async () => {
    setConnectionState('importing')
    setImportProgress(0)
    setImportedCount(0)

    // Simulate progressive import
    const importInterval = setInterval(() => {
      setImportedCount((prev) => {
        const next = prev + 100
        if (next >= totalTickets) {
          clearInterval(importInterval)
          setConnectionState('imported')

          // Show success toast
          toast.success('Tickets synced successfully', {
            description: `${totalTickets} tickets imported`,
          })

          return totalTickets
        }
        return next
      })

      setImportProgress((prev) => {
        const next = prev + 5
        return next >= 100 ? 100 : next
      })
    }, 200)
  }

  const handleRefreshSync = async () => {
    // Re-run import
    await handleImportTickets()
  }

  const handleViewTickets = () => {
    // Mark tickets as imported for demo flow
    localStorage.setItem('demo:hasImportedTickets', 'true')
    navigate('/tickets')
  }

  // Render configuration form
  const renderConfigureForm = () => (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="instanceUrl">Instance URL</Label>
          <Input
            id="instanceUrl"
            type="url"
            placeholder={`https://your-company.${source.name.toLowerCase()}.com`}
            value={formData.instanceUrl}
            onChange={(e) =>
              setFormData({ ...formData, instanceUrl: e.target.value })
            }
            required
          />
          <p className="text-sm text-muted-foreground">
            Your {source.name} instance URL
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="admin@company.com"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />
          <p className="text-sm text-muted-foreground">
            Email address for authentication
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="apiKey">API Key</Label>
          <Input
            id="apiKey"
            type="password"
            placeholder="••••••••••••••••"
            value={formData.apiKey}
            onChange={(e) =>
              setFormData({ ...formData, apiKey: e.target.value })
            }
            required
          />
          <p className="text-sm text-muted-foreground">
            Your {source.name} API key or token
          </p>
        </div>
      </div>

      <div className="flex gap-3 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          disabled={isSaving}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Connection'}
        </Button>
      </div>
    </form>
  )

  // Render connected view with import section
  const renderConnectedView = () => {
    const currentTime = new Date().toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })

    return (
      <div className="flex flex-col gap-8">
        {/* Configure section */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Configure</h3>
          </div>

          <div className="flex flex-col gap-3 p-4 border rounded-lg bg-card">
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-1 flex-1">
                <div className="flex items-center gap-2">
                  <Label className="text-sm text-muted-foreground">URL</Label>
                </div>
                <p className="text-sm">{formData.instanceUrl || 'http://some-servicenow.net'}</p>
              </div>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Check className="w-3 h-3" />
                Connected
              </Badge>
            </div>

            <div className="flex flex-col gap-1">
              <Label className="text-sm text-muted-foreground">Email</Label>
              <p className="text-sm">{formData.email || 'charlie@momo.com'}</p>
            </div>

            <div className="flex flex-col gap-1">
              <Label className="text-sm text-muted-foreground">API</Label>
              <p className="text-sm">••••••••••••••••••••</p>
            </div>

            <p className="text-xs text-muted-foreground mt-2">
              Updated at {currentTime} - Today
            </p>
          </div>
        </div>

        {/* Tickets section */}
        <div className="flex flex-col gap-4">
          <div>
            <h3 className="text-lg font-semibold">Tickets</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Sync tickets from {source.name} to analyze information opportunities
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
              <Label htmlFor="timeRange">Time range</Label>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 90 days</SelectItem>
                  <SelectItem value="180">Last 180 days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Import progress */}
            {connectionState === 'importing' && (
              <div className="flex flex-col gap-2">
                <Progress value={importProgress} className="h-2" />
                <p className="text-sm text-muted-foreground">
                  {importedCount} of {totalTickets} tickets
                </p>
              </div>
            )}

            {/* Import complete message */}
            {connectionState === 'imported' && (
              <p className="text-sm font-medium">
                {totalTickets} tickets imported
              </p>
            )}

            {/* Action buttons */}
            <div className="flex gap-3 justify-end">
              {connectionState === 'connected' && (
                <Button onClick={handleImportTickets}>
                  Import tickets
                </Button>
              )}

              {connectionState === 'importing' && (
                <Button disabled>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Import tickets
                </Button>
              )}

              {connectionState === 'imported' && (
                <>
                  <Button variant="outline" onClick={handleRefreshSync}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Re-fresh sync
                  </Button>
                  <Button onClick={handleViewTickets}>
                    View Tickets
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <RitaSettingsLayout>
      <div className="flex-1 inline-flex flex-col items-center gap-8 w-full">
        <div className="self-stretch flex flex-col items-start gap-8">
          <Header
            breadcrumbs={[
              { label: connectionState === 'configure' ? 'ITSM Sources' : 'Connections', href: '/settings/connections' },
              { label: source.name },
            ]}
            title={source.name}
            icon={
              <img
                src={source.icon}
                alt={`${source.name} icon`}
                className="w-5 h-5"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            }
            description={`Connect your ${source.name} instance to build content with tech knowledge and tickets.`}
          />
        </div>

        <div className="w-full max-w-2xl mx-auto flex flex-col gap-8">
          {connectionState === 'configure' ? renderConfigureForm() : renderConnectedView()}
        </div>
      </div>
    </RitaSettingsLayout>
  )
}
