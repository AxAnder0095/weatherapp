import './App.css'
import {BrowserRouter, Routes, Route} from "react-router-dom";
import MainPage from "./view/MainPage.jsx";

function App() {


  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path={'/'} element={<MainPage/>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
