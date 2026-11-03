// lib/constants.js
// Global constants and initial data structures for Green Rewards
// Demonstrates: Centralized configuration and single-source-of-truth principles

// Predefined waste categories specified in the prompt
export const INITIAL_CATEGORIES = [
  {
    id: "wet",
    name: "Wet Waste",
    rewardCoins: 10,
    description: "Kitchen waste, vegetables, food scraps, compostable matter",
    examples: "Vegetable peels, fruit rinds, leftover food, tea leaves, garden clippings",
    icon: "🥗",
  },
  {
    id: "dry",
    name: "Dry Waste",
    rewardCoins: 10,
    description: "Paper, clean plastics, cardboard, packaging materials",
    examples: "Cardboard, newspaper, rinsed milk packets, beverage cans, glass bottles",
    icon: "📦",
  },
  {
    id: "ewaste",
    name: "E-Waste",
    rewardCoins: 20,
    description: "Batteries, old cables, circuit boards, obsolete electronics",
    examples: "AA/AAA batteries, chargers, old mobile phones, broken headphones",
    icon: "🔋",
  },
  {
    id: "other",
    name: "Other Waste",
    rewardCoins: 5,
    description: "Inert debris, mixed non-recyclables, ceramic, clothing",
    examples: "Floor sweepings, broken ceramic plates, worn rags, inert dust",
    icon: "🧹",
  },
];

// User roles supported in the system
export const USER_ROLES = {
  CITIZEN: "CITIZEN",
  ADMIN: "ADMIN",
  BUSINESS: "BUSINESS",
};

// Contribution verification statuses
export const SUBMISSION_STATUS = {
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
};

// Redemption request statuses
export const REDEMPTION_STATUS = {
  REQUESTED: "Requested",
  ACCEPTED: "Accepted",
  REJECTED: "Rejected",
};

// Transaction ledger types
export const TRANSACTION_TYPES = {
  CREDIT_REWARD: "CREDIT_REWARD",
  DEBIT_REDEMPTION: "DEBIT_REDEMPTION",
  REFUND_REJECTED: "REFUND_REJECTED",
};
