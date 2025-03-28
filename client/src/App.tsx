import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Archive from "@/pages/Archive";
import Senders from "@/pages/Senders";
import Recipients from "@/pages/Recipients";
import Statistics from "@/pages/Statistics";
import IncomeStatistics from "@/pages/IncomeStatistics";
import Sidebar from "@/components/Sidebar";
import { SidebarProvider, useSidebar } from "@/hooks/use-sidebar";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/archive" component={Archive} />
      <Route path="/senders" component={Senders} />
      <Route path="/recipients" component={Recipients} />
      <Route path="/statistics" component={Statistics} />
      <Route path="/income-statistics" component={IncomeStatistics} />
      <Route path="/clients" component={Senders} /> {/* Redirect legacy route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// Componente wrapper che può accedere al context
function LayoutContent({ children }: { children: React.ReactNode }) {
  const { state, isMobile } = useSidebar();
  
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div 
        className={
          isMobile 
            ? "pt-16" // Mobile view con top space per l'header
            : state === "expanded"
              ? "md:pl-64" // Desktop con sidebar espansa
              : "md:pl-16" // Desktop con sidebar collassata
        }
      >
        <div className="pt-2 md:pt-0">
          {children}
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SidebarProvider>
        <LayoutContent>
          <Router />
        </LayoutContent>
        <Toaster />
      </SidebarProvider>
    </QueryClientProvider>
  );
}

export default App;
