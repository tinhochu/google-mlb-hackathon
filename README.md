![Banner Image](https://d112y698adiu2z.cloudfront.net/photos/production/challenge_background_images/003/181/709/datas/original.png)

# Google x MLB™ Hackaton 2025

## Demo Video

[![Watch the demo video](https://img.youtube.com/vi/your-video-id/0.jpg)](https://www.youtube.com/watch?v=your-video-id)

## Project Overview

I'm participating in the MLB Hackathon, **tackling Challenge #5**, titled **MLB™ P3: Prospect Potential Predictor**. My goal is to make baseball more exciting for fans by creating a tool that helps them follow young talented players and predict their future potential. My tool will display player stats, historical data, and live updates — information typically reserved for baseball experts.

I'm making baseball viewing more interactive by letting fans make data-driven predictions about players, share their insights with other fans, and compare their picks with experts. This creates a deeper connection to the sport.

The tool will enhance key moments like draft days and league promotions, allowing fans to track their favorite prospects' journeys. This transforms casual viewers into passionate fans invested in their team's future.

Through this combination of sports, technology, and social features, I'm working to make baseball more engaging and accessible for everyone.

Stay tuned as we innovate and bring our ideas to life!

## Features & Functionality

- Predict the career of a prospect by analyzing the first year in minor league.
- Using Gemini to infer the scouting grades of a prospect, from the synopsis giving by the MLB.
- Keep track of the latest news and updates about a prospect with a custom google search.
- Compare the prospect with historical players that have similar stats in their first year in minor league.

## Technology Stack

### Frontend

- [NextJS](https://nextjs.org)
- [TailwindCSS](https://tailwindcss.com)
- [Shadcn UI](https://ui.shadcn.com)
- [Clerk](https://clerk.com)
- [Sentry](https://sentry.io)
- [Google Gemini](https://developers.google.com/gemini)

### Databases

- [Firestore](https://firebase.google.com/products/firestore)

## Data Sources

- [MLB datasets](https://www.kaggle.com/datasets/mlb/mlb-player-data)
- [Google Gemini](https://developers.google.com/gemini)
- [Google Custom Search API](https://developers.google.com/custom-search)
- [Baseball Reference](https://www.baseball-reference.com)

## Installation & Setup

1. Clone the repository
2. Enter the `frontend` directory and run `pnpm install`
3. get the env variables from the `.env.example` file and put them in the `.env.local` file
4. to start the development server, run `pnpm dev`

## Innovation and Creativity

I'm using Google Cloud's amazing Vertex AI platform to do something really cool - my project takes MLB scouting reports and turns them into easy-to-understand prospect grades using Gemini's smart language abilities. I've combined this with some other great features like up-to-the-minute news updates through Google Custom Search and historical stats to create a fun system that puts professional baseball insights right in fans' hands. It's exciting to see how Vertex AI and Gemini can take complex baseball information and turn it into helpful insights that make the game more engaging for everyone!

## Acknowledgements

- [Google Cloud](https://cloud.google.com)
- [Google Gemini](https://developers.google.com/gemini)
- [Google Custom Search API](https://developers.google.com/custom-search)
- [Baseball Reference](https://www.baseball-reference.com)
- [MLB datasets](https://www.kaggle.com/datasets/mlb/mlb-player-data)
- [Shadcn UI](https://ui.shadcn.com)
- [TailwindCSS](https://tailwindcss.com)
- [NextJS](https://nextjs.org)
- [Clerk](https://clerk.com)
- [Firebase](https://firebase.google.com)
- [Sentry](https://sentry.io)
- [Vercel](https://vercel.com)
- [Github Actions](https://github.com/features/actions)

## Known Issues and Future Enhancements

- [ ] Add a better UI for the prospect comparison.
- [ ] Add a better UI for the prospect scouting report.
- [ ] Add a better UI for the prospect news.
- [ ] Add a better UI for the prospect historical data.
- [ ] Integrate all years from the prospect's career into the prediction.
- [ ] Integration of LangChain to improve the prediction.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

### Non-Proprietary Aspects

The submission complies with the Google Cloud x MLB Hackathon requirements by licensing all Non-Proprietary Aspects under the MIT License, an OSI-approved license that allows unrestricted commercial use, modification, and distribution.

Note: MLB-provided data and Google Cloud services are excluded from this license and remain the property of their respective owners.
