import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircleIcon, CheckIcon, PlayCircleIcon } from '../icons';
import { useLanguage } from '../../contexts/LanguageContext';

const VideoModal = ({ videoId, onClose }: { videoId: string; onClose: () => void }) => {
    const modalRoot = document.getElementById('modal-root');
    if (!modalRoot) return null;

    return createPortal(
        <div 
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 animate-fade-in"
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div 
                className="bg-surface rounded-lg shadow-2xl relative w-11/12 max-w-4xl aspect-video"
                onClick={(e) => e.stopPropagation()}
            >
                <button 
                    onClick={onClose} 
                    className="absolute -top-3 -right-3 text-white bg-primary rounded-full h-8 w-8 flex items-center justify-center z-10 hover:bg-primary-dark transition-colors"
                    aria-label="Close video player"
                >&times;</button>
                <iframe
                    className="w-full h-full rounded-lg"
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                ></iframe>
            </div>
        </div>,
        modalRoot
    );
};

const Step = ({ number, title, children, isCompleted, onToggle }: { number: number; title: string; children: React.ReactNode; isCompleted: boolean; onToggle: () => void; }) => (
    <div className="flex">
        <div className="flex flex-col items-center mr-4">
            <div onClick={onToggle} className="cursor-pointer" aria-label={`Mark step ${number} as ${isCompleted ? 'incomplete' : 'complete'}`}>
                <div className={`flex items-center justify-center w-10 h-10 border rounded-full font-bold transition-all duration-300 ${isCompleted ? 'bg-accent border-accent text-white' : 'bg-primary text-white hover:bg-primary-dark'}`}>
                    {isCompleted ? <CheckIcon className="w-6 h-6"/> : number}
                </div>
            </div>
            <div className="w-px h-full bg-gray-300"></div>
        </div>
        <div className={`pb-8 transition-opacity ${isCompleted ? 'opacity-60' : 'opacity-100'}`}>
            <p className={`mb-2 text-xl font-bold text-textPrimary ${isCompleted ? 'line-through' : ''}`}>{title}</p>
            <div className="text-textSecondary space-y-2">{children}</div>
        </div>
    </div>
);


const ActionPlanPage = () => {
    const { t } = useLanguage();
    const [modalVideoId, setModalVideoId] = useState<string | null>(null);
    const totalSteps = 4;
    const [completedSteps, setCompletedSteps] = useState<number[]>(() => {
        try {
            const saved = localStorage.getItem('dbt-action-plan-steps');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error("Failed to parse completed steps from localStorage", error);
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem('dbt-action-plan-steps', JSON.stringify(completedSteps));
    }, [completedSteps]);

    const handleToggleStep = (stepNumber: number) => {
        setCompletedSteps(prev => 
            prev.includes(stepNumber) 
                ? prev.filter(n => n !== stepNumber)
                : [...prev, stepNumber]
        );
    };

    const progressPercentage = (completedSteps.length / totalSteps) * 100;

    const steps = [
        { 
            title: "Visit Your Bank Branch", 
            content: (
                <>
                    <p>Go to the bank branch where you have your primary student account. This is the account you want your scholarship money to be credited to.</p>
                    <p className="font-semibold">What to take: Your original Aadhaar card and a photocopy.</p>
                </>
            )
        },
        { 
            title: "Request the Correct Form", 
            content: (
                 <>
                    <p>Ask the bank official for the "Aadhaar Seeding and DBT Consent Form" (sometimes called 'NPCI Mapper Consent Form').</p>
                    <p className="text-red-600 font-medium">Important: Do not just fill a KYC update form. You must specifically give consent for DBT.</p>
                </>
            )
        },
        { 
            title: "Fill and Submit the Form", 
            content: (
                <>
                    <p>Fill out the form carefully, ensuring your name, account number, and Aadhaar number are correct.</p>
                    <p>Submit the form along with the Aadhaar photocopy. Always ask for a stamped acknowledgement receipt as proof of submission.</p>
                </>
            ) 
        },
        { 
            title: "Wait and Verify", 
            content: (
                <>
                    <p>It can take a few business days for the bank to update your status in the NPCI Mapper.</p>
                    <p>After 3-5 days, use our <strong className="text-primary">Unified Status Checker</strong> to confirm that your account is now 'Active' and correctly seeded. </p>
                </>
            )
        },
    ];

    return (
        <div className="animate-fade-in">
            {modalVideoId && <VideoModal videoId={modalVideoId} onClose={() => setModalVideoId(null)} />}
            <h1 className="text-2xl sm:text-3xl font-bold text-textPrimary mb-6">{t('action_plan_page_title')}</h1>
            <p className="text-base sm:text-lg text-textSecondary mb-8">
                Follow this simple, step-by-step guide to ensure your bank account is ready to receive government benefits. Completing these steps will prevent most payment failures.
            </p>

            <div className="mb-8 p-6 rounded-lg shadow-md bg-blue-50 border border-primary-light">
                <h2 className="text-xl font-bold text-textPrimary mb-3">Visual Guide: Filling the Form</h2>
                 <p className="text-textSecondary mb-4">
                   Need help with the paperwork? Watch this short video for a step-by-step walkthrough of the Aadhaar Seeding Consent Form.
                </p>
                <div onClick={() => setModalVideoId('gjPkUF23UTg')} className="relative group cursor-pointer aspect-video rounded-lg overflow-hidden shadow-lg">
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-lg group-hover:bg-opacity-60 transition-all">
                        <PlayCircleIcon className="h-16 w-16 text-white opacity-80 group-hover:opacity-100 transform group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="bg-gray-700 h-full w-full rounded-lg flex items-end p-4 bg-cover bg-center" style={{backgroundImage: "url('https://img.youtube.com/vi/gjPkUF23UTg/maxresdefault.jpg')"}}>
                        <div className="bg-black bg-opacity-60 text-white p-2 rounded w-full">
                            <h5 className="font-bold">How to Fill the Aadhaar Seeding Form</h5>
                            <p className="text-sm">A visual guide to avoid common mistakes.</p>
                        </div>
                    </div>
                </div>
            </div>

             <div className="mb-8">
                <div className="flex justify-between mb-1">
                    <span className="text-base font-medium text-primary">Progress</span>
                    <span className="text-sm font-medium text-primary">{Math.round(progressPercentage)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-primary h-2.5 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
                </div>
            </div>

            <div className="bg-surface p-8 rounded-lg shadow-md">
                {steps.map((step, index) => (
                    <Step 
                        key={index}
                        number={index + 1} 
                        title={step.title}
                        isCompleted={completedSteps.includes(index + 1)}
                        onToggle={() => handleToggleStep(index + 1)}
                    >
                        {step.content}
                    </Step>
                ))}
                 <div className="flex">
                    <div className="flex flex-col items-center mr-4">
                        <div>
                           <CheckCircleIcon className="w-10 h-10 text-accent"/>
                        </div>
                    </div>
                    <div className="pt-1">
                        <p className="text-xl font-bold text-accent">You're All Set!</p>
                        <p className="text-textSecondary">Once your status is active, you are DBT-ready. The government can now successfully transfer all benefits to this account.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActionPlanPage;