import { Client, Users } from 'node-appwrite';
import { gotScraping } from 'got-scraping';
import * as cheerio from 'cheerio';

// This Appwrite function will be executed every time your function is triggered
export default async ({ req, res, log, error }) => {
  try {
    // Check if its POST request
    if (req.method !== 'POST') {
      return res.json({ error: 'Method not allowed' }, 405);
    }

    // Get the body
    const body = req.body;

    // First, Get the MLB API Player ID
    const response = await gotScraping.get(
      `https://statsapi.mlb.com/api/v1/people/${body.playerId}`
    );

    // Parse the response
    const data = JSON.parse(response.body);

    // Get the player
    const player = data.people[0];

    // Now, get the player's scouting grades

    return res.json({});
  } catch (e) {
    error(e);
  }
};
