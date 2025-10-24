/**
 * TicketGroupDetailPage - Ticket group detail view
 *
 * Design source: https://www.figma.com/design/TBw4XFq0g6o1S0y8xt5tLK/AutoPilot?node-id=183-138228
 */

import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Info, Sparkles, Zap, GitBranch, ChevronDown, Crown, X, Wand2 } from 'lucide-react'
import confetti from 'canvas-confetti'
import RitaLayout from '../components/layouts/RitaLayout'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts'
import { Checkbox } from '@/components/ui/checkbox'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import AutoRespondPanel from '../components/tickets/AutoRespondPanel'
import EnrichmentModal from '../components/tickets/EnrichmentModal'
import CreateKnowledgePanel from '../components/tickets/CreateKnowledgePanel'

// Mock ticket data
interface Ticket {
  id: string
  priority: 'low' | 'med' | 'high'
  title: string
  time: string
}

// Mock tickets by group
const TICKETS_BY_GROUP: Record<string, Ticket[]> = {
  '1': [ // Email Signatures
    { id: 'INC0006032', priority: 'med', title: 'Email signature not displaying correctly', time: '2h' },
    { id: 'INC0006541', priority: 'med', title: 'Signature includes outdated disclaimer', time: '4h' },
    { id: 'INC0007129', priority: 'med', title: 'Email signature missing company logo', time: '1d' },
    { id: 'INC0007241', priority: 'low', title: 'Signature format breaks in Outlook', time: '2d' },
    { id: 'INC0008012', priority: 'med', title: 'Signature showing wrong department', time: '3d' },
    { id: 'INC0008451', priority: 'high', title: 'Signature missing contact information', time: '5h' },
  ],
  '2': [ // Password Resets
    { id: 'INC0009821', priority: 'high', title: 'Unable to reset password via email', time: '1h' },
    { id: 'INC0009932', priority: 'med', title: 'Password reset link expired', time: '3h' },
    { id: 'INC0010054', priority: 'high', title: 'Account locked after password reset attempt', time: '6h' },
    { id: 'INC0010165', priority: 'med', title: 'Reset password email not received', time: '1d' },
    { id: 'INC0010276', priority: 'low', title: 'New password not meeting complexity requirements', time: '2d' },
    { id: 'INC0010387', priority: 'med', title: 'Password reset not working for AD account', time: '4h' },
  ],
  '3': [ // Network Connectivity
    { id: 'INC0011498', priority: 'high', title: 'WiFi connection keeps dropping', time: '30m' },
    { id: 'INC0011509', priority: 'high', title: 'Cannot connect to corporate network', time: '1h' },
    { id: 'INC0011610', priority: 'med', title: 'Slow network performance in building B', time: '5h' },
    { id: 'INC0011721', priority: 'med', title: 'Ethernet port not working at desk', time: '8h' },
    { id: 'INC0011832', priority: 'low', title: 'VPN disconnects when switching networks', time: '1d' },
    { id: 'INC0011943', priority: 'high', title: 'Unable to access shared drives over network', time: '2h' },
  ],
  '4': [ // Application Crashes
    { id: 'INC0012054', priority: 'high', title: 'Outlook crashes when opening attachments', time: '45m' },
    { id: 'INC0012165', priority: 'med', title: 'Excel freezes when processing large files', time: '2h' },
    { id: 'INC0012276', priority: 'high', title: 'Teams app crashes during video calls', time: '4h' },
    { id: 'INC0012387', priority: 'med', title: 'Chrome browser crashes frequently', time: '6h' },
    { id: 'INC0012498', priority: 'high', title: 'Slack desktop app won\'t launch', time: '1d' },
    { id: 'INC0012509', priority: 'low', title: 'Adobe Acrobat crashes when saving PDFs', time: '2d' },
  ],
  '5': [ // VPN Issues
    { id: 'INC0013610', priority: 'high', title: 'VPN connection timeout error', time: '1h' },
    { id: 'INC0013721', priority: 'high', title: 'Cannot connect to VPN from home', time: '3h' },
    { id: 'INC0013832', priority: 'med', title: 'VPN slow performance', time: '5h' },
    { id: 'INC0013943', priority: 'high', title: 'VPN authentication failed', time: '7h' },
    { id: 'INC0014054', priority: 'med', title: 'VPN disconnects after 30 minutes', time: '1d' },
    { id: 'INC0014165', priority: 'low', title: 'Split tunnel VPN not working', time: '2d' },
  ],
  '6': [ // System Overload
    { id: 'INC0015276', priority: 'high', title: 'Computer running extremely slow', time: '2h' },
    { id: 'INC0015387', priority: 'high', title: 'High CPU usage from unknown process', time: '4h' },
    { id: 'INC0015498', priority: 'med', title: 'System freezing during startup', time: '6h' },
    { id: 'INC0015509', priority: 'high', title: 'Out of memory errors', time: '8h' },
    { id: 'INC0015610', priority: 'med', title: 'Disk space running low on C drive', time: '1d' },
    { id: 'INC0015721', priority: 'low', title: 'Fan running constantly, system overheating', time: '2d' },
  ],
  '7': [ // Signatures Preferences
    { id: 'INC0016832', priority: 'low', title: 'Cannot change default email signature', time: '3h' },
    { id: 'INC0016943', priority: 'med', title: 'Signature preferences not saving', time: '5h' },
    { id: 'INC0017054', priority: 'low', title: 'Multiple signatures showing in dropdown', time: '7h' },
    { id: 'INC0017165', priority: 'low', title: 'Signature font size not updating', time: '1d' },
    { id: 'INC0017276', priority: 'med', title: 'Cannot set different signatures per account', time: '2d' },
    { id: 'INC0017387', priority: 'low', title: 'Signature template not applying to new emails', time: '3d' },
  ],
  '8': [ // Performance Optimization
    { id: 'INC0018498', priority: 'med', title: 'Browser performance degradation', time: '4h' },
    { id: 'INC0018509', priority: 'high', title: 'Database queries running slow', time: '6h' },
    { id: 'INC0018610', priority: 'med', title: 'Application load time increased', time: '8h' },
    { id: 'INC0018721', priority: 'med', title: 'File server response time slow', time: '1d' },
    { id: 'INC0018832', priority: 'low', title: 'Email sync taking too long', time: '2d' },
    { id: 'INC0018943', priority: 'low', title: 'Print jobs queued, not processing', time: '3d' },
  ],
  '9': [ // Connection Troubleshooting
    { id: 'INC0020054', priority: 'med', title: 'Cannot connect to printer', time: '2h' },
    { id: 'INC0020165', priority: 'high', title: 'Remote desktop connection failing', time: '4h' },
    { id: 'INC0020276', priority: 'high', title: 'Cannot access company intranet', time: '6h' },
    { id: 'INC0020387', priority: 'high', title: 'SSH connection refused to server', time: '8h' },
    { id: 'INC0020498', priority: 'med', title: 'Database connection timeout', time: '1d' },
    { id: 'INC0020509', priority: 'low', title: 'FTP connection not establishing', time: '2d' },
  ],
}

