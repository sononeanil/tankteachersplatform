import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from "vite-tsconfig-paths";
import { nodePolyfills } from 'vite-plugin-node-polyfills';  // ✅ use named import
import Sitemap from 'vite-plugin-sitemap'; // 1. Import the sitemap plugin
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    Sitemap({
      hostname: 'https://studentsnotes.in',
      // List your main accessible user routes below so search engines index them
      dynamicRoutes: [
        '/',
        '/filterDetails/Class_6_Science',
        '/filterDetails/Class_7_Science',
        '/filterDetails/Class_8_Science',
        '/filterDetails/Class_9_Science',
        '/filterDetails/Class_10_Science',
        '/getDetailedNotes?standard=6&board=CBSE&subject=Science&chapter=1',
        '/getDetailedNotes?standard=7&board=CBSE&subject=Science&chapter=1',
        '/getDetailedNotes?standard=8&board=CBSE&subject=Science&chapter=1',
        '/getDetailedNotes?standard=9&board=CBSE&subject=Science&chapter=1',
        '/getDetailedNotes?standard=10&board=CBSE&subject=Science&chapter=1',

      ],
      // This ensures it generates exactly 'sitemap.xml' instead of guessing extensions
      outDir: 'dist',
    }), // 2. Add the sitemap plugin
    nodePolyfills(),   // ✅ works now
  ],
  resolve: {
    alias: {
      crypto: 'crypto-browserify',
      stream: 'stream-browserify',
      buffer: 'buffer',
    },
  },
});