/**
 * @typedef {object} TrackPayload
 * @property {string} visitorId
 * @property {string} sessionId  One per page load; DB unique → duplicate POSTs return success+duplicate
 * @property {boolean} isUnique
 * @property {string} timestamp
 * @property {number} timeSpent
 * @property {boolean} formFilled
 * @property {{ country: string | null; city: string | null }} location
 * @property {string | null} ip
 * @property {string} pageUrl
 */

export {};
