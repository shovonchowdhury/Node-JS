import express from 'express';

const app=express();

const port= 4000;

app.use(express.json());  


// app.use('/login',(req,res)=>{
//     res.end('First middleWare');
// })

app.use('/admin',(req,res,next)=>{
    if(req.body.pass!='secret')
    {
        res.end('Invalid credentials');
    }
    else
    {
        next();
    }
})

app.post('/admin',(req,res)=>{
    res.end('Verification Successfull');
})


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