import Jimp from "jimp";
import FormData from "form-data";
import https from "https";

export const enhancedImageAPI = async (buffer) => {
let level = 1
return new Promise(async (resolve, reject) => {
try {
let image = buffer
let iterations = level === 1 ? 5 : level === 2 ? 10 : level === 3 ? 20 : level === 4 ? 30 : 1;
for (let i = 0; i < iterations; i++) {
let form = new FormData();
let url = `https://inferenceengine.vyro.ai/enhance`;
form.append("model_version", 1);
form.append("image", Buffer.from(buffer), {
filename: "enhance_image_body.jpg",
contentType: "image/jpeg",
});
let options = {
method: "POST",
headers: {
...form.getHeaders(),
"User-Agent": "okhttp/4.9.3",
Connection: "Keep-Alive",
"Accept-Encoding": "gzip",
},
};
let chunks = [];
await new Promise((resolveReq) => {
let req = https.request(url, options, (res) => {
res.on("data", (chunk) => chunks.push(chunk));
res.on("end", () => resolveReq());
});
req.on("error", (err) => reject(err));
form.pipe(req);
});
image = Buffer.concat(chunks);
}
resolve(image);
} catch (error) {
reject(error);
}
});
}