// Mock ticket group data
const TICKET_GROUPS: Record<string, { title: string; count: number; open: number; automated: number; knowledgeCount: number }> = {
  '1': { title: 'Email Signatures', count: 976, open: 14, automated: 0, knowledgeCount: 3 },
  '2': { title: 'Password Resets', count: 743, open: 8, automated: 0, knowledgeCount: 1 },
  '3': { title: 'Network Connectivity', count: 564, open: 12, automated: 0, knowledgeCount: 2 },
  '4': { title: 'Application Crashes', count: 121, open: 6, automated: 0, knowledgeCount: 1 },
  '5': { title: 'VPN Issues', count: 45, open: 5, automated: 0, knowledgeCount: 0 },
  '6': { title: 'System Overload', count: 32, open: 4, automated: 0, knowledgeCount: 0 },
  '7': { title: 'Signatures Preferences', count: 21, open: 3, automated: 0, knowledgeCount: 1 },
  '8': { title: 'Performance Optimization', count: 11, open: 2, automated: 0, knowledgeCount: 0 },
  '9': { title: 'Connection Troubleshooting', count: 4, open: 2, automated: 0, knowledgeCount: 1 },
}

// Initial chart data (will be made dynamic)
const INITIAL_CHART_DATA = [
  { month: 'Jan', manual: 45, automated: 0 },
  { month: 'Feb', manual: 52, automated: 0 },
  { month: 'Mar', manual: 48, automated: 0 },
  { month: 'Apr', manual: 38, automated: 0 },
  { month: 'May', manual: 42, automated: 0 },
  { month: 'Jun', manual: 41, automated: 0 },
]

const chartConfig = {
  manual: {
    label: 'Manual',
    color: '#9747FF',
  },
  automated: {
    label: 'Automated',
    color: '#07EFD4',
  },
}

// Mock AI response generator
const generateMockAIResponse = (ticket: Ticket): string => {
  if (ticket.id === 'INC0006032') {
    return `Hi {name},

Thank you for reaching out about your email signature. I'd be happy to help you update it to reflect your new role.

Here are the steps to update your email signature:

• Open Outlook and navigate to File > Options > Mail
• Click on "Signatures" button
• Select your existing signature or create a new one
• Update your information (name, contact details)
• Click OK to save and apply to new messages

Please let me know if these steps resolve your issue. If you need any additional assistance with formatting or have questions, I'm here to help!`
  }

  return `Hi {name},

Thank you for contacting IT support. I've analyzed your issue and here's the recommended solution:

Based on your request, I recommend the following steps to resolve this issue. Please follow the instructions carefully and let me know if you need any clarification.

If this doesn't resolve your issue, please reply with additional details and I'll be happy to provide further assistance.`
}

// Mock KB articles
const getMockKBArticles = (ticketId: string) => {
  if (ticketId === 'INC0006032') {
    return [
      {
        id: 'KB0004',
        title: 'Email Signature Configuration Guide',
        confidence: 92,
        confidenceLabel: 'strong',
      },
    ]
  }
  return []
}

