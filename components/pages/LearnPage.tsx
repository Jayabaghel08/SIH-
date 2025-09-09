import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { quizData } from '../../services/translation';
import { CheckCircleIcon, PlayCircleIcon, RefreshIcon, UserIcon, LibraryIcon, BuildingOffice2Icon, ServerIcon, ArrowRightIcon, XCircleIcon } from '../icons';

const Accordion = ({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="border-b border-gray-200">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center py-4 text-left text-lg font-semibold text-textPrimary hover:bg-gray-50 focus:outline-none px-2"
            >
                <span>{title}</span>
                <svg
                    className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
            </button>
            {isOpen && (
                <div className="pb-4 px-2 text-textSecondary animate-fade-in-down space-y-4">
                    {children}
                </div>
            )}
        </div>
    );
};

const Quiz = () => {
    const { t } = useLanguage();
    const [isStarted, setIsStarted] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [score, setScore] = useState(0);
    const [isFinished, setIsFinished] = useState(false);

    const handleStart = () => setIsStarted(true);

    const handleAnswer = (answerIndex: number) => {
        if (showFeedback) return;
        setSelectedAnswer(answerIndex);
        setShowFeedback(true);
        if (answerIndex === quizData[currentQuestionIndex].correctAnswerIndex) {
            setScore(prev => prev + 1);
        }
    };

    const handleNext = () => {
        if (currentQuestionIndex < quizData.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setSelectedAnswer(null);
            setShowFeedback(false);
        } else {
            setIsFinished(true);
        }
    };

    const handleRestart = () => {
        setIsStarted(false);
        setCurrentQuestionIndex(0);
        setSelectedAnswer(null);
        setShowFeedback(false);
        setScore(0);
        setIsFinished(false);
    };

    if (!isStarted) {
        return (
            <div className="text-center p-4">
                <p className="mb-4">{t('quiz_intro')}</p>
                <button onClick={handleStart} className="bg-primary text-white font-semibold py-2 px-6 rounded-md hover:bg-primary-dark transition-colors">
                    {t('quiz_start_button')}
                </button>
            </div>
        );
    }

    if (isFinished) {
        const percentage = Math.round((score / quizData.length) * 100);
        let feedbackKey: 'quiz_results_feedback_good' | 'quiz_results_feedback_ok' | 'quiz_results_feedback_bad';
        if (percentage >= 80) {
            feedbackKey = 'quiz_results_feedback_good';
        } else if (percentage >= 50) {
            feedbackKey = 'quiz_results_feedback_ok';
        } else {
            feedbackKey = 'quiz_results_feedback_bad';
        }

        return (
            <div className="text-center p-4">
                <h3 className="text-2xl font-bold text-textPrimary mb-2">{t('quiz_results_title')}</h3>
                <p className="text-lg mb-4">{t('quiz_results_score')} <span className="font-bold">{score} / {quizData.length}</span></p>
                <p className="mb-6">{t(feedbackKey)}</p>
                <button onClick={handleRestart} className="flex items-center justify-center mx-auto bg-primary text-white font-semibold py-2 px-6 rounded-md hover:bg-primary-dark transition-colors">
                    <RefreshIcon className="w-5 h-5 mr-2" />
                    {t('quiz_retry_button')}
                </button>
            </div>
        );
    }
    
    const currentQuestion = quizData[currentQuestionIndex];
    const { questionKey, optionsKeys, correctAnswerIndex } = currentQuestion;

    return (
        <div className="p-4">
            <h4 className="font-bold text-lg mb-4 text-textPrimary">{t('quiz_question_title')} {currentQuestionIndex + 1}/{quizData.length}: {t(questionKey)}</h4>
            <div className="space-y-3">
                {optionsKeys.map((optionKey, index) => {
                    const isCorrect = index === correctAnswerIndex;
                    const isSelected = selectedAnswer === index;
                    let buttonClass = 'border-gray-300 hover:bg-gray-100';
                    if (showFeedback && isSelected) {
                        buttonClass = isCorrect ? 'border-accent bg-green-50 text-accent font-bold' : 'border-red-500 bg-red-50 text-red-600 font-bold';
                    } else if (showFeedback && isCorrect) {
                        buttonClass = 'border-accent bg-green-50 text-accent font-bold';
                    }

                    return (
                         <button
                            key={index}
                            onClick={() => handleAnswer(index)}
                            disabled={showFeedback}
                            className={`w-full text-left p-3 border rounded-md transition-colors ${buttonClass} ${!showFeedback ? 'cursor-pointer' : 'cursor-default'}`}
                        >
                            {t(optionKey)}
                        </button>
                    )
                })}
            </div>
            {showFeedback && (
                 <div className="text-center mt-6">
                     <button onClick={handleNext} className="bg-primary text-white font-semibold py-2 px-8 rounded-md hover:bg-primary-dark transition-colors">
                        {currentQuestionIndex < quizData.length - 1 ? t('quiz_next_button') : t('quiz_finish_button')}
                    </button>
                 </div>
            )}
        </div>
    );
};

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


