import React, { createContext, useContext, useState, ReactNode } from 'react';

type ActiveModal = 'none' | 'firstAid' | 'whistle' | 'checklist' | 'numbers';

interface DrawerContextValue {
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  activeModal: ActiveModal;
  selectedCategory: string | null;
  openFirstAid: (category?: string) => void;
  openWhistle: () => void;
  openChecklist: () => void;
  openNumbers: () => void;
  closeModal: () => void;
}

const DrawerContext = createContext<DrawerContextValue | undefined>(undefined);

export const DrawerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<ActiveModal>('none');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);
  const toggleDrawer = () => setIsDrawerOpen((prev) => !prev);

  const openFirstAid = (category?: string) => {
    setSelectedCategory(category || null);
    setActiveModal('firstAid');
    setIsDrawerOpen(false);
  };

  const openWhistle = () => {
    setActiveModal('whistle');
    setIsDrawerOpen(false);
  };

  const openChecklist = () => {
    setActiveModal('checklist');
    setIsDrawerOpen(false);
  };

  const openNumbers = () => {
    setActiveModal('numbers');
    setIsDrawerOpen(false);
  };

  const closeModal = () => {
    setActiveModal('none');
    setSelectedCategory(null);
  };

  return (
    <DrawerContext.Provider
      value={{
        isDrawerOpen,
        openDrawer,
        closeDrawer,
        toggleDrawer,
        activeModal,
        selectedCategory,
        openFirstAid,
        openWhistle,
        openChecklist,
        openNumbers,
        closeModal,
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
