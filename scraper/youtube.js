import youtubedlPkg from "youtube-dl-exec"
import { promisify } from "util"
import os from "os"
import path from "path"
import fs from "fs"
import axios from "axios"
import FormData from "form-data"

const youtubedl = youtubedlPkg.default ?? youtubedlPkg

export async function ytDownloader(url) {
  const tempDir = path.join(os.tmpdir(), "downify-yt")
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true })
  }

  const outputTemplate = path.join(tempDir, "%(title)s.%(ext)s")

  try {
    await youtubedl(url, {
      extractAudio: true,
      audioFormat: "mp3",
      audioQuality: "0",
      output: outputTemplate,
      noCheckCertificates: true,
      noWarnings: true,
      preferFreeFormats: true,
      addHeader: [
        "user-agent: Mozilla/5.0"
      ]
    })

    const files = fs.readdirSync(tempDir)
    const mp3File = files.find(f => f.endsWith(".mp3"))

    if (!mp3File) {
      return { status: false, message: "No mp3 found" }
    }

    const filePath = path.join(tempDir, mp3File)

    const form = new FormData()
    form.append("reqtype", "fileupload")
    form.append("fileToUpload", fs.createReadStream(filePath))

    const upload = await axios.post("https://catbox.moe/user/api.php", form, {
      headers: form.getHeaders()
    })

    fs.unlinkSync(filePath)

    return {
      status: true,
      title: mp3File.replace(".mp3", ""),
      url: upload.data
    }

  } catch (error) {
    return {
      status: false,
      message: error.message || "Download failed"
    }
  }
}