import { createContext, useState, useContext, useEffect } from "react";
import { useIsMobile } from "./use-mobile";

export type SidebarState = "expanded" | "collapsed";

interface SidebarContextProps {
  state: SidebarState;
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
}

const initialState: SidebarContextProps = {
  state: "expanded",
  open: true,
  setOpen: () => {},
  openMobile: false,
  setOpenMobile: () => {},
  isMobile: false,
  toggleSidebar: () => {},
};

const SidebarContext = createContext<SidebarContextProps>(initialState);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<SidebarState>("expanded");
  const [open, setOpen] = useState<boolean>(true);
  const [openMobile, setOpenMobile] = useState<boolean>(false);
  const isMobile = useIsMobile();

  // Toggle sidebar state between expanded and collapsed
  const toggleSidebar = () => {
    const newState = state === "expanded" ? "collapsed" : "expanded";
    setState(newState);
    setOpen(newState === "expanded");
  };

  // Reset sidebar state when switching between mobile and desktop
  useEffect(() => {
    if (isMobile) {
      setState("expanded");
      setOpen(true);
      setOpenMobile(false);
    }
  }, [isMobile]);

  return (
    <SidebarContext.Provider
      value={{
        state,
        open,
        setOpen,
        openMobile,
        setOpenMobile,
        isMobile,
        toggleSidebar,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  
  return context;
};