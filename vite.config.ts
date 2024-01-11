import { defineConfig, loadEnv } from 'vite'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
    const env = loadEnv(mode, process.cwd(), '')
    return {
        base: '/',
        build: {
            minify: 'esbuild',
            cssMinify: 'esbuild',
            chunkSizeWarningLimit: 20
        },
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
                '@ui': path.resolve(__dirname, './src/user-interface')
            }
        },
        define: {
            process: {
                env: { DEBUG: env.DEBUG }
            }
        }
    }
})
