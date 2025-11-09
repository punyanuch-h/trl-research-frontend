import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Profile from "./pages/profile/Profile.tsx";
import AdminHomePage from "./pages/homepage/AdminHomePage.tsx";
import AppointmentDetail from "./pages/deposit-May-be-used/AppointmentDetail.tsx";
import CaseDetial from "./pages/caseDetial/CaseDetial";
import ResearcherForm from "./pages/researchForm/ResearcherForm";
import TrlScore from "./pages/deposit-May-be-used/TrlScore.tsx";
import NotFound from "./pages/NotFound";
import DifyChatIframe from "@/components/chat/DifyChatIFrame.tsx";
import ResearcherHomePage from "./pages/homepage/ResearcherHomePage.tsx";
import ResearcherDetailResearcher from "./pages/homepage/ResearcherHomePage.tsx";
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
          <Route path="/" element={<LoginPage />} />
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
          <Route path="/assessment/:id" element={<AssessmentResult />} />
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
