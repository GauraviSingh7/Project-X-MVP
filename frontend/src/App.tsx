import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import LiveScores from "./pages/LiveScores";
import Schedule from "./pages/Schedule";
import MatchDetail from "./pages/MatchDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000, // 30 seconds for live data
      refetchInterval: 30 * 1000,
    },
  },
});

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Helmet>
          <title>STRYKER - Your Cricket Command Center</title>
          <meta name="description" content="STRYKER is the ultimate destination for serious cricket fans. Live scores, expert analysis, and intelligent discussions - all in one place." />
          <meta name="keywords" content="cricket, live scores, cricket news, cricket analysis, cricket community" />
        </Helmet>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="live" element={<LiveScores />} />
              <Route path="schedule" element={<Schedule />} />
              <Route path="match/:matchId" element={<MatchDetail />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
