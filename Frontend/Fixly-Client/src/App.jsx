import PublicLayout from './layouts/PublicLayout.jsx';
import LandingPage from './pages/LandingPage.jsx';
import { useEffect } from "react";
import socket from "./services/socket";

import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'


export default function App() {
  // only the landing page for now, a router will decide the page later



  const [count, setCount] = useState(0)

  useEffect(() => {
    const handleConnect = () => {
      console.log("Socket connected:", socket.id);
    };

    const handleDisconnect = () => {
      console.log("Socket disconnected");
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
    };
  }, []);

  return (
    <PublicLayout>
      <LandingPage />
    </PublicLayout>
   
  );

}
