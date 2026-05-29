const express = require('express');
const path    = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log('');
  console.log('  ██╗██████╗  ██████╗ ███╗   ██╗    ██╗  ██╗███████╗██████╗  ██████╗');
  console.log('  ██║██╔══██╗██╔═══██╗████╗  ██║    ██║  ██║██╔════╝██╔══██╗██╔═══██╗');
  console.log('  ██║██████╔╝██║   ██║██╔██╗ ██║    ███████║█████╗  ██████╔╝██║   ██║');
  console.log('  ██║██╔══██╗██║   ██║██║╚██╗██║    ██╔══██║██╔══╝  ██╔══██╗██║   ██║');
  console.log('  ██║██║  ██║╚██████╔╝██║ ╚████║    ██║  ██║███████╗██║  ██║╚██████╔╝');
  console.log('  ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═══╝    ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝ ╚═════╝');
  console.log('');
  console.log(`  🏋  Running at  →  http://localhost:${PORT}`);
  console.log('');
  console.log('  Pages:');
  console.log(`    ⚔  Train         →  http://localhost:${PORT}/`);
  console.log(`    🌳  Skills        →  http://localhost:${PORT}/skills.html`);
  console.log(`    💀  Boss          →  http://localhost:${PORT}/boss.html`);
  console.log(`    📜  Log           →  http://localhost:${PORT}/log.html`);
  console.log(`    🏆  Achievements  →  http://localhost:${PORT}/achievements.html`);
  console.log('');
  console.log('  Ctrl+C to stop.');
  console.log('');
});