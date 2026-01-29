import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ForgetPassword from "./pages/ForgetPassword";
import Profile from "./pages/profile/ProfilePage.tsx";
import AdminHomePage from "./pages/homepage/AdminHomePage.tsx";
import CaseDetial from "./pages/caseDetial/CaseDetial";
import ResearcherForm from "./pages/researchForm/ResearcherForm";
import TrlScore from "./pages/deposit-May-be-used/TrlScore.tsx";
import DifyChatIframe from "@/components/chat/DifyChatIFrame.tsx";
import ResearcherHomePage from "./pages/homepage/ResearcherHomePage.tsx";
import ResearcherDetailResearcher from "./pages/homepage/ResearcherHomePage.tsx";
import AssessmentResult from "./pages/evaluate/assessmentResult.tsx";
import PublicRoute from "./routers/PublicRoute.tsx";
import PrivateRoute from "./routers/PrivateRoute.tsx";
import CreateAccountPage from "./pages/CreateAccountPage.tsx";

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <DifyChatIframe />

        <Routes>
          <Route path="/" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />
          <Route path="/forget-password" element={<PublicRoute><ForgetPassword /></PublicRoute>} />
          <Route path="/admin/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/admin/create-admin" element={<PrivateRoute><CreateAccountPage /></PrivateRoute>} />
          <Route path="/admin/homepage" element={<PrivateRoute><AdminHomePage /></PrivateRoute>} />
          <Route path="/researcher/homepage" element={<PrivateRoute><ResearcherHomePage /></PrivateRoute>} />
          <Route path="/case-detail/:id" element={<PrivateRoute><CaseDetial /></PrivateRoute>} />
          
          {/* <Route path="/appointment-detail" element={<AppointmentDetail />} /> */}
          <Route path="/researcher-detail-researcher" element={<PrivateRoute><ResearcherDetailResearcher /></PrivateRoute>} />
          <Route path="/researcher-form" element={<PrivateRoute><ResearcherForm /></PrivateRoute>} />
          <Route path="/trl-score" element={<PrivateRoute><TrlScore /></PrivateRoute>} />
          <Route path="/assessment/:id" element={<PrivateRoute><AssessmentResult /></PrivateRoute>} />
          {/* Catch-all route */}
          <Route path="*" element={<PublicRoute><LoginPage /></PublicRoute>} />
        </Routes>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
