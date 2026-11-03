// app/businesses/page.js
// Participating Partner Businesses & Offers Directory
// Demonstrates: Functional Component, Nested Route (/businesses), and Responsive Cards

import Link from "next/link";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

export default function BusinessesPage() {
  const businesses = [
    {
      id: 1,
      name: "Prakriti Organic Mart",
      type: "Grocery & Vegetables",
      address: "Shop 14, MG Road Market, Ward 12",
      description: "Direct-from-farm organic groceries, fresh local vegetables, and chemical-free whole grains.",
      offers: [
        { title: "Eco-Shopper Voucher", coins: 50, discount: "₹10 OFF on any ₹100 purchase" },
        { title: "Weekly Veggie Basket", coins: 100, discount: "₹25 OFF on orders above ₹250" },
      ],
    },
    {
      id: 2,
      name: "Green Cafe & Bakery",
      type: "Bakery & Coffee",
      address: "Opposite City Garden, Civil Lines",
      description: "Zero-plastic cafe serving artisanal sourdough breads, organic shade-grown coffee, and plant-based treats.",
      offers: [
        { title: "Morning Brew Discount", coins: 50, discount: "₹10 OFF on hot/cold beverages" },
        { title: "Zero-Waste Combo Meal", coins: 100, discount: "₹25 OFF on sandwiches and meals" },
      ],
    },
    {
      id: 3,
      name: "EcoStyle Khadi & Apparel",
      type: "Sustainable Clothing",
      address: "Shop 204, Metro Plaza, Sector 4",
      description: "Hand-spun khadi garments, upcycled denim accessories, and biodegradable cotton cloth bags.",
      offers: [
        { title: "Sustainable Wardrobe Voucher", coins: 200, discount: "₹60 OFF on apparel orders" },
      ],
    },
    {
      id: 4,
      name: "CleanEarth Stationers",
      type: "Recycled Stationery",
      address: "Near University Gate 2",
      description: "Notebooks made with 100% recycled paper, seed-embedded pencils, and refillable wooden pens.",
      offers: [
        { title: "Student Eco Pack", coins: 50, discount: "₹10 OFF on notebook bundles" },
      ],
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 flex flex-col gap-10">
      {/* Header */}
      <header className="text-center flex flex-col items-center gap-3">
        <Badge variant="success">Local Sustainability Ecosystem</Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1b4332]">
          Partner Businesses & Redemption Offers
        </h1>
        <p className="text-gray-600 max-w-2xl text-sm md:text-base">
          Local stores partnering with Green Rewards to honor your segregation efforts with real discounts on everyday goods.
        </p>
      </header>

      {/* Business List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {businesses.map((biz) => (
          <Card key={biz.id} className="flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start gap-3 mb-2">
                <div>
                  <h2 className="text-2xl font-bold text-[#1b4332]">{biz.name}</h2>
                  <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                    {biz.type}
                  </span>
                </div>
                <span className="text-2xl">🏪</span>
              </div>

              <p className="text-xs text-gray-500 mb-2">📍 {biz.address}</p>
              <p className="text-xs text-gray-600 leading-relaxed mb-6">{biz.description}</p>

              {/* Active Offers from this merchant */}
              <div className="space-y-3 pt-4 border-t border-gray-100">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Active Redemption Offers:
                </div>
                {biz.offers.map((offer, oIdx) => (
                  <div
                    key={oIdx}
                    className="p-3 rounded-xl bg-[#f8faf7] border border-[#e2ece9] flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="text-sm font-bold text-[#1b4332]">{offer.title}</div>
                      <div className="text-xs text-gray-600 font-medium">{offer.discount}</div>
                    </div>
                    <span className="shrink-0 text-xs font-extrabold px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                      🪙 {offer.coins} Coins
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-gray-100">
              <Link href="/login" className="w-full">
                <Button variant="primary" size="sm" className="w-full">
                  Log In to Redeem Offers &rarr;
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>

      {/* Business registration CTA */}
      <div className="bg-white p-8 rounded-2xl border border-[#e2ece9] text-center flex flex-col items-center gap-3">
        <h3 className="text-xl font-bold text-[#1b4332]">
          Are You a Local Business Owner?
        </h3>
        <p className="text-xs text-gray-600 max-w-lg">
          Join the Green Rewards merchant program to welcome eco-conscious shoppers and build long-term local customer loyalty.
        </p>
        <Link href="/register">
          <Button variant="outline" size="sm">
            Register Your Business &rarr;
          </Button>
        </Link>
      </div>
    </div>
  );
}
