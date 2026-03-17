import { defineConfig } from "vite";
import react from "@vitejs/plugin-react"; // Agar React use kar rahe ho toh

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173, // Jo bhi aapka port ho
    strictPort: true,
    allowedHosts: [
      "council-sacrifice-polyphonic-referred.trycloudflare.com",
      ".trycloudflare.com" 
    ]
  }
});