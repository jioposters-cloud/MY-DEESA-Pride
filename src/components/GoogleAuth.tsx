import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogIn, X, UserCheck } from 'lucide-react';
import { reportVisit } from '../services/trackingService';

interface GoogleAuthProps {
  onAuthSuccess: (email: string) => void;
}

export default function GoogleAuth({ onAuthSuccess }: GoogleAuthProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(localStorage.getItem('user_email'));

  useEffect(() => {
    // Check if user already signed in
    if (userEmail) {
      reportVisit(userEmail);
      onAuthSuccess(userEmail);
      return;
    }

    // If not signed in, show the prompt after a short delay
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, [userEmail]);

  useEffect(() => {
    if (!isOpen) return;

    // Initialize Google One Tap / Sign In
    const handleCredentialResponse = (response: any) => {
      const payload = JSON.parse(atob(response.credential.split('.')[1]));
      const email = payload.email;
      
      localStorage.setItem('user_email', email);
      setUserEmail(email);
      setIsOpen(false);
      reportVisit(email);
      onAuthSuccess(email);
    };

    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
        callback: handleCredentialResponse,
      });

      window.google.accounts.id.renderButton(
        document.getElementById('google-signin-button'),
        { theme: 'outline', size: 'large', width: '100%' }
      );

      // Also show One Tap if possible
      window.google.accounts.id.prompt();
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-sm bg-white rounded-[2.5rem] shadow-2xl overflow-hidden p-8 text-center space-y-6"
          >
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto">
              <LogIn className="w-10 h-10 text-[#b71700]" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-2xl font-black tracking-tighter uppercase text-[#b71700]">Welcome Back</h3>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-widest leading-relaxed">
                Please sign in with your Google account to continue and help us improve your experience.
              </p>
            </div>

            <div id="google-signin-button" className="w-full flex justify-center"></div>

            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">
              By signing in, you agree to our terms and help us understand visit patterns.
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
