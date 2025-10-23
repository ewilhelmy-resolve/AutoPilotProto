/**
 * TicketDetailPage - Individual ticket detail view
 *
 * Design source:
 * - https://www.figma.com/design/TBw4XFq0g6o1S0y8xt5tLK/AutoPilot?node-id=78-59004
 */

import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react'
import RitaLayout from '../components/layouts/RitaLayout'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

// Mock ticket data
interface TicketDetail {
  id: string
  groupId: string
  groupName: string
  title: string
  requester: string
  status: 'Open' | 'Closed' | 'In Progress'
  assignedTo: string
  created: string
  description: string
}

const MOCK_TICKETS: Record<string, TicketDetail[]> = {
  '1': [
    {
      id: 'INC0006032',
      groupId: '1',
      groupName: 'Email Signatures',
      title: 'Email signature not displaying correctly',
      requester: 'admin@acme.com',
      status: 'Open',
      assignedTo: '',
      created: '10/3/2025, 1:23:23 PM',
      description: 'User needs assistance with email signature. They want to update their signature to reflect their new role.',
    },
    {
      id: 'INC0006541',
      groupId: '1',
      groupName: 'Email Signatures',
      title: 'Signature includes outdated disclaimer',
      requester: 'john.doe@acme.com',
      status: 'Open',
      assignedTo: '',
      created: '10/2/2025, 3:45:12 PM',
      description: 'The email signature contains an old legal disclaimer that needs to be updated.',
    },
  ],
}

export default function TicketDetailPage() {
  const { groupId, ticketId } = useParams<{ groupId: string; ticketId: string }>()
  const navigate = useNavigate()

  // Find the ticket
  const groupTickets = MOCK_TICKETS[groupId || '1'] || []
  const currentIndex = groupTickets.findIndex(t => t.id === ticketId)
  const ticket = currentIndex !== -1 ? groupTickets[currentIndex] : groupTickets[0]

  // Navigation helpers
  const hasPrevious = currentIndex > 0
  const hasNext = currentIndex < groupTickets.length - 1

  const goToPrevious = () => {
    if (hasPrevious) {
      navigate(`/tickets/${groupId}/${groupTickets[currentIndex - 1].id}`)
    }
  }

  const goToNext = () => {
    if (hasNext) {
      navigate(`/tickets/${groupId}/${groupTickets[currentIndex + 1].id}`)
    }
  }

  if (!ticket) {
    return (
      <RitaLayout activePage="tickets">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h2 className="text-xl font-semibold">Ticket not found</h2>
            <Button onClick={() => navigate('/tickets')} className="mt-4">
              Back to Tickets
            </Button>
          </div>
        </div>
      </RitaLayout>
    )
  }

  return (
    <RitaLayout activePage="tickets">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 border-b flex-shrink-0">
          <div className="flex items-center justify-between">
            {/* Left: Back button + Ticket ID with navigation */}
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(`/tickets/${groupId}`)}
                className="h-8 w-8"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={goToPrevious}
                  disabled={!hasPrevious}
                  className="h-8 w-8"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <span className="text-base font-semibold">{ticket.id}</span>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={goToNext}
                  disabled={!hasNext}
                  className="h-8 w-8"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Right: Archive button */}
            <Button onClick={() => {}}>
              Archive
            </Button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 px-4 sm:px-6 py-4 sm:py-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto w-full">
            <Card className="p-6">
              {/* Card Header */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-foreground">{ticket.id}</span>
                <Button variant="outline" size="sm">
                  Duplicate
                </Button>
              </div>

              {/* Title */}
              <h1 className="text-xl font-semibold text-foreground mb-6">{ticket.title}</h1>

              {/* Two Column Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-muted-foreground">Requester</span>
                    <span className="text-sm text-foreground">{ticket.requester}</span>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-muted-foreground">Assigned to</span>
                    <span className="text-sm text-foreground">{ticket.assignedTo || '—'}</span>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-muted-foreground">Description</span>
                    <p className="text-sm text-foreground">{ticket.description}</p>
                  </div>
                </div>

                {/* Right Column */}
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <span className="text-sm text-foreground">{ticket.status}</span>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-muted-foreground">Created</span>
                    <span className="text-sm text-foreground">{ticket.created}</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </RitaLayout>
  )
}
