import React, { useState, useEffect } from "react";
import "./App.css";
import LevelMap from "./widget-pass/Main.jsx";

function App({ smarticoConfigured = true }) {
  const [smarticoReady, setSmarticoReady] = useState(false);
  const [smarticoTimedOut, setSmarticoTimedOut] = useState(false);

  useEffect(() => {
    if (!smarticoConfigured) return;

    const checkReady = () => {
      if (window._smartico && window._smartico.api) {
        setSmarticoReady(true);
        return true;
      }
      return false;
    };

    if (checkReady()) return;
    const id = setInterval(() => {
      if (checkReady()) {
        clearInterval(id);
      }
    }, 300);
    const timeoutId = setTimeout(() => {
      setSmarticoTimedOut(true);
      clearInterval(id);
    }, 8000);

    return () => {
      clearInterval(id);
      clearTimeout(timeoutId);
    };
  }, [smarticoConfigured]);

  return (
    <div className="app-shell">
      <div className="phone">
        <div className="phone-notch" />
        <div className="phone-screen">
          {!smarticoConfigured ? (
            <LevelMap />
          ) : smarticoReady ? (
            <LevelMap />
          ) : (
            <div className="phone-loading">
              {smarticoTimedOut ? <LevelMap /> : "Loading Smartico script..."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
