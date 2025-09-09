import React, { useState, useCallback } from 'react';
import { Grievance, GrievanceTicket } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { SparklesIcon } from '../icons';

const GrievanceSuccess = ({ ticket }: { ticket: GrievanceTicket }) => (
    <div className="text-center p-8 bg-green-50 rounded-lg border border-green-200 animate-fade-in">
        <h2 className="text-2xl font-bold text-accent mb-4">Grievance Submitted Successfully!</h2>
        <p className="text-textSecondary mb-6">Your issue has been logged. Please use the details below for future reference.</p>
        <div className="bg-surface p-4 rounded-md shadow-sm text-left inline-block">
            <p><strong className="text-textPrimary">Tracking ID:</strong> <span className="font-mono text-primary">{ticket.ticketId}</span></p>
            <p><strong className="text-textPrimary">Issue Type:</strong> {ticket.type}</p>
            <p><strong className="text-textPrimary">Submitted On:</strong> {ticket.submittedAt}</p>
        </div>
        <div className="mt-8 text-left p-4 bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800">
            <h4 className="font-bold">What Happens Next?</h4>
            <p className="mt-2"><strong>Step 1:</strong> Please contact your bank branch within 48 hours with your Tracking ID. They are responsible for resolving seeding issues.</p>
            <p className="mt-1"><strong>Step 2:</strong> If the bank does not resolve the issue within 7 working days, you can escalate the matter to NPCI through their official portal, referencing this Tracking ID.</p>
        </div>
    </div>
)

const GrievancePage = () => {
    const { t } = useLanguage();
    const [grievance, setGrievance] = useState<Grievance>({
        type: 'Not Seeded',
        description: '',
        aadhaar: '',
    });
    const [submittedTicket, setSubmittedTicket] = useState<GrievanceTicket | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setGrievance(prev => ({ ...prev, [name]: value }));
    }, []);

    const handleSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        const ticketId = `DBT-${Date.now()}`;
        const newTicket: GrievanceTicket = {
            ...grievance,
            ticketId,
            status: 'Submitted',
            submittedAt: new Date().toLocaleString(),
        };
        setSubmittedTicket(newTicket);
    }, [grievance]);

     const handleGenerateDescription = async () => {
        setIsGenerating(true);
        setError(null);
        try {
            const { GoogleGenAI } = await import('@google/genai');
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const prompt = `You are a helpful assistant for students in India filing a grievance about Direct Benefit Transfer (DBT) payments.
            The student has selected the issue type: "${grievance.type}".
            Based on this, write a clear, concise, and formal description for their grievance report in English.
            Start by stating the problem clearly. If the user has already typed a description, use it as context to improve upon it.
            Context from user: "${grievance.description}"
            
            Generate only the description text. Do not include any titles or introductory phrases like "Here is the description:".`;
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });

            const text = response.text.trim();
            if (text) {
                 setGrievance(prev => ({ ...prev, description: text }));
            }
        } catch (error) {
            console.error("AI generation failed:", error);
            setError("Sorry, the AI Assistant couldn't generate a description. Please write it manually.");
        } finally {
            setIsGenerating(false);
        }
    };

    if (submittedTicket) {
        return <GrievanceSuccess ticket={submittedTicket} />;
    }

    return (
        <div className="animate-fade-in">
            <h1 className="text-2xl sm:text-3xl font-bold text-textPrimary mb-6">{t('grievance_page_title')}</h1>
            <p className="text-base sm:text-lg text-textSecondary mb-8">
                If your payment has failed even after following the steps, please log your issue here. We will guide you on the next steps.
            </p>
            <div className="bg-surface p-8 rounded-lg shadow-md">
                <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="type" className="block text-sm font-medium text-textSecondary mb-2">Issue Type</label>
                            <select
                                id="type"
                                name="type"
                                value={grievance.type}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                            >
                                <option>Not Seeded</option>
                                <option>Multiple Accounts</option>
                                <option>Details Mismatch</option>
                                <option>Other</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="aadhaar" className="block text-sm font-medium text-textSecondary mb-2">Your Aadhaar Number</label>
                            <input
                                type="text"
                                id="aadhaar"
                                name="aadhaar"
                                value={grievance.aadhaar}
                                onChange={(e) => setGrievance(prev => ({ ...prev, aadhaar: e.target.value.replace(/\D/g, '') }))}
                                maxLength={12}
                                placeholder="Enter 12-digit number"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                                required
                            />
                        </div>
                        <div>
                             <div className="flex justify-between items-center mb-2">
                                <label htmlFor="description" className="block text-sm font-medium text-textSecondary">Describe Your Issue</label>
                                <button type="button" onClick={handleGenerateDescription} disabled={isGenerating} className="flex items-center text-sm text-primary font-semibold hover:text-primary-dark disabled:text-gray-400 disabled:cursor-wait transition-colors">
                                    {isGenerating ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            <SparklesIcon className="w-4 h-4 mr-1" />
                                            AI Assistant
                                        </>
                                    )}
                                </button>
                            </div>
                            <textarea
                                id="description"
                                name="description"
                                value={grievance.description}
                                onChange={handleChange}
                                rows={4}
                                placeholder="Briefly explain the problem you are facing, or use the AI Assistant to generate a description."
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                                required
                            ></textarea>
                            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
                        </div>
                        <div>
                             <button
                                type="submit"
                                className="w-full bg-primary text-white font-semibold py-3 px-6 rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-gray-400 transition-colors"
                                disabled={grievance.aadhaar.length !== 12 || grievance.description.length < 10}
                            >
                                Submit Grievance
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default GrievancePage;