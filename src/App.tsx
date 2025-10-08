
import { useState } from 'react'
import { BrowserRouter } from 'react-router-dom';
import './App.css'
import AppRouter from './router/Router';
import MButton from './components/MButton';
import NavigationIcons from "./components/NavigationIcons";

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <>
        <h1>Vite + React</h1>
        <div className="card">
          <MButton onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </MButton>
          <p>
            Edit <code>src/App.tsx</code> and save to test HMR
          </p>
        </div>
        <p className="read-the-docs">
          Click on the Vite and React logos to learn more
        </p>
      </>
      <AppRouter />
      <NavigationIcons />
    </BrowserRouter>
  );
};

export default App
