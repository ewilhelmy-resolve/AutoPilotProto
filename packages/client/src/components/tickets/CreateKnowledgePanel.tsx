/**
 * CreateKnowledgePanel - Right slide-in panel for creating knowledge articles
 *
 * Design source: Knowledge Gap Detection feature
 */

import { useState } from 'react'
import { X, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'

interface CreateKnowledgePanelProps {
  groupTitle: string
  onClose: () => void
  onCreateKnowledge: (article: { title: string; content: string; sources: string[] }) => void
}

export default function CreateKnowledgePanel({
  groupTitle,
  onClose,
  onCreateKnowledge,
}: CreateKnowledgePanelProps) {
  const [selectedSources, setSelectedSources] = useState<string[]>(['historical', 'websearch'])
  const [articleTitle, setArticleTitle] = useState('')
  const [articleContent, setArticleContent] = useState('')
  const [isGenerated, setIsGenerated] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  const generateArticle = () => {
    setIsGenerating(true)

    // Simulate AI generation delay
    setTimeout(() => {
      setArticleTitle(`How to resolve: ${groupTitle}`)
      setArticleContent(`## Overview
This guide provides step-by-step instructions for resolving common ${groupTitle.toLowerCase()} issues reported by users.

## Common Symptoms
- Users experience difficulty with ${groupTitle.toLowerCase()}
- Error messages or unexpected behavior
- Unable to complete intended task

## Troubleshooting Steps

### 1. Check Physical Connections
- Verify network cables are securely connected
- Check for damaged cables or ports
- Ensure WiFi is enabled on the device

### 2. Verify Network Settings
- Confirm correct network is selected
- Check IP address configuration
- Verify DNS settings

### 3. Test Connectivity
- Ping gateway address
- Test external connectivity
- Run network diagnostics

### 4. Advanced Steps
- Reset network adapter
- Update network drivers
- Contact IT support if issue persists

## Prevention
- Keep network drivers up to date
- Regular system maintenance
- Report recurring issues promptly`)
      setIsGenerated(true)
      setIsGenerating(false)
    }, 1500) // 1.5 second delay for AI generation simulation
  }

  const toggleSource = (source: string) => {
    setSelectedSources((prev) =>
      prev.includes(source) ? prev.filter((s) => s !== source) : [...prev, source]
    )
  }

  const handleCreate = () => {
    onCreateKnowledge({
      title: articleTitle,
      content: articleContent,
      sources: selectedSources,
    })
    onClose()
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
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-1">Create Knowledge Article</h2>
              <p className="text-sm text-muted-foreground">
                Generate a comprehensive article for <strong>{groupTitle}</strong> using AI-powered insights
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
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="space-y-6">
            {/* Knowledge Sources */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3">Knowledge Sources</h3>
              <p className="text-xs text-muted-foreground mb-3">
                Select sources to generate comprehensive article
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 border rounded-lg hover:bg-accent transition-colors">
                  <Checkbox
                    checked={selectedSources.includes('historical')}
                    onCheckedChange={() => toggleSource('historical')}
                    className="mt-0.5"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium mb-1">Historical Tickets</div>
                    <p className="text-xs text-muted-foreground">
                      Use past ticket solutions and patterns from this cluster
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 border rounded-lg hover:bg-accent transition-colors">
                  <Checkbox
                    checked={selectedSources.includes('websearch')}
                    onCheckedChange={() => toggleSource('websearch')}
                    className="mt-0.5"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium mb-1">Web Search</div>
                    <p className="text-xs text-muted-foreground">
                      Include relevant information from web sources and documentation
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Generate Article Button or AI-Generated Article Preview */}
            {!isGenerated ? (
              <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-lg">
                <FileText className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-sm font-medium mb-2">Ready to generate article</h3>
                <p className="text-xs text-muted-foreground text-center mb-4 max-w-sm">
                  Rita will analyze {selectedSources.length} selected source{selectedSources.length !== 1 ? 's' : ''} to create a comprehensive knowledge article
                </p>
                <Button
                  onClick={generateArticle}
                  disabled={selectedSources.length === 0 || isGenerating}
                  className="gap-2"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4" />
                      Generate Article
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-muted-foreground">AI-Generated Article</h3>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 text-xs text-green-600">
                      <FileText className="w-3 h-3" />
                      <span>Draft ready</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={generateArticle}
                      disabled={isGenerating}
                      className="h-7 gap-1"
                    >
                      {isGenerating ? (
                        <>
                          <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          <span className="text-xs">Regenerating...</span>
                        </>
                      ) : (
                        <span className="text-xs">Regenerate</span>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Title */}
                <div className="mb-4">
                  <label className="text-xs text-muted-foreground mb-1 block">Title</label>
                  <input
                    type="text"
                    value={articleTitle}
                    onChange={(e) => setArticleTitle(e.target.value)}
                    className="w-full px-3 py-2 text-sm border rounded-md bg-background"
                  />
                </div>

                {/* Content */}
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Content (Markdown)</label>
                  <Textarea
                    value={articleContent}
                    onChange={(e) => setArticleContent(e.target.value)}
                    className="min-h-[400px] font-mono text-sm resize-none"
                    placeholder="AI-generated content will appear here..."
                  />
                </div>
              </div>
            )}

            {/* Info Note - Only show when generated */}
            {isGenerated && (
              <div className="flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-lg p-3">
                <FileText className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div className="text-sm text-blue-900">
                  <strong>AI-Enhanced Knowledge</strong>
                  <p className="text-blue-700 mt-0.5">
                    This article is generated from {selectedSources.length} source{selectedSources.length !== 1 ? 's' : ''} and can be edited before publishing.
                  </p>
                </div>
              </div>
            )}
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
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              className="flex-1"
              disabled={!isGenerated || !articleTitle.trim() || !articleContent.trim()}
            >
              Add Knowledge
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
