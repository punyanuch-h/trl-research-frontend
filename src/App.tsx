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
import CaseDetial from "./pages/CaseDetial";
import ResearcherForm from "./pages/researchDetails/ResearcherForm";
import TrlScore from "./pages/TrlScore";
import CompletePage from "./pages/CompletePage";
import NotFound from "./pages/NotFound";
import DifyChatIframe from "@/components/DifyChatIFrame";
import ResearcherHomePage from "./pages/ResearcherHomePage";
import ResearcherDetailResearcher from "./pages/ResearcherHomePage";
import AssessmentResult from "./pages/evaluate/assessmentResult.tsx";
import PublicRoute from "./routers/PublicRoute.tsx";
import PrivateRoute from "./routers/PrivateRoute.tsx";

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <DifyChatIframe />

        <Routes>
          <Route path="/" element={<PublicRoute><StartPage /></PublicRoute>} />
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/admin-homepage" element={<PrivateRoute><AdminHomePage /></PrivateRoute>} />
          <Route path="/researcher-homepage" element={<PrivateRoute><ResearcherHomePage /></PrivateRoute>} />
          <Route path="/case-detail/:id" element={<PrivateRoute><CaseDetial /></PrivateRoute >} />
          
          {/* <Route path="/appointment-detail" element={<AppointmentDetail />} /> */}
          <Route path="/researcher-detail-researcher" element={<PrivateRoute><ResearcherDetailResearcher /></PrivateRoute>} />
          <Route path="/researcher-form" element={<PrivateRoute><ResearcherForm /></PrivateRoute>} />
          <Route path="/trl-score" element={<PrivateRoute><TrlScore /></PrivateRoute>} />
          <Route path="/assessment/:id" element={<PrivateRoute><AssessmentResult /></PrivateRoute>} />
          <Route path="/complete" element={<PrivateRoute><CompletePage /></PrivateRoute>} />
          {/* Catch-all route */}
          <Route path="*" element={<PublicRoute><NotFound /></PublicRoute>} />
        </Routes>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
