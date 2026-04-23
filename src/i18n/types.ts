export type Locale = 'en' | 'pt' | 'fr' | 'de' | 'es';

export interface Translations {
  // Navigation
  nav: {
    selectedWorks: string;
    allWorks: string;
    studio: string;
    about: string;
    contact: string;
  };
  // Hero
  hero: {
    subtitle: string;
    statement: string;
  };
  // Featured works (homepage)
  featured: {
    label: string;
    title: string;
    viewSelected: string;
  };
  // Statement section
  statement: {
    quote: string;
  };
  // Authority strip
  authority: {
    label: string;
  };
  // Collector section
  collector: {
    listLabel: string;
    title: string;
    description: string;
    sideNote: string;
    emailPlaceholder: string;
    join: string;
    subscribe: string;
    stayConnected: string;
    footerDescription: string;
    thankYou: string;
    thankYouMessage: string;
  };
  // Selected Works page
  selectedWorks: {
    label: string;
    title: string;
    description: string;
    viewAll: string;
    loading: string;
    empty: string;
  };
  // All Works page
  allWorks: {
    label: string;
    title: string;
    description: string;
    loading: string;
    noMatch: string;
    clearFilters: string;
    filter: string;
    clearAll: string;
    work: string;
    works: string;
    show: string;
    technique: string;
    techniqueOil: string;
    techniqueAcrylic: string;
    techniqueMixed: string;
    format: string;
    vertical: string;
    square: string;
    horizontal: string;
    size: string;
    small: string;
    medium: string;
    large: string;
    priceRange: string;
    under1000: string;
    from1000to3000: string;
    above3000: string;
    priceOnRequest: string;
    sort: string;
    sortNewest: string;
    sortPriceLow: string;
    sortPriceHigh: string;
  };
  // Artwork detail
  artwork: {
    backToArchive: string;
    medium: string;
    dimensions: string;
    status: string;
    price: string;
    detailViews: string;
    artistNote: string;
    furtherViewing: string;
    loading: string;
    notFound: string;
    backToWorks: string;
    available: string;
    soldStatus: string;
  };
  // Commerce CTA
  commerce: {
    sold: string;
    inquireSimilar: string;
    inquire: string;
    acquireOnline: string;
    preparing: string;
    askQuestion: string;
    inquireAbout: string;
  };
  // Trust info
  trust: {
    certificate: string;
    shipping: string;
    delivery: string;
  };
  // Inquiry modal
  inquiry: {
    title: string;
    regarding: string;
    namePlaceholder: string;
    emailPlaceholder: string;
    phonePlaceholder: string;
    budgetRange: string;
    messagePlaceholder: string;
    send: string;
    sending: string;
    thankYou: string;
    received: string;
    close: string;
    required: string;
    error: string;
    name: string;
    email: string;
    phone: string;
    message: string;
  };
  // Contact page
  contact: {
    getInTouch: string;
    title: string;
    inquiriesLabel: string;
    inquiriesText: string;
    studioLabel: string;
    studioLocation: string;
    emailLabel: string;
    nameLabel: string;
    emailFieldLabel: string;
    subjectLabel: string;
    selectSubject: string;
    acquisition: string;
    generalInquiry: string;
    commissionRequest: string;
    exhibition: string;
    pressMedia: string;
    messageLabel: string;
    sendMessage: string;
    thankYou: string;
    thankYouMessage: string;
  };
  // Studio page
  studioPage: {
    label: string;
    title: string;
    description: string;
    quotes: string[];
    captions: string[];
  };
  // About page
  aboutPage: {
    aboutArtist: string;
    quote: string;
    biography: string;
    bio: string[];
    portraitCaption: string;
    trajectory: string;
    presence: string;
    practice: string;
    recognition: string;
    presenceText: string;
    practiceText: string;
    recognitionText: string;
    presenceDetails: string[];
    practiceDetails: string[];
    recognitionDetails: string[];
    pressTitle: string;
    exhibitionsTitle: string;
    all: string;
    solo: string;
    group: string;
    fairs: string;
    collectionsTitle: string;
    collections: string[];
    forGalleries: string;
    requestCV: string;
  };
  // CV page
  cv: {
    label: string;
    selectedExhibitions: string;
    education: string;
    selectedCollections: string;
    collectionsText: string;
  };
  // Collections page
  collectionsPage: {
    label: string;
    title: string;
    worksCount: string;
  };
  // Checkout
  checkout: {
    successTitle: string;
    successMessage: string;
    successShipping: string;
    continueBrowsing: string;
    cancelTitle: string;
    cancelMessage: string;
    returnToArtwork: string;
    browseAll: string;
  };
  // 404
  notFound: {
    title: string;
    message: string;
    returnHome: string;
  };
  // Footer
  footer: {
    description: string;
    navigate: string;
    inquiries: string;
    contact: string;
    copyright: string;
    artworksCopyright: string;
    madeBy: string;
    legal: string;
    followUs: string;
    privacyPolicy: string;
    cookiePolicy: string;
    termsConditions: string;
    disputeResolution: string;
    complaintsBook: string;
  };
  // Legal pages
  legal: {
    backToHome: string;
    lastUpdated: string;
    placeholderIntro: string;
    placeholderContent: string;
    privacyTitle: string;
    cookiesTitle: string;
    termsTitle: string;
    disputesTitle: string;
    complaintsTitle: string;
  };
}
