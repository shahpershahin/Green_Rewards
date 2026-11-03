// app/categories/page.js
// Waste Categories & Segregation Guidelines Page
// Demonstrates: Functional Component, Nested Route (/categories), and Grid Layout

import Link from "next/link";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

export default function CategoriesPage() {
  const categories = [
    {
      id: "wet",
      name: "Wet Waste",
      reward: 10,
      icon: "🥗",
      badgeColor: "success",
      description: "Biodegradable organic matter that decomposes naturally and can be turned into rich compost.",
      dos: ["Vegetable and fruit peels", "Leftover cooked food & grains", "Eggshells and tea bags", "Garden leaves and flowers"],
      donts: ["Plastic wraps or packaging", "Sanitary waste", "Pet litter", "Metal foil wrapping"],
    },
    {
      id: "dry",
      name: "Dry Waste",
      reward: 10,
      icon: "📦",
      badgeColor: "info",
      description: "Non-biodegradable, clean recyclable household materials. Must be free from liquid or grease.",
      dos: ["Newspapers, books, and cartons", "Clean plastic tubs & pouches", "Aluminum cans & metal caps", "Rinsed glass containers"],
      donts: ["Soiled pizza boxes", "Used tissues or wet wipes", "Thermocol with food stains", "Hazardous chemicals"],
    },
    {
      id: "ewaste",
      name: "E-Waste",
      reward: 20,
      icon: "🔋",
      badgeColor: "warning",
      description: "Electrical, electronic components, or heavy-metal devices requiring authorized municipal recycling.",
      dos: ["Household batteries & torch cells", "Broken charging cables & adapters", "Old cellphones and remotes", "Dead circuit boards & motherboards"],
      donts: ["Wet batteries with leaking acid", "Broken mercury thermometers", "Tube lights (handle as hazardous)"],
    },
    {
      id: "other",
      name: "Other Waste",
      reward: 5,
      icon: "🧹",
      badgeColor: "warning",
      description: "Inert domestic refuse, sweeping debris, or mixed non-hazardous items that cannot be recycled.",
      dos: ["Floor sweeping dust & debris", "Broken ceramic crockery", "Worn-out rags & cloth fibers", "Dry pet hair"],
      donts: ["Flammable paints or oils", "Medical needles or bio-hazard", "Industrial chemical barrels"],
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 flex flex-col gap-10">
      {/* Header */}
      <header className="text-center flex flex-col items-center gap-3">
        <Badge variant="coin">Municipal Segregation Guidelines</Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1b4332]">
          Household Waste Categories
        </h1>
        <p className="text-gray-600 max-w-2xl text-sm md:text-base">
          Accurate segregation ensures your waste contribution is approved on the first review, crediting Green Coins without delays.
        </p>
      </header>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {categories.map((cat) => (
          <Card key={cat.id} className="flex flex-col justify-between">
            <div>
              {/* Card Header */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-4xl p-2 rounded-2xl bg-[#f8faf7] border border-[#e2ece9]">
                    {cat.icon}
                  </span>
                  <div>
                    <h2 className="text-2xl font-bold text-[#1b4332]">{cat.name}</h2>
                    <span className="text-xs text-gray-500 font-medium">Standard Category</span>
                  </div>
                </div>
                <span className="font-extrabold text-sm px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                  🪙 {cat.reward} Coins
                </span>
              </div>

              <p className="text-sm text-gray-700 leading-relaxed mb-6">
                {cat.description}
              </p>

              {/* Do's and Don'ts comparison */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                {/* DOs */}
                <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-200">
                  <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <span>✅</span> What to Include
                  </div>
                  <ul className="text-xs text-emerald-950 space-y-1.5">
                    {cat.dos.map((item, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-600 font-bold">&bull;</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* DONTs */}
                <div className="bg-rose-50/70 p-3.5 rounded-xl border border-rose-200">
                  <div className="text-xs font-bold text-rose-800 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <span>❌</span> Do NOT Include
                  </div>
                  <ul className="text-xs text-rose-950 space-y-1.5">
                    {cat.donts.map((item, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-rose-600 font-bold">&bull;</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Quick Upload Action */}
            <div className="pt-6 mt-6 border-t border-gray-100 flex justify-between items-center">
              <span className="text-xs text-gray-500">Reward value is configurable by administrator.</span>
              <Link href="/citizen/upload">
                <Button variant="secondary" size="sm">
                  Upload {cat.name} &rarr;
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
