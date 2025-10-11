import React from "react";
import "./LoadingScreen.css";

const LoadingScreen: React.FC = () => {
  return (
    <div className="loading-screen">
      <div className="loading-screen__content">
        {/* Animated VG Logo */}
        <div className="loading-logo">
          <div className="loading-logo__letter loading-logo__letter--v">V</div>
          <div className="loading-logo__letter loading-logo__letter--g">G</div>
        </div>
      </div>

      {/* Background Animation */}
      <div className="loading-bg">
        <div className="loading-bg__circle loading-bg__circle--1"></div>
        <div className="loading-bg__circle loading-bg__circle--2"></div>
        <div className="loading-bg__circle loading-bg__circle--3"></div>
      </div>
    </div>
  );
};

export default LoadingScreen;
