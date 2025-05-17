"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react"; // or wherever you import from

export default function DarkMode() {
  const [mode, setMode] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const storedMode = localStorage.getItem('mode') as 'dark' | 'light' | null;
    const initialMode = storedMode ?? 'dark'; //default mode
    setMode(initialMode);
    document.documentElement.classList.toggle('dark', initialMode === 'dark');
  }, []);

  useEffect(() => {
    localStorage.setItem('mode', mode);
    document.documentElement.classList.toggle('dark', mode === 'dark');
  }, [mode]);

  const changeMode = () => {
    setMode(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <button onClick={changeMode}>
      {mode === 'dark' ? <Sun /> : <Moon />}
    </button>
  );
}
