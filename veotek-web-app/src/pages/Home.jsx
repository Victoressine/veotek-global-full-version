/*****************************************************************
 * Home Page
 * VeoTek Global
 * Public Website Homepage
 *****************************************************************/

import MainLayout from "../components/layout/MainLayout";

import Hero from "../components/home/Hero";
import WhyChooseVeoTek from "../components/home/WhyChooseVeoTek";
import IndustriesWeServe from "../components/home/IndustriesWeServe";
import Testimonials from "../components/home/Testimonials";
import LatestInsights from "../components/home/LatestInsights";
import HomeFAQ from "../components/home/HomeFAQ";
import HomeCTA from "../components/home/HomeCTA";

export default function Home() {
  return (
    <MainLayout>
      <main id="main-content" className="overflow-x-hidden">
        {/* Hero */}
        <Hero />

        {/* Why Choose VeoTek */}
        <WhyChooseVeoTek />

        {/* Industries */}
        <IndustriesWeServe />

        {/* Client Testimonials */}
        <Testimonials />

        {/* Latest Articles */}
        <LatestInsights />

        {/* Frequently Asked Questions */}
        <HomeFAQ />

        {/* Final Call To Action */}
        <HomeCTA />
      </main>
    </MainLayout>
  );
}
