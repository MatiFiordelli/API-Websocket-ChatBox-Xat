import { WebSocketServer } from 'ws'
import { DOMParser } from 'xmldom'

const PORT = process.env.PORT || 3000
const wss = new WebSocketServer({port: PORT})

wss.on('connection', function connection(ws){
    ws.on('open', ()=>{ console.log('oppened')})
    //ws.on('close', (e)=>{ console.log(e.socket)})
    ws.on('error', console.error)
    ws.on('message', function message(data){
        //const parsedMsg = JSON.parse(data)
        const parsedMsg = new DOMParser().parseFromString(data.toString(), 'text/xml')
        const command = parsedMsg.childNodes[0].firstChild?.textContent

        wss.clients.forEach((client)=>{
            //if(client.readyState===1){
                //console.log(wss.clients.size)
                console.log('------------')
                if(command){
                    console.log('Command sent', command)
                    client.send(`<command>${command}</command>`)
                } else {
                    console.log('Message sent')
                    client.send(data.toString())
                }                
            //}
        })
    })    
})