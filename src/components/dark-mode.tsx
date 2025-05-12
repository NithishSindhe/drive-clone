'use client';

import { useState,useEffect } from "react"
import { Sun, Moon } from "lucide-react"

export default function DarkMode() {
  const [mode, setMode] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('mode') as 'dark' | 'light') || 'dark';
  });
  useEffect(() => {
    document.documentElement.classList.toggle('dark', mode === 'dark');
    localStorage.setItem('mode', mode);
  }, [mode]);
  const changeMode = () => {
      setMode(prev => (prev === 'dark' ? 'light' : 'dark'));
  };
  return <button onClick={changeMode}>
            {mode === 'dark' ? <Sun /> : <Moon />}
          </button>
}
