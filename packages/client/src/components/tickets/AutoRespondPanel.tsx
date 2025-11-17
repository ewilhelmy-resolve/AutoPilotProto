/**
 * AutoRespondPanel - Right slide-in panel for auto-respond feature
 *
 * Design source:
 * - https://www.figma.com/design/TBw4XFq0g6o1S0y8xt5tLK/AutoPilot?node-id=183-140995
 */

import { useState, useEffect } from 'react'
import { X, ThumbsDown, ThumbsUp, FileText, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Textarea } from '@/components/ui/textarea'
import { ConfettiButton } from '@/components/ui/confetti'

interface TicketDetail {
  id: string
  priority: 'low' | 'med' | 'high'
  title: string
  description: string
  aiResponse: string
  kbArticles?: Array<{
    id: string
    title: string
    confidence: number
    confidenceLabel: string
  }>
}

interface AutoRespondPanelProps {
  tickets: TicketDetail[]
  currentIndex: number
  trainingResults: {
    trusted: number
    taught: number
    total: number
  }
  onClose: () => void
  onNext: () => void
  onTrust: (ticketId: string, response: string) => void
  onTeach: (ticketId: string, response: string, feedback?: string, tags?: string[]) => void
  onEnableAutoRespond?: () => void
}

const FEEDBACK_TAGS = [
  'Missing information',
  'Wrong tone',
  'Incorrect solution',
  'Too generic',
]

