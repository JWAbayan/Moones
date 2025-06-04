import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route, Outlet, useNavigate } from 'react-router'
import Home from './pages/home/Home'
import MoodSetter from './pages/mood/MoodSetter'
import Player from './pages/player/player'

function AppLayout(){
  const navigate = useNavigate()

  return(
    <div className="flex flex-col  w-screen h-screen font-display p-6 md:p-10" >
      <header className="flex">
          <h1 className=" font-bold uppercase md:text-xl" onClick={() => navigate("/")} >Moones</h1>
      </header>
      <main className="h-full flex pt-8 md:px-10">
        <Outlet/>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout/>}>
          <Route path='/' element={<Home/>}/>
          <Route path='/mood' element={<MoodSetter/>}/>
          <Route path='/player' element={<Player/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
