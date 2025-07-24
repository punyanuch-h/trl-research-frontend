import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import StartPage from "./pages/StartPage";
import ProfessorDashboard from "./pages/ProfessorDashboard";
import ResearcherDashboard from "./pages/ResearcherDashboard";
import ResearcherForm from "./pages/ResearcherForm";
import Step1 from "./pages/Step1";
import Step2 from "./pages/Step2";
import Step3 from "./pages/Step3";
import Step4 from "./pages/Step4";
import Step5 from "./pages/Step5";
import Step6 from "./pages/Step6";
import Step7 from "./pages/Step7";
import Step8 from "./pages/Step8";
import Step9 from "./pages/Step9";
import CompletePage from "./pages/CompletePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<StartPage />} />
          <Route path="/professor-dashboard" element={<ProfessorDashboard />} />
          <Route path="/researcher-dashboard" element={<ResearcherDashboard />} />
          <Route path="/researcher-form" element={<ResearcherForm />} />
          <Route path="/trl-1" element={<Step1 />} />
          <Route path="/trl-2" element={<Step2 />} />
          <Route path="/trl-3" element={<Step3 />} />
          <Route path="/trl-4" element={<Step4 />} />
          <Route path="/trl-5" element={<Step5 />} />
          <Route path="/trl-6" element={<Step6 />} />
          <Route path="/trl-7" element={<Step7 />} />
          <Route path="/trl-8" element={<Step8 />} />
          <Route path="/trl-9" element={<Step9 />} />
          <Route path="/complete" element={<CompletePage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
