import { StatusResult } from '../types';

// Mock service to simulate checking DBT status.
// In a real application, this would make an API call to a backend service.
export class DbtService {
  /**
   * Checks the DBT seeding status for a given Aadhaar number.
   * @param aadhaarNumber - The 12-digit Aadhaar number.
   * @returns A Promise that resolves with the status result.
   */
  public static async checkStatus(aadhaarNumber: string): Promise<StatusResult> {
    // Simulate network delay to mimic a real API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Basic validation for the Aadhaar number format
    if (aadhaarNumber.length !== 12 || !/^\d{12}$/.test(aadhaarNumber)) {
      throw new Error('Invalid Aadhaar number. Please enter a valid 12-digit number.');
    }

    const lastDigit = aadhaarNumber.slice(-1);

    // This mock service returns different data based on the last digit
    // of the Aadhaar number to allow for testing various UI states.
    switch (lastDigit) {
      case '1': // Scenario: Seeded & Approved
        return {
          aadhaarNumber,
          isSeeded: true,
          bankName: 'State Bank of India',
          lastUpdated: '2023-10-15',
          scholarshipStatus: 'Approved',
          scholarshipName: 'National Merit Scholarship',
        };
      case '2': // Scenario: Seeded & Pending
        return {
          aadhaarNumber,
          isSeeded: true,
          bankName: 'HDFC Bank',
          lastUpdated: '2024-01-20',
          scholarshipStatus: 'Pending',
          scholarshipName: 'Post-Matric Scholarship',
        };
      case '3': // Scenario: Seeded & Rejected
        return {
          aadhaarNumber,
          isSeeded: true,
          bankName: 'Punjab National Bank',
          lastUpdated: '2023-11-05',
          scholarshipStatus: 'Rejected',
          scholarshipName: 'Central Sector Scheme Scholarship',
        };
      case '4': // Scenario: Not Seeded
        return {
          aadhaarNumber,
          isSeeded: false,
          bankName: null,
          lastUpdated: null,
          scholarshipStatus: 'Not Applied', // If not seeded, they likely haven't applied or it failed.
          scholarshipName: null,
        };
       case '5': // Scenario: Seeded but Not Applied for scholarship
        return {
          aadhaarNumber,
          isSeeded: true,
          bankName: 'ICICI Bank',
          lastUpdated: '2023-09-01',
          scholarshipStatus: 'Not Applied',
          scholarshipName: null,
        };
      case '0': // Scenario: Simulate a server error
        throw new Error('Could not connect to the DBT server. Please try again later.');
      default: // A generic "found but pending" case for other numbers
        return {
          aadhaarNumber,
          isSeeded: true,
          bankName: 'Axis Bank',
          lastUpdated: '2024-02-01',
          scholarshipStatus: 'Pending',
          scholarshipName: 'State Merit Scholarship',
        };
    }
  }
}
