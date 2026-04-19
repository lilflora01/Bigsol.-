sock.ev.on("messages.upsert", async (msg) => {
  const m = msg.messages[0];
  if (!m.message) return;

  const text =
    m.message.conversation ||
    m.message.extendedTextMessage?.text;

  const sender = m.key.remoteJid;

  if (!text) return;

  console.log("📩 Message:", text);

  // 🧠 COMMAND SYSTEM
  const command = text.toLowerCase().trim();

  // ⚡ Commands
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
ping - check if bot is alive
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

  // 🤖 Auto reply (non-command)
  else {
    await sock.sendMessage(sender, {
      text: "🤖 I don't understand that yet. Type *menu*."
    });
  }
});
