import { PlannerForm } from './components/PlannerForm'
import './App.css'

function App() {
  return (
    <main className="app-shell">
      <section className="hero" aria-labelledby="page-title">
        <div className="hero__copy">
          <p className="eyebrow">Thoughtful travel, simply planned</p>
          <h1 id="page-title">AI Travel Assistant</h1>
          <p className="hero__description">
            Shape a trip around the people going, the time you have, and the
            experiences you want to bring home.
          </p>
        </div>

        <PlannerForm />
      </section>

      <p className="app-note">
        Your trip details stay here while you explore your options.
      </p>
    </main>
  )
}

export default App