export default function AutoRespondPanel({
  tickets,
  currentIndex,
  trainingResults,
  onClose,
  onNext,
  onTrust,
  onTeach,
  onEnableAutoRespond,
}: AutoRespondPanelProps) {
  const currentTicket = tickets[currentIndex]
  const [editedResponse, setEditedResponse] = useState(currentTicket?.aiResponse || '')
  const [showFeedbackForm, setShowFeedbackForm] = useState(false)
  const [feedbackText, setFeedbackText] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [celebrating, setCelebrating] = useState(false)
  const [showSummary, setShowSummary] = useState(false)

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
        return 'Medium'
      case 'high':
        return 'High'
    }
  }

  const getConfidenceBadgeColor = (confidence: number) => {
    if (confidence >= 90) return 'bg-teal-500 text-white'
    if (confidence >= 70) return 'bg-yellow-500 text-white'
    return 'bg-red-500 text-white'
  }

  // Reset state when ticket changes
  useEffect(() => {
    setEditedResponse(currentTicket?.aiResponse || '')
    setShowFeedbackForm(false)
    setFeedbackText('')
    setSelectedTags([])
    setCelebrating(false)
  }, [currentIndex, currentTicket])

  const handleTrust = () => {
    if (!currentTicket) return
    setCelebrating(true)
    onTrust(currentTicket.id, editedResponse)

    // Auto-advance after celebration
    setTimeout(() => {
      if (currentIndex < tickets.length - 1) {
        onNext()
      } else {
        // Show summary when last ticket is completed
        setShowSummary(true)
      }
    }, 800)
  }

  const handleTeachClick = () => {
    setShowFeedbackForm(true)
  }

  const handleSkipFeedback = () => {
    if (!currentTicket) return
    onTeach(currentTicket.id, editedResponse)
    if (currentIndex < tickets.length - 1) {
      onNext()
    } else {
      // Show summary when last ticket is completed
      setShowSummary(true)
    }
  }

  const handleSubmitFeedback = () => {
    if (!currentTicket) return
    onTeach(currentTicket.id, editedResponse, feedbackText, selectedTags)
    if (currentIndex < tickets.length - 1) {
      onNext()
    } else {
      // Show summary when last ticket is completed
      setShowSummary(true)
    }
  }

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  const progressPercentage = ((currentIndex + 1) / tickets.length) * 100
  const confidenceImprovement = Math.round((trainingResults.trusted / trainingResults.total) * 100)

  // Safety check - return null if no current ticket
  if (!currentTicket && !showSummary) {
    return null
  }

  // Summary View
  if (showSummary) {
    return (
      <div className="fixed inset-0 z-50 flex items-stretch justify-end">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/20"
          onClick={onClose}
        />

        {/* Panel */}
        <div className="relative w-full max-w-2xl bg-background shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
          {/* Header - Just close button */}
          <div className="px-6 py-4 flex-shrink-0 flex justify-end">
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Summary Content */}
          <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col items-center justify-center">
            <div className="max-w-md w-full text-center space-y-8">
              {/* Main Heading */}
              <h3 className="text-2xl font-semibold">You reviewed {trainingResults.total} tickets</h3>

              {/* Confidence Improvement with Emojis */}
              <div className="relative py-8">
                <div className="space-y-2">
                  <p className="text-base text-muted-foreground">Confidence improved by</p>
                  <p className="text-6xl font-semibold">{confidenceImprovement}%</p>
                </div>
                {/* Emoji confetti decoration */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="text-2xl absolute top-0 left-1/4">🎉</div>
                  <div className="text-xl absolute top-4 right-1/4">✨</div>
                  <div className="text-lg absolute bottom-4 left-1/3">🎊</div>
                  <div className="text-xl absolute bottom-0 right-1/3">🌟</div>
                </div>
              </div>

              {/* Summary Stats */}
              <div className="flex items-center justify-center gap-8 text-sm">
                <div className="flex items-center gap-2">
                  <ThumbsDown className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Need improvement</span>
                  <span className="font-semibold">{trainingResults.taught}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ThumbsUp className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Trusted</span>
                  <span className="font-semibold">{trainingResults.trusted}</span>
                </div>
              </div>

              {/* Call to Action */}
              <p className="text-sm text-muted-foreground">
                Ready to enable Auto-Respond for this ticket group?
              </p>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="px-6 py-4 border-t flex-shrink-0">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Keep reviewing
              </Button>
              <Button
                onClick={() => {
                  if (onEnableAutoRespond) {
                    onEnableAutoRespond()
                  }
                  onClose()
                }}
                className="flex-1"
              >
                Enable Auto-Respond
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-stretch justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full max-w-2xl bg-background shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="px-6 py-4 border-b flex-shrink-0">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-1">Review AI response</h2>
              <p className="text-sm text-muted-foreground">
                Rita analyzed your KB and similar tickets to draft this response.
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 -mt-1"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">
                Tickets: {currentIndex + 1} of {tickets.length}
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="space-y-6">
            {/* Ticket Details */}
            <div>
              <h3 className="text-sm font-medium mb-3">Ticket Details</h3>
              <div className="border rounded-lg p-4 space-y-4 bg-muted/30">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-base mb-1">{currentTicket.id}</div>
                    <h4 className="text-base">{currentTicket.title}</h4>
                  </div>
                  <Badge className={`text-xs border shrink-0 ${getPriorityColor(currentTicket.priority)}`}>
                    {getPriorityLabel(currentTicket.priority)}
                  </Badge>
                </div>

                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-2">Description</div>
                  <p className="text-sm">{currentTicket.description}</p>
                </div>
              </div>
            </div>

            {/* AI Response */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-sm font-medium">AI-Response</h3>
                <Badge className="bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-100 gap-1 text-xs">
                  <Sparkles className="w-3 h-3" />
                  Auto-Respond
                </Badge>
              </div>

              <div className="border rounded-lg p-4 bg-muted/30">
                <Textarea
                  value={editedResponse}
                  onChange={(e) => setEditedResponse(e.target.value)}
                  className="min-h-[300px] text-sm resize-none bg-transparent border-0 p-0 focus-visible:ring-0"
                  placeholder="AI-generated response will appear here..."
                />

                {/* KB Articles */}
                {currentTicket.kbArticles && currentTicket.kbArticles.length > 0 && (
                  <div className="mt-4 pt-4 border-t space-y-2">
                    {currentTicket.kbArticles.map((article) => (
                      <div
                        key={article.id}
                        className="flex items-center gap-3 hover:bg-muted/50 transition-colors cursor-pointer rounded p-2 -mx-2"
                      >
                        <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                        <span className="flex-1 text-sm font-medium">{article.id} - {article.title}</span>
                        <Badge className="text-xs shrink-0 bg-gray-200 text-gray-700 border-0">+{(currentTicket.kbArticles?.length ?? 0) + 3}</Badge>
                        <Badge className={`text-xs shrink-0 ${getConfidenceBadgeColor(article.confidence)}`}>
                          {article.confidence}% {article.confidenceLabel}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t flex-shrink-0">
          {celebrating ? (
            <div className="flex items-center justify-center py-2">
              <p className="text-sm font-medium text-green-600">
                ✓ Great response! Rita is learning
              </p>
            </div>
          ) : showFeedbackForm ? (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-3">
                  Thanks! Help Rita improve (optional)
                </h4>

                {/* Quick feedback tags */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {FEEDBACK_TAGS.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                        selectedTags.includes(tag)
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-background hover:bg-accent border-border'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>

                {/* Optional text feedback */}
                <Textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="What could be improved?"
                  className="min-h-[80px] text-sm resize-none"
                />
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  onClick={handleSkipFeedback}
                  className="flex-1"
                >
                  Skip
                </Button>
                <Button
                  onClick={handleSubmitFeedback}
                  className="flex-1"
                >
                  Submit Feedback
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={handleTeachClick}
                className="gap-2 flex-1"
              >
                <ThumbsDown className="w-4 h-4" />
                Teach the Bot
              </Button>
              <ConfettiButton
                onClick={handleTrust}
                className="gap-2 flex-1"
                options={{
                  particleCount: 30,
                  spread: 60,
                  colors: ['#10b981', '#06b6d4', '#8b5cf6'],
                }}
              >
                <ThumbsUp className="w-4 h-4" />
                Trust the Bot
              </ConfettiButton>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
