import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [],
      build: {
        rollupOptions: {
          input: {
            main: path.resolve(__dirname, 'index.html'),
            article: path.resolve(__dirname, 'article.html'),
            about: path.resolve(__dirname, 'about.html'),
            contact: path.resolve(__dirname, 'contact.html'),
            'privacy-policy': path.resolve(__dirname, 'privacy-policy.html'),
            'editorial-policy': path.resolve(__dirname, 'editorial-policy.html'),
            'terms-and-conditions': path.resolve(__dirname, 'terms-and-conditions.html'),
            '404': path.resolve(__dirname, '404.html'),
          }
        },
        minify: 'terser',
        terserOptions: {
          compress: { drop_console: true }
        }
      },
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
