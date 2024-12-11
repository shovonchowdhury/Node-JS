import { createWriteStream } from 'node:fs';
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
    // socket.on('data',(chunk)=>{

    //     const inputString=chunk.toString();
    //     let [clientNumber] = inputString.split(" ");
    //     const text=inputString.substring(clientNumber.length + 1);
    //     if (!isNaN(clientNumber) && clientNumber.trim() !== "")
    //     {
    //         clientNumber=parseInt(clientNumber);
    //     }
    //     if(typeof(clientNumber) == 'number')
    //     {
    //         if(clientNumber<clientList.length)
    //         {
    //             clientList[clientNumber].write(text);
    //         }
    //         else
    //         {
    //             process.stdout.write('Client is not found\n');
    //         }
    //     }
    //     else
    //     {
    //         clientList.forEach((socketPro)=>{
    //             if(socket!==socketPro)
    //             {
    //                 socketPro.write(chunk);
    //             }
    //         })
    //         process.stdout.write(chunk);
    //     }
    //     socket.write('Got the message');
    // })

    // console.log(socket.address());
    
    // const writeStream= createWriteStream('movie.mp4');
    // socket.pipe(writeStream);
   
    let writeStream = null;
    let fileName = null;

    // console.log(`New client connected: ${socket.remoteAddress}`);
    // console.log(`Total clients: ${clientList.length}`);

    socket.on('data', (chunk) => {
        const message = chunk.toString().trim();

        // Check for FILE_START message
        if (message.startsWith('FILE_START')) {
            fileName = message.split(' ')[1]; // Extract file name
            console.log(`Receiving file: ${fileName}`);
            writeStream = createWriteStream(`movie.mp4`); // Save file in server directory
        } 
        // Check for FILE_END message
        else if (message === 'FILE_END') {
            if (writeStream) {
                writeStream.end();
                console.log(`File received: ${fileName}`);
                writeStream = null;
                fileName = null;
                socket.write('File received successfully.\n');
            }
        } 
        // Handle regular text messages
        else {
            if (writeStream) {
                writeStream.write(chunk);
                console.log('yo bro')
            } else {
                console.log(`Client says: ${message}`);
                socket.write(`Message received: ${message}`);
            }
        }
    });
   
    socket.on('end',()=>{
        console.log('File fully loaded');
    })
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

