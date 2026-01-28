import { Switch, Route, useLocation, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import LandingPage from "@/pages/LandingPage";
import Login from "@/pages/Login";
import Home from "@/pages/Home";
import Archive from "@/pages/Archive";
import Senders from "@/pages/Senders";
import Recipients from "@/pages/Recipients";
import Statistics from "@/pages/Statistics";
import IncomeStatistics from "@/pages/IncomeStatistics";
import Sidebar from "@/components/Sidebar";
import { SidebarProvider, useSidebar } from "@/hooks/use-sidebar";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }
  
  return <Component />;
}

function DashboardRouter() {
  return (
    <Switch>
      <Route path="/dashboard" component={() => <ProtectedRoute component={Home} />} />
      <Route path="/dashboard/archive" component={() => <ProtectedRoute component={Archive} />} />
      <Route path="/dashboard/senders" component={() => <ProtectedRoute component={Senders} />} />
      <Route path="/dashboard/recipients" component={() => <ProtectedRoute component={Recipients} />} />
      <Route path="/dashboard/statistics" component={() => <ProtectedRoute component={Statistics} />} />
      <Route path="/dashboard/income-statistics" component={() => <ProtectedRoute component={IncomeStatistics} />} />
      <Route component={NotFound} />
    </Switch>
  );
}

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { state, isMobile } = useSidebar();
  
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div 
        className={
          isMobile 
            ? "pt-16"
            : state === "expanded"
              ? "md:pl-64"
              : "md:pl-16"
        }
      >
        <div className="pt-2 md:pt-0">
          {children}
        </div>
      </div>
    </div>
  );
}

function DashboardLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }
  
  return (
    <SidebarProvider>
      <LayoutContent>
        <DashboardRouter />
      </LayoutContent>
    </SidebarProvider>
  );
}

function AppRouter() {
  const [location] = useLocation();
  
  if (location.startsWith("/dashboard")) {
    return <DashboardLayout />;
  }
  
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/login" component={Login} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppRouter />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
