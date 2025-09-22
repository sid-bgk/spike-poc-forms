import * as React from 'react'
import { Link } from 'react-router-dom'
import { fetchAllForms, type FormMetadataSummary } from '../api/formConfig'

export function Home() {
  const [forms, setForms] = React.useState<FormMetadataSummary[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        setLoading(true)
        setError(null)
        const list = await fetchAllForms()
        if (!mounted) return
        setForms(list)
      } catch (e: any) {
        if (!mounted) return
        setError(e?.message || 'Failed to fetch forms')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [])

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold">Frontend Spike POC</h1>

        {loading && (
          <div className="text-muted-foreground">Loading available forms...</div>
        )}
        {error && (
          <div className="text-destructive">{error}</div>
        )}

        {!loading && !error && (
          <>
            <section className="space-y-4">
              <div>
                <h2 className="text-2xl font-semibold">TanStack Forms</h2>
                <p className="text-muted-foreground">Rendered via TanStack React Form engine</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                {forms.map((f) => (
                  <div key={f.id} className="border rounded-lg p-4 bg-card">
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-semibold">{f.name}</div>
                      {f.flowConfig?.type && (
                        <span className="text-xs px-2 py-0.5 rounded bg-secondary text-secondary-foreground">
                          {f.flowConfig.type}
                        </span>
                      )}
                    </div>
                    {f.description && (
                      <p className="text-sm text-muted-foreground mb-3">{f.description}</p>
                    )}
                    <Link
                      to={`/tanstack/form/${f.id}`}
                      className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-3"
                    >
                      Open
                    </Link>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <div>
                <h2 className="text-2xl font-semibold">RHF Forms</h2>
                <p className="text-muted-foreground">Rendered via React Hook Form engine</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                {forms
                  .filter((f) => f.id === 'simplified-application-poc')
                  .map((f) => (
                    <div key={f.id} className="border rounded-lg p-4 bg-card">
                      <div className="font-semibold mb-1">{f.name}</div>
                      {f.description && (
                        <p className="text-sm text-muted-foreground mb-3">{f.description}</p>
                      )}
                      <Link
                        to={`/rhf/form/${f.id}`}
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-3"
                      >
                        Open
                      </Link>
                    </div>
                  ))}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  )
}
