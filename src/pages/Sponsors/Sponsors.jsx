import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { AnimatedTitle } from "@cyscomvit/cyscomui";
import SponsorCard from "../../components/SponsorCard";

gsap.registerPlugin(ScrollTrigger);

const sponsors = [
  {
    name: "Trainsec",
    description: "TrainSec Academy is a cybersecurity learning platform that provides hands-on training in areas such as ethical hacking, digital forensics, malware analysis, and cybersecurity research.",
    image: "/img/sponsors/trainsec_logo.webp",
    website: "https://trainsec.net/"
  },
  {
    name: "AECC",
    description: "A global education consultancy helping students pursue higher education abroad through university admissions, visa assistance, and career guidance.",
    image: "/img/sponsors/aecc.webp",
    website: null
  },
  {
    name: "Tezos",
    description: "An energy-efficient, open-source blockchain platform supporting smart contracts, decentralized applications, and on-chain governance.",
    image: "/img/sponsors/tezos.webp",
    website: null
  },
  {
    name: "Polygon",
    description: "A leading blockchain scaling platform that enhances Ethereum with faster, lower-cost, and more scalable decentralized applications.",
    image: "/img/sponsors/polygon.webp",
    website: null
  },
  {
    name: "Code Asylums",
    description: "A technology community focused on software development, innovation, hackathons, and developer education.",
    image: "/img/sponsors/code-asylums.webp",
    website: null
  },
  {
    name: "IDP",
    description: "A global leader in international education services, assisting students with overseas admissions, English testing, and visas.",
    image: "/img/sponsors/idp.webp",
    website: null
  },
  {
    name: "Manya",
    description: "A premier test-preparation and study-abroad consultancy offering coaching for GRE, GMAT, SAT, IELTS, TOEFL, and admissions guidance.",
    image: "/img/sponsors/Manya.webp",
    website: null
  },
  {
    name: "Geeks for Geeks",
    description: "One of the world's largest computer science learning platforms, providing coding tutorials, interview preparation, and technical courses.",
    image: "/img/sponsors/geeks.webp",
    website: null
  },
  {
    name: "Tamil Nadu Police",
    description: "The state law enforcement agency responsible for maintaining public safety, enforcing laws, and ensuring security across Tamil Nadu.",
    image: "/img/sponsors/tnpolice.webp",
    website: null
  },
  {
    name: "Wanderlooms",
    description: "A lifestyle and travel brand focused on curated experiences, premium products, and creative exploration.",
    image: "/img/sponsors/wanderlooms.webp",
    website: null
  },
  {
    name: "Olive Consulting",
    description: "A consulting and technology solutions company delivering business transformation, IT services, and digital innovation.",
    image: "/img/sponsors/olive.webp",
    website: null
  },
  {
    name: "Greater Chennai Police",
    description: "The metropolitan police force responsible for law enforcement, public safety, and traffic management across Chennai.",
    image: "/img/sponsors/gcp.webp",
    website: null
  },
  {
    name: "Devfolio",
    description: "India's leading hackathon platform connecting developers with hackathons, grants, bounties, and startup opportunities.",
    image: "/img/sponsors/devfolio.webp",
    website: null
  },
  {
    name: "Wolfram Language",
    description: "A symbolic programming language powering computational mathematics, data science, AI, and scientific computing.",
    image: "/img/sponsors/wolfram.webp",
    website: null
  },
  {
    name: "Give My Certificate",
    description: "A digital credential platform that enables organizations to securely issue, verify, and manage certificates online.",
    image: "/img/sponsors/give.webp",
    website: null
  },
  {
    name: "Tetra Flip",
    description: "A technology company focused on innovative digital products, software solutions, and emerging technologies.",
    image: "/img/sponsors/tetra.webp",
    website: null
  },
  {
    name: "Altered Sec",
    description: "A cybersecurity company specializing in red teaming, penetration testing, Active Directory security, and professional training.",
    image: "/img/sponsors/alteredsecurity.webp",
    website: null
  },
  {
    name: "Okta",
    description: "A leading identity and access management platform providing secure authentication, authorization, and identity solutions for organizations.",
    image: "/img/sponsors/okta.webp",
    website: null
  }
];

const Sponsors = () => {
  const sectionRef = useRef(null);

  useGSAP(() => {
    const cards = gsap.utils.toArray("[data-sponsor-card]");
    cards.forEach((card, index) => {
      gsap.fromTo(card,
        { opacity: 0, y: 40, rotateX: -10 },
        {
          scrollTrigger: {
            trigger: card,
            start: "top bottom-=50",
            end: "top center",
            toggleActions: "play none none none",
          },
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.6,
          ease: "power2.out",
          delay: (index % 4) * 0.15,
        }
      );
    });
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      id="sponsors"
      className="min-h-screen bg-black pb-12 md:pb-32 pt-24 md:pt-32 cyber-grid relative"
    >
      <div className="section-divider absolute top-0" />
      <div className="container mx-auto px-3 md:px-5 lg:px-10">
        {/* Section Header */}
        <div className="mb-8 md:mb-24 flex flex-col items-center gap-3 md:gap-8 text-center">
          <p className="font-general text-xs md:text-sm uppercase tracking-wider text-blue-300 animate-fade-in-up">
            Our Partners
          </p>
          <AnimatedTitle
            title="O<b>u</b>r Sp<b>o</b>nsors &<br /> Su<b>p</b>porters"
            containerClass="mt-5 !text-blue-100 text-center"
          />
          <p className="mt-5 max-w-2xl font-circular-web text-lg text-blue-50/70">
            We are grateful to the organisations who believed in our mission to
            cultivate a thriving cybersecurity community at VIT Chennai.
          </p>
        </div>
        {/* Sponsors Grid */}
        <div className="grid grid-cols-2 gap-3 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
          {sponsors.map((sponsor, index) => (
            <SponsorCard
              key={index}
              name={sponsor.name}
              description={sponsor.description}
              image={sponsor.image}
              website={sponsor.website}
            />
          ))}
        </div>
        {/* Bottom Text */}
        <div className="mt-20 text-center">
          <p className="font-circular-web text-base text-blue-50/50">
            Interested in partnering with us? Reach out to the team.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Sponsors;
