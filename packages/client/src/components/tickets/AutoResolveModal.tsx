/**
 * AutoResolveModal - Modal for Auto-Resolve workflow preview
 *
 * Design source:
 * - https://www.figma.com/design/TBw4XFq0g6o1S0y8xt5tLK/AutoPilot?node-id=186-57915
 */

import React from 'react'
import { X, FileText, User, Search, GitBranch, Code, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface WorkflowStep {
  id: string
  title: string
  description: string
  icon: 'user' | 'search' | 'branch' | 'code' | 'settings' | 'filetext'
  status?: 'completed' | 'pending'
}

interface AutoResolveModalProps {
  isOpen: boolean
  onClose: () => void
  onValidate: () => void
  groupTitle: string
  ticketCount: number
}

const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    id: '1',
    title: 'Get User Details',
    description: 'Retrieve user info, credentials, and manager info from the...',
    icon: 'user',
    status: 'completed',
  },
  {
    id: '2',
    title: 'Fetch Signature Template',
    description: 'Query knowledge base for correct signature template base...',
    icon: 'search',
    status: 'completed',
  },
  {
    id: '3',
    title: 'Template Found?!',
    description: '[Branch] → [Template Signature - Title → User Name → Po...]',
    icon: 'branch',
    status: 'completed',
  },
  {
    id: '4',
    title: 'Generate Signature',
    description: 'Populate template with user data and format HTML signature...',
    icon: 'code',
    status: 'completed',
  },
  {
    id: '5',
    title: 'Apply to Outlook',
    description: 'grayed out/incomplete',
    icon: 'settings',
    status: 'pending',
  },
]

const getStepIcon = (icon: WorkflowStep['icon']) => {
  const iconProps = { className: 'w-4 h-4' }
  switch (icon) {
    case 'user':
      return <User {...iconProps} />
    case 'search':
      return <Search {...iconProps} />
    case 'branch':
      return <GitBranch {...iconProps} />
    case 'code':
      return <Code {...iconProps} />
    case 'settings':
      return <Settings {...iconProps} />
    case 'filetext':
      return <FileText {...iconProps} />
    default:
      return <FileText {...iconProps} />
  }
}

export default function AutoResolveModal({
  isOpen,
  onClose,
  onValidate,
  groupTitle,
  ticketCount,
}: AutoResolveModalProps) {
  const [hasValidated, setHasValidated] = React.useState(false)
  const [isValidating, setIsValidating] = React.useState(false)

  // Reset state when modal closes
  React.useEffect(() => {
    if (!isOpen) {
      setHasValidated(false)
      setIsValidating(false)
    }
  }, [isOpen])

  if (!isOpen) return null

  // Calculate ROI metrics
  const resolutionTime = 2 // minutes
  const perTicket = 24 // dollars
  const timeSaved = Math.round((ticketCount * resolutionTime) / 60) // hours
  const annualSavings = ticketCount * perTicket

  const handleRunTest = () => {
    setIsValidating(true)
    // Simulate workflow test
    setTimeout(() => {
      setIsValidating(false)
      setHasValidated(true)
    }, 2000)
  }

  const handleEnableAutoResolve = () => {
    onValidate()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-background rounded-lg shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b flex-shrink-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-1">Auto-Resolve</h3>
              <p className="text-sm text-muted-foreground">
                Risk-free preview of how Rita would automatically diagnose, decide, and remediate this ticket
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="space-y-6">
            {/* Workflow Match */}
            <div className="border rounded-lg p-4 space-y-2">
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-semibold">{groupTitle}</h4>
                    <Badge className="bg-blue-600 text-white hover:bg-blue-600">87% match</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Workflow for automated {groupTitle.toLowerCase()}.
                  </p>
                </div>
              </div>
            </div>

            {/* Preview Section */}
            <div className="bg-gray-50 border rounded-lg p-4">
              <h4 className="text-sm font-medium text-muted-foreground mb-4">Preview</h4>

              <div className="space-y-2">
                {/* START indicator */}
                <div className="flex justify-center mb-3">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                    START
                  </Badge>
                </div>

                {/* Workflow Steps */}
                {WORKFLOW_STEPS.map((step) => (
                  <div
                    key={step.id}
                    className={`flex items-center gap-3 p-3 border rounded-lg ${
                      step.status === 'pending'
                        ? 'bg-muted/30 opacity-60'
                        : 'bg-background'
                    }`}
                  >
                    <div className="shrink-0">
                      <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center">
                        {getStepIcon(step.icon)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium mb-0.5">{step.title}</div>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {step.description}
                      </p>
                    </div>
                    <div className="shrink-0">
                      <Badge variant="outline" className="text-xs">
                        {step.status === 'completed' ? '100% M' : 'IN PROGRESS'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary of Value */}
            <div className="bg-green-50 border border-green-300 rounded-lg p-4 space-y-3">
              <h4 className="text-sm font-semibold">Summary of value</h4>

              {/* Metrics Row */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-base font-bold">{resolutionTime} mins</div>
                  <div className="text-xs text-muted-foreground">Resolution time</div>
                </div>
                <div>
                  <div className="text-base font-bold">{timeSaved}hr</div>
                  <div className="text-xs text-muted-foreground">Time saved</div>
                </div>
                <div>
                  <div className="text-base font-bold">${perTicket}</div>
                  <div className="text-xs text-muted-foreground">Per ticket</div>
                </div>
              </div>

              {/* Annual Savings */}
              <div className="pt-2 border-t border-green-300">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="text-sm font-semibold mb-1">
                      Annual savings (this cluster)
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Based on {ticketCount.toLocaleString()} tickets/year x ${perTicket}/ticket
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold">
                      ${annualSavings.toLocaleString()} /year
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t flex-shrink-0">
          {hasValidated ? (
            // Stage 2: After validation
            <div className="space-y-3">
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-start gap-2">
                <span className="text-green-600 text-lg">✓</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-green-900">Workflow Validated Successfully!</p>
                  <p className="text-xs text-green-700 mt-0.5">
                    This workflow would have resolved this ticket in {resolutionTime} minutes. Ready to enable for all {ticketCount.toLocaleString()} tickets?
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                >
                  Maybe Later
                </Button>
                <Button
                  onClick={handleEnableAutoResolve}
                  className="flex-1"
                >
                  Upgrade to Auto-Resolve
                </Button>
              </div>
            </div>
          ) : (
            // Stage 1: Before validation
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Maybe Later
              </Button>
              <Button
                onClick={handleRunTest}
                disabled={isValidating}
                className="flex-1"
              >
                {isValidating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Testing Workflow...
                  </>
                ) : (
                  'Run Test Workflow (Free)'
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
