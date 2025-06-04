import {OpenAI} from "openai";


const openai = new OpenAI({
baseURL: 'https://api.a4f.co/v1', //'https://beta.sree.shop/v1'/,
apiKey: 'ddc-a4f-5a2fa37f060b4d71a969d087aa9d3e13' //'ddc-beta-klx9fk6vdk-u8OAE2Q5RDfNf5VYih6r2r0102Pe7icG3jE'
});

export const ai = async (text, model) => {
try {
const response = await openai.chat.completions.create({
model: `provider-2/${model}` || "provider-2/claude-3.7-sonnet",
messages:[
{"role": "system", "content": "Kamu Adalah SatzzDev."},
{"role": "user", "content": text}
]
})
return { status : true, developer: 'https://t.me/krniwnstria/', message: response.choices[0].message.content}
} catch (error) {
return { status : false, developer: 'https://t.me/krniwnstria/', message: error.message}
}
}