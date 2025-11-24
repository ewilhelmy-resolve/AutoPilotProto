/**
 * ITSMConfigurationPage - Mock configuration page for ITSM sources
 *
 * This is a simplified mock configuration page for design prototype purposes.
 */

import { useState, useEffect } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { RefreshCw, Check, Share2, XCircle, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import Header from '@/components/Header'
import RitaSettingsLayout from '@/components/layouts/RitaSettingsLayout'
import DelegateConfigModal from '@/components/modals/ShareConfigModal'
import { toast } from '@/lib/toast'
import { useAuth } from '@/hooks/useAuth'

// Mock ITSM source metadata
const ITSM_SOURCES: Record<string, { name: string; icon: string }> = {
  'zendesk-1': { name: 'Zendesk', icon: '/connections/icon_zendesk.svg' },
  'freshdesk-1': { name: 'Freshdesk', icon: '/connections/icon_freshdesk.svg' },
  'servicenow-1': { name: 'ServiceNow', icon: '/connections/icon_servicenow.svg' },
}

type ConnectionState = 'configure' | 'connected' | 'importing' | 'imported' | 'error'

interface ImportError {
  type: 'sync_failed' | 'invalid_credentials' | 'expired_token' | 'partial_import'
  message: string
  ticketsImported?: number
  ticketsFailed?: number
  retryable: boolean
}

export default function ITSMConfigurationPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { authenticated, loading } = useAuth()

  const source = id ? ITSM_SOURCES[id] : null
  const delegateToken = searchParams.get('token')
  const isDelegateAccess = !!delegateToken

  // Redirect to sign-up if accessing via delegate link without authentication
  useEffect(() => {
    console.log('Auth check:', { isDelegateAccess, loading, authenticated })
    if (isDelegateAccess && !loading && !authenticated) {
      console.log('Redirecting to signup...')
      // Preserve the current URL to return after sign-up
      const returnUrl = `/config/${id}?token=${delegateToken}`
      navigate(`/signup?returnTo=${encodeURIComponent(returnUrl)}`, { replace: true })
    }
  }, [isDelegateAccess, authenticated, loading, id, delegateToken, navigate])

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
  const [showShareModal, setShowShareModal] = useState(false)
  const [importError, setImportError] = useState<ImportError | null>(null)

  // Show loading state while checking auth for delegate access
  if (isDelegateAccess && loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

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

    // Show different success message for delegate access
    if (isDelegateAccess) {
      toast.success('Configuration saved successfully', {
        description: `The owner has been notified. You can now close this page.`,
      })
    } else {
      toast.success('Connection successful', {
        description: `Successfully connected to ${source?.name}`,
      })
    }
  }

  const handleCancel = () => {
    navigate('/settings/connections')
  }

  // Simulate different error scenarios for demo
  const simulateError = (errorType: ImportError['type']) => {
    const errors: Record<ImportError['type'], ImportError> = {
      sync_failed: {
        type: 'sync_failed',
        message: 'Failed to sync tickets from ServiceNow',
        retryable: true,
      },
      invalid_credentials: {
        type: 'invalid_credentials',
        message: 'Invalid credentials. Please check your API key and email.',
        retryable: false,
      },
      expired_token: {
        type: 'expired_token',
        message: 'Access token has expired. Please reconnect your account.',
        retryable: false,
      },
      partial_import: {
        type: 'partial_import',
        message: 'Some tickets could not be imported due to validation errors',
        ticketsImported: 1847,
        ticketsFailed: 153,
        retryable: true,
      },
    }

    setImportError(errors[errorType])
    setConnectionState('error')
  }

  const handleImportTickets = async () => {
    setConnectionState('importing')
    setImportProgress(0)
    setImportedCount(0)
    setImportError(null)

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
    setImportError(null)
    await handleImportTickets()
  }

  const handleRetryImport = async () => {
    setImportError(null)
    await handleImportTickets()
  }

  const handleReconfigure = () => {
    setConnectionState('configure')
    setImportError(null)
    setFormData({
      instanceUrl: '',
      apiKey: '',
      email: '',
    })
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

      <div className="flex gap-3 justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={() => setShowShareModal(true)}
          className="gap-2"
        >
          <Share2 className="w-4 h-4" />
          Delegate to admin
        </Button>
        <div className="flex gap-3">
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

            {/* Error states */}
            {connectionState === 'error' && importError && (
              <Alert variant={importError.type === 'partial_import' ? 'default' : 'destructive'}>
                {importError.type === 'partial_import' ? (
                  <AlertTriangle className="h-4 w-4" />
                ) : (
                  <XCircle className="h-4 w-4" />
                )}
                <AlertTitle>
                  {importError.type === 'sync_failed' && 'Failed sync'}
                  {importError.type === 'invalid_credentials' && 'Invalid credentials'}
                  {importError.type === 'expired_token' && 'Expired access token'}
                  {importError.type === 'partial_import' && 'Partial import'}
                </AlertTitle>
                <AlertDescription>
                  <p>{importError.message}</p>
                  {importError.type === 'partial_import' && importError.ticketsImported && importError.ticketsFailed && (
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center justify-between p-2 bg-background/50 rounded">
                        <span className="text-sm">Successfully imported</span>
                        <span className="font-semibold text-green-600">{importError.ticketsImported}</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-background/50 rounded">
                        <span className="text-sm">Failed to import</span>
                        <span className="font-semibold text-destructive">{importError.ticketsFailed}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Click "View Failed" to see error details for each ticket
                      </p>
                    </div>
                  )}
                </AlertDescription>
              </Alert>
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

              {connectionState === 'error' && importError && (
                <>
                  {importError.type === 'partial_import' ? (
                    <>
                      <Button variant="outline" onClick={() => {
                        toast.info('Failed tickets', {
                          description: `Showing ${importError.ticketsFailed} failed tickets with error details`
                        })
                      }}>
                        View Failed ({importError.ticketsFailed})
                      </Button>
                      <Button variant="outline" onClick={handleRetryImport}>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Retry Failed Only
                      </Button>
                      <Button onClick={handleViewTickets}>
                        View Imported Tickets
                      </Button>
                    </>
                  ) : importError.retryable ? (
                    <Button variant="outline" onClick={handleRetryImport}>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Retry Import
                    </Button>
                  ) : (
                    <Button onClick={handleReconfigure}>
                      Reconfigure Connection
                    </Button>
                  )}
                </>
              )}
            </div>

            {/* Demo error buttons (only show when connected, for testing) */}
            {connectionState === 'connected' && (
              <div className="mt-4 p-4 border border-dashed rounded-lg bg-muted/50">
                <p className="text-xs font-medium text-muted-foreground mb-3">Demo Error States:</p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => simulateError('sync_failed')}
                  >
                    Failed Sync
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => simulateError('invalid_credentials')}
                  >
                    Invalid Credentials
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => simulateError('expired_token')}
                  >
                    Expired Token
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => simulateError('partial_import')}
                  >
                    Partial Import
                  </Button>
                </div>
              </div>
            )}
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

      {/* Delegate Configuration Modal */}
      {showShareModal && (
        <DelegateConfigModal
          sourceName={source.name}
          sourceId={id!}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </RitaSettingsLayout>
  )
}
