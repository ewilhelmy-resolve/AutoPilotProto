/**
 * DelegateConfigModal - Modal for delegating ITSM configuration tasks
 *
 * Allows Rita Go owners to delegate configuration tasks to ITSM admins
 * via email or shareable link.
 */

import { useState } from 'react'
import { X, Mail, Link2, Check, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from '@/lib/toast'

interface ShareConfigModalProps {
  sourceName: string
  sourceId: string
  onClose: () => void
}

export default function DelegateConfigModal({ sourceName, sourceId, onClose }: ShareConfigModalProps) {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState(`Hi! I need your help configuring ${sourceName} credentials for Rita. I'm delegating this setup task to you. Click the link below to complete the configuration.`)
  const [isSending, setIsSending] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)

  // Generate shareable link with temporary access token
  const generateShareLink = () => {
    const token = btoa(`${sourceId}-${Date.now()}-${Math.random()}`)
    return `${window.location.origin}/config/${sourceId}?token=${token}`
  }

  const shareLink = generateShareLink()

  const handleSendEmail = async () => {
    if (!email) {
      toast.error('Please enter an email address')
      return
    }

    setIsSending(true)

    // Simulate API call to send email
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSending(false)
    toast.success('Invitation sent!', {
      description: `Configuration link sent to ${email}`,
    })

    onClose()
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink)
    setLinkCopied(true)
    toast.success('Link copied!', {
      description: 'Share this link with your ITSM admin',
    })

    setTimeout(() => setLinkCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-background rounded-lg shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold">Delegate configuration task</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Request an ITSM admin to configure {sourceName}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6">
          <Tabs defaultValue="email" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="email" className="gap-2">
                <Mail className="w-4 h-4" />
                Email
              </TabsTrigger>
              <TabsTrigger value="link" className="gap-2">
                <Link2 className="w-4 h-4" />
                Copy Link
              </TabsTrigger>
            </TabsList>

            <TabsContent value="email" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  The recipient will receive a secure link with temporary access (24 hours)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message (optional)</Label>
                <Textarea
                  id="message"
                  placeholder="Add a personal message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="text-sm font-medium mb-2">What happens next?</h4>
                <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                  <li>Recipient receives email with secure link</li>
                  <li>They configure {sourceName} credentials</li>
                  <li>You're notified when configuration is complete</li>
                  <li>You can start importing tickets</li>
                </ol>
              </div>

              <Button
                onClick={handleSendEmail}
                disabled={isSending}
                className="w-full"
              >
                {isSending ? 'Sending...' : 'Send invitation'}
              </Button>
            </TabsContent>

            <TabsContent value="link" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Configuration request link</Label>
                <div className="flex gap-2">
                  <Input
                    value={shareLink}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    onClick={handleCopyLink}
                    variant={linkCopied ? 'default' : 'outline'}
                    className="shrink-0 gap-2"
                  >
                    {linkCopied ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Send this link via Teams, Slack, or any messaging platform
                </p>
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="text-sm font-medium mb-2">Security details</h4>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Link expires in 24 hours</li>
                  <li>Single-use only (expires after configuration)</li>
                  <li>Temporary access to {sourceName} config only</li>
                  <li>Activity is logged for audit purposes</li>
                </ul>
              </div>

              <div className="pt-2">
                <p className="text-sm text-center text-muted-foreground">
                  Share this link securely with your ITSM admin
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
