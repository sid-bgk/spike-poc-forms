import * as React from "react"
import { VerticalConfigFormRenderer } from "./VerticalConfigFormRenderer"
import { fetchFormConfig, type FormConfig } from "../api/formConfig"
import type { FormData } from "./types"

export function DemoVerticalFormExample() {
  const [config, setConfig] = React.useState<FormConfig | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    const loadConfig = async () => {
      try {
        setLoading(true)
        setError(null)
        const formConfig = await fetchFormConfig('simplified-application-poc')
        setConfig(formConfig)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load form configuration')
        console.error('Error loading form config:', err)
      } finally {
        setLoading(false)
      }
    }

    loadConfig()
  }, [])

  const handleSubmit = async (data: FormData) => {
    console.log("Form submitted with data:", data)
    await new Promise(resolve => setTimeout(resolve, 1000))
    alert(`Form submitted successfully!\n\nData:\n${JSON.stringify(data, null, 2)}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
              <p className="text-muted-foreground">Loading form configuration...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-4">
              <div className="text-destructive text-lg font-semibold">Error Loading Form</div>
              <p className="text-muted-foreground">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!config) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">No form configuration available</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <VerticalConfigFormRenderer
        config={config}
        onSubmit={handleSubmit}
        defaultValues={{}}
        className="max-w-6xl"
      />
    </div>
  )
}
