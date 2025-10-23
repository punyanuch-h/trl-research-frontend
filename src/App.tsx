import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Profile from "./pages/Profile";
import StartPage from "./pages/StartPage";
import AdminHomePage from "./pages/AdminHomePage";
import AppointmentDetail from "./pages/AppointmentDetail";
import CaseDetial from "./pages/CaseDetial";
import ResearcherForm from "./pages/researchDetails/ResearcherForm";
import TrlScore from "./pages/TrlScore";
import CompletePage from "./pages/CompletePage";
import NotFound from "./pages/NotFound";
import DifyChatIframe from "@/components/DifyChatIFrame";
import ResearcherHomePage from "./pages/ResearcherHomePage";
import ResearcherDetailResearcher from "./pages/ResearcherHomePage";
import AssessmentResult from "./pages/evaluate/assessmentResult.tsx";

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <DifyChatIframe />

        <Routes>
          <Route path="/" element={<StartPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin-homepage" element={<AdminHomePage />} />
          <Route path="/researcher-homepage" element={<ResearcherHomePage />} />
          <Route path="/case-detail/:id" element={<CaseDetial />} />
          
          {/* <Route path="/appointment-detail" element={<AppointmentDetail />} /> */}
          <Route path="/researcher-detail-researcher" element={<ResearcherDetailResearcher />} />
          <Route path="/researcher-form" element={<ResearcherForm />} />
          <Route path="/trl-score" element={<TrlScore />} />
          <Route path="/show-case-detail/:id" element={<AssessmentResult />} />
          <Route path="/complete" element={<CompletePage />} />
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
