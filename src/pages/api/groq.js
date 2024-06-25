import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: "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",
});

const universityInfo = {
    name: "SRH Hochschule Berlin",
    location: "Berlin, Germany",
    programs: [
        "Business Administration",
        "Computer Science",
        "Engineering",
        "Psychology ",
    ],
    contact: {
        email: "info@srh-hochschule-berlin.de",
        phone: "+49 30 374374-0",
    },
    website: "https://www.srh-hochschule-berlin.de",
};

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { messages } = req.body;

        const chatMessages = messages.map((msg) => ({
            role: msg.sender === "user" ? "user" : "assistant",
            content: msg.text,
        }));

        const systemMessage = {
            role: "system",
            content: `You are a helpful assistant for SRH Hochschule Berlin. Here is some information about the university: 
              Name: ${universityInfo.name}
              Location: ${universityInfo.location}
              Programs: ${universityInfo.programs.join(", ")}
              Contact Email: ${universityInfo.contact.email}
              Contact Phone: ${universityInfo.contact.phone}
              Website: ${universityInfo.website}
            `,
        };

        try {
            const chatCompletion = await groq.chat.completions.create({
                messages: [systemMessage, ...chatMessages],
                model: "llama3-8b-8192",
                temperature: 1,
                max_tokens: 1024,
                top_p: 1,
                stream: false,
                stop: null,
            });

            const botResponse = chatCompletion.choices[0].message.content;
            res.status(200).json(botResponse);
        } catch (error) {
            res.status(500).json({
                error: "Error communicating with Groq API",
            });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}
