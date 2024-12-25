import express from 'express';

const app=express();

const port= 4000;


///////// custom global middleware
// app.use((req,res,next)=>{

//     console.log(req.url);
//     console.log(req.headers)

//     req.on('data',(chunk)=>{
//          req.body= JSON.parse(chunk.toString());
//          //console.log(body);
//          next();
//     })
    
// })

app.use(express.json());  //inbulit global middleware

app.get('/',(req,res)=>{
    res.end('Home GET');
})
app.post('/',(req,res)=>{
    res.end('Home POST');
})
app.delete('/',(req,res)=>{
    res.end('Home DELETE');
})
app.put('/',(req,res)=>{
    res.end('Home PUT');
})
app.patch('/',(req,res)=>{
    res.end('Home PATCH');
})



app.get('/login',(req,res)=>{
    res.end('Login GET')
})
app.post('/login',(req,res)=>{
    console.log(req.body);
    res.end('Login POST')
})

app.listen(port,()=>{
    console.log(`Server is running on Port: ${port}`);
})