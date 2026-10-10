

import landingImage from '../../assets/images/landing image.jpeg';
import landingVideo from '../../assets/images/Video.mp4';
import customerProblemImage from '../../assets/images/Customer describing a real problem.jpeg';
import phoneOffersImage from '../../assets/images/Phone showing offers from different providers.jpeg';
import customerReviewsImage from '../../assets/images/Customer Riviewing Technician Profiles.png';
import providerLaptopImage from '../../assets/images/Choosing a provider on laptop.png';
import technicianDoorImage from '../../assets/images/Friendly Fixly Technician at the Door.png';
import acImage from '../../assets/images/Technician Serving an AC.png';
import electricianImage from '../../assets/images/Electrician Testing Outlet Wiring.png';
import plumberImage from '../../assets/images/Fixly Plumber Repairing Kitchen Sink.png';
import applianceImage from '../../assets/images/Fixly Technician Repairs Washing Machine.png';
import painterImage from '../../assets/images/painter working on interior wall.jpg';
import cleaningTeamImage from '../../assets/images/cleaning team in an home or office.jpg';
import carpenterImage from '../../assets/images/Handyman Repairing a Door Lock.png';
import technicianRepairImage from '../../assets/images/technician completing home repair.jpg';

export const HERO = {
  title: 'Find the right professional for your repair.',
  text: 'Describe your problem, receive prices from verified service providers, compare your options, and choose the person who works best for you.',
  imageAlt: 'Technician repairing an air conditioner in a real home',
  image: landingImage,
};

export const STEPS = [
  { title: 'Tell Fixly what needs repairing', imageAlt: 'Customer describing a repair problem on a phone', image: customerProblemImage },
  { title: 'Receive prices from providers', imageAlt: 'Phone showing offers from different providers', image: phoneOffersImage },
  { title: 'Compare reliability and reviews', imageAlt: 'Customer reviewing technician profiles', image: customerReviewsImage },
  { title: 'Select your preferred provider', imageAlt: 'Customer choosing a provider on a laptop', image: providerLaptopImage },
  { title: 'Track the job and confirm who arrives', imageAlt: "Technician arriving at a customer's door", image: technicianDoorImage },
];

export const VIDEO = {
  imageAlt: 'Short demonstration video of the customer journey',
  image: landingVideo,
};

export const SERVICES = [
  { code: 'AC', label: 'AC repair', imageAlt: 'Technician servicing an air conditioner', image: acImage },
  { code: 'Electrician', label: 'Electrical work', imageAlt: 'Electrician checking a socket or wiring', image: electricianImage },
  { code: 'Plumber', label: 'Plumbing', imageAlt: 'Plumber fixing a kitchen sink pipe', image: plumberImage },
  { code: 'Appliance', label: 'Appliance repair', imageAlt: 'Technician repairing a washing machine', image: applianceImage },
  { code: 'Carpenter', label: 'Carpentry', imageAlt: 'Carpenter repairing a door or cupboard', image: carpenterImage },
  { code: 'Painter', label: 'Painting', imageAlt: 'Painter working on an interior wall', image: painterImage },
  { code: 'Cleaning', label: 'Cleaning', imageAlt: 'Cleaning team in a home or office', image: cleaningTeamImage },
  { code: 'Other', label: 'Other services', imageAlt: 'Technician completing a home repair', image: technicianRepairImage },
];

export const TRUST = {
  title: 'Why customers can trust Fixly',
  imageAlt: "Technician arriving at a customer's property",
  image: technicianDoorImage,
  points: [
    'Receive and compare prices from multiple providers.',
    "See each provider's work history and reliability record.",
    'Read reviews from previous customers.',
    'Message providers before you decide.',
    'Confirm the person who arrives is the provider you selected.',
    'Pay the provider directly. Fixly tracks the payment confirmation.',
  ],
};

export const CTA_TITLE = 'Need help with something at home or at work?';

export const FOOTER_COLUMNS = [
  {
    heading: 'Company',
    links: [
      { label: 'About Fixly', to: 'how' },
      { label: 'How Fixly Works', to: 'how' },
      { label: 'Services', to: 'services' },
      { label: 'Become a Provider', to: 'info', slug: 'become-a-provider' },
    ],
  },
  {
    heading: 'Support',
    links: [
      { label: 'Help and Support', to: 'info', slug: 'help-and-support' },
      { label: 'Contact Us', to: 'info', slug: 'contact-us' },
      { label: 'Safety', to: 'info', slug: 'safety' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Privacy Policy', to: 'info', slug: 'privacy-policy' },
      { label: 'Terms & Conditions', to: 'info', slug: 'terms-and-conditions' },
    ],
  },
];
