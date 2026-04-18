import youtubedlPkg from "youtube-dl-exec"
import path from "path"
import os from "os"
import fs from "fs"
import axios from "axios"
import FormData from "form-data"

const youtubedl = youtubedlPkg.default ?? youtubedlPkg

const ytDlpPath = path.resolve("./bin/yt-dlp.exe")

export async function ytDownloader(url) {
  const tempDir = path.join(os.tmpdir(), "yt-downloader")
  fs.mkdirSync(tempDir, { recursive: true })

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
      addHeader: ["user-agent: Mozilla/5.0"],

      // 🔥 INI YANG KUNCI
      binary: ytDlpPath
    })

    const files = fs.readdirSync(tempDir)
    const mp3File = files.find(f => f.endsWith(".mp3"))

    if (!mp3File) {
      return { status: false, message: "no mp3 found" }
    }

    const filePath = path.join(tempDir, mp3File)

    const form = new FormData()
    form.append("reqtype", "fileupload")
    form.append("fileToUpload", fs.createReadStream(filePath))

    const upload = await axios.post("https://catbox.moe/user/api.php", form, {
      headers: form.getHeaders(),
      maxBodyLength: Infinity
    })

    fs.rmSync(filePath, { force: true })

    return {
      status: true,
      title: mp3File.replace(".mp3", ""),
      url: upload.data
    }

  } catch (err) {
    return {
      status: false,
      message: err?.message || "download failed"
    }
  } finally {
    const files = fs.existsSync(tempDir) ? fs.readdirSync(tempDir) : []
    for (const f of files) {
      fs.rmSync(path.join(tempDir, f), { force: true })
    }
  }
}