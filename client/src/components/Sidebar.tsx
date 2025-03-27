import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { MenuIcon, X, FileText, Archive, Users } from "lucide-react";
import { useSidebar } from "@/hooks/use-sidebar";

const sidebarLinks = [
  {
    title: "Modulo Spedizione",
    href: "/",
    icon: <FileText className="mr-2 h-4 w-4" />,
  },
  {
    title: "Archivio",
    href: "/archive",
    icon: <Archive className="mr-2 h-4 w-4" />,
  },
  {
    title: "Clienti",
    href: "/clients",
    icon: <Users className="mr-2 h-4 w-4" />,
  },
];

export default function Sidebar() {
  const { state, toggleSidebar, isMobile, openMobile, setOpenMobile } = useSidebar();
  const [location] = useLocation();

  useEffect(() => {
    if (isMobile) {
      setOpenMobile(false);
    }
  }, [location, isMobile, setOpenMobile]);

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && openMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/80"
          onClick={() => setOpenMobile(false)}
        />
      )}

      {/* Mobile header with menu button */}
      <div className="flex h-16 items-center px-4 md:hidden border-b">
        <Button
          variant="ghost"
          className="mr-2"
          size="icon"
          onClick={() => setOpenMobile(!openMobile)}
        >
          <MenuIcon className="h-6 w-6" />
        </Button>
        <div className="font-semibold">MAYLEA Logistics & Transport</div>
      </div>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-background border-r transition-transform duration-300 ease-in-out md:translate-x-0",
          state === "collapsed" && !isMobile ? "-translate-x-full sm:translate-x-0 sm:w-16" : "",
          isMobile && !openMobile ? "-translate-x-full" : ""
        )}
      >
        {/* Sidebar header with toggle/close button */}
        <div className="flex h-16 items-center border-b px-4">
          <div className={cn("flex items-center flex-1", 
            state === "collapsed" && !isMobile ? "justify-center" : "justify-between"
          )}>
            {(state === "expanded" || isMobile) && (
              <span className="font-semibold">MAYLEA ML&T</span>
            )}
            
            {isMobile ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpenMobile(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
              >
                <MenuIcon className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>

        {/* Sidebar links */}
        <div className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-2 px-2">
            {sidebarLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start",
                      location === link.href ? "bg-primary-50" : "",
                      state === "collapsed" && !isMobile ? "justify-center px-0" : ""
                    )}
                  >
                    {link.icon}
                    {(state === "expanded" || isMobile) && <span>{link.title}</span>}
                  </Button>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Sidebar footer */}
        <div className="border-t p-4">
          {(state === "expanded" || isMobile) && (
            <div className="text-xs text-muted-foreground">
              <p>© 2023 MAYLEA Logistics & Transport</p>
              <p>C.T.D. SRL</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}