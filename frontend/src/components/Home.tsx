import { Link } from 'react-router-dom'

export function Home() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Frontend Spike POC</h1>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="border rounded-lg p-6 bg-card">
            <h2 className="text-2xl font-semibold mb-4">TanStack Form Demo</h2>
            <p className="text-muted-foreground mb-4">
              A demonstration of dynamic form generation using TanStack Form with configuration-driven fields and validation.
            </p>
            <Link
              to="/tanstack/form"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              View TanStack Form Demo
            </Link>
          </div>

          <div className="border rounded-lg p-6 bg-card">
            <h2 className="text-2xl font-semibold mb-4">Vertical Steps Demo</h2>
            <p className="text-muted-foreground mb-4">
              Same engine with a vertical stepper navigation and two-column layout.
            </p>
            <Link
              to="/tanstack/form-vertical"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              View Vertical Steps Demo
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
