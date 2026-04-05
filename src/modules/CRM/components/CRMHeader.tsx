import React from 'react';
import { ArrowLeft, Plus } from 'lucide-react';
import { Button } from '../../../components/ui/button';

interface CRMHeaderProps {
  fromDashboard: boolean;
  onBackToDashboard: () => void;
  onNewContact: () => void;
}

export function CRMHeader({ fromDashboard, onBackToDashboard, onNewContact }: CRMHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-primary to-neon-light text-white">
      <div className="flex items-center justify-between p-6">
        <div className="flex items-center gap-4">
          {fromDashboard && (
            <Button
              variant="ghost"
              onClick={onBackToDashboard}
              className="text-white hover:bg-white/20 mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
          )}
          <div className="p-3 bg-white/20 rounded-xl">
            <span className="text-2xl">🌐</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold">CRM - Site internet & SEO</h1>
          </div>
        </div>
        <Button
          onClick={onNewContact}
          className="flex items-center gap-2 bg-white text-primary hover:bg-white/90 px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
        >
          <Plus className="h-5 w-5" />
          Nouveau Contact
        </Button>
      </div>
    </div>
  );
}
