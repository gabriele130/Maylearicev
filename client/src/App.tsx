import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Archive from "@/pages/Archive";
import Clients from "@/pages/Clients";
import Sidebar from "@/components/Sidebar";
import { SidebarProvider } from "@/hooks/use-sidebar";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/archive" component={Archive} />
      <Route path="/clients" component={Clients} />
      <Route component={NotFound} />
    </Switch>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="md:pl-64">
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
        <Layout>
          <Router />
        </Layout>
        <Toaster />
      </SidebarProvider>
    </QueryClientProvider>
  );
}

export default App;
