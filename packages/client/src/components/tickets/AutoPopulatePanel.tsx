/**
 * AutoPopulatePanel - Right slide-in panel for Auto-Populate field predictions
 *
 * Design source:
 * - https://www.figma.com/design/TBw4XFq0g6o1S0y8xt5tLK/AutoPilot?node-id=186-77697
 */

import { X, ArrowRight, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface FieldPrediction {
  type: string
  currentValue: string
  predictedValue: string
}

interface AutoPopulatePanelProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  ticketCount: number
  isGroupLevel: boolean // true = entire group, false = selected tickets
  predictions: FieldPrediction[]
}

export default function AutoPopulatePanel({
  isOpen,
  onClose,
  onConfirm,
  ticketCount,
  isGroupLevel,
  predictions,
}: AutoPopulatePanelProps) {
  if (!isOpen) return null

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
              <h2 className="text-xl font-semibold mb-1">Enable Auto-populate</h2>
              <p className="text-sm text-muted-foreground">
                {isGroupLevel
                  ? 'New tickets in this group will automatically have fields populated with predicted values.'
                  : `${ticketCount} selected ticket${ticketCount > 1 ? 's' : ''} will be enriched with predicted values.`}
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
            {/* Predictions Table */}
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted/50 border-b">
                  <tr>
                    <th className="text-left text-xs font-medium text-muted-foreground p-3">Field Type</th>
                    <th className="text-left text-xs font-medium text-muted-foreground p-3">Current Value</th>
                    <th className="w-8"></th>
                    <th className="text-left text-xs font-medium text-muted-foreground p-3">Predicted Value</th>
                  </tr>
                </thead>
                <tbody>
                  {predictions.map((field, index) => (
                    <tr key={field.type} className={index !== predictions.length - 1 ? 'border-b' : ''}>
                      <td className="p-3 text-sm font-medium">{field.type}</td>
                      <td className="p-3 text-sm text-muted-foreground">
                        {field.currentValue || <span className="italic">Empty</span>}
                      </td>
                      <td className="p-3">
                        <ArrowRight className="w-4 h-4 text-muted-foreground" />
                      </td>
                      <td className="p-3 text-sm font-medium text-green-700">{field.predictedValue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Info Note */}
            <div className="flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900">
                <strong>Based on AI Predictions</strong>
                <p className="text-blue-700 mt-1">
                  Predictions use past tickets and knowledge base data associated with this ticket group.
                  Auto-Populate learns from your team's historical patterns to improve accuracy over time.
                </p>
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-green-900 mb-2">Benefits</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Reduce manual data entry by up to 80%</li>
                <li>• Improve field consistency and accuracy</li>
                <li>• Speed up ticket processing time</li>
                <li>• Learn from your team's best practices</li>
              </ul>
            </div>
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
              onClick={onConfirm}
              className="flex-1"
            >
              {isGroupLevel ? 'Enable Auto-Populate' : `Enrich ${ticketCount} Ticket${ticketCount > 1 ? 's' : ''}`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
