import type { Command } from 'commander'
import express, { type NextFunction, type Request, type Response } from 'express'
import morgan from 'morgan'
import cors from 'cors'


function handler(req: Request, res: Response) {
	console.log(`incoming request from: ${req.ip}`)
	console.time('netcat')
	req.on('close', () => console.timeEnd('netcat'))
	res.json({
		"message": "this is echo server",
		"headers": req.headers,
		"body": req.body,
	})
}

export function registerNetcatCommand(cmd: Command) {
	cmd.command('netcat')
		.description('Netcat Demo')
		.action(() => {
			const app = express()
			app.use(cors())
			app.use(express.text({ type: '*/*' }))
			app.use(morgan('combined'))
			app.use(handler)
			app.listen(3000, () => {
				console.log('Netcat Demo listening on port 3000')
			})
		})
}
