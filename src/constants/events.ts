export type EventType = 'wedding' | 'betrothal' | 'birthday' | 'baptism' | 'holy_communion' | 'naming_ceremony' | 'baby_shower' | 'housewarming';

export interface EventConfig {
  type: EventType;
  label: string;
  slug: string;
  urlPath: string;
  accentColor: string;
  person1Label: string;
  person2Label?: string;
  isCoupleEvent: boolean;
  tagline: string;
  subtitle: string;
  heroTitle: string;
  socialProof: string;
  countdownLabel: string;
  footerText: string;
}

export const EVENTS: EventConfig[] = [
  {
    type: 'wedding', label: 'Wedding', slug: 'wedding',
    urlPath: '/create-your-wedding-website',
    accentColor: '#e8dbdc',
    person1Label: 'Groom', person2Label: 'Bride', isCoupleEvent: true,
    tagline: 'Together with their families',
    subtitle: 'request the pleasure of your company',
    heroTitle: 'Create Your Dream Wedding Website',
    socialProof: '12,847+ happy couples',
    countdownLabel: 'Countdown to Forever',
    footerText: "Can't wait to see you there!",
  },
  {
    type: 'betrothal', label: 'Betrothal', slug: 'betrothal',
    urlPath: '/create-your-betrothal-website',
    accentColor: '#c084fc',
    person1Label: 'Groom', person2Label: 'Bride', isCoupleEvent: true,
    tagline: 'With joy in our hearts',
    subtitle: 'we invite you to celebrate our engagement',
    heroTitle: 'Create Your Betrothal Website',
    socialProof: '3,200+ happy couples',
    countdownLabel: 'Countdown to Our Day',
    footerText: "Can't wait to celebrate with you!",
  },
  {
    type: 'birthday', label: 'Birthday', slug: 'birthday',
    urlPath: '/create-your-birthday-website',
    accentColor: '#8499dd',
    person1Label: 'Birthday Person', isCoupleEvent: false,
    tagline: "You're invited to celebrate",
    subtitle: 'a very special birthday',
    heroTitle: 'Create Your Birthday Website',
    socialProof: '8,542+ parents & party planners',
    countdownLabel: 'Countdown to the Party',
    footerText: 'Come celebrate with us!',
  },
  {
    type: 'baptism', label: 'Baptism', slug: 'baptism',
    urlPath: '/create-your-baptism-website',
    accentColor: '#57aa53',
    person1Label: 'Child', isCoupleEvent: false,
    tagline: 'With gratitude and joy',
    subtitle: 'we invite you to witness the baptism of',
    heroTitle: 'Create Your Baptism Website',
    socialProof: '4,100+ blessed families',
    countdownLabel: 'Countdown to the Ceremony',
    footerText: 'Your presence is a blessing!',
  },
  {
    type: 'holy_communion', label: 'Holy Communion', slug: 'holy-communion',
    urlPath: '/create-your-holy-communion-website',
    accentColor: '#57aa53',
    person1Label: 'Child', isCoupleEvent: false,
    tagline: 'With hearts full of faith',
    subtitle: 'we invite you to the Holy Communion of',
    heroTitle: 'Create Your Holy Communion Website',
    socialProof: '2,800+ families of faith',
    countdownLabel: 'Countdown to the Ceremony',
    footerText: 'Join us in this sacred celebration!',
  },
  {
    type: 'naming_ceremony', label: 'Naming Ceremony', slug: 'naming-ceremony',
    urlPath: '/create-your-naming-ceremony-website',
    accentColor: '#f4c542',
    person1Label: 'Baby', isCoupleEvent: false,
    tagline: 'With love and happiness',
    subtitle: 'we invite you to the naming ceremony of',
    heroTitle: 'Create Your Naming Ceremony Website',
    socialProof: '1,900+ joyful families',
    countdownLabel: 'Countdown to the Celebration',
    footerText: 'Come bless our little one!',
  },
  {
    type: 'baby_shower', label: 'Baby Shower', slug: 'baby-shower',
    urlPath: '/create-your-baby-shower-website',
    accentColor: '#f9a8d4',
    person1Label: 'Mother-to-be', isCoupleEvent: false,
    tagline: 'A little one is on the way!',
    subtitle: 'join us to shower love and blessings on',
    heroTitle: 'Create Your Baby Shower Website',
    socialProof: '2,300+ expecting families',
    countdownLabel: 'Countdown to the Shower',
    footerText: "We can't wait to celebrate!",
  },
  {
    type: 'housewarming', label: 'Housewarming', slug: 'housewarming',
    urlPath: '/create-your-housewarming-website',
    accentColor: '#f97316',
    person1Label: 'Host', isCoupleEvent: false,
    tagline: 'New home, new beginnings',
    subtitle: 'you are cordially invited to the housewarming of',
    heroTitle: 'Create Your Housewarming Website',
    socialProof: '1,500+ new homeowners',
    countdownLabel: 'Countdown to the Celebration',
    footerText: 'Come bless our new home!',
  },
];

export const getEventBySlug = (slug: string): EventConfig | undefined =>
  EVENTS.find(e => e.slug === slug);

export const getEventByType = (type: EventType): EventConfig | undefined =>
  EVENTS.find(e => e.type === type);

export const PROMO_CODES: Record<string, { discount: number; label: string }> = {
  'SAVE10': { discount: 10, label: '10% OFF' },
};

export const PRICING_PLANS = [
  { id: '1month', label: '1 Month', price: 99, duration: 30, preferred: false },
  { id: '3months', label: '3 Months', price: 199, duration: 90, preferred: true },
  { id: '1year', label: '1 Year', price: 499, duration: 365, preferred: false },
];
