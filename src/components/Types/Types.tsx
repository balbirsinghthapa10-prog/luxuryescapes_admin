interface Link {
  text: string
  url: string
}

export interface HighlightType {
  highlightsTitle: string
  // highlightPicture: File | null
}

interface Link {
  text: string
  url: string
}

interface AccommodationType {
  accommodationTitle: string
  accommodationPics: File[]
  accommodationDescription: string
}

// export interface ItineraryType {
//   day: string
//   title: string
//   description: string
//   itineraryDayPhoto: File | null
//   itineraryDayPhotoPreview: string | null
//   accommodation: AccommodationType[]
//   links: { text: string; url: string }[]
// }

export interface ItineraryType {
  day: string
  title: string
  description: string
  note?: string
  itineraryDayPhoto: File | string | null
  itineraryDayPhotoPreview?: string
  accommodation: string[]
  fineDining: string[]

  links: Array<{ text: string; url: string }>
}

export interface ServicesType {
  inclusives: string[]
  exclusives: string[]
}

export interface FAQType {
  question: string
  answer: string
}

export interface BookingPriceInterface {
  _id: string
  adventureId: string
  adventureType: string
  solo: ""
  soloPremiumFiveStar: ""
  soloFourStar: ""
  soloFiveStar: ""
  singleSupplementary: ""
  singleSupplementaryPremiumFiveStar: ""
  singleSupplementaryFourStar: ""
  singleSupplementaryFiveStar: ""
  standardPremiumFiveStar: ""
  standardFourStar: ""
  standardFiveStar: ""
}

export interface sessionData {
  expires: string
  user: {
    name: string
    email: string
    id: string
  }
  jwt: string
}

interface DestinationsArrayTypes {
  caption: string
  image: string
}
export interface DestinationTypes {
  _id: string
  thumbnail: string
  slug: string
  title: string
  description: string
  destinations?: DestinationsArrayTypes[]
}

export interface AffiliateTypes {
  id: number | null
  title: string
  thumbnail: string | null
  link: string
}

interface Highlight {
  id: string
  text: string
}

export interface DestinationBannerTypes {
  title: string
  slug?: string
  description: string
  image: File | null
  overview: string
  overviewImages: File[]
  highlights: Highlight[]
  previewImage?: string
  overviewImagesPreviews?: string[]
}
