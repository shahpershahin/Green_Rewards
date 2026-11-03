// app/about/page.js
// About Project & Academic Syllabus Page
// Demonstrates: Functional Component, Nested Route (/about), and Semantic Content Organization

import Link from "next/link";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 flex flex-col gap-10">
      {/* Header */}
      <header className="text-center flex flex-col items-center gap-3">
        <Badge variant="info">Academic Project Specification</Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1b4332]">
          About Green Rewards
        </h1>
        <p className="text-gray-600 max-w-2xl text-sm md:text-base">
          A full-stack sustainability platform engineered for B.Tech Semester 3, demonstrating practical concepts in React.js and Next.js.
        </p>
      </header>

      {/* Main Content Card */}
      <Card className="flex flex-col gap-6">
        <div>
          <h2 className="text-xl font-bold text-[#1b4332] mb-2">1. Problem Statement & Motivation</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            Municipal waste collection in urban and semi-urban centers frequently suffers from low rates of segregation at the source. Mixed garbage ends up in landfills, creating severe environmental degradation and preventable greenhouse gas emissions.
            <br /><br />
            <strong>Green Rewards</strong> bridges this gap by introducing a transparent, digital incentive mechanism. Citizens who segregate their household waste into distinct categories (Wet, Dry, E-Waste, Other) submit photographic proof. Upon administrator verification, citizens receive <em>Green Coins</em> that can be redeemed as real discounts at local neighborhood stores.
          </p>
        </div>

        <div className="border-t border-gray-100 pt-4">
          <h2 className="text-xl font-bold text-[#1b4332] mb-2">2. Three-Role Architectural Ecosystem</h2>
          <ul className="text-sm text-gray-700 space-y-3">
            <li className="flex items-start gap-2">
              <span className="text-emerald-700 font-bold">1. Citizen:</span>
              <span>Uploads photographs of segregated waste, enters quantity, tracks verification status, and redeems earned Green Coins for business discount vouchers.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-700 font-bold">2. Administrator:</span>
              <span>Reviews submitted waste images, verifies categorization, approves or rejects submissions with feedback, and manages reward rates.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-700 font-bold">3. Local Business:</span>
              <span>Publishes discount offers, accepts Green Coins from verified citizens, and verifies redemption tokens at checkout.</span>
            </li>
          </ul>
        </div>

        <div className="border-t border-gray-100 pt-4">
          <h2 className="text-xl font-bold text-[#1b4332] mb-2">3. Academic Syllabus Alignment</h2>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            This project is intentionally built using clean, beginner-friendly functional JavaScript, demonstrating core syllabus units:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="bg-[#f8faf7] p-3 rounded-xl border border-[#e2ece9]">
              <strong className="text-[#1b4332]">React Essentials:</strong> Functional components, JSX, Props, Component Composition, Conditional Rendering.
            </div>
            <div className="bg-[#f8faf7] p-3 rounded-xl border border-[#e2ece9]">
              <strong className="text-[#1b4332]">Hooks & State:</strong> useState, useEffect, useContext, useCallback, useMemo.
            </div>
            <div className="bg-[#f8faf7] p-3 rounded-xl border border-[#e2ece9]">
              <strong className="text-[#1b4332]">Routing & Layouts:</strong> Next.js App Router, file-based routing, nested layouts, client-side navigation.
            </div>
            <div className="bg-[#f8faf7] p-3 rounded-xl border border-[#e2ece9]">
              <strong className="text-[#1b4332]">Backend & APIs:</strong> Route Handlers, REST principles, Zod validation, Fetch API.
            </div>
          </div>
        </div>
      </Card>

      {/* Return home link */}
      <div className="text-center">
        <Link href="/">
          <Button variant="outline" size="sm">
            &larr; Return to Home Page
          </Button>
        </Link>
      </div>
    </div>
  );
}
