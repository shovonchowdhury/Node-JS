import http from 'node:http';

const server= http.createServer((request,response)=>{

    console.log(request.url);
    console.log(request.headers);

    response.setHeader("Content-Length","18");
    response.end('Hello from server.');

    request.on('data',(chunk)=>{
        console.log('Requesting...');
        console.log(chunk.toString());
    })
});

server.listen(4000,'0.0.0.0',()=>{
    console.log('Server started...');
})