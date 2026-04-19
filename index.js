const {
  default: makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion
} = require("@whiskeysockets/baileys");

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("auth");
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    auth: state,
    browser: ["Bot", "Chrome", "1.0.0"],
    printQRInTerminal: false
  });

  sock.ev.on("creds.update", saveCreds);

  // 🔑 CONNECTION + FORCED PAIRING CODE
  sock.ev.on("connection.update", async (update) => {
    const { connection } = update;

    if (connection === "connecting") {
      try {
        const code = await sock.requestPairingCode("2349114568400"); // 👈 PUT YOUR NUMBER
        console.log("\n🔑 YOUR PAIRING CODE:");
        console.log(code);
        console.log("\n👉 WhatsApp > Linked Devices > Link with phone number\n");
      } catch (err) {
        console.log("❌ Pairing error:", err);
      }
    }

    if (connection === "open") {
      console.log("🤖 WhatsApp Bot Connected!");
    }

    if (connection === "close") {
      console.log("❌ Connection closed, restarting...");
      startBot();
    }
  });

  // 🧠 MESSAGE + COMMAND SYSTEM
  sock.ev.on("messages.upsert", async (msg) => {
    const m = msg.messages[0];
    if (!m.message) return;

    const text =
      m.message.conversation ||
      m.message.extendedTextMessage?.text;

    const sender = m.key.remoteJid;

    if (!text) return;

    const command = text.toLowerCase().trim();

    console.log("📩 Message:", command);

    // ⚡ COMMANDS
    if (command === "hi") {
      await sock.sendMessage(sender, { text: "Hello 👋 I'm alive!" });
    }

    else if (command === "ping") {
      await sock.sendMessage(sender, { text: "pong ⚡" });
    }

    else if (command === "menu") {
      await sock.sendMessage(sender, {
        text: `📜 *BOT MENU*

hi - greet bot
ping - check bot
menu - show commands
time - current time`
      });
    }

    else if (command === "time") {
      const now = new Date().toLocaleTimeString();
      await sock.sendMessage(sender, {
        text: `⏰ Current time: ${now}`
      });
    }

    else {
      await sock.sendMessage(sender, {
        text: "🤖 I don't understand that yet. Type *menu*."
      });
    }
  });
}

startBot();
