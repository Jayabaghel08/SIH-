import React, { useState, useCallback } from 'react';
import { StatusResult } from '../../types';
import { DbtService } from '../../services/dbtService';
import { CheckCircleIcon, XCircleIcon, ClockIcon } from '../icons';
import { useLanguage } from '../../contexts/LanguageContext';

type ScholarshipStatus = StatusResult['scholarshipStatus'];

const ScholarshipProgressTracker = ({ status }: { status: ScholarshipStatus }) => {
    const steps = ['Application Submitted', 'Department Review', 'Approved & Disbursed'];

    const getStepStatus = (stepIndex: number): 'completed' | 'current' | 'upcoming' | 'rejected' => {
        if (status === 'Approved') return 'completed';
        if (status === 'Rejected') {
            if (stepIndex === 0) return 'completed';
            if (stepIndex === 1) return 'rejected';
            return 'upcoming';
        }
        if (status === 'Pending') {
            if (stepIndex === 0) return 'completed';
            if (stepIndex === 1) return 'current';
            return 'upcoming';
        }
        // Not Applied
        return 'upcoming';
    };

    return (
        <div>
            <h4 className="font-semibold text-textPrimary mb-3">Scholarship Progress Tracker</h4>
            <div className="flex items-center">
                {steps.map((step, index) => {
                    const stepStatus = getStepStatus(index);
                    const isLastStep = index === steps.length - 1;

                    let icon;
                    let iconColor = 'text-gray-400';
                    let textColor = 'text-textSecondary';
                    
                    if (stepStatus === 'completed') {
                        icon = <CheckCircleIcon className="w-8 h-8" />;
                        iconColor = 'text-accent';
                        textColor = 'text-accent font-semibold';
                    } else if (stepStatus === 'current') {
                        icon = <ClockIcon className="w-8 h-8 animate-pulse" />;
                        iconColor = 'text-primary';
                        textColor = 'text-primary font-semibold';
                    } else if (stepStatus === 'rejected') {
                        icon = <XCircleIcon className="w-8 h-8" />;
                        iconColor = 'text-red-500';
                        textColor = 'text-red-500 font-semibold';
                    } else { // upcoming
                        icon = <div className="w-8 h-8 flex items-center justify-center"><div className="w-3 h-3 bg-gray-300 rounded-full"></div></div>;
                    }

                    return (
                        <React.Fragment key={step}>
                            <div className="flex flex-col items-center text-center">
                                <div className={`mb-1 ${iconColor}`}>{icon}</div>
                                <p className={`text-xs ${textColor}`}>{step}</p>
                            </div>
                            {!isLastStep && <div className="flex-auto border-t-2 border-gray-300 mx-2"></div>}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
}

const StatusResultCard = ({ result }: { result: StatusResult }) => {
    const isSeeded = result.isSeeded;
    const headerBg = isSeeded ? 'bg-green-100' : 'bg-red-100';
    const headerText = isSeeded ? 'text-accent' : 'text-red-600';
    const HeaderIcon = isSeeded ? CheckCircleIcon : XCircleIcon;

    const getAlertMessage = () => {
        if (!result.isSeeded) {
            return (
                <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-800">
                    <h4 className="font-bold">Action Required!</h4>
                    <p>Your account is not DBT-ready. Please visit your bank branch immediately and submit the 'Aadhaar Seeding Consent Form' to receive your benefits.</p>
                </div>
            );
        }
        if (result.isSeeded && result.scholarshipStatus === 'Pending') {
             return (
                <div className="mt-6 p-4 bg-blue-50 border-l-4 border-primary-light text-primary-dark">
                    <h4 className="font-bold">Patience is Key!</h4>
                    <p>Your account is DBT-ready. Your scholarship application is currently being processed by the department.</p>
                </div>
            );
        }
        if (result.isSeeded && result.scholarshipStatus === 'Approved') {
            return (
                <div className="mt-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-800">
                    <h4 className="font-bold">Good News!</h4>
                    <p>Your scholarship has been approved. The funds will be credited to your seeded account shortly.</p>
                </div>
            );
        }
         if (result.isSeeded && result.scholarshipStatus === 'Rejected') {
            return (
                <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-800">
                    <h4 className="font-bold">Important Update!</h4>
                    <p>While your account is DBT-ready, your scholarship application was rejected. Please check the scholarship portal for specific reasons.</p>
                </div>
            );
        }
        return null;
    }


    return (
        <div className="mt-8 bg-surface rounded-lg shadow-lg animate-fade-in overflow-hidden border border-gray-200">
            <div className={`p-6 flex flex-col sm:flex-row items-center justify-center text-center ${headerBg} ${headerText}`}>
                <HeaderIcon className="h-12 w-12 sm:mr-4 mb-2 sm:mb-0" />
                <div>
                    <p className="font-semibold">Aadhaar Seeding (DBT-Ready)</p>
                    <p className={`text-2xl sm:text-3xl font-bold`}>{isSeeded ? 'ACTIVE' : 'INACTIVE'}</p>
                </div>
            </div>
            
            <div className="p-6 space-y-6">
                <div>
                     <h4 className="font-semibold text-textPrimary mb-1">Aadhaar Details</h4>
                     <p className="text-textSecondary">Status for Aadhaar ending in: <span className="font-mono">{result.aadhaarNumber.slice(-4)}</span></p>
                </div>

                {isSeeded && result.bankName && (
                     <div>
                         <h4 className="font-semibold text-textPrimary mb-1">Seeded Bank Account</h4>
                         <p className="text-textSecondary">{result.bankName}</p>
                         <p className="text-xs text-gray-400">Last Updated: {result.lastUpdated}</p>
                     </div>
                )}
                
                <div className="border-t border-gray-200 pt-6">
                    <ScholarshipProgressTracker status={result.scholarshipStatus} />
                </div>

                {getAlertMessage()}
            </div>
        </div>
    )
}


const StatusPage = () => {
    const { t } = useLanguage();
    const [aadhaar, setAadhaar] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<StatusResult | null>(null);

    const handleCheckStatus = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResult(null);
        try {
            const data = await DbtService.checkStatus(aadhaar);
            setResult(data);
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    }, [aadhaar]);

    return (
        <div className="animate-fade-in">
            <h1 className="text-2xl sm:text-3xl font-bold text-textPrimary mb-6">{t('status_page_title')}</h1>
            <p className="text-base sm:text-lg text-textSecondary mb-8">
                Enter your 12-digit Aadhaar number to check your DBT-readiness and scholarship status in one place.
            </p>
            <div className="bg-surface p-8 rounded-lg shadow-md">
                <form onSubmit={handleCheckStatus}>
                    <label htmlFor="aadhaar" className="block text-sm font-medium text-textSecondary mb-2">Aadhaar Number</label>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <input
                            type="text"
                            id="aadhaar"
                            value={aadhaar}
                            onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, ''))}
                            maxLength={12}
                            placeholder="Enter 12-digit number"
                            className="flex-grow w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                            disabled={loading}
                        />
                        <button
                            type="submit"
                            className="w-full sm:w-auto bg-primary text-white font-semibold py-2 px-6 rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                            disabled={loading || aadhaar.length !== 12}
                        >
                            {loading ? 'Checking...' : 'Check Status'}
                        </button>
                    </div>
                </form>

                {error && <p className="mt-4 text-center text-red-600">{error}</p>}

                {loading && (
                    <div className="mt-8 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                        <p className="mt-4 text-textSecondary">Verifying details securely...</p>
                    </div>
                )}
                
                {result && <StatusResultCard result={result} />}
            </div>
        </div>
    );
};

export default StatusPage;