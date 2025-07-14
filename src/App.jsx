import { useEffect, useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route, Outlet, useNavigate } from 'react-router'
import Home from './pages/home/Home'
import MoodSetter from './pages/mood/MoodSetter'
import Player from './pages/player/player'
import MessageSnackbar from './pages/shared/MessageSnackbar'
import { PopupTypes } from './utils/types/popupTypes'

const footerLinks = [
  {
    header: "About",
    items: [
      {
        title: "Github",
        href: "https://github.com/JWAbayan/Moones.git"
      }
    ]
  },
  {
    header: "Resources",
    items: [
      {
        title: "API",
        href: "https://developer.jamendo.com/v3.0"
      }
    ]
  },
]

function FooterSection({header, links}){
  return(
     <div className="font-display">
        <h1 className="font-bold">{header}</h1>
        <ul className="space-y-1/2 mt-2">
          {
            links.map(link => {
              return (
                  <li> 
                    <a className="text-sm text-gray-500 " href={link.href}> 
                      {link.title} 
                      </a> 
                  </li>
                )
            })
          }
        </ul>
      </div>
  );
}

function AppLayout(){
  const [messagePopup, setMessagePopup] = useState({
    show:true,
    type: PopupTypes.Error,
    message: ""
  })
  const navigate = useNavigate()

  const timeoutSec = 3000;

  useEffect(()=> {
    showMessagePopup(PopupTypes.Error, "Internal Server Error, Try again later")
  },[])

  async function showMessagePopup(type, message){
      setMessagePopup({
        ...messagePopup,
        show: true,
        type: type,
        message: message,
      })

      const timeout = setTimeout(() => {
          setMessagePopup({
            show:false,
            type:PopupTypes.Affirm,
            message: ""
          })
      }, timeoutSec);
  }

  return(
    <div className="flex flex-col  w-screen h-screen font-display p-6 md:p-10" >
      {messagePopup.show && <MessageSnackbar type={messagePopup.type} message={messagePopup.message}/>}
      <header className="flex">
          <h1 className=" font-bold uppercase md:text-xl" onClick={() => navigate("/")} >Moones</h1>
      </header>
      <main className="h-auto flex pt-8 md:px-10">
        <Outlet context={[setMessagePopup]}/>
      </main>
      <footer className="w-full flex space-x-10 border-t-1 border-gray-300 py-5 mx-0 mt-5">
        {
          footerLinks.map(links => {
            return <FooterSection header={links.header} links={links.items} />
          })
        }
      </footer>
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
