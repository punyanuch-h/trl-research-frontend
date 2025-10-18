import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ArrowLeft, List, CalendarRange } from 'lucide-react';
import { Button } from '@/components/ui/button';

import Header from './Header';

interface ProfessorNavbarProps {
  activeView: 'management';
  onViewChange: (view: 'management') => void;
  children: React.ReactNode;
}

export default function ProfessorNavbar({ activeView, onViewChange, children }: ProfessorNavbarProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Navigation Tabs */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Research Management</h1>
              <p className="text-muted-foreground">Manage your TRL assessment projects</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button onClick={() => navigate('/researcher-form')}>
              <Plus className="w-4 h-4 mr-2" />
              New Research
            </Button>
          </div>
        </div>

        {/* Remove View Toggle entirely - only show management */}
        {/* Content */}
        {children}
      </div>
    </div>
  );
} 