export default function TicketGroupDetailPage() {
  const { groupId } = useParams<{ groupId: string }>()
  const navigate = useNavigate()

  const group = groupId ? TICKET_GROUPS[groupId] : null
  const tickets = groupId ? TICKETS_BY_GROUP[groupId] || [] : []

  const [selectedTickets, setSelectedTickets] = useState<Set<string>>(new Set())
  const [sortBy, setSortBy] = useState('newest')
  const [showAutoRespondPanel, setShowAutoRespondPanel] = useState(false)
  const [autoRespondIndex, setAutoRespondIndex] = useState(0)
  const [trainingResults, setTrainingResults] = useState<{
    trusted: number
    taught: number
    total: number
  }>({ trusted: 0, taught: 0, total: 0 })
  const [validatedCount, setValidatedCount] = useState(0)

  // Real-time data states
  const [chartData, setChartData] = useState(INITIAL_CHART_DATA)
  const [openTicketsCount, setOpenTicketsCount] = useState(group?.open || 0)
  const [automatedTicketsCount, setAutomatedTicketsCount] = useState(0)
  const [automationPercentage, setAutomationPercentage] = useState(0)
  const [showSuccessBanner, setShowSuccessBanner] = useState(false)
  const [timeSaved, setTimeSaved] = useState(0)
  const [isAutoRespondEnabled, setIsAutoRespondEnabled] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showDisableModal, setShowDisableModal] = useState(false)

  // Auto-populate states
  const [showEnrichmentModal, setShowEnrichmentModal] = useState(false)
  const [enrichmentContext, setEnrichmentContext] = useState<'group' | 'selected'>('group')
  const [isAutoPopulateEnabled, setIsAutoPopulateEnabled] = useState(false)
  const [enrichedTicketsCount, setEnrichedTicketsCount] = useState(0)
  const [showEnrichmentSuccess, setShowEnrichmentSuccess] = useState(false)
  const [lastEnrichmentCount, setLastEnrichmentCount] = useState(0)
  const [pendingUpdates, setPendingUpdates] = useState<{
    count: number
    details: Array<{
      type: 'improved' | 'low-confidence' | 'new-mapping' | 'manual-review'
      ticketCount: number
      description: string
    }>
  } | null>(null)
  const [showReviewUpdatesModal, setShowReviewUpdatesModal] = useState(false)

  // Knowledge states
  const [showCreateKnowledgePanel, setShowCreateKnowledgePanel] = useState(false)
  const [knowledgeCount, setKnowledgeCount] = useState(group?.knowledgeCount || 0)
  const [showKnowledgeSuccess, setShowKnowledgeSuccess] = useState(false)
  const [lastCreatedArticle, setLastCreatedArticle] = useState('')
  const hasKnowledgeGap = knowledgeCount === 0

  // Knowledge confetti celebration (book/star theme)
  const triggerKnowledgeCelebration = () => {
    const count = 200
    const defaults = {
      origin: { y: 0.7 },
      zIndex: 100,
    }

    function fire(particleRatio: number, opts: any) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      })
    }

    // Fire sparkle bursts with blue/purple theme (knowledge colors)
    fire(0.25, {
      spread: 26,
      startVelocity: 55,
      shapes: ['circle'],
      colors: ['#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#c084fc'],
    })
    fire(0.2, {
      spread: 60,
      shapes: ['circle'],
      colors: ['#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#c084fc'],
    })
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
      shapes: ['circle'],
      colors: ['#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#c084fc'],
    })
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
      shapes: ['circle'],
      colors: ['#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#c084fc'],
    })
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
      shapes: ['circle'],
      colors: ['#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#c084fc'],
    })
  }

  // Handle creating knowledge article
  const handleCreateKnowledge = (article: { title: string; content: string; sources: string[] }) => {
    console.log('📚 Creating knowledge article:', article)

    // In real implementation, this would:
    // 1. Send article to backend via Rita Go → Actions → Rabbit pattern
    // 2. Store article in knowledge base
    // 3. Update group metadata

    // Update knowledge count
    setKnowledgeCount((prev) => prev + 1)

    // Store article title for success message
    setLastCreatedArticle(article.title)

    // Close the panel
    setShowCreateKnowledgePanel(false)

    // Show success banner
    setShowKnowledgeSuccess(true)

    // 🎉 CELEBRATION! Fire knowledge confetti
    triggerKnowledgeCelebration()

    // TODO: Send create knowledge action to backend via Rita Go → Actions → Rabbit pattern
  }

  // Update real-time metrics (chart, open tickets, automation %)
  const updateRealTimeMetrics = () => {
    // Decrement open tickets count
    setOpenTicketsCount((prev) => Math.max(0, prev - 1))

    // Increment automated tickets count
    setAutomatedTicketsCount((prev) => prev + 1)

    // Calculate new automation percentage
    const totalTickets = group?.count || 0
    const newAutomatedCount = automatedTicketsCount + 1
    const newPercentage = totalTickets > 0 ? Math.round((newAutomatedCount / totalTickets) * 100) : 0
    setAutomationPercentage(newPercentage)

    // Update chart data - add to automated count in current month (Jun)
    setChartData((prev) => {
      const updated = [...prev]
      const lastIndex = updated.length - 1
      updated[lastIndex] = {
        ...updated[lastIndex],
        automated: updated[lastIndex].automated + 1,
        manual: Math.max(0, updated[lastIndex].manual - 1),
      }
      return updated
    })

    // Calculate time saved (assume 10 minutes per ticket)
    setTimeSaved((prev) => prev + 10)
  }

  // Handle enable button click - show confirmation modal
  const handleEnableClick = () => {
    setShowConfirmModal(true)
  }

  // Fireworks confetti celebration
  const triggerConfettiCelebration = () => {
    const duration = 3000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 }

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min
    }

    const interval = window.setInterval(() => {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)

      // Fire confetti from random positions
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#10b981', '#06b6d4', '#8b5cf6', '#f59e0b', '#ec4899'],
      })
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#10b981', '#06b6d4', '#8b5cf6', '#f59e0b', '#ec4899'],
      })
    }, 250)
  }

  // Handle confirming auto-respond enablement
  const handleConfirmEnable = () => {
    console.log('🎉 Auto-Respond enabled for group!')

    // Calculate metrics for ALL remaining open tickets
    const remainingOpenTickets = openTicketsCount
    const timePerTicket = 10 // minutes
    const totalTimeSavedForGroup = remainingOpenTickets * timePerTicket

    // Update all metrics to reflect full automation
    setAutomatedTicketsCount(remainingOpenTickets)
    setTimeSaved(totalTimeSavedForGroup)
    setOpenTicketsCount(0) // All tickets are now automated
    setAutomationPercentage(100) // 100% automated

    // Update chart to show all tickets as automated
    setChartData((prev) => {
      const updated = [...prev]
      const lastIndex = updated.length - 1
      updated[lastIndex] = {
        ...updated[lastIndex],
        automated: updated[lastIndex].manual, // Transfer all manual to automated
        manual: 0,
      }
      return updated
    })

    // Show success banner
    setShowSuccessBanner(true)

    // Mark auto-respond as enabled
    setIsAutoRespondEnabled(true)

    // Close modal
    setShowConfirmModal(false)

    // 🎉 CELEBRATION! Fire confetti
    triggerConfettiCelebration()

    // TODO: Send enable auto-respond action to backend via Rita Go → Actions → Rabbit pattern
  }

  // Handle disable button click - show confirmation modal
  const handleDisableClick = () => {
    setShowDisableModal(true)
  }

  // Handle confirming auto-respond disablement
  const handleConfirmDisable = () => {
    console.log('⚠️ Auto-Respond disabled for group')

    // Reset metrics back to initial state
    setAutomatedTicketsCount(0)
    setTimeSaved(0)
    setOpenTicketsCount(group?.open || 0)
    setAutomationPercentage(0)

    // Reset chart to initial state
    setChartData(INITIAL_CHART_DATA)

    // Hide success banner
    setShowSuccessBanner(false)

    // Mark auto-respond as disabled
    setIsAutoRespondEnabled(false)

    // Close modal
    setShowDisableModal(false)

    // TODO: Send disable auto-respond action to backend via Rita Go → Actions → Rabbit pattern
  }

  // Mock field predictions for auto-populate
  const fieldPredictions = [
    { type: 'Category', currentValue: 'General Inquiry', predictedValue: 'Email Signature' },
    { type: 'Sub Category', currentValue: '--', predictedValue: 'Applications' },
    { type: 'Priority', currentValue: '--', predictedValue: 'Low' },
    { type: 'CI', currentValue: '--', predictedValue: 'Active Directory' },
    { type: 'Business Service', currentValue: '--', predictedValue: 'Identity Management' },
  ]

  // Handle auto-populate for selected tickets
  const handleAutoPopulateSelected = () => {
    setEnrichmentContext('selected')
    setShowEnrichmentModal(true)
  }

  // Handle enable auto-populate for entire group
  const handleEnableAutoPopulate = () => {
    setEnrichmentContext('group')
    setShowEnrichmentModal(true)
  }

  // Handle applying pending updates
  const handleApplyUpdates = () => {
    if (!pendingUpdates) return

    console.log('✅ Applying updates:', pendingUpdates)

    // Update enriched count with the new tickets
    setEnrichedTicketsCount((prev) => prev + pendingUpdates.count)

    // Show success message
    setLastEnrichmentCount(pendingUpdates.count)
    setShowEnrichmentSuccess(true)

    // Fire celebration
    triggerEnrichmentCelebration()

    // Clear pending updates
    setPendingUpdates(null)
    setShowReviewUpdatesModal(false)

    // TODO: Send update action to backend
  }

  // Handle dismissing pending updates
  const handleDismissUpdates = () => {
    console.log('⏭️ Dismissing updates')
    setPendingUpdates(null)
    setShowReviewUpdatesModal(false)
  }

  // Sparkle confetti celebration for enrichment
  const triggerEnrichmentCelebration = () => {
    const count = 200
    const defaults = {
      origin: { y: 0.7 },
      zIndex: 100,
    }

    function fire(particleRatio: number, opts: any) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      })
    }

    // Fire sparkle bursts with teal/green theme
    fire(0.25, {
      spread: 26,
      startVelocity: 55,
      shapes: ['star'],
      colors: ['#14b8a6', '#06b6d4', '#10b981', '#34d399', '#6ee7b7'],
    })
    fire(0.2, {
      spread: 60,
      shapes: ['star'],
      colors: ['#14b8a6', '#06b6d4', '#10b981', '#34d399', '#6ee7b7'],
    })
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
      shapes: ['star'],
      colors: ['#14b8a6', '#06b6d4', '#10b981', '#34d399', '#6ee7b7'],
    })
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
      shapes: ['star'],
      colors: ['#14b8a6', '#06b6d4', '#10b981', '#34d399', '#6ee7b7'],
    })
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
      shapes: ['star'],
      colors: ['#14b8a6', '#06b6d4', '#10b981', '#34d399', '#6ee7b7'],
    })
  }

  // Simulate detecting updates after enabling (mock for demo)
  const simulateUpdateDetection = () => {
    // Simulate detection after 8 seconds
    setTimeout(() => {
      const mockUpdates = {
        count: 12,
        details: [
          {
            type: 'improved' as const,
            ticketCount: 8,
            description: 'Higher confidence predictions available (70% → 95%)',
          },
          {
            type: 'new-mapping' as const,
            ticketCount: 4,
            description: 'New CI mappings detected based on recent patterns',
          },
        ],
      }
      setPendingUpdates(mockUpdates)
      console.log('🔔 Auto-Populate: Updates detected', mockUpdates)
    }, 8000)
  }

  // Handle confirming enrichment
  const handleConfirmEnrichment = () => {
    const ticketsToEnrich = enrichmentContext === 'group' ? openTicketsCount : selectedTickets.size

    console.log(`🎨 Auto-Populate: Enriching ${ticketsToEnrich} tickets`)

    // Update enriched count
    setEnrichedTicketsCount((prev) => prev + ticketsToEnrich)
    setLastEnrichmentCount(ticketsToEnrich)

    if (enrichmentContext === 'group') {
      // Mark as enabled for entire group
      setIsAutoPopulateEnabled(true)

      // Simulate detection of updates after enabling
      simulateUpdateDetection()
    }

    // Close modal
    setShowEnrichmentModal(false)

    // Clear selection if enriching selected tickets
    if (enrichmentContext === 'selected') {
      clearSelection()
    }

    // Show success banner
    setShowEnrichmentSuccess(true)

    // 🎉 CELEBRATION! Fire sparkle confetti
    triggerEnrichmentCelebration()

    // TODO: Send enrichment data to backend via Rita Go → Actions → Rabbit pattern
  }

  const toggleTicketSelection = (ticketId: string) => {
    const newSelected = new Set(selectedTickets)
    if (newSelected.has(ticketId)) {
      newSelected.delete(ticketId)
    } else {
      newSelected.add(ticketId)
    }
    setSelectedTickets(newSelected)
  }

  const clearSelection = () => {
    setSelectedTickets(new Set())
  }

  const handleAutoRespond = () => {
    setAutoRespondIndex(0)
    setShowAutoRespondPanel(true)
    setTrainingResults({ trusted: 0, taught: 0, total: selectedTickets.size })
  }

  const handleAutoRespondNext = () => {
    setAutoRespondIndex((prev) => prev + 1)
  }

  const handleAutoRespondTrust = (ticketId: string, response: string) => {
    console.log('✅ Trust feedback for ticket:', ticketId, 'Response:', response)

    // Update training results
    setTrainingResults((prev) => ({
      ...prev,
      trusted: prev.trusted + 1,
    }))

    // Update validated count for right sidebar
    setValidatedCount((prev) => prev + 1)

    // Update real-time metrics
    updateRealTimeMetrics()

    // TODO: Send positive feedback to backend via Rita Go → Actions → Rabbit pattern
  }

  const handleAutoRespondTeach = (ticketId: string, response: string, feedback?: string, tags?: string[]) => {
    console.log('⚠️ Teach feedback for ticket:', ticketId, {
      response,
      feedback,
      tags,
    })

    // Update training results
    setTrainingResults((prev) => ({
      ...prev,
      taught: prev.taught + 1,
    }))

    // Update validated count for right sidebar
    setValidatedCount((prev) => prev + 1)

    // Update real-time metrics
    updateRealTimeMetrics()

    // TODO: Send negative feedback to backend via Rita Go → Actions → Rabbit pattern
  }

  const handleAutoRespondClose = () => {
    setShowAutoRespondPanel(false)
    setAutoRespondIndex(0)
    clearSelection()
  }

  // Prepare tickets for auto-respond panel
  const selectedTicketIds = Array.from(selectedTickets)
  const autoRespondTickets = selectedTicketIds.map((ticketId) => {
    const ticket = tickets.find((t) => t.id === ticketId)
    if (!ticket) return null

    return {
      id: ticket.id,
      priority: ticket.priority,
      title: ticket.title,
      description: `User needs assistance with ${ticket.title.toLowerCase()}. Please provide guidance on how to resolve this issue.`,
      aiResponse: generateMockAIResponse(ticket),
      kbArticles: getMockKBArticles(ticket.id),
    }
  }).filter((t) => t !== null) as Array<{
    id: string
    priority: 'low' | 'med' | 'high'
    title: string
    description: string
    aiResponse: string
    kbArticles: Array<{
      id: string
      title: string
      confidence: number
      confidenceLabel: string
    }>
  }>

  const getPriorityColor = (priority: 'low' | 'med' | 'high') => {
    switch (priority) {
      case 'low':
        return 'bg-blue-100 text-blue-600 border-blue-200'
      case 'med':
        return 'bg-yellow-100 text-yellow-600 border-yellow-200'
      case 'high':
        return 'bg-red-100 text-red-600 border-red-200'
    }
  }

  const getPriorityLabel = (priority: 'low' | 'med' | 'high') => {
    switch (priority) {
      case 'low':
        return 'Low'
      case 'med':
        return 'Med'
      case 'high':
        return 'High'
    }
  }

  if (!group) {
    return (
      <RitaLayout activePage="tickets">
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">Ticket group not found</p>
        </div>
      </RitaLayout>
    )
  }

  return (
    <RitaLayout activePage="tickets">
      <div className="flex flex-col h-full">
        {/* Auto-Respond Success Banner */}
        {showSuccessBanner && (
          <div className="bg-green-50 border-b border-green-200 px-4 sm:px-6 py-3 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="text-2xl">🎉</div>
              <div>
                <h3 className="text-sm font-semibold text-green-900">
                  Great Job! You just saved {Math.floor(timeSaved / 60)} hour{Math.floor(timeSaved / 60) !== 1 ? 's' : ''}.
                </h3>
                <p className="text-xs text-green-700">
                  Your responses have been added to the local knowledge base
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowSuccessBanner(false)}
              className="text-green-700 hover:text-green-900 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Auto-Populate Success Banner */}
        {showEnrichmentSuccess && (
          <div className="bg-teal-50 border-b border-teal-200 px-4 sm:px-6 py-3 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="text-2xl">✨</div>
              <div>
                <h3 className="text-sm font-semibold text-teal-900">
                  Success! {lastEnrichmentCount} ticket{lastEnrichmentCount !== 1 ? 's' : ''} enriched with AI predictions
                </h3>
                <p className="text-xs text-teal-700">
                  Ticket fields have been automatically populated based on historical data
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowEnrichmentSuccess(false)}
              className="text-teal-700 hover:text-teal-900 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Knowledge Article Success Banner */}
        {showKnowledgeSuccess && (
          <div className="bg-blue-50 border-b border-blue-200 px-4 sm:px-6 py-3 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="text-2xl">📚</div>
              <div>
                <h3 className="text-sm font-semibold text-blue-900">
                  Knowledge article created successfully!
                </h3>
                <p className="text-xs text-blue-700">
                  "{lastCreatedArticle}" has been added to the knowledge base
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowKnowledgeSuccess(false)}
              className="text-blue-700 hover:text-blue-900 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Header */}
        <div className="px-4 sm:px-6 py-4 sm:py-6 border-b flex-shrink-0">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground mb-2">
            <button
              onClick={() => navigate('/tickets')}
              className="hover:text-foreground flex items-center gap-1"
            >
              Tickets
            </button>
            <span>›</span>
            <span className="text-foreground">{group.title}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <h1 className="text-xl sm:text-2xl font-semibold">{group.title}</h1>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                <span className="font-medium">{group.count} tickets</span>
                <span className="text-muted-foreground">{openTicketsCount} open</span>
                <span className="text-muted-foreground">{automationPercentage}% automated</span>
                {knowledgeCount > 0 ? (
                  <Badge className="bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100">
                    Knowledge found
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-300">
                    Knowledge missing
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
          {/* Main Content */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6">
            <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
              {/* Ticket Trends */}
              <Card className="p-4 sm:p-6">
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-base sm:text-lg font-semibold">Ticket Trends</h2>
                  <Info className="w-4 h-4 text-muted-foreground" />
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6">
                  Rita learned from {group.count} tickets, automatically handled {automationPercentage}%
                </p>

                {/* Chart */}
                <ChartContainer config={chartConfig} className="h-48 sm:h-64">
                  <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" vertical={false} />
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: '#737373', fontSize: 12 }}
                    />
                    <YAxis hide />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="manual"
                      stroke="#07EFD4"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="automated"
                      stroke="#9747FF"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ChartContainer>

                <div className="flex items-center justify-center gap-4 mt-4 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#07EFD4' }} />
                    <span>Manual</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#9747FF' }} />
                    <span>Automated</span>
                  </div>
                </div>
              </Card>

              {/* Ticket List */}
              <div className="flex flex-col gap-4">
                {/* Selection Toolbar */}
                {selectedTickets.size > 0 && (
                  <div className="flex items-center gap-3 px-3 py-2 bg-muted/50 rounded-lg border">
                    <span className="text-sm font-medium">
                      {selectedTickets.size} ticket{selectedTickets.size > 1 ? 's' : ''} selected
                    </span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-2">
                          <Sparkles className="w-4 h-4" />
                          Auto-Respond
                          <ChevronDown className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        <DropdownMenuItem onClick={handleAutoRespond}>
                          <Sparkles className="w-4 h-4 mr-2" style={{ color: '#a855f7' }} />
                          Auto-Respond
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleAutoPopulateSelected}>
                          <Zap className="w-4 h-4 mr-2" style={{ color: '#14b8a6' }} />
                          Auto-Populate
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <GitBranch className="w-4 h-4 mr-2" style={{ color: '#0050c7' }} />
                          Auto-Resolve
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <button
                      onClick={clearSelection}
                      className="text-sm text-muted-foreground hover:text-foreground ml-auto"
                    >
                      Clear
                    </button>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-medium">
                      {openTicketsCount} Open
                    </span>
                  </div>

                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full sm:w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="oldest">Oldest</SelectItem>
                      <SelectItem value="priority">Priority</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Tickets */}
                {isAutoRespondEnabled ? (
                  <Card className="p-6 sm:p-8 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="text-4xl">✨</div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Auto-Respond Enabled</h3>
                        <p className="text-sm text-muted-foreground">
                          All incoming tickets in this group will be automatically responded to based on your training.
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-green-600 font-medium">✓ {automatedTicketsCount} tickets automated</span>
                      </div>
                    </div>
                  </Card>
                ) : (
                  <div className="flex flex-col gap-2">
                    {tickets.map((ticket, index) => (
                      <Card
                        key={`${ticket.id}-${index}`}
                        className="p-3 sm:p-4 hover:bg-accent transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <Checkbox
                            checked={selectedTickets.has(ticket.id)}
                            onCheckedChange={() => toggleTicketSelection(ticket.id)}
                            className="mt-0.5"
                          />
                          <div
                            className="flex-1 min-w-0 cursor-pointer"
                            onClick={() => navigate(`/tickets/${groupId}/${ticket.id}`)}
                          >
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className="font-medium text-xs sm:text-sm">{ticket.id}</span>
                              <Badge className={`text-xs border ${getPriorityColor(ticket.priority)}`}>
                                {getPriorityLabel(ticket.priority)}
                              </Badge>
                            </div>
                            <p className="text-xs sm:text-sm text-muted-foreground break-words">{ticket.title}</p>
                          </div>
                          <span className="text-xs text-muted-foreground shrink-0">{ticket.time}</span>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l overflow-y-auto px-4 sm:px-6 py-4 sm:py-6 flex-shrink-0">
            <div className="flex flex-col gap-4">
              {/* Tabs */}
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="w-full">
                  <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
                  <TabsTrigger value="knowledge" className="flex-1">Knowledge ({knowledgeCount})</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-4 space-y-4">
                  {/* Metrics */}
                  <div className="border rounded-lg p-3">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="flex flex-col text-center">
                        <span className="text-2xl font-bold">{automatedTicketsCount}</span>
                        <span className="text-xs text-muted-foreground">Automated</span>
                      </div>
                      <div className="flex flex-col text-center">
                        <span className="text-2xl font-bold">{timeSaved}</span>
                        <span className="text-xs text-muted-foreground">Mins Saved</span>
                      </div>
                      <div className="flex flex-col text-center">
                        <span className="text-2xl font-bold">${Math.round(timeSaved * 0.5)}</span>
                        <span className="text-xs text-muted-foreground">Savings</span>
                      </div>
                    </div>
                  </div>

                  {/* Validation Confidence */}
                  <div className="border rounded-lg p-3">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">Validation Confidence</span>
                        <Info className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {validatedCount === 0
                          ? 'Low chance to automate successfully'
                          : validatedCount < 10
                          ? 'Moderate chance to automate successfully'
                          : 'High chance to automate successfully ✓'}
                      </p>
                      <div className="py-2">
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-500 ${
                              validatedCount < 5
                                ? 'bg-yellow-400'
                                : validatedCount < 10
                                ? 'bg-orange-400'
                                : 'bg-green-500'
                            }`}
                            style={{ width: `${(validatedCount / 16) * 100}%` }}
                          />
                        </div>
                      </div>
                      <p className="text-sm">Validated {validatedCount}/16</p>
                    </div>
                  </div>

                  {/* Knowledge Gap Detection Alert */}
                  {hasKnowledgeGap && (
                    <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-4">
                      <div className="flex flex-col gap-3">
                        <div className="flex items-start gap-2">
                          <Wand2 className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-foreground mb-1">
                              Knowledge Gap Detected
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              No knowledge articles found for this cluster.Rita recommends creating one to enable Auto-Answer.
                            </p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          className="w-full bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-medium"
                          onClick={() => setShowCreateKnowledgePanel(true)}
                        >
                          Create Knowledge Article
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Group actions */}
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2 px-1.5 py-2">
                      <span className="text-sm font-semibold">Group actions</span>
                      <ChevronDown className="w-4 h-4 opacity-50" />
                    </div>

                    <div className="flex flex-col gap-3">
                      {/* Auto-Respond */}
                      <div className="flex items-center gap-3 py-2">
                        <Sparkles className="w-4 h-4 shrink-0" style={{ color: '#a855f7' }} />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium">Auto-Respond</div>
                          <div className="text-xs text-muted-foreground">
                            {hasKnowledgeGap ? 'Needs knowledge' : '16 tickets ready'}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 shrink-0"
                          onClick={hasKnowledgeGap ? () => setShowCreateKnowledgePanel(true) : (isAutoRespondEnabled ? handleDisableClick : handleEnableClick)}
                          disabled={hasKnowledgeGap}
                        >
                          {isAutoRespondEnabled ? 'Disable' : 'Enable'}
                        </Button>
                      </div>

                      {/* Auto-Populate */}
                      <div className="flex items-center gap-3 py-2">
                        <Zap className="w-4 h-4 shrink-0" style={{ color: '#14b8a6' }} />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium">Auto-Populate</div>
                          <div className="text-xs text-muted-foreground">
                            {isAutoPopulateEnabled ? `${enrichedTicketsCount} enriched` : 'Ticket enrichment'}
                          </div>
                        </div>
                        {isAutoPopulateEnabled && pendingUpdates ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 shrink-0 gap-1"
                            onClick={() => setShowReviewUpdatesModal(true)}
                          >
                            Enabled
                            <span className="bg-orange-500 text-white text-xs rounded-full px-1.5 py-0.5 font-semibold">
                              {pendingUpdates.count}
                            </span>
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 shrink-0"
                            onClick={handleEnableAutoPopulate}
                            disabled={isAutoPopulateEnabled && !pendingUpdates}
                          >
                            {isAutoPopulateEnabled ? 'Enabled' : 'Enable'}
                          </Button>
                        )}
                      </div>

                      {/* Auto-Resolve */}
                      <div className="flex items-center gap-3 py-2">
                        <GitBranch className="w-4 h-4 shrink-0" style={{ color: '#0050c7' }} />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium">Auto-Resolve</div>
                          <div className="text-xs text-muted-foreground">Pre-set workflow</div>
                        </div>
                        <Crown className="w-4 h-4 shrink-0 text-yellow-600" />
                        <Button variant="ghost" size="sm" className="h-8 shrink-0">
                          Upgrade
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="knowledge" className="mt-4">
                  <p className="text-sm text-muted-foreground text-center py-8">Knowledge base content (coming soon)</p>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>

      {/* Auto Respond Panel */}
      {showAutoRespondPanel && autoRespondTickets.length > 0 && (
        <AutoRespondPanel
          tickets={autoRespondTickets}
          currentIndex={autoRespondIndex}
          trainingResults={trainingResults}
          onClose={handleAutoRespondClose}
          onNext={handleAutoRespondNext}
          onTrust={handleAutoRespondTrust}
          onTeach={handleAutoRespondTeach}
          onEnableAutoRespond={handleEnableClick}
        />
      )}

      {/* Enable Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowConfirmModal(false)}
          />

          {/* Modal */}
          <div className="relative bg-background rounded-lg shadow-2xl max-w-md w-full mx-4 p-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-1">Enable Auto-Respond?</h3>
                  <p className="text-sm text-muted-foreground">
                    You are about to enable automated responses for all tickets in <strong>{group.title}</strong>.
                  </p>
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <p className="text-sm">This will:</p>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• Send automated responses to <strong>{openTicketsCount} currently open tickets</strong></li>
                  <li>• Automatically respond to <strong>all future tickets</strong> matching this group</li>
                  <li>• Use the responses you've trained Rita with</li>
                </ul>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmEnable}
                  className="flex-1"
                >
                  Enable Auto-Respond
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Disable Confirmation Modal */}
      {showDisableModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowDisableModal(false)}
          />

          {/* Modal */}
          <div className="relative bg-background rounded-lg shadow-2xl max-w-md w-full mx-4 p-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Sparkles className="w-5 h-5 text-orange-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-1">Disable Auto-Respond?</h3>
                  <p className="text-sm text-muted-foreground">
                    You are about to disable automated responses for <strong>{group.title}</strong>.
                  </p>
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <p className="text-sm">This will:</p>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• Stop sending automated responses to future tickets</li>
                  <li>• Require manual handling of all tickets in this group</li>
                  <li>• Your training data will be preserved for future use</li>
                </ul>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowDisableModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmDisable}
                  className="flex-1"
                >
                  Disable Auto-Respond
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enrichment Modal for Auto-Populate */}
      <EnrichmentModal
        isOpen={showEnrichmentModal}
        onClose={() => setShowEnrichmentModal(false)}
        onConfirm={handleConfirmEnrichment}
        ticketCount={enrichmentContext === 'group' ? openTicketsCount : selectedTickets.size}
        isGroupLevel={enrichmentContext === 'group'}
        predictions={fieldPredictions}
      />

      {/* Review Updates Modal */}
      {showReviewUpdatesModal && pendingUpdates && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowReviewUpdatesModal(false)}
          />

          {/* Modal */}
          <div className="relative bg-background rounded-lg shadow-2xl max-w-lg w-full mx-4 p-6">
            <div className="flex flex-col gap-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Zap className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-1">
                      {pendingUpdates.count} Tickets Have Updates Available
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Rita detected improved predictions and new patterns for existing tickets
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowReviewUpdatesModal(false)}
                  className="text-muted-foreground hover:text-foreground p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Updates List */}
              <div className="border rounded-lg overflow-hidden">
                <div className="divide-y">
                  {pendingUpdates.details.map((update, index) => (
                    <div key={index} className="p-4 flex items-start gap-3">
                      <div className="shrink-0 mt-0.5">
                        {update.type === 'improved' && (
                          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                            <span className="text-green-600 text-sm">↑</span>
                          </div>
                        )}
                        {update.type === 'new-mapping' && (
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-600 text-sm">✦</span>
                          </div>
                        )}
                        {update.type === 'low-confidence' && (
                          <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                            <span className="text-yellow-600 text-sm">⚠</span>
                          </div>
                        )}
                        {update.type === 'manual-review' && (
                          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                            <span className="text-red-600 text-sm">!</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium mb-1">
                          {update.ticketCount} ticket{update.ticketCount !== 1 ? 's' : ''}
                        </div>
                        <div className="text-sm text-muted-foreground">{update.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Info Note */}
              <div className="flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-lg p-3">
                <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div className="text-sm text-blue-900">
                  <strong>Smart Updates</strong>
                  <p className="text-blue-700 mt-0.5">
                    These updates are automatically detected based on model improvements and new patterns learned from recent tickets.
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={handleDismissUpdates}
                  className="flex-1"
                >
                  Dismiss
                </Button>
                <Button
                  onClick={handleApplyUpdates}
                  className="flex-1"
                >
                  Review & Apply Updates
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Knowledge Panel */}
      {showCreateKnowledgePanel && (
        <CreateKnowledgePanel
          groupTitle={group.title}
          onClose={() => setShowCreateKnowledgePanel(false)}
          onCreateKnowledge={handleCreateKnowledge}
        />
      )}
    </RitaLayout>
  )
}
