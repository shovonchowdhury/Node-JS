import http from 'http';


const client=http.request({method:'POST'});

client.write('HI from client');

client.on('response',(response)=>{
    response.on('data',(chunk)=>{
        console.log(chunk.toString());
    })
})

