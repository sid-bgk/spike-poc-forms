import * as React from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, AlertCircle, CheckCircle } from "lucide-react"
// Simple time difference formatter (replace date-fns dependency)
function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return 'just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hr`
  return `${Math.floor(diffInSeconds / 86400)} day${Math.floor(diffInSeconds / 86400) > 1 ? 's' : ''}`
}
import type { SaveState } from "./types"

interface SaveStatusIndicatorProps {
  saveState: SaveState
  onManualSave: () => void
  showManualSave?: boolean
}

export function SaveStatusIndicator({
  saveState,
  onManualSave,
  showManualSave = true
}: SaveStatusIndicatorProps) {
  const { isSaving, lastSaveTime, saveError } = saveState

  return (
    <div className="space-y-2">
      {/* Save Error Alert */}
      {saveError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Save Failed</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span>{saveError}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={onManualSave}
              disabled={isSaving}
              className="ml-2"
            >
              Retry Save
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Save Status Indicator (hidden when no activity yet) */}
      {(isSaving || lastSaveTime) && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Saving progress...</span>
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Saved {formatTimeAgo(lastSaveTime!)} ago</span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}