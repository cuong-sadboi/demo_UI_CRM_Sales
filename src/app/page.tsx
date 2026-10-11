'use client';

import React, { useState, useEffect, useCallback } from 'react';
import NavigationShell from '../components/NavigationShell';
import OverviewScreen from '../components/screens/OverviewScreen';
import CustomersScreen from '../components/screens/CustomersScreen';
import AllocationScreen from '../components/screens/AllocationScreen';
import ProjectsScreen from '../components/screens/ProjectsScreen';
import ImportScreen from '../components/screens/ImportScreen';
import ReportsScreen from '../components/screens/ReportsScreen';
import CalendarScreen from '../components/screens/CalendarScreen';
import RolesScreen from '../components/screens/RolesScreen';
import { ScreenTab } from '../types/crm';

export default function HomePage() {
  const [currentTab, setCurrentTab] = useState<ScreenTab>('overview');
  const [globalToast, setGlobalToast] = useState<string | null>(null);

  const showToast = useCallback((message: string) => {
    setGlobalToast(message);
    setTimeout(() => {
      setGlobalToast(null);
    }, 3500);
  }, []);

  // Sync with URL hash if present
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '') as ScreenTab;
      if (['overview', 'projects', 'customers', 'allocation', 'calendar', 'reports', 'import', 'roles'].includes(hash)) {
        setCurrentTab(hash);
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleTabChange = (tab: ScreenTab) => {
    setCurrentTab(tab);
    window.location.hash = tab;
  };

  return (
    <NavigationShell currentTab={currentTab} onTabChange={handleTabChange}>
      {/* Toast Notification */}
      {globalToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-inverse-surface text-inverse-on-surface px-4 py-3 rounded-xl shadow-2xl border border-outline/20">
          <span className="material-symbols-outlined text-tertiary-container text-[20px]">check_circle</span>
          <span className="font-label-md text-xs sm:text-sm font-medium">{globalToast}</span>
        </div>
      )}

      {/* Screen Render */}
      {currentTab === 'overview' && (
        <OverviewScreen onNavigateTab={handleTabChange} onToast={showToast} />
      )}
      {currentTab === 'customers' && (
        <CustomersScreen onToast={showToast} />
      )}
      {currentTab === 'allocation' && (
        <AllocationScreen onToast={showToast} />
      )}
      {currentTab === 'projects' && (
        <ProjectsScreen onToast={showToast} />
      )}
      {currentTab === 'import' && (
        <ImportScreen onToast={showToast} onNavigateTab={handleTabChange} />
      )}
      {currentTab === 'reports' && (
        <ReportsScreen onToast={showToast} />
      )}
      {currentTab === 'calendar' && (
        <CalendarScreen onToast={showToast} />
      )}
      {currentTab === 'roles' && (
        <RolesScreen onToast={showToast} />
      )}
    </NavigationShell>
  );
}
