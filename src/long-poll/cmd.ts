import type { Command } from 'commander'
import express, { type Request, type Response } from 'express'
import morgan from 'morgan'
import readline from 'node:readline'
import cors from 'cors'

function handler(req: Request, res: Response) {
    console.log(`incoming request from: ${req.ip}`)
    console.time('long-poll')

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: 'Message to send to client: ',
    })
    req.on('end', () => {
        rl.close()
        console.timeEnd('long-poll')
    })
    rl.prompt()
    rl.on('line', (line) => {
        res.send(line)
    })
}

export function registerLongPollCommand(cmd: Command) {
    cmd.command('long-poll')
        .description('Long Poll Demo')
        .action(() => {
            const app = express()
            app.use(cors())
            app.use(morgan('combined'))
            app.use(handler)
            app.listen(3000, () => {
                console.log('Long Poll Demo listening on port 3000')
            })
        })
}
