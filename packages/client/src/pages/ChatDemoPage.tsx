/**
 * ChatDemoPage - Simple demo page for designers
 *
 * This page shows the chat UI without any backend dependencies.
 * Perfect for UI/UX work and design iterations.
 */

import RitaLayout from '../components/layouts/RitaLayout'

export default function ChatDemoPage() {
  return (
    <RitaLayout activePage="chat">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="px-6 py-6 border-b flex-shrink-0">
          <h1 className="text-2xl font-semibold">Chat</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Start a conversation or continue an existing one
          </p>
        </div>

        {/* Chat content area */}
        <div className="flex-1 px-6 py-6">
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div className="text-center">
              <h2 className="text-lg font-medium mb-2">Welcome to Rita</h2>
              <p>Click "New Chat" to start a conversation</p>
            </div>
          </div>
        </div>
      </div>
    </RitaLayout>
  )
}
