/**
 * ActionsPanel - Unified actions panel for ticket cluster operations
 *
 * Inspired by Clay's Actions sidebar pattern - consolidates all available
 * actions for a ticket group in one discoverable, searchable interface.
 */

import { useState } from 'react'
import { X, Search, MessageSquare, Sparkles, Crown, FileText, Zap, TrendingUp, Download, GraduationCap, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

interface Action {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  category: 'automation' | 'knowledge' | 'analysis' | 'training'
  status: 'enabled' | 'disabled' | 'available' | 'premium'
  creditCost?: number
  isPremium?: boolean
  badge?: string
  onAction: () => void
}

interface ActionsPanelProps {
  isOpen: boolean
  onClose: () => void
  groupTitle: string
  ticketCount: number
  actions: Action[]
}

export default function ActionsPanel({
  isOpen,
  onClose,
  groupTitle,
  ticketCount,
  actions,
}: ActionsPanelProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('automation')

  if (!isOpen) return null

  // Filter actions by search and category
  const filteredActions = actions.filter((action) => {
    const matchesSearch =
      searchQuery === '' ||
      action.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      action.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = action.category === activeTab

    return matchesSearch && matchesCategory
  })

  const getStatusColor = (status: Action['status']) => {
    switch (status) {
      case 'enabled':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'disabled':
        return 'bg-gray-100 text-gray-600 border-gray-200'
      case 'available':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'premium':
        return 'bg-amber-100 text-amber-700 border-amber-200'
    }
  }

  const getStatusLabel = (status: Action['status']) => {
    switch (status) {
      case 'enabled':
        return 'Enabled'
      case 'disabled':
        return 'Disabled'
      case 'available':
        return 'Available'
      case 'premium':
        return 'Premium'
    }
  }

  const categoryIcons = {
    automation: <Zap className="w-4 h-4" />,
    knowledge: <FileText className="w-4 h-4" />,
    analysis: <TrendingUp className="w-4 h-4" />,
    training: <GraduationCap className="w-4 h-4" />,
  }

  const categoryLabels = {
    automation: 'Automation',
    knowledge: 'Knowledge',
    analysis: 'Analysis',
    training: 'Training',
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
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-1">Actions</h2>
              <p className="text-sm text-muted-foreground">
                Available actions for <strong>{groupTitle}</strong> ({ticketCount.toLocaleString()} tickets)
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

          {/* Search */}
          <div className="mt-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search actions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
          <div className="px-6 pt-4 border-b flex-shrink-0">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="automation" className="flex items-center gap-1.5">
                {categoryIcons.automation}
                <span className="hidden sm:inline">Automation</span>
              </TabsTrigger>
              <TabsTrigger value="knowledge" className="flex items-center gap-1.5">
                {categoryIcons.knowledge}
                <span className="hidden sm:inline">Knowledge</span>
              </TabsTrigger>
              <TabsTrigger value="analysis" className="flex items-center gap-1.5">
                {categoryIcons.analysis}
                <span className="hidden sm:inline">Analysis</span>
              </TabsTrigger>
              <TabsTrigger value="training" className="flex items-center gap-1.5">
                {categoryIcons.training}
                <span className="hidden sm:inline">Training</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <TabsContent value={activeTab} className="mt-0 px-6 py-6">
              {filteredActions.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Info className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">
                    {searchQuery ? 'No actions match your search.' : `No actions available in ${categoryLabels[activeTab as keyof typeof categoryLabels]}.`}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredActions.map((action) => (
                    <button
                      key={action.id}
                      onClick={action.onAction}
                      className="w-full text-left border rounded-lg p-4 hover:border-primary hover:bg-accent/50 transition-all group"
                    >
                      <div className="flex items-start gap-3">
                        {/* Icon */}
                        <div className="shrink-0 mt-0.5">
                          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                            {action.icon}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-sm font-semibold">{action.name}</h4>
                            {action.isPremium && (
                              <Crown className="w-3.5 h-3.5 text-amber-600" />
                            )}
                            {action.badge && (
                              <Badge variant="outline" className="text-xs">
                                {action.badge}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">
                            {action.description}
                          </p>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={`text-xs ${getStatusColor(action.status)}`}>
                              {getStatusLabel(action.status)}
                            </Badge>
                            {action.creditCost !== undefined && (
                              <Badge variant="outline" className="text-xs">
                                {action.creditCost === 0 ? 'Free' : `${action.creditCost} credit${action.creditCost !== 1 ? 's' : ''}`}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>

        {/* Footer Tip */}
        <div className="px-6 py-3 border-t flex-shrink-0 bg-muted/30">
          <p className="text-xs text-muted-foreground">
            💡 Tip: Actions run on all tickets in this group. Use filters or select specific tickets for targeted operations.
          </p>
        </div>
      </div>
    </div>
  )
}
