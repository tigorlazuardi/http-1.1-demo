import { Command } from 'commander'
import { registerLongPollCommand } from './long-poll/_index.js'
import { registerShortPollCommand } from './short-poll/_index.js'
import { registerSSECommand } from './sse/_index.js'
import { registerNetcatCommand } from './netcat/_index.js'
import { registerWebsocketCommand } from './websocket/_index.js'

const cmd = new Command('demo-presentasi')

registerLongPollCommand(cmd)
registerShortPollCommand(cmd)
registerSSECommand(cmd)
registerNetcatCommand(cmd)
registerWebsocketCommand(cmd)

cmd.parse()

export default cmd
