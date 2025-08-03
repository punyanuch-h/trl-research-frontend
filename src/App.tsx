import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Profile from "./pages/Profile";
import StartPage from "./pages/StartPage";
import ProfessorDashboard from "./pages/ProfessorDashboard";
import ResearcherDashboard from "./pages/ResearcherDashboard";
import ResearcherDetail from "./pages/ResearcherDetail";
import ResearcherForm from "./pages/ResearcherForm";
import Step1 from "./pages/steps/Step1";
import Step2 from "./pages/steps/Step2";
import Step3 from "./pages/steps/Step3";
import Step4 from "./pages/steps/Step4";
import Step5 from "./pages/steps/Step5";
import Step6 from "./pages/steps/Step6";
import Step7 from "./pages/steps/Step7";
import Step8 from "./pages/steps/Step8";
import Step9 from "./pages/steps/Step9";
import CompletePage from "./pages/CompletePage";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/startPage" element={<StartPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/professor-dashboard" element={<ProfessorDashboard />} />
          <Route path="/researcher-dashboard" element={<ResearcherDashboard />} />
          <Route path="/researcher-detail" element={<ResearcherDetail />} />
          <Route path="/researcher-form" element={<ResearcherForm />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
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
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
