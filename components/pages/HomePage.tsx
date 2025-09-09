import React from 'react';
import { Page } from '../../types';
import { BookOpenIcon, SearchCircleIcon, ClipboardListIcon, ExclamationCircleIcon, UserIcon, LibraryIcon, ServerIcon, XCircleIcon, CheckCircleIcon } from '../icons';
import { useLanguage } from '../../contexts/LanguageContext';

interface HomePageProps {
  onNavigate: (page: Page) => void;
}

const InfoCard = ({ title, description, icon, onClick }: { title: string; description: string; icon: React.ReactNode; onClick: () => void }) => (
  <div
    onClick={onClick}
    className="bg-surface rounded-lg shadow-md p-6 flex flex-col items-center text-center cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
  >
    <div className="bg-primary-light text-white rounded-full p-4 mb-4">
      {icon}
    </div>
    <h3 className="text-lg font-semibold text-textPrimary mb-2">{title}</h3>
    <p className="text-sm text-textSecondary">{description}</p>
  </div>
);

const HomePage = ({ onNavigate }: HomePageProps) => {
  const { t } = useLanguage();

  return (
    <div className="animate-fade-in">
      <div className="bg-primary text-white rounded-lg shadow-lg p-8 mb-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">{t('home_title')}</h1>
        <p className="text-lg opacity-90">{t('home_subtitle')}</p>
      </div>
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-center text-textPrimary mb-6">{t('home_visual_title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Linking Card */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex flex-col shadow-sm">
                <h3 className="text-lg font-bold text-red-700 mb-3">{t('home_visual_linking_title')}</h3>
                <p className="text-sm text-red-800 flex-grow">{t('home_visual_linking_desc')}</p>
                <div className="flex items-center justify-center space-x-4 my-6 text-red-700">
                    <UserIcon className="h-10 w-10"/>
                    <div className="border-t-2 border-dashed border-red-400 flex-grow text-center font-semibold text-red-600 text-sm">KYC</div>
                    <LibraryIcon className="h-10 w-10"/>
                </div>
                <div className="mt-auto p-3 rounded-md bg-red-100 text-center flex items-center justify-center">
                    <XCircleIcon className="w-5 h-5 mr-2 text-red-700" />
                    <p className="font-bold text-sm text-red-800">{t('home_visual_linking_status')}</p>
                </div>
            </div>

            {/* Seeding Card */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 flex flex-col shadow-sm">
                <h3 className="text-lg font-bold text-accent mb-3">{t('home_visual_seeding_title')}</h3>
                <p className="text-sm text-green-800 flex-grow">{t('home_visual_seeding_desc')}</p>
                <div className="flex items-center justify-center space-x-4 my-6 text-accent">
                    <UserIcon className="h-10 w-10"/>
                    <div className="border-t-2 border-dashed border-green-400 flex-grow"></div>
                    <LibraryIcon className="h-10 w-10"/>
                    <div className="border-t-2 border-dashed border-green-400 flex-grow text-center font-semibold text-green-600 text-sm">NPCI</div>
                    <ServerIcon className="h-10 w-10"/>
                </div>
                <div className="mt-auto p-3 rounded-md bg-green-100 text-center flex items-center justify-center">
                    <CheckCircleIcon className="w-5 h-5 mr-2 text-green-800" />
                    <p className="font-bold text-sm text-green-800">{t('home_visual_seeding_status')}</p>
                </div>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <InfoCard 
          title={t('home_card_learn_title')}
          description={t('home_card_learn_desc')}
          icon={<BookOpenIcon className="h-8 w-8" />}
          onClick={() => onNavigate(Page.Learn)}
        />
        <InfoCard 
          title={t('home_card_status_title')}
          description={t('home_card_status_desc')}
          icon={<SearchCircleIcon className="h-8 w-8" />}
          onClick={() => onNavigate(Page.Status)}
        />
        <InfoCard 
          title={t('home_card_plan_title')}
          description={t('home_card_plan_desc')}
          icon={<ClipboardListIcon className="h-8 w-8" />}
          onClick={() => onNavigate(Page.ActionPlan)}
        />
        <InfoCard 
          title={t('home_card_grievance_title')}
          description={t('home_card_grievance_desc')}
          icon={<ExclamationCircleIcon className="h-8 w-8" />}
          onClick={() => onNavigate(Page.Grievance)}
        />
      </div>
    </div>
  );
};

export default HomePage;