import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Moon } from 'lucide-react';
import { SupabaseProvider } from './context/SupabaseProvider';
import Navbar from './components/Navbar';
import LoadingSpinner from './components/LoadingSpinner';

const DreamEntry = lazy(() => import('./components/DreamEntry'));
const DreamFeed = lazy(() => import('./components/DreamFeed'));
const DreamStats = lazy(() => import('./components/DreamStats'));
const DreamCollections = lazy(() => import('./components/DreamCollections'));
const UserProfile = lazy(() => import('./components/UserProfile'));
const EmailConfirmation = lazy(() => import('./components/EmailConfirmation'));

function AppContent() {
  const [currentView, setCurrentView] = React.useState<'feed' | 'profile'>('feed');

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-pink-800">
      <Navbar onViewChange={setCurrentView} currentView={currentView} />

      <Suspense fallback={<LoadingSpinner />}>
        {currentView === 'feed' ? (
          <div className="container mx-auto px-4 pt-20">
            <DreamEntry />
            <DreamCollections />
            <DreamStats />
            <DreamFeed />
          </div>
        ) : (
          <div className="pt-16">
            <UserProfile />
          </div>
        )}
      </Suspense>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <SupabaseProvider>
        <Routes>
          <Route 
            path="/confirm" 
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <EmailConfirmation />
              </Suspense>
            } 
          />
          <Route path="/" element={<AppContent />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </SupabaseProvider>
    </BrowserRouter>
  );
}

export default App;