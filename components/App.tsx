import React, { useState, useCallback } from 'react';
import { Page } from '../types';
import HomePage from './pages/HomePage';
import LearnPage from './pages/LearnPage';
import StatusPage from './pages/StatusPage';
import ActionPlanPage from './pages/ActionPlanPage';
import GrievancePage from './pages/GrievancePage';
import { HomeIcon, BookOpenIcon, SearchCircleIcon, ClipboardListIcon, ExclamationCircleIcon } from './icons';
import { useLanguage } from '../contexts/LanguageContext';

const NavItem = ({ icon, label, isActive, onClick }: { icon: React.ReactNode; label: string; isActive: boolean; onClick: () => void; }) => (
    <button 
      onClick={onClick} 
      className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-md transition-colors duration-200 ${
        isActive 
        ? 'bg-primary-dark text-white' 
        : 'text-gray-300 hover:bg-primary-light hover:text-white'
      }`}
    >
      {icon}
      <span className="ml-3">{label}</span>
    </button>
);

const LanguageSwitcher = () => {
    const { language, setLanguage } = useLanguage();

    return (
        <div className="mt-auto p-4 flex justify-center items-center space-x-2 border-t border-primary-light">
            <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${
                    language === 'en' ? 'bg-white text-primary' : 'bg-transparent text-gray-300 hover:bg-primary-light'
                }`}
            >
                EN
            </button>
             <div className="w-px h-4 bg-primary-light"></div>
            <button
                onClick={() => setLanguage('hi')}
                className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${
                    language === 'hi' ? 'bg-white text-primary' : 'bg-transparent text-gray-300 hover:bg-primary-light'
                }`}
            >
                HI
            </button>
        </div>
    );
};


const App = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Home);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { t } = useLanguage();

  const handleNavigate = useCallback((page: Page) => {
    setCurrentPage(page);
    setSidebarOpen(false); // Close sidebar on navigation
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case Page.Home:
        return <HomePage onNavigate={handleNavigate} />;
      case Page.Learn:
        return <LearnPage />;
      case Page.Status:
        return <StatusPage />;
      case Page.ActionPlan:
        return <ActionPlanPage />;
      case Page.Grievance:
        return <GrievancePage />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  const navItems = [
    { page: Page.Home, label: t('nav_dashboard'), icon: <HomeIcon className="h-5 w-5" /> },
    { page: Page.Learn, label: t('nav_learn_center'), icon: <BookOpenIcon className="h-5 w-5" /> },
    { page: Page.Status, label: t('nav_check_status'), icon: <SearchCircleIcon className="h-5 w-5" /> },
    { page: Page.ActionPlan, label: t('nav_action_plan'), icon: <ClipboardListIcon className="h-5 w-5" /> },
    { page: Page.Grievance, label: t('nav_grievance'), icon: <ExclamationCircleIcon className="h-5 w-5" /> },
  ];

  const sidebarContent = (
    <>
      <div className="text-2xl font-bold p-4 text-center">DBT-Sankalp</div>
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map(item => (
          <NavItem 
            key={item.page}
            icon={item.icon}
            label={item.label}
            isActive={currentPage === item.page}
            onClick={() => handleNavigate(item.page)}
          />
        ))}
      </nav>
      <LanguageSwitcher />
    </>
  );
  
  const currentPageTitle = navItems.find(item => item.page === currentPage)?.label || 'DBT-Sankalp';

  return (
    <div className="flex h-screen bg-background text-textPrimary">
      {/* Sidebar for Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-primary text-white">
        {sidebarContent}
      </aside>

       {/* Sidebar for Mobile */}
      <div 
        className={`fixed inset-0 z-30 bg-black bg-opacity-50 transition-opacity lg:hidden ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setSidebarOpen(false)}
      ></div>
      <aside className={`fixed top-0 left-0 h-full bg-primary text-white w-64 transform transition-transform z-40 lg:hidden flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {sidebarContent}
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex lg:hidden items-center justify-between p-4 bg-surface shadow-md">
            <h1 className="text-xl font-bold text-primary">{currentPageTitle}</h1>
            <button onClick={() => setSidebarOpen(true)} className="text-textPrimary">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </button>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 lg:p-8">
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

export default App;