import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req) {
  if (!process.env.OPENAI_API_KEY) {
    return Response.json({
      message: "Please add your OPENAI_API_KEY to .env.local to see AI Insights! 🤖",
    })
  }

  try {
    const { activities } = await req.json()

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Actually valid OpenAI model
      messages: [
        {
          role: "user",
          content: `Analyze this user activity: ${JSON.stringify(
            activities
          )} and give short insight`,
        },
      ],
    })

    return Response.json({
      message: response.choices[0].message.content,
    })
  } catch (error) {
    return Response.json({
      message: "AI Insight temporarily unavailable",
    })
  }
}
