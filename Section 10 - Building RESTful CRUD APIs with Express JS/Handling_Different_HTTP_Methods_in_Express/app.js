import express from "express";

const app=express();

const port=4000;

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

app.listen(port,()=>{
    console.log(`Server running on port: ${port}`);
})