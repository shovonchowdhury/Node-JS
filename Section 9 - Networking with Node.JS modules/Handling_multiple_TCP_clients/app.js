import net from 'node:net';

process.stdin.on('data',(input)=>{
    const inputString=input.toString();
    let [clientNumber] = inputString.split(" ");
    const text=inputString.substring(clientNumber.length + 1);
    if (!isNaN(clientNumber) && clientNumber.trim() !== "")
    {
        clientNumber=parseInt(clientNumber);
    }
    if(typeof(clientNumber) == 'number')
    {
        if(clientNumber<clientList.length)
        {
            clientList[clientNumber].write(text);
        }
        else
        {
            process.stdout.write('Client is not found\n');
        }
    }
    else
    {
        clientList.forEach((socket)=>{
            socket.write(input);
        })
    }
    
})

const clientList=[];

const server= net.createServer((socket)=>{
    clientList.push(socket);
    socket.on('data',(chunk)=>{

        const inputString=chunk.toString();
        let [clientNumber] = inputString.split(" ");
        const text=inputString.substring(clientNumber.length + 1);
        if (!isNaN(clientNumber) && clientNumber.trim() !== "")
        {
            clientNumber=parseInt(clientNumber);
        }
        if(typeof(clientNumber) == 'number')
        {
            if(clientNumber<clientList.length)
            {
                clientList[clientNumber].write(text);
            }
            else
            {
                process.stdout.write('Client is not found\n');
            }
        }
        else
        {
            clientList.forEach((socket)=>{
                socket.write(chunk);
            })
            process.stdout.write(chunk);
        }
        socket.write('Got the message');
    })

    // console.log(socket.address());
    socket.on('error',()=>{
        console.log(`${socket.remoteAddress} Client lost`);
    })
    socket.on('close',()=>{
        console.log(`Disconnected : ${socket.remoteAddress}`);
    })
    console.log(`Connection established : ${socket.remoteAddress}`);
    console.log(`Total client: ${clientList.length}`);
});

server.listen(4000,'0.0.0.0',()=>{
    console.log('Listening on port 4000');
});

