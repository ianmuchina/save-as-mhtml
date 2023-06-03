// esbuild script to watch for changes and write them to disk
import { context } from 'esbuild'
import { config } from './config.mjs'
await (await context(config)).watch()