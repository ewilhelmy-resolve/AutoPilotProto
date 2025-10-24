/**
 * EnrichmentModal - Modal for Auto-Populate field predictions
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

interface EnrichmentModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  ticketCount: number
  isGroupLevel: boolean // true = entire group, false = selected tickets
  predictions: FieldPrediction[]
}

export default function EnrichmentModal({
  isOpen,
  onClose,
  onConfirm,
  ticketCount,
  isGroupLevel,
  predictions,
}: EnrichmentModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-background rounded-lg shadow-2xl max-w-2xl w-full mx-4 p-6">
        <div className="flex flex-col gap-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-1">Enable Auto-populate</h3>
              <p className="text-sm text-muted-foreground">
                {isGroupLevel
                  ? 'New tickets in this group will automatically have fill populate with predicted values.'
                  : `${ticketCount} selected ticket${ticketCount > 1 ? 's' : ''} will be enriched with predicted values.`}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Predictions Table */}
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted/50 border-b">
                <tr>
                  <th className="text-left text-xs font-medium text-muted-foreground p-3">Type</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-3">Current Value</th>
                  <th className="w-8"></th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-3">Predicted Value</th>
                </tr>
              </thead>
              <tbody>
                {predictions.map((field, index) => (
                  <tr key={field.type} className={index !== predictions.length - 1 ? 'border-b' : ''}>
                    <td className="p-3 text-sm font-medium">{field.type}</td>
                    <td className="p-3 text-sm text-muted-foreground">{field.currentValue}</td>
                    <td className="p-3">
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    </td>
                    <td className="p-3 text-sm font-medium">{field.predictedValue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Info Note */}
          <div className="flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-lg p-3">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-sm text-blue-900">
              <strong>Base on AI Predictions</strong>
              <p className="text-blue-700 mt-0.5">
                Predictions use past tickets + kb data associated to this ticket group.
              </p>
            </div>
          </div>

          {/* Actions */}
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
