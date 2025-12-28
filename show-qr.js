import qrcode from "qrcode-terminal";
import { networkInterfaces } from "os";

// Pegar IP local
const nets = networkInterfaces();
let localIP = "localhost";

for (const name of Object.keys(nets)) {
  for (const net of nets[name]) {
    // Pular endereços internos e não IPv4
    if (net.family === "IPv4" && !net.internal) {
      localIP = net.address;
      break;
    }
  }
}

const url = `http://${localIP}:3001`;

console.log("\n📱 Escaneie o QR Code para acessar no smartphone:\n");
qrcode.generate(url, { small: true });
console.log(`\n🔗 URL: ${url}\n`);
