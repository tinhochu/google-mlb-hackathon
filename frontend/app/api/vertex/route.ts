import { Buffer } from 'buffer'
import { GoogleAuth } from 'google-auth-library'
import { NextRequest, NextResponse } from 'next/server'

// Decode the base64-encoded service account key
const base64Key = process.env.NEXT_PRIVATE_GOOGLE_SERVICE_ACCOUNT_KEY!
const jsonKey = JSON.parse(Buffer.from(base64Key, 'base64').toString('utf8'))

const vertexEndpoint = {
  hits: `https://us-west1-aiplatform.googleapis.com/v1/projects/${process.env.NEXT_PRIVATE_VERTEX_PROJECT_ID}/locations/us-west1/endpoints/${process.env.NEXT_PRIVATE_VERTEX_CAREER_HITS_ENDPOINT_ID}:predict`,
  debut: `https://us-central1-aiplatform.googleapis.com/v1/projects/${process.env.NEXT_PRIVATE_VERTEX_PROJECT_ID}/locations/us-central1/endpoints/${process.env.NEXT_PRIVATE_VERTEX_MLB_DEBUT_ENDPOINT_ID}:predict`,
  homerun: `https://us-west2-aiplatform.googleapis.com/v1/projects/${process.env.NEXT_PRIVATE_VERTEX_PROJECT_ID}/locations/us-west2/endpoints/${process.env.NEXT_PRIVATE_VERTEX_CAREER_HR_ENDPOINT_ID}:predict`,
  war: `https://us-west3-aiplatform.googleapis.com/v1/projects/${process.env.NEXT_PRIVATE_VERTEX_PROJECT_ID}/locations/us-west3/endpoints/${process.env.NEXT_PRIVATE_VERTEX_CAREER_WAR_ENDPOINT_ID}:predict`,
  batAvg: `https://us-west4-aiplatform.googleapis.com/v1/projects/${process.env.NEXT_PRIVATE_VERTEX_PROJECT_ID}/locations/us-west4/endpoints/${process.env.NEXT_PRIVATE_VERTEX_CAREER_BATTING_AVG_ENDPOINT_ID}:predict`,
}

const catsMapping = {
  battingHand: {
    L: 0,
    R: 1,
    S: 2,
  },
  throwingHand: {
    L: 0,
    R: 1,
    S: 2,
  },
  primaryPositon: {
    '1B': 0,
    '2B': 1,
    '3B': 2,
    C: 3,
    CF: 4,
    DH: 5,
    IF: 6,
    LF: 7,
    OF: 8,
    P: 9,
    PH: 10,
    RF: 11,
    SS: 12,
    X: 13,
  },
  draftTeam: {
    'Arizona Diamondbacks': 0,
    Athletics: 1,
    'Atlanta Braves': 2,
    'Baltimore Orioles': 3,
    'Boston Red Sox': 4,
    'Chicago Cubs': 5,
    'Chicago White Sox': 6,
    'Cincinnati Reds': 7,
    'Cleveland Guardians': 8,
    'Colorado Rockies': 9,
    'Detroit Tigers': 10,
    'Houston Astros': 11,
    'Kansas City Royals': 12,
    'Los Angeles Angels': 13,
    'Los Angeles Dodgers': 14,
    'Miami Marlins': 15,
    'Milwaukee Brewers': 16,
    'Minnesota Twins': 17,
    'New York Mets': 18,
    'New York Yankees': 19,
    'Philadelphia Phillies': 20,
    'Pittsburgh Pirates': 21,
    'San Diego Padres': 22,
    'San Francisco Giants': 23,
    'Seattle Mariners': 24,
    'St. Louis Cardinals': 25,
    'Tampa Bay Rays': 26,
    'Texas Rangers': 27,
    'Toronto Blue Jays': 28,
    'Washington Nationals': 29,
  },
}

const instanceMap = {
  draftYear: 'Draft_Year',
  pickOverall: 'Pick_Overall',
  height: 'Height',
  weight: 'Weight',
  primaryPositon: 'Primary_Position',
  battingHand: 'Batting_Hand',
  throwingHand: 'Throwing_Hand',
  draftTeam: 'Draft_Team',
  isPitcher: 'Is_Pitcher',
  gamesPlayed: 'G',
  atBats: 'AB',
  runs: 'R',
  hits: 'H',
  totalBases: 'TB',
  doubles: '2B',
  triples: '3B',
  homeRuns: 'HR',
  rbi: 'RBI',
  baseOnBalls: 'BB',
  intentionalWalks: 'IBB',
  strikeOuts: 'SO',
  stolenBases: 'SB',
  caughtStealing: 'CS',
  avg: 'AVG',
  obp: 'OBP',
  slg: 'SLG',
  ops: 'OPS',
  wins: 'W',
  losses: 'L',
  era: 'ERA',
  gamesStarted: 'GS',
  completeGames: 'CG',
  saves: 'SV',
  saveOpportunities: 'SVO',
  inningsPitched: 'IP',
  earnedRuns: 'ER',
  hitBatsmen: 'HB',
  whip: 'WHIP',
}

/**
 * * This is coming from the one_hot_and_scaling.py script
 * * It is the scaler params for the data
 * * It is used to scale the data before it is sent to the vertex model
 */
const scalerParams = {
  mean: [
    73.68515576323986, 199.90831516095537, 658.6345729491173, 29.083592938733126, 74.11461578400831, 38.592030114226375,
    0.24981882788161994, 0.7508310617860852, 2.2071904205607478,
  ],
  scale: [
    2.780410363665687, 20.216146071192835, 416.30177441151926, 20.89893616883467, 94.43685653413417, 24.13570567656647,
    0.06114423432211721, 0.8429324520126993, 3.380793768138012,
  ],
  columns: ['height', 'weight', 'pickOverall', 'gamesPlayed', 'atBats', 'hits', 'avg', 'whip', 'era'],
}

