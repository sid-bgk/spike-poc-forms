import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import { DynamicFormPage } from '../tanstackform/DynamicFormPage'
import { DemoRHFFormExample } from '../rhfform/DemoRHFFormExample'
import { DynamicRHFFormPage } from '../rhfform/DynamicRHFFormPage'
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
              to="/tanstack/form/ppf-broker-complete"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname.startsWith('/tanstack/form')
                  ? 'text-primary border-b-2 border-primary pb-1'
                  : 'text-muted-foreground'
              }`}
            >
              TanStack Form
            </Link>
            <Link
              to="/rhf/form/simplified-application-poc"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname.startsWith('/rhf/form')
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
            <Route path="/tanstack/form/:formId" element={<DynamicFormPage />} />
            <Route path="/rhf/form/:formId" element={<DynamicRHFFormPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