const LearnPage = () => {
    const { t } = useLanguage();
    const [modalVideoId, setModalVideoId] = useState<string | null>(null);

    return (
        <div className="animate-fade-in">
            {modalVideoId && <VideoModal videoId={modalVideoId} onClose={() => setModalVideoId(null)} />}
            <h1 className="text-2xl sm:text-3xl font-bold text-textPrimary mb-6">{t('learn_title')}</h1>
            <p className="text-base sm:text-lg text-textSecondary mb-8">
                {t('learn_subtitle')}
            </p>
            <div className="bg-surface p-4 sm:p-8 rounded-lg shadow-md space-y-4">
                <Accordion title={t('learn_accordion1_title')} defaultOpen>
                    <p>{t('learn_accordion1_content')}</p>
                </Accordion>

                <Accordion title={t('learn_accordion2_title')} defaultOpen>
                    <h4 className="text-xl font-bold text-textPrimary mb-4">{t('learn_visual_comp')}</h4>
                    <div className="grid md:grid-cols-2 gap-6 my-4">
                        {/* Linking Card */}
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 flex flex-col">
                            <h5 className="text-xl font-bold text-orange-700 mb-3">{t('learn_linking_title')}</h5>
                            <p className="text-sm text-orange-800 flex-grow">{t('learn_linking_desc_p1')}</p>
                            <p className="text-sm text-red-600 font-semibold mt-2">{t('learn_linking_desc_p2')}</p>
                            <div className="flex items-center justify-center space-x-4 my-6 text-orange-700">
                                <UserIcon className="h-10 w-10"/>
                                <div className="border-t-2 border-dashed border-orange-400 flex-grow"></div>
                                <LibraryIcon className="h-10 w-10"/>
                            </div>
                            <p className="text-xs text-center text-orange-600 italic mb-4">{t('learn_linking_diagram_desc')}</p>
                            <div className="mt-auto p-3 rounded-md bg-orange-100 text-center space-y-1">
                                <p className="font-semibold text-sm text-orange-800">{t('learn_linking_diagram_kyc')}</p>
                                <div className="flex items-center justify-center text-red-700">
                                    <XCircleIcon className="w-5 h-5 mr-2" />
                                    <p className="font-bold text-sm">{t('learn_linking_diagram_dbt')}</p>
                                </div>
                            </div>
                        </div>

                        {/* Seeding Card */}
                        <div className="bg-green-50 border border-green-200 rounded-lg p-6 flex flex-col">
                            <h5 className="text-xl font-bold text-accent mb-3">{t('learn_seeding_title')}</h5>
                            <p className="text-sm text-green-800 flex-grow">{t('learn_seeding_desc')}</p>
                            <div className="flex items-center justify-center space-x-4 my-6 text-accent">
                                <UserIcon className="h-10 w-10"/>
                                <div className="border-t-2 border-dashed border-green-400 flex-grow"></div>
                                <LibraryIcon className="h-10 w-10"/>
                                <div className="border-t-2 border-dashed border-green-400 flex-grow"></div>
                                <ServerIcon className="h-10 w-10"/>
                            </div>
                             <p className="text-xs text-center text-green-600 italic mb-4">{t('learn_seeding_diagram_desc_p1')} <strong className="font-semibold">{t('learn_seeding_diagram_desc_p2')}</strong>{t('learn_seeding_diagram_desc_p3')}</p>
                             <div className="mt-auto p-3 rounded-md bg-green-100 text-center">
                                <div className="flex items-center justify-center text-green-800">
                                    <CheckCircleIcon className="w-5 h-5 mr-2" />
                                    <p className="font-bold text-sm">{t('learn_seeding_diagram_dbt')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Accordion>
                
                <Accordion title={t('learn_accordion3_title')}>
                    <p>{t('learn_accordion3_content')}</p>
                    <h5 className="font-semibold text-textPrimary mt-6 mb-4">{t('learn_flow_title')}</h5>
                    <div className="flex items-center justify-around flex-wrap gap-4 text-center my-6 p-4 bg-gray-50 rounded-lg">
                        <div className="flex flex-col items-center w-24">
                            <BuildingOffice2Icon className="h-12 w-12 text-primary" />
                            <p className="mt-2 text-sm font-semibold">{t('learn_flow_govt')}</p>
                        </div>
                        <ArrowRightIcon className="h-6 w-6 text-gray-400 hidden sm:block" />
                        <div className="flex flex-col items-center w-24">
                            <ServerIcon className="h-12 w-12 text-primary" />
                            <p className="mt-2 text-sm font-semibold">{t('learn_flow_npci')}</p>
                            <p className="text-xs text-textSecondary">{t('learn_flow_npci_desc')}</p>
                        </div>
                        <ArrowRightIcon className="h-6 w-6 text-gray-400 hidden sm:block" />
                        <div className="flex flex-col items-center w-24">
                            <LibraryIcon className="h-12 w-12 text-primary" />
                            <p className="mt-2 text-sm font-semibold">{t('learn_flow_bank')}</p>
                        </div>
                         <ArrowRightIcon className="h-6 w-6 text-gray-400 hidden sm:block" />
                        <div className="flex flex-col items-center w-24">
                            <UserIcon className="h-12 w-12 text-primary" />
                            <p className="mt-2 text-sm font-semibold">{t('learn_flow_student')}</p>
                        </div>
                    </div>
                </Accordion>
                
                <Accordion title={t('learn_accordion4_title')}>
                    <p>{t('learn_accordion4_content')}</p>
                </Accordion>

                 <div className="grid md:grid-cols-2 gap-6 pt-6">
                    <div onClick={() => setModalVideoId('_bYh81P7I0A')} className="relative group cursor-pointer aspect-video">
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-lg group-hover:bg-opacity-60 transition-all">
                            <PlayCircleIcon className="h-16 w-16 text-white opacity-80 group-hover:opacity-100 transform group-hover:scale-110 transition-transform" />
                        </div>
                        <div className="bg-gray-700 h-full w-full rounded-lg flex items-end p-4 bg-cover bg-center" style={{backgroundImage: "url('https://img.youtube.com/vi/_bYh81P7I0A/maxresdefault.jpg')"}}>
                            <div className="bg-black bg-opacity-60 text-white p-2 rounded w-full">
                                <h5 className="font-bold">{t('learn_video_seeding_title')}</h5>
                                <p className="text-sm">{t('learn_video_seeding_caption')}</p>
                            </div>
                        </div>
                    </div>
                    <div onClick={() => setModalVideoId('_Trt3Mv6Jk0')} className="relative group cursor-pointer aspect-video">
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-lg group-hover:bg-opacity-60 transition-all">
                            <PlayCircleIcon className="h-16 w-16 text-white opacity-80 group-hover:opacity-100 transform group-hover:scale-110 transition-transform" />
                        </div>
                        <div className="bg-gray-700 h-full w-full rounded-lg flex items-end p-4 bg-cover bg-center" style={{backgroundImage: "url('https://img.youtube.com/vi/_Trt3Mv6Jk0/maxresdefault.jpg')"}}>
                             <div className="bg-black bg-opacity-60 text-white p-2 rounded w-full">
                                <h5 className="font-bold">{t('learn_video_mapper_title')}</h5>
                                <p className="text-sm">{t('learn_video_mapper_caption')}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <Accordion title={t('quiz_accordion_title')}>
                    <Quiz />
                </Accordion>
            </div>
        </div>
    );
};

export default LearnPage;