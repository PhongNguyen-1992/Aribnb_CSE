import './App.css'
import { useRoutes } from 'react-router-dom'
import { router } from './router';

function App() {
  const routerElement = useRoutes(router);

  return (
    <div>
      {routerElement}
    </div>
  )
}

export default App
