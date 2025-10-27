/**
 * PricingModal - Pricing and upgrade modal for Auto-Resolve
 *
 * Design source:
 * - https://www.figma.com/design/CqQbFfSLjNfdtvCvlDKNiq/RitaGo-Epic?node-id=534-59452
 */

import React from 'react'
import { X, Check, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface PricingModalProps {
  isOpen: boolean
  onClose: () => void
  onUpgrade: (plan: 'pro' | 'enterprise') => void
}

interface PlanFeature {
  name: string
  tooltip?: string
}

interface PricingPlan {
  id: 'free' | 'pro' | 'enterprise'
  name: string
  description: string
  price: number | string
  period: string
  features: PlanFeature[]
  buttonText: string
  buttonVariant: 'outline' | 'default' | 'secondary'
  highlighted?: boolean
  current?: boolean
}

export default function PricingModal({
  isOpen,
  onClose,
  onUpgrade,
}: PricingModalProps) {
  const [billingPeriod, setBillingPeriod] = React.useState<'monthly' | 'annually'>('monthly')

  if (!isOpen) return null

  const plans: PricingPlan[] = [
    {
      id: 'free',
      name: 'Free',
      description: 'Perfect for trying out Auto-Respond and Auto-Populate features',
      price: 0,
      period: '/month',
      features: [
        { name: 'Auto-Respond (unlimited)' },
        { name: 'Auto-Populate (unlimited)' },
        { name: 'Basic analytics' },
        { name: 'Email support' },
      ],
      buttonText: 'Current Plan',
      buttonVariant: 'outline',
      current: true,
    },
    {
      id: 'pro',
      name: 'Pro',
      description: 'Unlock Auto-Resolve and advanced automation for your team',
      price: 49,
      period: '/month',
      features: [
        { name: 'Everything in Free, plus:' },
        { name: 'Auto-Resolve (10 workflows)', tooltip: 'Fully automated end-to-end ticket resolution' },
        { name: 'Advanced analytics & reporting', tooltip: 'Deep insights into automation performance' },
        { name: 'Priority support', tooltip: '24/7 priority email and chat support' },
        { name: 'Custom workflow builder', tooltip: 'Build custom automation workflows' },
      ],
      buttonText: 'Upgrade to Pro',
      buttonVariant: 'default',
      highlighted: true,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'Advanced features and dedicated support for large teams',
      price: 'Custom',
      period: '',
      features: [
        { name: 'Everything in Pro, plus:' },
        { name: 'Unlimited Auto-Resolve workflows' },
        { name: 'Dedicated success manager' },
        { name: 'Custom integrations' },
        { name: 'SLA guarantees' },
        { name: 'Advanced security & compliance' },
      ],
      buttonText: 'Contact Us',
      buttonVariant: 'secondary',
    },
  ]

  const handlePlanSelect = (planId: 'free' | 'pro' | 'enterprise') => {
    if (planId === 'pro') {
      onUpgrade('pro')
    } else if (planId === 'enterprise') {
      onUpgrade('enterprise')
    }
  }

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-background rounded-lg shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col z-10">
        {/* Header */}
        <div className="px-6 py-4 border-b flex-shrink-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-1">Choose a plan</h3>
            </div>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="space-y-8">
            {/* Billing Period Toggle */}
            <div className="flex justify-center">
              <div className="bg-muted rounded-lg p-1 inline-flex">
                <button
                  onClick={() => setBillingPeriod('monthly')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    billingPeriod === 'monthly'
                      ? 'bg-background shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingPeriod('annually')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    billingPeriod === 'annually'
                      ? 'bg-background shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Annually
                </button>
              </div>
            </div>

            {/* Pricing Cards */}
            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`border rounded-xl p-8 flex flex-col ${
                    plan.highlighted
                      ? 'border-foreground bg-foreground text-background'
                      : 'bg-card'
                  }`}
                >
                  {/* Plan Header */}
                  <div className="mb-6">
                    <h4 className={`text-lg font-semibold mb-3 ${plan.highlighted ? 'text-background' : 'text-foreground'}`}>
                      {plan.name}
                    </h4>
                    <p className={`text-sm mb-4 ${plan.highlighted ? 'text-background/70' : 'text-muted-foreground'}`}>
                      {plan.description}
                    </p>

                    {/* Price */}
                    <div className="flex items-end gap-1 mb-6">
                      <span className={`text-4xl font-bold ${plan.highlighted ? 'text-background' : 'text-foreground'}`}>
                        {typeof plan.price === 'number' ? `$${plan.price}` : plan.price}
                      </span>
                      {plan.period && (
                        <span className={`text-base mb-1 ${plan.highlighted ? 'text-background/70' : 'text-muted-foreground'}`}>
                          {plan.period}
                        </span>
                      )}
                    </div>

                    {/* CTA Button */}
                    <Button
                      onClick={() => handlePlanSelect(plan.id)}
                      disabled={plan.current}
                      variant={plan.highlighted ? 'secondary' : plan.buttonVariant}
                      className={`w-full ${plan.current ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {plan.buttonText}
                    </Button>
                  </div>

                  {/* Features List */}
                  <div className="space-y-4 flex-1">
                    {plan.features.map((feature, idx) => (
                      <div key={idx}>
                        {feature.name.includes(':') ? (
                          // Section header
                          <p className={`text-sm font-medium ${plan.highlighted ? 'text-background' : 'text-foreground'}`}>
                            {feature.name}
                          </p>
                        ) : (
                          // Feature item
                          <div className="flex items-start gap-3">
                            <Check className={`w-5 h-5 shrink-0 mt-0.5 ${plan.highlighted ? 'text-background' : 'text-primary'}`} />
                            <span className={`text-sm flex-1 ${plan.highlighted ? 'text-background/70' : 'text-muted-foreground'}`}>
                              {feature.name}
                            </span>
                            {feature.tooltip && (
                              <Info className={`w-4 h-4 shrink-0 opacity-70 ${plan.highlighted ? 'text-background' : 'text-muted-foreground'}`} />
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
