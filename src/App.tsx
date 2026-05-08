import React, { useState, useEffect } from 'react';
import OneSignal from 'react-onesignal';
import { Screen } from './types';
import Welcome from './components/Welcome';
import Dashboard from './components/Dashboard';
import DirectoryList from './components/DirectoryList';
import ExternalView from './components/ExternalView';
import ExploreGallery from './components/ExploreGallery';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [initialCategory, setInitialCategory] = useState<string | null>(null);

  useEffect(() => {
    OneSignal.init({
      appId: 'd45b951e-1fb2-4bf8-91e6-530e0392aa9c',
      allowLocalhostAsSecureOrigin: true,
    });

    // Initialize history state if not present
    if (!window.history.state) {
      window.history.replaceState({ screen: 'welcome' }, '');
    } else if (window.history.state.screen) {
      setCurrentScreen(window.history.state.screen);
      setInitialCategory(window.history.state.category || null);
    }

    const handlePopState = (event: PopStateEvent) => {
      // Check if we have a valid state to navigate to
      if (event.state && event.state.screen) {
        setCurrentScreen(event.state.screen);
        setInitialCategory(event.state.category || null);
      } else if (window.location.pathname === '/') {
        // Fallback to welcome only if at root path
        setCurrentScreen('welcome');
        setInitialCategory(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (screen: Screen, category?: string) => {
    if (screen === currentScreen && category === initialCategory) return;
    
    // Use a small delay for smoother transitions on mobile
    requestAnimationFrame(() => {
      setCurrentScreen(screen);
      setInitialCategory(category || null);
      window.history.pushState({ screen, category }, '');
      window.scrollTo(0, 0);
    });
  };

  const goBack = () => {
    window.history.back();
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return <Welcome onExplore={() => navigateTo('dashboard')} />;
      case 'dashboard':
        return <Dashboard onNavigate={navigateTo} />;
      case 'phonebook':
      case 'rental':
      case 'property':
      case 'jobs':
      case 'food':
      case 'realestate':
      case 'events':
      case 'phonebook-dark':
        return (
          <DirectoryList 
            screen={currentScreen === 'phonebook-dark' ? 'phonebook' : currentScreen} 
            onBack={goBack} 
            initialCategory={initialCategory} 
            onCategoryChange={(cat) => setInitialCategory(cat)}
            forceDarkMode={currentScreen === 'phonebook-dark'}
          />
        );
      case 'explore':
        return <ExploreGallery onBack={goBack} />;
      case 'weather':
        return (
          <ExternalView 
            title="Weather" 
            url="https://www.mydeesa.in/2016/02/weather.html" 
            onBack={goBack} 
          />
        );
      case 'game':
        return (
          <ExternalView 
            title="My Deesa Games" 
            url="https://potato-games.jioposters.workers.dev/" 
            onBack={goBack} 
          />
        );
      case 'apmc':
        return (
          <ExternalView 
            title="APMC Rates" 
            url="https://www.apmcdeesa.com/" 
            onBack={goBack} 
          />
        );
      case 'shopping':
        return (
          <ExternalView 
            title="Shopping" 
            url="https://mydeesa.statusring.in" 
            onBack={goBack} 
          />
        );
      default:
        return <Dashboard onNavigate={navigateTo} />;
    }
  };

  return (
    <div className="min-h-screen font-sans selection:bg-[#fedf36]/30">
      {renderScreen()}
    </div>
  );
}
