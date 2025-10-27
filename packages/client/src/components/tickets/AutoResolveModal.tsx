/**
 * AutoResolveModal - Modal for Auto-Resolve workflow preview
 *
 * Design source:
 * - https://www.figma.com/design/TBw4XFq0g6o1S0y8xt5tLK/AutoPilot?node-id=186-57915
 */

import React from 'react'
import { X, FileText, User, Search, GitBranch, Code, Settings, Crown } from 'lucide-react'
import { motion } from 'motion/react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BorderBeam } from '@/components/ui/border-beam'
import PricingModal from './PricingModal'

interface WorkflowStep {
  id: string
  title: string
  description: string
  badge: string
  icon: 'user' | 'search' | 'branch' | 'code' | 'settings' | 'filetext'
  status?: 'completed' | 'pending'
}

interface AutoResolveModalProps {
  isOpen: boolean
  onClose: () => void
  onUpgrade: (plan: 'pro' | 'enterprise') => void
  groupTitle: string
  ticketCount: number
}

const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    id: '1',
    title: 'Get User Details',
    description: 'Retrieve user role, department, and manager info from Active Directory.',
    badge: 'query-ad',
    icon: 'user',
    status: 'completed',
  },
  {
    id: '2',
    title: 'Fetch Signature Template',
    description: 'Query knowledge base for correct signature template based on user role.',
    badge: 'query-kb',
    icon: 'search',
    status: 'completed',
  },
  {
    id: '3',
    title: 'Template Found?',
    description: 'If found → "Generate Signature." Else → "Use Default Template."',
    badge: 'if/then/else',
    icon: 'branch',
    status: 'completed',
  },
  {
    id: '4',
    title: 'Generate Signature',
    description: 'Populate template with user data and format HTML signature.',
    badge: 'run-powershell-cmd',
    icon: 'code',
    status: 'completed',
  },
  {
    id: '5',
    title: 'Apply to Outlook',
    description: 'Set signature in user\'s Outlook profile for new emails and replies.',
    badge: 'run-powershell-cmd',
    icon: 'settings',
    status: 'pending',
  },
]

