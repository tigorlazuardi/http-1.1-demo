import type { Command } from 'commander'
import express, { type Request, type Response } from 'express'
import morgan from 'morgan'
import cors from 'cors'

function handler(req: Request, res: Response) {
    console.log(`incoming request from: ${req.ip}`)
    const headers = {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    }
    // This is needed to be set and send first for the client to prepare
    // receiving the event stream.
    res.writeHead(200, headers)
    res.flushHeaders()

    let progress = 0

    const intervalID = setInterval(() => {
        progress += Math.floor(Math.random() * 10) + 1
        if (progress >= 100) {
            clearInterval(intervalID)
            res.write('data: done\n\n')
            res.end()
            return
        }
        res.write(`data: ${progress}%\n\n`)
    }, 1000)
}

export function registerSSECommand(cmd: Command) {
    cmd.command('sse')
        .description('SSE Demo')
        .action(() => {
            const app = express()
            app.use(cors())
            app.use(morgan('combined'))
            app.use(handler)
            app.listen(3000, () => {
                console.log('SSE Demo listening on port 3000')
            })
        })
}
