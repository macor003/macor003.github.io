/**
 * UTILITY FUNCTIONS MODULE
 *
 * Reusable helper functions for the entire application
 *
 * Dependencies: None
 */

/**
 * Sanitizes user input to prevent XSS attacks
 * @param {string} input - The input string to sanitize
 * @returns {string} - Sanitized string
 */
export function sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML.trim();
}
