import './App.css'
import { BrowserRouter } from 'react-router-dom'
import Rutas from './componentes/rutas'

function App() {
  return (
     <BrowserRouter>
      <main>
        <Rutas />
      </main>
    </BrowserRouter>
  )
}

export default App