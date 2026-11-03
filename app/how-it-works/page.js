// app/how-it-works/page.js
// How It Works Detailed Workflow Page
// Demonstrates: Functional Component, Nested Route (/how-it-works), and Card layout

import Link from "next/link";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

export default function HowItWorksPage() {
  const detailedSteps = [
    {
      num: "1",
      title: "Segregation at Source",
      badge: "Citizen Action",
      desc: "Sort household waste into designated bins: Wet (organic kitchen waste), Dry (clean recyclables), E-Waste (electronics & batteries), and Other. Never mix food residue with dry recyclable items.",
      tip: "Pro Tip: Rinse plastic milk packets and juice bottles before placing them in Dry Waste.",
    },
    {
      num: "2",
      title: "Photograph & Submit Contribution",
      badge: "Citizen Action",
      desc: "Log into your Citizen Portal, choose the segregated category, enter the approximate quantity (e.g. 1.5 kg or 1 bag), attach a clear photograph, and submit for verification.",
      tip: "Pro Tip: Ensure good lighting so the contents are clearly identifiable in the photo.",
    },
    {
      num: "3",
      title: "Simulated & Administrator Verification",
      badge: "Admin Verification",
      desc: "Submissions enter a PENDING status. The system runs initial validation checks, and the municipal administrator reviews the photograph, confirming correct category segregation before approving.",
      tip: "Note: Incomplete or incorrect segregation is rejected with an explanatory reason.",
    },
    {
      num: "4",
      title: "Green Coin Credit & Wallet Update",
      badge: "Automated Reward",
      desc: "Upon administrator approval, Green Coins are instantly minted to your wallet (Wet: 10, Dry: 10, E-Waste: 20, Other: 5). A secure, non-duplicate transaction entry is recorded.",
      tip: "Reward rate is verified server-side; client input cannot modify coin values.",
    },
    {
      num: "5",
      title: "Redemption at Local Businesses",
      badge: "Local Economy",
      desc: "Browse offers from local eco-conscious businesses. Claim a discount voucher by redeeming your coins. Present your redemption code at checkout to claim your savings.",
      tip: "Example: 50 Coins = ₹10 OFF, 100 Coins = ₹25 OFF, 200 Coins = ₹60 OFF.",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 flex flex-col gap-10">
      {/* Page Header */}
      <header className="text-center flex flex-col items-center gap-3">
        <Badge variant="info">Step-by-Step Guide</Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1b4332]">
          How Green Rewards Works
        </h1>
        <p className="text-gray-600 max-w-2xl text-sm md:text-base">
          A transparent, closed-loop workflow that converts domestic environmental diligence into tangible daily savings.
        </p>
      </header>

      {/* Steps List */}
      <div className="space-y-6">
        {detailedSteps.map((step) => (
          <Card key={step.num} className="flex flex-col sm:flex-row gap-6 items-start">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-[#1b4332] text-white font-extrabold text-xl shrink-0">
              {step.num}
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-xl font-bold text-[#1b4332]">{step.title}</h3>
                <Badge variant={step.num === "3" ? "warning" : "success"}>
                  {step.badge}
                </Badge>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{step.desc}</p>
              <div className="text-xs text-[#2d6a4f] bg-emerald-50/80 p-2.5 rounded-lg border border-emerald-200/60 font-medium">
                {step.tip}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="text-center bg-white p-8 rounded-2xl border border-[#e2ece9] flex flex-col items-center gap-4">
        <h3 className="text-xl font-bold text-[#1b4332]">
          Ready to Make Your First Waste Contribution?
        </h3>
        <p className="text-xs text-gray-600 max-w-md">
          Join your fellow citizens in keeping our community clean while earning digital incentives.
        </p>
        <Link href="/register">
          <Button variant="primary" size="md">
            Create Citizen Account &rarr;
          </Button>
        </Link>
      </div>
    </div>
  );
}
