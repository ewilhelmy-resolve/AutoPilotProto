/**
 * TicketGroupDetailPage - Ticket group detail view
 *
 * Design source: https://www.figma.com/design/TBw4XFq0g6o1S0y8xt5tLK/AutoPilot?node-id=183-138228
 */

import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Info, Sparkles, Zap, GitBranch, ChevronDown, Crown } from 'lucide-react'
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
const TICKET_GROUPS: Record<string, { title: string; count: number; open: number; automated: number }> = {
  '1': { title: 'Email Signatures', count: 976, open: 14, automated: 0 },
  '2': { title: 'Password Resets', count: 743, open: 8, automated: 0 },
  '3': { title: 'Network Connectivity', count: 564, open: 12, automated: 0 },
  '4': { title: 'Application Crashes', count: 121, open: 6, automated: 0 },
  '5': { title: 'VPN Issues', count: 45, open: 5, automated: 0 },
  '6': { title: 'System Overload', count: 32, open: 4, automated: 0 },
  '7': { title: 'Signatures Preferences', count: 21, open: 3, automated: 0 },
  '8': { title: 'Performance Optimization', count: 11, open: 2, automated: 0 },
  '9': { title: 'Connection Troubleshooting', count: 4, open: 2, automated: 0 },
}

// Mock chart data
const CHART_DATA = [
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

export default function TicketGroupDetailPage() {
  const { groupId } = useParams<{ groupId: string }>()
  const navigate = useNavigate()

  const group = groupId ? TICKET_GROUPS[groupId] : null
  const tickets = groupId ? TICKETS_BY_GROUP[groupId] || [] : []

  const [selectedTickets, setSelectedTickets] = useState<Set<string>>(new Set())
  const [sortBy, setSortBy] = useState('newest')

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
                <span className="text-muted-foreground">{group.open} open</span>
                <span className="text-muted-foreground">{group.automated}% automated</span>
                <Button variant="outline" size="sm">
                  Knowledge base
                </Button>
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
                  Rita learned from {group.count} tickets, automatically handled 0%
                </p>

                {/* Chart */}
                <ChartContainer config={chartConfig} className="h-48 sm:h-64">
                  <LineChart data={CHART_DATA} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
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
                        <DropdownMenuItem>
                          <Sparkles className="w-4 h-4 mr-2" style={{ color: '#a855f7' }} />
                          Auto-Respond
                        </DropdownMenuItem>
                        <DropdownMenuItem>
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
                      {group.open} Open
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
                        <div className="flex-1 min-w-0">
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
                  <TabsTrigger value="knowledge" className="flex-1">Knowledge (3)</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-4 space-y-4">
                  {/* Metrics */}
                  <div className="border rounded-lg p-3">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="flex flex-col text-center">
                        <span className="text-2xl font-bold">0</span>
                        <span className="text-xs text-muted-foreground">Automated</span>
                      </div>
                      <div className="flex flex-col text-center">
                        <span className="text-2xl font-bold">0</span>
                        <span className="text-xs text-muted-foreground">Mins Saved</span>
                      </div>
                      <div className="flex flex-col text-center">
                        <span className="text-2xl font-bold">$0</span>
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
                        Low change to automate successfully
                      </p>
                      <div className="py-2">
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-yellow-400" style={{ width: '14px' }} />
                        </div>
                      </div>
                      <p className="text-sm">Validated 0/16</p>
                    </div>
                  </div>

                  {/* Group actions */}
                  <div className="flex flex-col gap-2">
                    <button className="flex items-center gap-2 px-1.5 py-2 rounded-md hover:bg-accent">
                      <span className="text-sm font-semibold">Group actions</span>
                      <ChevronDown className="w-4 h-4 opacity-50" />
                    </button>

                    <div className="flex flex-col gap-3">
                      {/* Auto-Respond */}
                      <div className="flex flex-col">
                        <div className="border border-b-0 rounded-t-lg p-3">
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-1">
                              <Sparkles className="w-4 h-4" style={{ color: '#a855f7' }} />
                              <span className="flex-1 text-base">Auto-Respond</span>
                              <Badge variant="outline" className="text-xs">Not enabled</Badge>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Ready to validate</span>
                              <span>16 tickets</span>
                            </div>
                          </div>
                        </div>
                        <Button variant="secondary" className="rounded-t-none rounded-b-lg h-9">
                          Enable Auto-Answer
                        </Button>
                      </div>

                      {/* Auto-Populate */}
                      <div className="flex flex-col">
                        <div className="border border-b-0 rounded-t-lg p-3">
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-1">
                              <Zap className="w-4 h-4" style={{ color: '#14b8a6' }} />
                              <span className="flex-1 text-base">Auto-Populate</span>
                              <Badge variant="outline" className="text-xs">Not enabled</Badge>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Ticket enrichment</span>
                              <span>All</span>
                            </div>
                          </div>
                        </div>
                        <Button variant="secondary" className="rounded-t-none rounded-b-lg h-9">
                          Enable Auto-Populate
                        </Button>
                      </div>

                      {/* Auto-Resolve */}
                      <div className="flex flex-col">
                        <div className="border border-b-0 rounded-t-lg p-3">
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-1">
                              <GitBranch className="w-4 h-4" style={{ color: '#0050c7' }} />
                              <span className="flex-1 text-base">Auto-Resolve</span>
                              <Badge className="text-xs bg-yellow-50 text-yellow-600 border-yellow-500 hover:bg-yellow-50">
                                <Crown className="w-3 h-3 mr-1" />
                                Premium
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Pre-set workflow</span>
                              <span>Preview</span>
                            </div>
                          </div>
                        </div>
                        <Button variant="secondary" className="rounded-t-none rounded-b-lg h-9">
                          Upgrade Auto-Resolve
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
    </RitaLayout>
  )
}
