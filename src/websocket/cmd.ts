import type { Command } from 'commander'
import express, { type Request, type Response } from 'express'
import morgan from 'morgan'
import cors from 'cors'
import { WebSocketServer } from 'ws'
import http from 'node:http'
import internal from 'node:stream'

function handler(_: Request, res: Response) {
    res.send('healty')
}

function registerWebSocket(wsServer: WebSocketServer) {
    const interval = setInterval(() => {
        wsServer.clients.forEach((ws) => {
            if (ws.readyState === ws.OPEN) {
                const num = Math.floor(Math.random() * 100)
                ws.send(`server data: ${num}`)
            }
        })
    }, 5000)

    wsServer.on('connection', function (ws) {
        ws.on('message', function (data, _isBinary) {
            this.send(`server echo: ${data}`)
        })
    })

    wsServer.on('close', () => clearInterval(interval))

    return function (req: http.IncomingMessage, socket: internal.Duplex, head: Buffer) {
        wsServer.handleUpgrade(req, socket, head, function (ws) {
            wsServer.emit('connection', ws, req)
        })
    }
}

export function registerWebsocketCommand(cmd: Command) {
    cmd.command('websocket')
        .description('websocket Demo')
        .action(() => {
            const app = express()
            app.use(cors())
            app.use(morgan('combined'))
            app.get('/', handler)
            const server = http.createServer(app)
            const wsHandler = registerWebSocket(new WebSocketServer({ noServer: true }))
            server.on('upgrade', wsHandler)
            server.listen(3000, () => {
                console.log('Websocket Server is listening on port 3000')
            })
        })
}
