/**
 * Security & Anti-Spam Utility for Form Submissions
 *
 * Implements honeypot validation, submission speed checks, email pattern validation,
 * and rate-limiting to prevent automated spam and bot abuse.
 */

const RATE_LIMIT_KEY = "tia_last_form_submit";
const MIN_SUBMISSION_INTERVAL_MS = 10000; // 10 seconds between submissions

export interface FormSecurityCheckParams {
  honeypotValue?: string;
  formLoadTime?: number;
  email: string;
}

export interface FormSecurityCheckResult {
  isValid: boolean;
  error?: string;
  isBot?: boolean;
}

export const validateFormSecurity = ({
  honeypotValue = "",
  formLoadTime,
  email,
}: FormSecurityCheckParams): FormSecurityCheckResult => {
  // 1. Honeypot check: Bots auto-fill hidden input fields
  if (honeypotValue.trim().length > 0) {
    // Silently trap bot without throwing visible error
    return { isValid: false, isBot: true };
  }

  // 2. Form submission speed check: Forms submitted faster than 800ms are almost certainly automated
  if (formLoadTime && Date.now() - formLoadTime < 800) {
    return { isValid: false, error: "Submission too fast. Please try again." };
  }

  // 3. Strict Email Validation
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email.trim())) {
    return { isValid: false, error: "Please enter a valid email address." };
  }

  // 4. Rate Limiting Check
  const lastSubmit = sessionStorage.getItem(RATE_LIMIT_KEY);
  if (lastSubmit) {
    const elapsed = Date.now() - parseInt(lastSubmit, 10);
    if (elapsed < MIN_SUBMISSION_INTERVAL_MS) {
      const waitSeconds = Math.ceil((MIN_SUBMISSION_INTERVAL_MS - elapsed) / 1000);
      return {
        isValid: false,
        error: `Please wait ${waitSeconds} second(s) before submitting again.`,
      };
    }
  }

  return { isValid: true };
};

export const recordFormSubmission = () => {
  sessionStorage.setItem(RATE_LIMIT_KEY, Date.now().toString());
};
