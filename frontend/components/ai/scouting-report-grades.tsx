import { Counter } from '@/components/counter'
import GPTTypingEffect from '@/components/gpt-typing-effect'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { model } from '@/lib/gemini'
import * as Sentry from '@sentry/nextjs'
import Image from 'next/image'

const GRADES = ['HIT', 'POWER', 'RUN', 'FIELD', 'ARM']

function ScoutingReportGradesSkeleton() {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image src="/gemini.svg" alt="Gemini" width={20} height={20} className="animate-spin" />
            <p className="text-xl font-bold">Gemini Injury Susceptibility Report</p>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </CardContent>
      </Card>
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {GRADES.map((grade, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="text-center uppercase">{grade}</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <div className="flex items-center justify-center">
                <Skeleton className="h-11 w-11" />
                <sup className="text-sm font-bold -top-[0.9rem]">/80</sup>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  )
}

async function ScoutingReportGrades({ prospect, stats }: { prospect: any; stats: any }) {
  const prompt = `
    You are a professional sports scout. you are evaluating a player.
    You have a blurb of the player's scouting report.
    You have the player's height, weight, and age.
    you have the player's position.
    you have the first Season's stats of the player.
    I want you to give me a general grading scale, typically the 20-80 scale, where:
    20-30: Well Below Average
    40: Below Average
    50: Average
    60: Above Average
    70-80: Elite

    Here's how I would project grades:
    Hit: Blurb says he "needs to refine his approach" and stats confirm this at .230 BA, but a decent .300 OBP. Grade: 40
    Power: Blurb states "raw power" and the HR and SLG stats back this. The ceiling is higher, but the current is a little below average. Grade: 45
    Run: "Surprising athleticism for his size" with 5 stolen bases in 200 ABs. This isn't speed-demon level, so a slightly above average mark Grade: 55
    Field: "Average defender" and 10 errors is not great. But, the 1B spot has a low defensive bar. Grade: 45
    Arm: "Strong arm" but since its a 1B and not a key defensive position it won't contribute too heavily. Grade 50
    the categories we're looking at. Typical ones include:
    Hit: Ability to make consistent contact with the ball.
    Power: Raw power, ability to hit for extra bases and home runs.
    Run: Speed and base-stealing ability.
    Field: Defensive ability, range, hands, arm, etc.
    Arm: Arm strength, accuracy.

    for the pitchers, create a another key in the JSON object called "pitchingGrades" outside of the gradingScale key.
    Pitching-Specific Attributes: For pitchers create a  (Fastball, Curveball, Slider, Changeup, Control, Command).
    Pitching-Specific Attributes only give me the grades.

    here is the data:
    height: ${prospect.person.height}
    weight: ${prospect.person.weight}
    age: ${prospect.person.currentAge}
    position: ${prospect.person.primaryPosition?.name}
    the scouting report: ${prospect.blurb}
    the stats: ${JSON.stringify(stats)}

    add another key to root output called synopsis and give me a short summary of the player focusing on the probability of success and their susceptibility to sports injuries.

    please give me JSON output with the following keys:
    - gradingScale
    - synopsis
    remove the \\\json from the output
  `

  try {
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    const json = JSON.parse(text.replace(/```json\n|```/g, '').replace(' ', ''))
    const scoutingGrades = json?.gradingScale ?? {}
    const pitchingGrades = json?.pitchingGrades ?? {}

    return (
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 px-5 lg:px-0">
        <div className="col-span-2 lg:col-span-5">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image src="/gemini.svg" alt="Gemini" width={20} height={20} />
                <p className="text-xl font-bold">Gemini Injury Susceptibility Report</p>
              </CardTitle>
              <CardDescription>
                {
                  "Based on the scouting report and stats, we forecasted the player's grades. Injury susceptibility is based on the player's position and the likelihood of injury."
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="min-h-24">
              <GPTTypingEffect text={json?.synopsis ?? ''} />
            </CardContent>
          </Card>
        </div>
        {Object.entries(scoutingGrades).map(([key, value]) => (
          <div className="col-span-1">
            <Card key={key}>
              <CardHeader>
                <CardTitle className="text-center uppercase font-bold">{key}</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-center">
                <p className="text-4xl font-bold">
                  <Counter end={(value !== null ? value : '20') as number} />
                  <sup className="text-sm -top-[0.9rem]">/80</sup>
                </p>
              </CardContent>
            </Card>
          </div>
        ))}
        {Object.entries(pitchingGrades).length > 0 && prospect.person.primaryPosition?.abbreviation === 'P' && (
          <>
            {Object.entries(pitchingGrades).map(([key, value]) => (
              <div className="col-span-1" key={key}>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-center uppercase font-bold">{key}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex items-center justify-center">
                    <p className="text-4xl font-bold">
                      <Counter end={(value !== null ? value : '20') as number} />
                      <sup className="text-sm -top-[0.9rem]">/80</sup>
                    </p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </>
        )}
      </div>
    )
  } catch (e: any) {
    Sentry.captureException(e)

    return (
      <Card>
        <CardHeader>
          <CardTitle>Error Generating Scouting Grades</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            {e.message.includes('403 Forbidden')
              ? `This service account doesn't have permission to talk to Gemini via Vertex AI`
              : 'Error contacting Gemini'}
          </p>
        </CardContent>
      </Card>
    )
  }
}

export { ScoutingReportGrades, ScoutingReportGradesSkeleton }
