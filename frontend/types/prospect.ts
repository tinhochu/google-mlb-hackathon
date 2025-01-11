export type Prospect = {
  id: string
  pickRound: string
  pickNumber: number
  headshotLink: string
  birthDate: string
  lastPlayedDate: string
  mlbDebutDate: string
  scoutingReport: string
  year: string
  person: {
    id: number
    firstName: string
    lastName: string
    fullName: string
    currentAge: number
    height: string
    weight: number
    birthCity: string
    birthStateProvince: string
    birthCountry: string
    active: boolean
    primaryPosition: {
      code: string
      name: string
      type: string
      abbreviation: string
    }
    batSide?: {
      code: string
      description: string
    }
    pitchHand?: {
      code: string
      description: string
    }
  }
  school?: {
    name: string
    schoolClass: string
    city: string
    state: string
    country: string
  }
  team: {
    id: number
    name: string
    abbreviation: string
    teamName: string
    locationName: string
  }
  rank: number
}
