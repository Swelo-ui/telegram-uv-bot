const { Telegraf } = require('telegraf'); // Import Telegraf library
const bot = new Telegraf('YOUR_TELEGRAM_BOT_TOKEN'); // Replace with your bot token

// Sample database for identification
const sampleDatabase = {
  Paracetamol: 243,
  Ibuprofen: 222,
  Aspirin: 265,
};

// Start command
bot.start((ctx) => {
  ctx.reply("Hello! I am your UV Spectrophotometer Assistant. Use /menu to get started.");
});

// Menu command
bot.command('menu', (ctx) => {
  ctx.reply("Options:\n1. /identify - Identify a compound by wavelength\n2. /help - Get help");
});

// Identify command
bot.command('identify', (ctx) => {
  ctx.reply("Enter a wavelength to identify the compound.");
});

// Handle text messages (for identifying compounds)
bot.on('text', (ctx) => {
  const wavelength = parseFloat(ctx.message.text.trim());
  if (isNaN(wavelength)) {
    ctx.reply("Please enter a valid numeric wavelength.");
    return;
  }
  const closestMatch = Object.keys(sampleDatabase).reduce((a, b) =>
    Math.abs(sampleDatabase[a] - wavelength) < Math.abs(sampleDatabase[b] - wavelength) ? a : b
  );
  ctx.reply(`Closest match: ${closestMatch} (Wavelength: ${sampleDatabase[closestMatch]} nm)`);
});

// Export handler for Netlify
exports.handler = async (event) => {
  try {
    await bot.handleUpdate(JSON.parse(event.body)); // Process incoming updates
    return { statusCode: 200, body: 'OK' }; // Respond with status 200
  } catch (error) {
    console.error('Error:', error);
    return { statusCode: 500, body: 'Error' };

  }
};
