// app/page.js
// Public Homepage for Green Rewards
// Demonstrates:
// 1. Functional Components and JSX
// 2. Reusable UI Components (Button, Badge, Card)
// 3. Declarative Array Mapping (.map) for clean, maintainable code
// 4. Responsive Tailwind CSS Layouts (Grid, Flexbox, Containers)

import Link from "next/link";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";

export default function HomePage() {
  // 1. Core Waste Categories defined in project specification
  const wasteCategories = [
    {
      id: "wet",
      name: "Wet Waste",
      reward: 10,
      icon: "🥗",
      badgeColor: "success",
      description: "Biodegradable organic household waste generated in kitchens and gardens.",
      examples: ["Vegetable & fruit peels", "Leftover food scraps", "Coffee grounds & tea leaves", "Garden leaves"],
      containerColor: "border-emerald-200 bg-emerald-50/50",
    },
    {
      id: "dry",
      name: "Dry Waste",
      reward: 10,
      icon: "📦",
      badgeColor: "info",
      description: "Clean, non-biodegradable recyclable materials kept free from food contamination.",
      examples: ["Cardboard & newspaper", "Clean plastic containers", "Metal cans & foils", "Glass bottles"],
      containerColor: "border-blue-200 bg-blue-50/50",
    },
    {
      id: "ewaste",
      name: "E-Waste",
      reward: 20,
      icon: "🔋",
      badgeColor: "warning",
      description: "Discarded electrical or electronic equipment requiring specialized processing.",
      examples: ["Used household batteries", "Damaged chargers & cables", "Broken headphones & phones", "Old circuit boards"],
      containerColor: "border-purple-200 bg-purple-50/50",
    },
    {
      id: "other",
      name: "Other Waste",
      reward: 5,
      icon: "🧹",
      badgeColor: "warning",
      description: "Inert household refuse, sanitary items, or mixed non-recyclable materials.",
      examples: ["Swept floor dust", "Ceramics & broken pottery", "Old rags & textiles", "Inert debris"],
      containerColor: "border-amber-200 bg-amber-50/50",
    },
  ];

  // 2. Step-by-step workflow items
  const workflowSteps = [
    {
      step: "01",
      title: "Segregate Waste",
      desc: "Separate your household waste into Wet, Dry, E-Waste, or Other at source.",
      icon: "♻️",
    },
    {
      step: "02",
      title: "Upload & Submit",
      desc: "Take a clear photograph, select the waste category and estimated quantity, and submit.",
      icon: "📸",
    },
    {
      step: "03",
      title: "Admin Verification",
      desc: "Administrators review the submitted waste image for accuracy and authenticity.",
      icon: "✅",
    },
    {
      step: "04",
      title: "Earn & Redeem",
      desc: "Approved submissions credit Green Coins into your digital wallet to redeem at local stores.",
      icon: "🪙",
    },
  ];

  // 3. Illustrative Participating Partner Businesses
  const partnerBusinesses = [
    {
      name: "Prakriti Organic Mart",
      category: "Groceries & Produce",
      address: "MG Road, Ward 12",
      offer: "50 Green Coins = ₹10 Discount",
      discount: "₹10 OFF",
      requiredCoins: 50,
      tag: "Popular",
    },
    {
      name: "Green Cafe & Bakery",
      category: "Food & Beverages",
      address: "Civil Lines, Near City Park",
      offer: "100 Green Coins = ₹25 Discount",
      discount: "₹25 OFF",
      requiredCoins: 100,
      tag: "Best Value",
    },
    {
      name: "EcoStyle Khadi & Apparel",
      category: "Clothing & Home",
      address: "Station Road, Sector 4",
      offer: "200 Green Coins = ₹60 Discount",
      discount: "₹60 OFF",
      requiredCoins: 200,
      tag: "Special Offer",
    },
  ];

  return (
    <div className="flex flex-col gap-16 md:gap-24 pb-16">
      
      {/* SECTION 1: HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#d8f3dc]/40 to-transparent pt-12 md:pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto flex flex-col items-center text-center gap-6">
          
          {/* Top Project Badge */}
          <Badge variant="success" className="px-4 py-1 text-sm font-semibold shadow-xs">
            🌱 Digital Waste Segregation & Incentive System
          </Badge>

          {/* Main Hero Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#1b4332] tracking-tight leading-tight">
            Turn Household Waste into <br />
            <span className="text-[#52b788] underline decoration-[#f77f00] decoration-wavy decoration-2">
              Rewarding Green Coins
            </span>
          </h1>

          {/* Subtitle / Value Proposition */}
          <p className="text-base sm:text-lg md:text-xl text-gray-700 max-w-3xl leading-relaxed">
            Encouraging responsible waste segregation at the source. Segregate your household waste,
            upload photographic proof, earn verified digital <strong>Green Coins</strong>, and redeem discounts
            at participating local businesses.
          </p>

          {/* Call to Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link href="/register">
              <Button variant="primary" size="lg" className="shadow-md">
                Start Segregating Today &rarr;
              </Button>
            </Link>
            <Link href="/how-it-works">
              <Button variant="outline" size="lg">
                See How It Works
              </Button>
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-4xl pt-8">
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-[#e2ece9] text-center shadow-xs">
              <div className="text-2xl font-bold text-[#1b4332]">4</div>
              <div className="text-xs text-gray-600 font-medium">Waste Categories</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-[#e2ece9] text-center shadow-xs">
              <div className="text-2xl font-bold text-[#1b4332]">100%</div>
              <div className="text-xs text-gray-600 font-medium">Admin Verified</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-[#e2ece9] text-center shadow-xs">
              <div className="text-2xl font-bold text-[#f77f00]">₹60+</div>
              <div className="text-xs text-gray-600 font-medium">Business Discounts</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-[#e2ece9] text-center shadow-xs">
              <div className="text-2xl font-bold text-[#1b4332]">Zero</div>
              <div className="text-xs text-gray-600 font-medium">Landfill Target</div>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 2: HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col items-center text-center gap-3 mb-12">
          <Badge variant="info">Simple 4-Step Process</Badge>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#1b4332]">
            How Green Rewards Operates
          </h2>
          <p className="text-gray-600 max-w-2xl text-sm md:text-base">
            From your kitchen bin to local store savings, our transparent workflow keeps waste segregation simple and accountable.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {workflowSteps.map((step, idx) => (
            <Card key={idx} hover={true} className="flex flex-col justify-between h-full relative">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">{step.icon}</span>
                  <span className="text-xs font-bold text-[#52b788] bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
                    Step {step.step}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#1b4332] mb-2">{step.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{step.desc}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* SECTION 3: WASTE CATEGORIES & REWARD VALUES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <Badge variant="coin">Official Incentive Rates</Badge>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#1b4332] mt-2">
              Waste Categories & Coin Rewards
            </h2>
            <p className="text-gray-600 text-sm md:text-base max-w-2xl mt-1">
              Every approved contribution earns Green Coins based on standard municipal categories.
            </p>
          </div>
          <Link href="/categories">
            <Button variant="outline" size="sm">
              View Guidelines &rarr;
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {wasteCategories.map((cat) => (
            <div
              key={cat.id}
              className={`p-6 rounded-2xl border transition-all duration-200 hover:shadow-md bg-white flex flex-col justify-between ${cat.containerColor}`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="text-3xl">{cat.icon}</span>
                  <span className="inline-flex items-center gap-1 font-bold text-xs px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                    🪙 {cat.reward} Coins
                  </span>
                </div>
                <h3 className="text-xl font-bold text-[#1b4332] mb-1">{cat.name}</h3>
                <p className="text-xs text-gray-600 leading-relaxed mb-4">{cat.description}</p>
                
                <div className="border-t border-gray-200/60 pt-3">
                  <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Acceptable Examples:
                  </div>
                  <ul className="text-xs text-gray-700 space-y-1">
                    {cat.examples.map((item, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="text-emerald-600 font-bold">&bull;</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4: THE GREEN COIN ECONOMY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-[#1b4332] text-white rounded-3xl p-8 md:p-12 shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            
            <div className="flex flex-col gap-4">
              <span className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-800 text-emerald-200 w-fit">
                🪙 Digital Incentive Architecture
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                How the Green Coin Economy Works
              </h2>
              <p className="text-emerald-100/90 text-sm md:text-base leading-relaxed">
                Green Coins are non-monetary digital incentive credits awarded to citizens when waste contributions are verified and approved by administrators.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <span className="text-emerald-400 font-bold text-lg">✓</span>
                  <div>
                    <h4 className="text-sm font-bold text-emerald-100">Strict Single-Award Policy</h4>
                    <p className="text-xs text-emerald-200/80">Coins are minted only once upon admin approval. No duplicate submissions or self-minting.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-emerald-400 font-bold text-lg">✓</span>
                  <div>
                    <h4 className="text-sm font-bold text-emerald-100">Ledger-Backed Transactions</h4>
                    <p className="text-xs text-emerald-200/80">Every credit and debit creates an immutable transaction record linked to contribution or redemption IDs.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-emerald-400 font-bold text-lg">✓</span>
                  <div>
                    <h4 className="text-sm font-bold text-emerald-100">Direct Local Merchant Discounts</h4>
                    <p className="text-xs text-emerald-200/80">Redeem coins directly at neighborhood stores, boosting local economic sustainability.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Illustrative Coin Wallet Graphic Card */}
            <div className="bg-emerald-800/60 rounded-2xl p-6 border border-emerald-700/60 flex flex-col gap-5">
              <div className="flex justify-between items-center pb-4 border-b border-emerald-700">
                <div>
                  <span className="text-xs text-emerald-200">Citizen Digital Wallet</span>
                  <div className="text-2xl font-bold text-white flex items-center gap-2">
                    <span>185</span> <span className="text-amber-400 text-sm font-normal">Green Coins</span>
                  </div>
                </div>
                <Badge variant="coin">Live Balance</Badge>
              </div>

              <div className="space-y-2 text-xs">
                <div className="text-emerald-200 font-semibold mb-1">Recent Sample Transactions:</div>
                <div className="flex justify-between items-center bg-emerald-900/50 p-2.5 rounded-lg border border-emerald-700/40">
                  <span>+20 Coins &bull; E-Waste Approved</span>
                  <span className="text-emerald-300 font-mono">Credit</span>
                </div>
                <div className="flex justify-between items-center bg-emerald-900/50 p-2.5 rounded-lg border border-emerald-700/40">
                  <span>+10 Coins &bull; Wet Waste Approved</span>
                  <span className="text-emerald-300 font-mono">Credit</span>
                </div>
                <div className="flex justify-between items-center bg-emerald-900/50 p-2.5 rounded-lg border border-emerald-700/40">
                  <span>-50 Coins &bull; Prakriti Mart Voucher</span>
                  <span className="text-amber-300 font-mono">Redeemed</span>
                </div>
              </div>

              <Link href="/citizen/dashboard" className="w-full">
                <Button variant="accent" size="md" className="w-full font-bold">
                  View Citizen Portal &rarr;
                </Button>
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 5: PARTICIPATING BUSINESSES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <Badge variant="success">Merchant Network</Badge>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#1b4332] mt-2">
              Participating Local Businesses
            </h2>
            <p className="text-gray-600 text-sm md:text-base max-w-2xl mt-1">
              Spend your Green Coins as direct cash discounts with our verified sustainability partners.
            </p>
          </div>
          <Link href="/businesses">
            <Button variant="outline" size="sm">
              All Partner Stores &rarr;
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {partnerBusinesses.map((biz, idx) => (
            <Card key={idx} hover={true} className="flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start gap-2 mb-3">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {biz.category}
                  </span>
                  <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                    {biz.tag}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-[#1b4332] mb-1">{biz.name}</h3>
                <p className="text-xs text-gray-500 mb-4">📍 {biz.address}</p>

                <div className="p-3 rounded-xl bg-[#f8faf7] border border-[#e2ece9] mb-4">
                  <div className="text-xs text-gray-500 font-medium">Available Discount:</div>
                  <div className="text-lg font-extrabold text-[#2d6a4f]">{biz.discount}</div>
                  <div className="text-xs text-gray-600 mt-1">{biz.offer}</div>
                </div>
              </div>

              <Link href="/login" className="w-full">
                <Button variant="secondary" size="sm" className="w-full">
                  Redeem with {biz.requiredCoins} Coins
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      </section>

      {/* SECTION 6: THREE-ROLE CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-gradient-to-r from-emerald-100 via-teal-50 to-emerald-100 rounded-3xl p-8 md:p-12 border border-emerald-200 text-center flex flex-col items-center gap-6">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#1b4332] max-w-2xl">
            Ready to Build a Cleaner, Greener Neighborhood?
          </h2>
          <p className="text-gray-700 max-w-xl text-sm md:text-base">
            Choose your role and explore how citizens, municipal administrators, and local businesses collaborate.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/register">
              <Button variant="primary" size="md">
                Citizen Sign Up
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="md">
                Admin & Business Login
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
