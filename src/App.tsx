import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";

import LoginPage from "./pages/account/LoginPage.tsx";
import SignupPage from "./pages/account/SignupPage.tsx";
import ProfilePage from "./pages/account/ProfilePage.tsx";
import CreateAccountPage from "./pages/account/CreateAccountPage.tsx";
import ResetPasswordPage from "./pages/account/ResetPassword.tsx";
import ForgetPassword from "./pages/account/ForgetPassword.tsx";
import AdminHomePage from "./pages/homepage/AdminHomePage.tsx";
import CaseDetial from "./pages/caseDetial/CaseDetial";
import ResearcherForm from "./pages/researchForm/ResearcherForm";
import DifyChatIframe from "@/components/chat/DifyChatIFrame.tsx";
import ResearcherHomePage from "./pages/homepage/ResearcherHomePage.tsx";
import ResearcherDetailResearcher from "./pages/homepage/ResearcherHomePage.tsx";
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
          <Route path="/" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />
          <Route path="/forget-password" element={<PublicRoute><ForgetPassword /></PublicRoute>} />
          <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
          <Route path="/admin/create-admin" element={<PrivateRoute><CreateAccountPage /></PrivateRoute>} />
          <Route path="/admin/homepage" element={<PrivateRoute><AdminHomePage /></PrivateRoute>} />
          <Route path="/researcher/homepage" element={<PrivateRoute><ResearcherHomePage /></PrivateRoute>} />
          <Route path="/case-detail/:id" element={<PrivateRoute><CaseDetial /></PrivateRoute>} />
          <Route path="/reset-password" element={<PrivateRoute><ResetPasswordPage /></PrivateRoute>} />
          <Route path="/researcher-detail-researcher" element={<PrivateRoute><ResearcherDetailResearcher /></PrivateRoute>} />
          <Route path="/researcher-form" element={<PrivateRoute><ResearcherForm /></PrivateRoute>} />
          <Route path="/assessment/:id" element={<PrivateRoute><AssessmentResult /></PrivateRoute>} />
          {/* Catch-all route */}
          <Route path="*" element={<PublicRoute><LoginPage /></PublicRoute>} />
        </Routes>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
