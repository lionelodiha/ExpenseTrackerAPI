import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import LoadingScreen from "./LoadingScreen";

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Show loading screen on route change
    setIsLoading(true);

    // Hide loading screen after a short delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500); // 2.5 seconds loading animation

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <>
      {isLoading && <LoadingScreen />}
      <div style={{ opacity: isLoading ? 0 : 1, transition: "opacity 0.3s ease" }}>
        {children}
      </div>
    </>
  );
};

export default PageTransition;
