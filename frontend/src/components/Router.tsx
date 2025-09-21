import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import { DemoFormExample } from '../tanstackform/DemoFormExample'
import { DemoVerticalFormExample } from '../tanstackform/DemoVerticalFormExample'
import { DemoRHFFormExample } from '../rhfform/DemoRHFFormExample'
import { Home } from './Home'

function Navigation() {
  const location = useLocation()

  return (
    <nav className="border-b bg-card px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-xl font-bold hover:text-primary">
            Frontend Spike POC
          </Link>
          <div className="flex items-center gap-4">
            <Link
              to="/tanstack/form"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === '/tanstack/form'
                  ? 'text-primary border-b-2 border-primary pb-1'
                  : 'text-muted-foreground'
              }`}
            >
              TanStack Form
            </Link>
            <Link
              to="/rhf/form"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === '/rhf/form'
                  ? 'text-primary border-b-2 border-primary pb-1'
                  : 'text-muted-foreground'
              }`}
            >
              RHF Form
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export function Router() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <Navigation />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tanstack/form" element={<DemoFormExample />} />
            <Route path="/tanstack/form-vertical" element={<DemoVerticalFormExample />} />
            <Route path="/rhf/form" element={<DemoRHFFormExample />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
