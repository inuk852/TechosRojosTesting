import './App.css'
import Header from "./componentes/header/header"
import Sidebar from './componentes/sidebar/sidebar'
import Mesa from './componentes/mesas/mesa'
import Tarjeta from './componentes/tarjeta/tarjeta'


function App() {

  return (
    <main>

  <Tarjeta/>


      <Sidebar />
      <div className="contenido">
        <Header
          section="tetas"
        />

        <div className='mesas'>
        <Mesa />
        <Mesa />
        <Mesa />
        <Mesa />
        <Mesa />
        <Mesa />
        </div>


      </div>
    </main>
  )
}

export default App