import vue from '@vitejs/plugin-vue'
import legacy from '@vitejs/plugin-legacy'
import svgLoader from 'vite-svg-loader'
import path from 'path'
import { defineConfig, loadEnv } from 'vite'

// 引入Node.js的fs模块
import fs from 'fs';

// 读取package.json文件
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')

  return {
    define: {
      __APP_NAME__: JSON.stringify(env.VITE_APP_TITLE),
      __APP_VERSION__: JSON.stringify(packageJson.version),
      __APP_DESCRIPTION__: JSON.stringify(packageJson.description),
    },
    plugins: [
      vue(),
      legacy(),
      svgLoader()
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    test: {
      globals: true,
      environment: 'jsdom'
    }
  }
})
