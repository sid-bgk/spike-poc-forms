import { Link } from 'react-router-dom'

export function Home() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Frontend Spike POC</h1>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="border rounded-lg p-6 bg-card">
            <h2 className="text-2xl font-semibold mb-4">PPF Broker (Multi-flow)</h2>
            <p className="text-muted-foreground mb-4">Loan type selection + dynamic borrowers.</p>
            <Link to="/tanstack/form/ppf-broker-complete" className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
              Open ppf-broker-complete
            </Link>
          </div>

          <div className="border rounded-lg p-6 bg-card">
            <h2 className="text-2xl font-semibold mb-4">Simplified Application (Vertical)</h2>
            <p className="text-muted-foreground mb-4">Single-flow application form.</p>
            <Link to="/tanstack/form/simplified-application-poc" className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
              Open simplified-application-poc
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
