import Hero from "../components/Hero";
import HowItWorks from "../components/HowItWorks";
import JobListings from "../components/JobListings";
import CTABanner from "../components/CTABanner";

import WorkerListings from "../components/WorkerListings";

function LandingPage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <JobListings />
      <CTABanner />
      <WorkerListings />
    </>
  );
}

export default LandingPage;
