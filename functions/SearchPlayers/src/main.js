import { gotScraping } from 'got-scraping';
/**
 * * This function will be executed every time your function is triggered
 * * It will search for players in the MLB Algolia Service
 * * It will return the players that match the search query
 */
export default async ({ req, res, log, error }) => {
  try {
    // Check if its POST request
    if (req.method !== 'POST') {
      return res.json({ error: 'Method not allowed' }, 405);
    }

    // Get the body
    const body = req.body;

    // Find in the MLB API
    const response = await gotScraping.get(
      `${process.env.MLB_API_ENDPOINT}/v1/people/search`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        searchParams: {
          names: body.query,
        },
      }
    );

    // Parse the response
    const data = JSON.parse(response.body);

    // Return the players
    return res.json({
      data: {
        players: data.people,
      },
    });
  } catch (e) {
    error(e);

    return res.json({ error: 'Internal server error' }, 500);
  }
};
