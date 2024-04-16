import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { VantResolver } from '@vant/auto-import-resolver';
import postCssPxToRem from "postcss-pxtorem"
import path from 'path'
function _resolve(dir: string) {
  return path.resolve(__dirname, dir)
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [VantResolver()],
    }),
    Components({
      resolvers: [VantResolver()],
    }),
  ],
  resolve: {
    alias: {
      '@': _resolve('src'),
    },
  },  
  server: {
    port: 8080,
    proxy: {
      '/api': {
        target: "http://110.40.173.100:5173",  // 配置到服务器后端的API头部
        rewrite: (path) => path.replace(/^\/api/, '/api')
      }
    }
  },
  css: {
    postcss: {
      plugins: [
        postCssPxToRem({
          rootValue: 37.5, // 1rem的大小
          propList: ['*'], // 需要转换的属性，这里选择全部都进行转换
          selectorBlackList: [".norem"], // 过滤掉.norem-开头的 class，不进行 rem 转换
        })
      ]
    },
    preprocessorOptions: {
      scss: {
        additionalData: "@import './src/assets/styles/variables.scss';"
      }
    }
  }
})
