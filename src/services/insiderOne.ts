/**
 * Insider One API Service
 * Handles user data upsertion for email collection and lead tracking
 */

const INSIDER_CONFIG = {
  endpoint: 'https://unification.useinsider.com/api/user/v1/upsert',
  partnerName: 'anvayaprod',
  token: 'INS.+j2EwqyxX-BYouAL4urb.GUaD5vecE5QPf6IrOqWqw5hSf7pJikC2wvHxLjijwZjCmwCDg8',
};

interface InsiderEvent {
  event_name: string;
  timestamp: string;
  event_params?: Record<string, unknown>;
}

interface InsiderUser {
  identifiers: {
    email: string;
  };
  attributes?: {
    email_optin: boolean;
    gdpr_optin: boolean;
    custom?: {
      lead_source: string;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };
  events?: InsiderEvent[];
}

interface InsiderRequest {
  skip_hook?: boolean;
  users: InsiderUser[];
}

interface InsiderResponse {
  data: {
    successful: Record<string, unknown>;
    fail: {
      count: number;
      errors?: Record<string, string[]>;
    };
  };
}

/**
 * Submit email to Insider One with lead source tracking
 * @param email - User's email address
 * @returns Promise with success status and message
 */
export async function submitEmailToInsider(email: string): Promise<{ success: boolean; message: string }> {
  try {
    const payload: InsiderRequest = {
      skip_hook: false,
      users: [
        {
          identifiers: {
            email: email.toLowerCase().trim(),
          },
          attributes: {
            email_optin: true,
            gdpr_optin: true,
            custom: {
              lead_source: 'anvaya-app',
            },
          },
          events: [
            {
              event_name: 'newsletter_subscribed',
              timestamp: new Date().toISOString(),
            },
          ],
        },
      ],
    };

    const response = await fetch(INSIDER_CONFIG.endpoint, {
      method: 'POST',
      headers: {
        'X-PARTNER-NAME': INSIDER_CONFIG.partnerName,
        'X-REQUEST-TOKEN': INSIDER_CONFIG.token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: InsiderResponse = await response.json();

    // Check if there were any failures
    if (data.data.fail && data.data.fail.count > 0) {
      console.error('Insider API errors:', data.data.fail.errors);
      return {
        success: false,
        message: 'Failed to subscribe. Please try again.',
      };
    }

    return {
      success: true,
      message: 'Thank you for subscribing! Check your email for confirmation.',
    };
  } catch (error) {
    console.error('Error submitting to Insider One:', error);
    return {
      success: false,
      message: 'Network error. Please check your connection and try again.',
    };
  }
}

/**
 * Validate email format
 * @param email - Email address to validate
 * @returns boolean indicating if email is valid
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
