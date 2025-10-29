/**
 * DemoControlsPanel - Demo and presentation controls
 *
 * Provides quick access controls for demonstrating Rita features.
 * Includes navigation shortcuts, modal triggers, and demo scenarios.
 */

import { useNavigate } from 'react-router-dom'
import {
  Play,
  Zap,
  FileText,
  MessageSquare,
  Crown,
  LayoutDashboard,
  Settings,
  Users,
  BarChart3,
  RefreshCw,
  Upload,
  BookPlus,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'

export function DemoControlsPanel() {
  const navigate = useNavigate()

  // Quick navigation handlers
  const handleNavigate = (path: string, label: string) => {
    navigate(path)
    toast.success(`Navigated to ${label}`)
  }

  // Demo scenario handlers
  const handleResetDemo = () => {
    // Clear localStorage demo state
    localStorage.removeItem('hasSeenWelcome')
    localStorage.removeItem('demoState')
    localStorage.removeItem('demo:hasImportedTickets')
    toast.success('Demo state reset - reload page to see initial state')
  }

  const handleLoadScenario = (scenario: string) => {
    toast.success(`Loaded demo scenario: ${scenario}`)
    // In a real implementation, this would set up specific demo data
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Play className="h-5 w-5 text-muted-foreground" />
        <div>
          <h2 className="text-lg font-semibold">Demo Controls</h2>
          <p className="text-sm text-muted-foreground">
            Quick access to features for demonstrations
          </p>
        </div>
      </div>

      {/* Quick Navigation */}
      <Card className="p-6">
        <h3 className="font-medium mb-4">Quick Navigation</h3>
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="justify-start gap-2"
            onClick={() => handleNavigate('/dashboard', 'Dashboard')}
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Button>

          <Button
            variant="outline"
            className="justify-start gap-2"
            onClick={() => handleNavigate('/tickets', 'Tickets')}
          >
            <FileText className="h-4 w-4" />
            Tickets
          </Button>

          <Button
            variant="outline"
            className="justify-start gap-2"
            onClick={() => handleNavigate('/tickets/1', 'Email Signatures Group')}
          >
            <BarChart3 className="h-4 w-4" />
            Email Signatures
          </Button>

          <Button
            variant="outline"
            className="justify-start gap-2"
            onClick={() => handleNavigate('/v1/chat', 'Chat Interface')}
          >
            <MessageSquare className="h-4 w-4" />
            Chat
          </Button>

          <Button
            variant="outline"
            className="justify-start gap-2"
            onClick={() => handleNavigate('/settings', 'Settings')}
          >
            <Settings className="h-4 w-4" />
            Settings
          </Button>

          <Button
            variant="outline"
            className="justify-start gap-2"
            onClick={() => handleNavigate('/settings/users', 'Users')}
          >
            <Users className="h-4 w-4" />
            Users
          </Button>
        </div>
      </Card>

      {/* Feature Demos */}
      <Card className="p-6">
        <h3 className="font-medium mb-4">Feature Demonstrations</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Navigate to specific features to demo Rita's automation capabilities
        </p>
        <div className="space-y-3">
          {/* Auto-Respond */}
          <div className="flex items-start gap-3 p-3 border rounded-lg">
            <MessageSquare className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm mb-1">Auto-Respond</div>
              <p className="text-xs text-muted-foreground mb-2">
                Train Rita to draft responses based on your knowledge base
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  navigate('/tickets/1')
                  toast.info('Click "Train Rita" button in sidebar to demo Auto-Respond')
                }}
              >
                Go to Demo
              </Button>
            </div>
          </div>

          {/* Auto-Populate */}
          <div className="flex items-start gap-3 p-3 border rounded-lg">
            <Zap className="h-5 w-5 text-teal-600 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm mb-1">Auto-Populate</div>
              <p className="text-xs text-muted-foreground mb-2">
                Automatically populate ticket fields using AI predictions
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  navigate('/tickets/1')
                  toast.info('Click "Actions" dropdown and select "Auto-Populate"')
                }}
              >
                Go to Demo
              </Button>
            </div>
          </div>

          {/* Knowledge Gap Detection */}
          <div className="flex items-start gap-3 p-3 border rounded-lg">
            <Zap className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm mb-1">Knowledge Gap Detection</div>
              <p className="text-xs text-muted-foreground mb-2">
                Identify missing knowledge and generate articles with AI
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  navigate('/tickets/5')
                  toast.info('Look for yellow Knowledge Gap badge with "Fill Gap" button')
                }}
              >
                Go to Demo
              </Button>
            </div>
          </div>

          {/* Auto-Resolve */}
          <div className="flex items-start gap-3 p-3 border rounded-lg bg-amber-50/50 border-amber-200">
            <Crown className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm mb-1 text-amber-900">
                Auto-Resolve (Premium)
              </div>
              <p className="text-xs text-muted-foreground mb-2">
                Automated end-to-end ticket resolution with workflow preview
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  navigate('/tickets/1')
                  toast.info('Click "Upgrade" button next to Auto-Resolve in sidebar')
                }}
              >
                Go to Demo
              </Button>
            </div>
          </div>

          {/* Import Tickets */}
          <div className="flex items-start gap-3 p-3 border rounded-lg">
            <Upload className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm mb-1">Import Tickets</div>
              <p className="text-xs text-muted-foreground mb-2">
                Start with empty state, import tickets (all manual, no automation yet)
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  // Reset to empty state for demo
                  localStorage.removeItem('demo:hasImportedTickets')
                  navigate('/tickets')
                  toast.info('Click "Setup ITSM Connections" to import tickets')
                }}
              >
                Go to Demo
              </Button>
            </div>
          </div>

          {/* Create Knowledge */}
          <div className="flex items-start gap-3 p-3 border rounded-lg">
            <BookPlus className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm mb-1">Create Knowledge</div>
              <p className="text-xs text-muted-foreground mb-2">
                Demo creating knowledge base articles with AI assistance
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  navigate('/knowledge')
                  toast.info('Navigate to knowledge base to create articles')
                }}
              >
                Go to Demo
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Demo Scenarios */}
      <Card className="p-6">
        <h3 className="font-medium mb-4">Demo Scenarios</h3>
        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            onClick={() => handleLoadScenario('New Customer')}
          >
            <Users className="h-4 w-4" />
            New Customer Journey
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            onClick={() => handleLoadScenario('Knowledge Base')}
          >
            <FileText className="h-4 w-4" />
            Knowledge Base Demo
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            onClick={() => handleLoadScenario('Premium Upgrade')}
          >
            <Crown className="h-4 w-4" />
            Premium Feature Upgrade Flow
          </Button>
        </div>
      </Card>

      <Separator />

      {/* Reset Controls */}
      <Card className="p-6 border-red-200 bg-red-50/50">
        <h3 className="font-medium mb-4 text-red-900">Reset Demo</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Clear all demo state and return to initial experience
        </p>
        <Button
          variant="outline"
          className="gap-2 border-red-300 hover:bg-red-100"
          onClick={handleResetDemo}
        >
          <RefreshCw className="h-4 w-4" />
          Reset Demo State
        </Button>
      </Card>

      {/* Demo Instructions */}
      <Card className="p-4 bg-muted/50">
        <p className="text-xs text-muted-foreground">
          <strong>Demo Tips:</strong>
          <br />
          • Use Quick Navigation to jump between features
          <br />
          • Each feature demo includes instructions via toast notifications
          <br />
          • Reset demo state to show welcome screen to new customers
          <br />• Access this page anytime at{' '}
          <code className="bg-background px-1 py-0.5 rounded">/devtools</code>
        </p>
      </Card>
    </div>
  )
}
