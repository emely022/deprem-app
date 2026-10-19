import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DrawerContextValue {
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  isFirstAidOpen: boolean;
  openFirstAid: () => void;
  closeFirstAid: (reopenDrawer?: boolean) => void;
}

const DrawerContext = createContext<DrawerContextValue | undefined>(undefined);

export const DrawerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isFirstAidOpen, setIsFirstAidOpen] = useState(false);

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);
  const toggleDrawer = () => setIsDrawerOpen((prev) => !prev);

  const openFirstAid = () => {
    setIsFirstAidOpen(true);
    setIsDrawerOpen(false);
  };

  const closeFirstAid = (reopenDrawer = false) => {
    setIsFirstAidOpen(false);
    if (reopenDrawer) {
      setIsDrawerOpen(true);
    }
  };

  return (
    <DrawerContext.Provider
      value={{
        isDrawerOpen,
        openDrawer,
        closeDrawer,
        toggleDrawer,
        isFirstAidOpen,
        openFirstAid,
        closeFirstAid,
      }}
    >
      {children}
    </DrawerContext.Provider>
  );
};

export const useDrawer = (): DrawerContextValue => {
  const context = useContext(DrawerContext);
  if (!context) {
    throw new Error('useDrawer must be used within a DrawerProvider');
  }
  return context;
};