// Use the decoded key with Google Cloud libraries
const auth = new GoogleAuth({
  credentials: jsonKey, // Decoded JSON key
  scopes: ['https://www.googleapis.com/auth/cloud-platform'], // Required scope for Vertex AI
})

// Function to get an access token
const getAccessToken = async () => {
  const client = await auth.getClient()
  const token = await client.getAccessToken()
  return token
}

const feetToInches = (height: string) => {
  const match = height.match(/(\d+)' ?(\d+)"/) // Regex to extract feet and inches

  if (match) {
    const feet = parseInt(match[1], 10) // Convert feet to integer
    const inches = parseInt(match[2], 10) // Convert inches to integer
    return feet * 12 + inches // Convert to total inches
  } else {
    console.error('🚨 Invalid height format')
    return height
  }
}

/**
 * This function scales the data using the scalerParams Object from the one_hot_and_scaling.py script
 * @param data - The data to be scaled
 * @returns The scaled data
 */
const scaleData = async (data: Record<string, any>) => {
  try {
    // for each key that is in the scalerParams, we need to scale the corresponding value in the data
    for (let i = 0; i < scalerParams.columns.length; i++) {
      const key = scalerParams.columns[i] // Get the key using the index

      // Check if the value is a string and convert it to a number if necessary
      const value = typeof data[key] === 'string' ? parseFloat(data[key]) : data[key]

      data[key] = (value - scalerParams.mean[i]) / scalerParams.scale[i] // Use the index to access mean and scale
    }

    return data
  } catch (error) {
    console.error(error)
    return data
  }
}

const convertStringToNumber = (data: Record<string, any>) => {
  for (const key in data) {
    if (typeof data[key] === 'string') {
      const parsedValue = parseFloat(data[key]) // Attempt to parse the string to a number
      if (!isNaN(parsedValue)) {
        // Check if the parsed value is a valid number
        data[key] = parsedValue // Only assign if it's a valid number
      } else {
        data[key] = data[key] // Keep the original string value
      }
    }
  }

  return data
}

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    // Get the model and data from the request
    const { data } = await req.json()

    // from the data, filter out the keys that are not in the instanceMap keys, create a new object with the filtered keys
    const filteredData = Object.keys(data)
      .filter((key) => Object.keys(instanceMap).includes(key))
      .reduce((acc: Record<string, any>, key) => {
        acc[key] = data[key]
        return acc
      }, {})

    // first, chane the height to inches
    filteredData.height = feetToInches(filteredData.height)

    // Second, we need to transform the data to be scaled
    const scaledData = await scaleData(filteredData)

    // some items in the data are strings, we need to convert them to numbers
    const convertedData = convertStringToNumber(scaledData)

    // Create a new Object with the values from the instanceMap, iterating over the keys and values from the convertedData
    const instanceMapData = Object.keys(instanceMap).reduce((acc: Record<string, any>, key) => {
      // Check if the key exists in catsMapping and if the value exists in catsMapping[key]
      // @ts-ignore
      if (catsMapping[key] && convertedData[key] in catsMapping[key]) {
        // @ts-ignore
        acc[instanceMap[key]] = String(catsMapping[key][convertedData[key]]) // Get value from catsMapping
      } else {
        // @ts-ignore
        acc[instanceMap[key]] = String(convertedData[key] ?? 0) // Convert to string
      }

      // check if the value is NaN, if it is, set it to 0
      // @ts-ignore
      if (acc[instanceMap[key]] === 'NaN') {
        // @ts-ignore
        acc[instanceMap[key]] = '0'
      }

      return acc
    }, {})

    // Get the access token
    const accessToken = await getAccessToken()

    // Finally, we are going to make a prediction using the vertex model
    const batAvgResponse = await fetch(vertexEndpoint.batAvg, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken.token}`,
      },
      body: JSON.stringify({ instances: [instanceMapData] }),
    })

    const mlbDebutResponse = await fetch(vertexEndpoint.debut, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken.token}`,
      },
      body: JSON.stringify({ instances: [instanceMapData] }),
    })

    const careerHomerunsResponse = await fetch(vertexEndpoint.homerun, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken.token}`,
      },
      body: JSON.stringify({ instances: [instanceMapData] }),
    })

    const vertexCareerWARResponse = await fetch(vertexEndpoint.war, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken.token}`,
      },
      body: JSON.stringify({ instances: [instanceMapData] }),
    })
    const vertexCareerHitsResponse = await fetch(vertexEndpoint.hits, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken.token}`,
      },
      body: JSON.stringify({ instances: [instanceMapData] }),
    })

    const batAvgData = await batAvgResponse.json()
    const careerHomerunsData = await careerHomerunsResponse.json()
    const careerWARData = await vertexCareerWARResponse.json()
    const mlbDebutData = await mlbDebutResponse.json()
    const careerHitsData = await vertexCareerHitsResponse.json()

    return NextResponse.json({
      data: {
        batAvg: batAvgData?.predictions?.[0],
        careerWar: careerWARData?.predictions?.[0],
        careerHomeruns: careerHomerunsData?.predictions?.[0],
        careerHits: careerHitsData?.predictions?.[0],
        mlbDebut: mlbDebutData?.predictions?.[0],
      },
    })
  } catch (error) {
    console.error(error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
