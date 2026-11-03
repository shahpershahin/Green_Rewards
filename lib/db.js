// lib/db.js
// Persistent Relational Database Module
// Demonstrates: CRUD operations, Relational Data Integrity, and Atomic File Persistence

import fs from "fs";
import path from "path";
import { hashPassword } from "./auth";
import { INITIAL_CATEGORIES, SUBMISSION_STATUS, REDEMPTION_STATUS, TRANSACTION_TYPES } from "./constants";

const DB_FILE_PATH = path.join(process.cwd(), "data", "db.json");

// Default seed data populated if database file does not exist
function getInitialSeedData() {
  const adminId = "user_admin_1";
  const citizenId = "user_citizen_1";
  const businessUserId = "user_biz_1";
  const bizId = "biz_prakriti_1";

  return {
    users: [
      {
        id: adminId,
        name: "Municipal Admin",
        email: "admin@greenrewards.org",
        password: hashPassword("admin123"),
        role: "ADMIN",
        createdAt: new Date().toISOString(),
      },
      {
        id: citizenId,
        name: "Aarav Sharma",
        email: "citizen@example.com",
        password: hashPassword("citizen123"),
        role: "CITIZEN",
        createdAt: new Date().toISOString(),
      },
      {
        id: businessUserId,
        name: "Prakriti Mart Owner",
        email: "mart@prakriti.com",
        password: hashPassword("business123"),
        role: "BUSINESS",
        createdAt: new Date().toISOString(),
      },
    ],
    categories: INITIAL_CATEGORIES.map((c) => ({
      id: c.id,
      name: c.name,
      description: c.description,
      rewardCoins: c.rewardCoins,
    })),
    wallets: [
      {
        id: "wallet_citizen_1",
        citizenId: citizenId,
        balance: 30, // 10 (wet) + 20 (ewaste) = 30
      },
    ],
    businesses: [
      {
        id: bizId,
        userId: businessUserId,
        businessName: "Prakriti Organic Mart",
        address: "Shop 14, MG Road Market, Ward 12",
        description: "Direct-from-farm organic groceries and produce",
      },
    ],
    offers: [
      {
        id: "offer_1",
        businessId: bizId,
        title: "Eco-Shopper Voucher",
        description: "Get ₹10 OFF on any purchase above ₹100",
        requiredCoins: 50,
        discountAmount: "₹10 OFF",
        isActive: true,
      },
      {
        id: "offer_2",
        businessId: bizId,
        title: "Organic Veggie Basket Discount",
        description: "Get ₹25 OFF on our farm-fresh weekly basket",
        requiredCoins: 100,
        discountAmount: "₹25 OFF",
        isActive: true,
      },
    ],
    contributions: [
      {
        id: "contrib_seed_1",
        citizenId: citizenId,
        categoryId: "wet",
        imagePath: "/uploads/sample_wet_waste.jpg",
        quantity: "2 kg",
        description: "Kitchen vegetable peels and leftover food in compostable bin",
        verificationStatus: SUBMISSION_STATUS.APPROVED,
        rejectionReason: null,
        rewardCoins: 10,
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
      {
        id: "contrib_seed_2",
        citizenId: citizenId,
        categoryId: "ewaste",
        imagePath: "/uploads/sample_ewaste.jpg",
        quantity: "4 units",
        description: "Used AA batteries and old micro-USB charging cables",
        verificationStatus: SUBMISSION_STATUS.APPROVED,
        rejectionReason: null,
        rewardCoins: 20,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: "contrib_seed_3",
        citizenId: citizenId,
        categoryId: "dry",
        imagePath: "/uploads/sample_dry_waste.jpg",
        quantity: "1.5 kg",
        description: "Flattened cardboard boxes and cleaned plastic packaging",
        verificationStatus: SUBMISSION_STATUS.PENDING,
        rejectionReason: null,
        rewardCoins: 10,
        createdAt: new Date().toISOString(),
      },
    ],
    transactions: [
      {
        id: "txn_1",
        citizenId: citizenId,
        type: TRANSACTION_TYPES.CREDIT_REWARD,
        amount: 10,
        contributionId: "contrib_seed_1",
        redemptionId: null,
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
      {
        id: "txn_2",
        citizenId: citizenId,
        type: TRANSACTION_TYPES.CREDIT_REWARD,
        amount: 20,
        contributionId: "contrib_seed_2",
        redemptionId: null,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
    ],
    redemptions: [],
  };
}

// Read database from disk
export async function readDB() {
  try {
    const dataDir = path.dirname(DB_FILE_PATH);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    if (!fs.existsSync(DB_FILE_PATH)) {
      const initialData = getInitialSeedData();
      await writeDB(initialData);
      return initialData;
    }

    const fileContent = await fs.promises.readFile(DB_FILE_PATH, "utf-8");
    return JSON.parse(fileContent);
  } catch (error) {
    console.error("Database read error:", error);
    return getInitialSeedData();
  }
}

// Write database to disk
export async function writeDB(data) {
  try {
    const dataDir = path.dirname(DB_FILE_PATH);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    await fs.promises.writeFile(DB_FILE_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Database write error:", error);
    throw error;
  }
}

// -------------------------------------------------------------
// CRUD Operations
// -------------------------------------------------------------

// USERS
export async function findUserByEmail(email) {
  const db = await readDB();
  return db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export async function findUserById(id) {
  const db = await readDB();
  return db.users.find((u) => u.id === id);
}

export async function createUser({ name, email, password, role }) {
  const db = await readDB();
  const newUser = {
    id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name,
    email: email.toLowerCase(),
    password: hashPassword(password),
    role,
    createdAt: new Date().toISOString(),
  };
  db.users.push(newUser);

  // If new user is a citizen, automatically initialize their wallet with 0 coins
  if (role === "CITIZEN") {
    db.wallets.push({
      id: `wallet_${Date.now()}`,
      citizenId: newUser.id,
      balance: 0,
    });
  }

  await writeDB(db);
  return newUser;
}

// CATEGORIES
export async function getCategories() {
  const db = await readDB();
  return db.categories;
}

export async function updateCategoryReward(categoryId, newReward) {
  const db = await readDB();
  const category = db.categories.find((c) => c.id === categoryId);
  if (!category) throw new Error("Category not found");
  category.rewardCoins = Number(newReward);
  await writeDB(db);
  return category;
}

// CONTRIBUTIONS
export async function getContributions(filter = {}) {
  const db = await readDB();
  let results = [...db.contributions];
  if (filter.citizenId) {
    results = results.filter((c) => c.citizenId === filter.citizenId);
  }
  if (filter.status) {
    results = results.filter((c) => c.verificationStatus === filter.status);
  }
  return results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export async function createContribution({ citizenId, categoryId, imagePath, quantity, description }) {
  const db = await readDB();
  const category = db.categories.find((c) => c.id === categoryId);
  const rewardCoins = category ? category.rewardCoins : 10;

  const newContribution = {
    id: `contrib_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    citizenId,
    categoryId,
    imagePath,
    quantity,
    description: description || "",
    verificationStatus: SUBMISSION_STATUS.PENDING,
    rejectionReason: null,
    rewardCoins,
    createdAt: new Date().toISOString(),
  };

  db.contributions.push(newContribution);
  await writeDB(db);
  return newContribution;
}

// APPROVE CONTRIBUTION & REWARD COINS (Strictly prevents duplicate rewards)
export async function approveContribution(contributionId) {
  const db = await readDB();
  const contribution = db.contributions.find((c) => c.id === contributionId);

  if (!contribution) throw new Error("Contribution not found");
  if (contribution.verificationStatus === SUBMISSION_STATUS.APPROVED) {
    throw new Error("Contribution is already approved");
  }

  // 1. Update submission status
  contribution.verificationStatus = SUBMISSION_STATUS.APPROVED;
  contribution.rejectionReason = null;

  // 2. Locate or create citizen wallet
  let wallet = db.wallets.find((w) => w.citizenId === contribution.citizenId);
  if (!wallet) {
    wallet = { id: `wallet_${Date.now()}`, citizenId: contribution.citizenId, balance: 0 };
    db.wallets.push(wallet);
  }

  // 3. Credit reward coins to wallet
  wallet.balance += contribution.rewardCoins;

  // 4. Create immutable transaction record
  const newTxn = {
    id: `txn_${Date.now()}`,
    citizenId: contribution.citizenId,
    type: TRANSACTION_TYPES.CREDIT_REWARD,
    amount: contribution.rewardCoins,
    contributionId: contribution.id,
    redemptionId: null,
    createdAt: new Date().toISOString(),
  };
  db.transactions.push(newTxn);

  await writeDB(db);
  return { contribution, wallet, transaction: newTxn };
}

// REJECT CONTRIBUTION
export async function rejectContribution(contributionId, reason) {
  const db = await readDB();
  const contribution = db.contributions.find((c) => c.id === contributionId);

  if (!contribution) throw new Error("Contribution not found");
  if (contribution.verificationStatus === SUBMISSION_STATUS.APPROVED) {
    throw new Error("Cannot reject an already approved contribution");
  }

  contribution.verificationStatus = SUBMISSION_STATUS.REJECTED;
  contribution.rejectionReason = reason || "Incomplete or inaccurate waste segregation.";

  await writeDB(db);
  return contribution;
}

// WALLET & TRANSACTIONS
export async function getWallet(citizenId) {
  const db = await readDB();
  let wallet = db.wallets.find((w) => w.citizenId === citizenId);
  if (!wallet) {
    wallet = { id: `wallet_${Date.now()}`, citizenId, balance: 0 };
    db.wallets.push(wallet);
    await writeDB(db);
  }
  return wallet;
}

export async function getTransactions(citizenId) {
  const db = await readDB();
  return db.transactions
    .filter((t) => t.citizenId === citizenId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

// BUSINESSES & OFFERS
export async function getBusinesses() {
  const db = await readDB();
  return db.businesses;
}

export async function getBusinessByUserId(userId) {
  const db = await readDB();
  return db.businesses.find((b) => b.userId === userId);
}

export async function createBusiness({ userId, businessName, address, description }) {
  const db = await readDB();
  const newBiz = {
    id: `biz_${Date.now()}`,
    userId,
    businessName,
    address,
    description,
  };
  db.businesses.push(newBiz);
  await writeDB(db);
  return newBiz;
}

export async function getOffers(filter = {}) {
  const db = await readDB();
  let results = [...db.offers];
  if (filter.businessId) {
    results = results.filter((o) => o.businessId === filter.businessId);
  }
  if (filter.isActive !== undefined) {
    results = results.filter((o) => o.isActive === filter.isActive);
  }
  return results;
}

export async function createOffer({ businessId, title, description, requiredCoins, discountAmount }) {
  const db = await readDB();
  const newOffer = {
    id: `offer_${Date.now()}`,
    businessId,
    title,
    description,
    requiredCoins: Number(requiredCoins),
    discountAmount,
    isActive: true,
  };
  db.offers.push(newOffer);
  await writeDB(db);
  return newOffer;
}

// REDEMPTION WORKFLOW (Prevents negative balance & duplicate deduction)
export async function createRedemption(citizenId, offerId) {
  const db = await readDB();
  const offer = db.offers.find((o) => o.id === offerId);
  if (!offer || !offer.isActive) throw new Error("Offer not available");

  const wallet = db.wallets.find((w) => w.citizenId === citizenId);
  if (!wallet || wallet.balance < offer.requiredCoins) {
    throw new Error("Insufficient Green Coin balance");
  }

  // Deduct coins exactly once
  wallet.balance -= offer.requiredCoins;

  const newRedemption = {
    id: `rdm_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    citizenId,
    businessId: offer.businessId,
    offerId: offer.id,
    offerTitle: offer.title,
    discountAmount: offer.discountAmount,
    coinsUsed: offer.requiredCoins,
    status: REDEMPTION_STATUS.REQUESTED,
    createdAt: new Date().toISOString(),
  };
  db.redemptions.push(newRedemption);

  // Record debit transaction
  const newTxn = {
    id: `txn_${Date.now()}`,
    citizenId,
    type: TRANSACTION_TYPES.DEBIT_REDEMPTION,
    amount: -offer.requiredCoins,
    contributionId: null,
    redemptionId: newRedemption.id,
    createdAt: new Date().toISOString(),
  };
  db.transactions.push(newTxn);

  await writeDB(db);
  return { redemption: newRedemption, newBalance: wallet.balance };
}

export async function getRedemptions(filter = {}) {
  const db = await readDB();
  let results = [...db.redemptions];
  if (filter.citizenId) {
    results = results.filter((r) => r.citizenId === filter.citizenId);
  }
  if (filter.businessId) {
    results = results.filter((r) => r.businessId === filter.businessId);
  }
  return results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export async function updateRedemptionStatus(redemptionId, newStatus) {
  const db = await readDB();
  const redemption = db.redemptions.find((r) => r.id === redemptionId);
  if (!redemption) throw new Error("Redemption not found");

  redemption.status = newStatus;

  // If rejected by business, refund the coins back to citizen!
  if (newStatus === REDEMPTION_STATUS.REJECTED) {
    const wallet = db.wallets.find((w) => w.citizenId === redemption.citizenId);
    if (wallet) {
      wallet.balance += redemption.coinsUsed;
      db.transactions.push({
        id: `txn_${Date.now()}`,
        citizenId: redemption.citizenId,
        type: TRANSACTION_TYPES.REFUND_REJECTED,
        amount: redemption.coinsUsed,
        contributionId: null,
        redemptionId: redemption.id,
        createdAt: new Date().toISOString(),
      });
    }
  }

  await writeDB(db);
  return redemption;
}

// SYSTEM-WIDE AUDIT & ADMIN STATS
export async function getAdminStats() {
  const db = await readDB();
  const citizens = db.users.filter((u) => u.role === "CITIZEN");
  const businesses = db.businesses;
  const submissions = db.contributions;
  const approved = submissions.filter((s) => s.verificationStatus === SUBMISSION_STATUS.APPROVED);
  const pending = submissions.filter((s) => s.verificationStatus === SUBMISSION_STATUS.PENDING);
  const totalCoinsIssued = approved.reduce((acc, curr) => acc + (curr.rewardCoins || 0), 0);

  return {
    totalCitizens: citizens.length,
    totalBusinesses: businesses.length,
    totalSubmissions: submissions.length,
    approvedSubmissions: approved.length,
    pendingSubmissions: pending.length,
    totalCoinsIssued,
  };
}
