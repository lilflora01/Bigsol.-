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

  sock.ev.on("connection.update", async (update) => {
    const { connection, pairingCode } = update;

    // 🔑 FORCE PAIRING CODE DISPLAY
    if (pairingCode) {
      console.log("\n🔑 YOUR PAIRING CODE:");
      console.log(pairingCode);
      console.log("\n👉 Go to WhatsApp > Linked Devices > Link with phone number");
    }

    if (connection === "open") {
      console.log("🤖 WhatsApp Bot Connected!");
    }

    if (connection === "close") {
      console.log("❌ Reconnecting...");
      startBot();
    }
  });
}

startBot();