const getStepIcon = (icon: WorkflowStep['icon']) => {
  const iconProps = { className: 'w-3.5 h-3.5' }
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
  onUpgrade,
  groupTitle,
  ticketCount,
}: AutoResolveModalProps) {
  const [hasValidated, setHasValidated] = React.useState(false)
  const [isValidating, setIsValidating] = React.useState(false)
  const [showPricingModal, setShowPricingModal] = React.useState(false)
  const [currentStep, setCurrentStep] = React.useState(0)

  // Reset state when modal closes
  React.useEffect(() => {
    if (!isOpen) {
      setHasValidated(false)
      setIsValidating(false)
      setShowPricingModal(false)
      setCurrentStep(0)
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
    setCurrentStep(0)

    // Simulate workflow test with step-by-step progression
    const stepDuration = 500 // ms per step
    WORKFLOW_STEPS.forEach((_, index) => {
      setTimeout(() => {
        setCurrentStep(index + 1)
      }, stepDuration * (index + 1))
    })

    // Complete after all steps
    setTimeout(() => {
      setIsValidating(false)
      setHasValidated(true)
    }, stepDuration * (WORKFLOW_STEPS.length + 1))
  }

  const handleShowPricing = () => {
    setShowPricingModal(true)
  }

  const handlePricingClose = () => {
    setShowPricingModal(false)
  }

  const handlePlanUpgrade = (plan: 'pro' | 'enterprise') => {
    setShowPricingModal(false)
    onUpgrade(plan)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-background rounded-lg shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col z-10">
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

            {/* Preview Section - On-brand workflow styling */}
            <div className="bg-white border rounded-lg overflow-hidden">
              <div className="px-4 py-3 border-b bg-gray-50">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold">
                    {isValidating ? 'Running Workflow Test...' : 'Preview'}
                  </h4>
                  {isValidating && (
                    <div className="flex items-center gap-2 text-xs text-blue-600">
                      <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                      <span>Testing in progress</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="px-8 py-6 flex flex-col items-center gap-1">
                {/* START indicator */}
                <div className="flex justify-center mb-1">
                  <div className="bg-white border border-gray-200 rounded-lg px-3 py-1">
                    <span className={`text-xs font-bold ${
                      isValidating ? 'text-[#0075ff]' : 'text-[#0075ff]'
                    }`}>
                      {isValidating ? 'RUNNING' : 'START'}
                    </span>
                  </div>
                </div>

                {/* Workflow Steps */}
                {WORKFLOW_STEPS.map((step, index) => {
                  const stepNumber = index + 1
                  const isProcessing = isValidating && currentStep === stepNumber
                  const isCompleted = isValidating ? currentStep > stepNumber : step.status === 'completed'
                  const isPending = isValidating ? currentStep < stepNumber : step.status === 'pending'
                  const isSuccess = index === WORKFLOW_STEPS.length - 1 && isCompleted && !isValidating

                  return (
                    <React.Fragment key={step.id}>
                      {/* Connector line */}
                      <div className="w-1 h-4 bg-gradient-to-b from-gray-200 to-gray-300 rounded-full" />

                      {/* Step node */}
                      <div
                        className={`w-full max-w-[265px] h-11 bg-white border rounded-lg transition-all ${
                          isSuccess
                            ? 'border-green-300 bg-green-50'
                            : isProcessing
                            ? 'border-blue-300 bg-blue-50 shadow-sm'
                            : isCompleted
                            ? 'border-green-200 bg-green-50'
                            : isPending
                            ? 'border-gray-200 opacity-60'
                            : 'border-[rgba(0,117,255,0.1)]'
                        }`}
                      >
                        <div className="flex items-center gap-2 h-full px-2 py-1">
                          {/* Icon */}
                          <div className={`shrink-0 w-6 h-6 rounded-sm flex items-center justify-center ${
                            isSuccess
                              ? 'bg-green-100'
                              : isProcessing
                              ? 'bg-blue-100'
                              : isCompleted
                              ? 'bg-green-100'
                              : 'bg-slate-200'
                          }`}>
                            {isProcessing ? (
                              <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <div className={`w-3.5 h-3.5 ${
                                isCompleted ? 'text-green-600' : 'text-gray-700'
                              }`}>
                                {getStepIcon(step.icon)}
                              </div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[11px] font-medium text-[#011331] font-mono leading-none truncate">
                                {step.title}
                              </span>
                              <Badge
                                variant="outline"
                                className="text-[8px] h-4 px-2 py-0 border-gray-200 leading-none"
                              >
                                {step.badge}
                              </Badge>
                            </div>
                            <p className="text-[8px] text-gray-500 leading-tight truncate">
                              {step.description}
                            </p>
                          </div>

                          {/* Status indicator */}
                          {isProcessing && (
                            <div className="shrink-0">
                              <Badge className="text-[8px] h-4 px-2 bg-blue-100 text-blue-700 border-blue-300">
                                RUNNING
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>
                    </React.Fragment>
                  )
                })}

                {/* Connector line to END */}
                <div className="w-1 h-4 bg-gradient-to-b from-gray-200 to-gray-300 rounded-full" />

                {/* END indicator */}
                <div className="flex justify-center mt-1">
                  <div className="bg-white border border-gray-200 rounded-lg px-3 py-1">
                    <span className="text-xs font-bold text-[#0075ff]">End</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t flex-shrink-0">
          {hasValidated ? (
            // Stage 2: After validation - Clean success card
            <div className="space-y-4">
              {/* Clean Success Card */}
              <div
                className="border border-green-300 rounded-xl p-3"
                style={{
                  background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.4) 100%), linear-gradient(90deg, rgba(240, 253, 244, 1) 0%, rgba(240, 253, 244, 1) 100%)'
                }}
              >
                <div className="space-y-3">
                  {/* Heading */}
                  <h4 className="text-base font-normal">Summary of value</h4>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-3 gap-4 py-2">
                    <div className="text-center">
                      <div className="text-2xl text-gray-800 leading-9">{resolutionTime} mins</div>
                      <div className="text-xs text-muted-foreground leading-none mt-1">Resolution time</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl text-gray-800 leading-9">{timeSaved}hr</div>
                      <div className="text-xs text-muted-foreground leading-none mt-1">Time saved</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl text-gray-800 leading-9">${perTicket}</div>
                      <div className="text-xs text-muted-foreground leading-none mt-1">Per ticket</div>
                    </div>
                  </div>

                  {/* Green Separator */}
                  <div className="h-px bg-green-400" />

                  {/* Annual Savings */}
                  <div className="flex items-end justify-between text-sm">
                    <div className="space-y-1">
                      <p className="font-semibold text-neutral-950">Annual savings (this cluster)</p>
                      <p className="text-neutral-950">Based on {ticketCount.toLocaleString()}tickets/year × ${perTicket}/ticket</p>
                    </div>
                    <p className="text-[22px] font-semibold text-neutral-950">${annualSavings.toLocaleString()} /year</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                >
                  Maybe Later
                </Button>
                <motion.button
                  onClick={handleShowPricing}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 17
                  }}
                  className="relative flex-1 border border-[#3d8bff] rounded-sm px-4 py-2 flex items-center justify-center gap-1 overflow-hidden"
                  style={{
                    background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.93) 0%, rgba(255, 255, 255, 0.93) 100%), linear-gradient(90deg, rgba(61, 139, 255, 1) 0%, rgba(87, 34, 246, 1) 48.798%, rgba(151, 71, 255, 1) 97.596%)'
                  }}
                >
                  <Crown className="w-3 h-3 text-purple-600" />
                  <span className="text-xs text-foreground relative z-10">Upgrade to Auto-Resolve</span>
                  <BorderBeam
                    size={40}
                    initialOffset={20}
                    colorFrom="#3d8bff"
                    colorTo="#9747ff"
                    className="from-transparent via-blue-500 to-transparent"
                    transition={{
                      type: "spring",
                      stiffness: 60,
                      damping: 20,
                    }}
                  />
                </motion.button>
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

      {/* Pricing Modal */}
      <PricingModal
        isOpen={showPricingModal}
        onClose={handlePricingClose}
        onUpgrade={handlePlanUpgrade}
      />
    </div>
  )
}
