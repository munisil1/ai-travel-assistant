import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { PlannerForm } from './components/PlannerForm'
import { SavedTripsPage } from './components/SavedTripsPage'
import { ItineraryPage } from './components/ItineraryPage'
import './App.css'

function AppLayout() {
  return (
    <main className="app-shell">
      <section className="hero" aria-labelledby="page-title">
        <div className="hero__copy">
          <p className="eyebrow">Thoughtful travel, simply planned</p>
          <h1 id="page-title">AI Travel Assistant</h1>
          {/* <p className="hero__description">
            Shape a trip around the people going, the time you have, and the
            experiences you want to bring home.
          </p> */}
        </div>

        <Outlet />
      </section>

      <p className="app-note">
        Your trip details stay here while you explore your options.
      </p>
    </main>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<PlannerForm />} />
          <Route path="saved-trips" element={<SavedTripsPage />} />
          <Route path="trips/:tripId" element={<ItineraryPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
