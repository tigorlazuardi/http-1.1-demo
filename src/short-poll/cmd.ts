import type { Command } from 'commander'
import express, { type Request, type Response } from 'express'
import morgan from 'morgan'
import cors from 'cors'

let count = 500
let intervalID: NodeJS.Timer | undefined = undefined

function handler(req: Request, res: Response) {
    console.log(`incoming request from: ${req.ip}`)
    console.time('short-poll')
    req.on('close', () => console.timeEnd('short-poll'))
    if (!intervalID) {
        intervalID = setInterval(() => {
            if (count <= 0) {
                clearInterval(intervalID)
                return
            }
            count -= Math.floor(Math.random() * 20) + 1
        }, 100)
        res.status(202).send(`starting job ${intervalID}`)
        return
    }
    if (count <= 0) {
        res.send(`progress = 100%. done`)
        count = 500
        intervalID = undefined
        return
    }
    res.status(202).send(`job ${intervalID}: not yet. progress = ${100 - count / 5}%`)
}

export function registerShortPollCommand(cmd: Command) {
    cmd.command('short-poll')
        .description('Short Poll Demo')
        .action(() => {
            const app = express()
            app.use(cors())
            app.use(morgan('combined'))
            app.use(handler)
            app.listen(3000, () => {
                console.log('Short Poll Demo listening on port 3000')
            })
        })
}
