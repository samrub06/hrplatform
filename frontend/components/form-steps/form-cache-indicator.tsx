"use client"

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useFormCacheStore } from '@/lib/stores/form-cache-store'
import { CheckCircleIcon, ClockIcon } from 'lucide-react'
import { useState } from 'react'

export function FormCacheIndicator() {
  const [isOpen, setIsOpen] = useState(false)
  const { 
    stepData, 
    lastSaved, 
    isCompleted,
    clearCache,
    getAllStepData 
  } = useFormCacheStore()

  const completedSteps = Object.keys(stepData).length
  const hasData = completedSteps > 0

  if (!hasData && !isCompleted) {
    return null
  }

  const formatLastSaved = () => {
    if (!lastSaved) return 'Never'
    const date = new Date(lastSaved)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`
    return date.toLocaleDateString()
  }

  const getStepDataPreview = () => {
    const allData = getAllStepData()
    const preview: Record<string, string> = {}

    if (allData.first_name || allData.last_name) {
      preview['Personal Info'] = `${allData.first_name || ''} ${allData.last_name || ''}`.trim()
    }
    if (allData.skills && allData.skills.length > 0) {
      preview['Skills'] = `${allData.skills.length} skills added`
    }
    if (allData.education && allData.education.length > 0) {
      preview['Education'] = `${allData.education.length} education entries`
    }
    if (allData.phone_number || allData.github_link || allData.linkedin_link) {
      preview['Contact'] = 'Contact information added'
    }

    return preview
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-80 shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">Form Progress</CardTitle>
            <div className="flex items-center gap-2">
              {isCompleted ? (
                <CheckCircleIcon className="h-4 w-4 text-green-500" />
              ) : (
                <ClockIcon className="h-4 w-4 text-blue-500" />
              )}
              <Badge variant={isCompleted ? "default" : "secondary"}>
                {isCompleted ? 'Completed' : `${completedSteps}/5 steps`}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Last saved:</span>
              <span>{formatLastSaved()}</span>
            </div>
            
            <div className="flex gap-2">
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="flex-1">
                    View Data
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Saved Form Data</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    {Object.entries(getStepDataPreview()).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center p-2 bg-muted rounded">
                        <span className="font-medium">{key}</span>
                        <span className="text-sm text-muted-foreground">{value}</span>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
              
              {!isCompleted && (
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => {
                    if (confirm('Are you sure you want to clear all saved data? This action cannot be undone.')) {
                      clearCache()
                    }
                  }}
                >
                  Clear
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 