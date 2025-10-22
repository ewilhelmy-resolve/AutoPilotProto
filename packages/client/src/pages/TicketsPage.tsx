/**
 * TicketsPage - Tickets management page
 *
 * Design sources:
 * - Empty state: https://www.figma.com/design/TBw4XFq0g6o1S0y8xt5tLK/AutoPilot?node-id=25-9428
 * - Dashboard: https://www.figma.com/design/TBw4XFq0g6o1S0y8xt5tLK/AutoPilot?node-id=27-16078
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Ticket, TrendingUp } from 'lucide-react'
import RitaLayout from '../components/layouts/RitaLayout'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

// Mock ticket group data
interface TicketGroup {
  id: string
  title: string
  count: number
  automationPercent: number
  manualPercent: number
}

const MOCK_TICKET_GROUPS: TicketGroup[] = [
  { id: '1', title: 'Email Signatures', count: 976, automationPercent: 0, manualPercent: 87 },
  { id: '2', title: 'Password Resets', count: 743, automationPercent: 0, manualPercent: 0 },
  { id: '3', title: 'Network Connectivity', count: 564, automationPercent: 0, manualPercent: 78 },
  { id: '4', title: 'Application Crashes', count: 121, automationPercent: 0, manualPercent: 37 },
  { id: '5', title: 'VPN Issues', count: 45, automationPercent: 0, manualPercent: 78 },
  { id: '6', title: 'System Overload', count: 32, automationPercent: 0, manualPercent: 0 },
  { id: '7', title: 'Signatures Preferences', count: 21, automationPercent: 0, manualPercent: 87 },
  { id: '8', title: 'Performance Optimization', count: 11, automationPercent: 0, manualPercent: 58 },
  { id: '9', title: 'Connection Troubleshooting', count: 4, automationPercent: 0, manualPercent: 87 },
]

export default function TicketsPage() {
  const navigate = useNavigate()
  const [hasTickets] = useState(true) // Set to false to show empty state
  const [timeRange, setTimeRange] = useState('90')

  const handleSetupConnections = () => {
    navigate('/settings/connections')
  }

  // Empty state
  if (!hasTickets) {
    return (
      <RitaLayout activePage="tickets">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="px-4 sm:px-6 py-4 sm:py-6 border-b flex-shrink-0">
            <h1 className="text-xl sm:text-2xl font-semibold">Tickets</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Intelligently groups and analyzes IT issues
            </p>
          </div>

          {/* Content Area */}
          <div className="flex-1 px-4 sm:px-6 py-4 sm:py-6 overflow-y-auto">
            <div className="h-full flex items-center justify-center">
              <div className="max-w-md w-full">
                <div className="flex flex-col items-center justify-center gap-6 p-6 border border-dashed rounded-lg">
                  {/* Icon */}
                  <div className="flex items-center justify-center w-12 h-12 rounded-md border bg-card">
                    <Ticket className="w-6 h-6 text-muted-foreground" />
                  </div>

                  {/* Text Content */}
                  <div className="flex flex-col gap-2 items-center text-center w-full">
                    <h2 className="text-xl font-semibold text-foreground">
                      No tickets yet...
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Intelligently groups and analyzes IT issues, showing similar
                      tickets grouped by outcomes.
                    </p>
                  </div>

                  {/* Action Button */}
                  <Button onClick={handleSetupConnections} className="w-auto">
                    Setup ITSM Connections
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </RitaLayout>
    )
  }

  // Dashboard view
  return (
    <RitaLayout activePage="tickets">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 sm:py-6 border-b flex-shrink-0">
          <h1 className="text-xl sm:text-2xl font-semibold">Tickets</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Rita learned from 1,200 tickets (in month) across 6 issue types
          </p>
        </div>

        {/* Content Area */}
        <div className="flex-1 px-4 sm:px-6 py-4 sm:py-6 overflow-y-auto">
          <div className="flex flex-col gap-4 sm:gap-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">103k</span>
                    <div className="flex items-center gap-1 text-xs text-green-600">
                      <TrendingUp className="w-3 h-3" />
                      +4.8%
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">Triaged last 7 days</p>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex flex-col gap-1">
                  <span className="text-2xl font-bold">0</span>
                  <p className="text-xs text-muted-foreground">Handled Automatically</p>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex flex-col gap-1">
                  <span className="text-2xl font-bold">0%</span>
                  <p className="text-xs text-muted-foreground">Automation Rate</p>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex flex-col gap-1">
                  <span className="text-2xl font-bold">0hr</span>
                  <p className="text-xs text-muted-foreground">AI Hours Saved</p>
                </div>
              </Card>
            </div>

            {/* Ticket Groups Section */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h2 className="text-base sm:text-lg font-semibold">Ticket Groups</h2>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Based on the last {timeRange} days
                  </p>
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                  <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger className="w-[120px] sm:w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">Last 7 days</SelectItem>
                      <SelectItem value="30">Last 30 days</SelectItem>
                      <SelectItem value="90">Last 90 days</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select defaultValue="all">
                    <SelectTrigger className="w-[100px] sm:w-[120px]">
                      <SelectValue placeholder="Filter by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="automated">Automated</SelectItem>
                      <SelectItem value="manual">Manual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Ticket Groups Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {MOCK_TICKET_GROUPS.map((group) => (
                  <Card
                    key={group.id}
                    className="p-4 hover:bg-accent transition-colors cursor-pointer"
                    onClick={() => navigate(`/tickets/${group.id}`)}
                  >
                    <div className="flex flex-col gap-4">
                      {/* Title */}
                      <h3 className="text-sm font-medium">{group.title}</h3>

                      {/* Count */}
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold">{group.count}</span>
                        <span className="text-xs text-muted-foreground uppercase">Ticket Total</span>
                      </div>

                      {/* Progress Bar */}
                      <div className="flex flex-col gap-2">
                        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                          {/* Manual bar (purple) - shows first since automation is 0% initially */}
                          <div
                            className="h-full transition-all"
                            style={{
                              width: `${group.manualPercent}%`,
                              backgroundColor: '#9747FF'
                            }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span style={{ color: '#07EFD4' }}>Automation {group.automationPercent}%</span>
                          <span style={{ color: '#9747FF' }}>Manual {group.manualPercent}%</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </RitaLayout>
  )
}
