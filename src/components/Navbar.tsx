import React, { useState } from 'react';
import { Menu, Moon, User, Bell, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useAuth } from '../hooks/useAuth';
import { useNotificationStore } from '../store/notificationStore';
import AuthModal from './AuthModal';
import NotificationCenter from './NotificationCenter';

interface NavbarProps {
  onViewChange: (view: 'feed' | 'profile') => void;
  currentView: 'feed' | 'profile';
}

export default function Navbar({ onViewChange, currentView }: NavbarProps) {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] =
    useState(false);
  const { user, isAuthenticated } = useAuthStore();
  const { signOut } = useAuth();
  const { getUnreadCount } = useNotificationStore();

  const handleLogout = async () => {
    await signOut();
    onViewChange('feed');
  };

  return (
    <>
      <nav className="fixed w-full bg-white/10 backdrop-blur-lg z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Moon className="w-8 h-8 text-purple-300" />
              <span className="text-xl font-bold text-white">DreamLoop </span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <button
                onClick={() => onViewChange('feed')}
                className={`text-purple-200 hover:text-white transition-colors ${
                  currentView === 'feed' ? 'text-white' : ''
                }`}
              >
                Home
              </button>
              {isAuthenticated && (
                <button
                  onClick={() => onViewChange('profile')}
                  className={`text-purple-200 hover:text-white transition-colors ${
                    currentView === 'profile' ? 'text-white' : ''
                  }`}
                >
                  Profile
                </button>
              )}
            </div>

            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => setIsNotificationCenterOpen(true)}
                    className="relative p-2 text-purple-300 hover:text-white transition-colors"
                  >
                    <Bell className="w-6 h-6" />
                    {getUnreadCount() > 0 && (
                      <span className="absolute top-0 right-0 w-5 h-5 bg-purple-500 text-white text-xs rounded-full flex items-center justify-center">
                        {getUnreadCount()}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => onViewChange('profile')}
                    className="flex items-center gap-2"
                  >
                    <img
                      src={user?.avatar}
                      alt={user?.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="text-white hidden md:block">
                      {user?.name}
                    </span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-purple-300 hover:text-white transition-colors group relative"
                    title="Sign Out"
                  >
                    <LogOut className="w-6 h-6" />
                    <span className="absolute right-0 top-full mt-1 w-max bg-white/10 backdrop-blur-sm text-white text-sm py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      Sign Out
                    </span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-full transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span>Sign In</span>
                </button>
              )}
              <button className="md:hidden p-2 text-purple-300 hover:text-white transition-colors">
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      <NotificationCenter
        isOpen={isNotificationCenterOpen}
        onClose={() => setIsNotificationCenterOpen(false)}
      />
    </>
  );
}
