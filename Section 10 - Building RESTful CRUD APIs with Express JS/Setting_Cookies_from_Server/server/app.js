import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
const PORT = 4000;

app.use(cookieParser());

app.use(cors(
  {
    origin:'http://127.0.0.1:5500',
    credentials:true
  }
));

app.get("/", (req, res) => {
  console.log(req.cookies)

  // res.set({
  //   "Set-Cookie" : [
  //     'name=shovon;SameSite=none;Secure',
  //     'email=shovon@gmail.com;SameSite=none;Secure',
  //     'pass=12234;SameSite=none;Secure'
  //   ]
  // })

  res.cookie('name','shovon',{
    secure:true,
    sameSite:"none",
    maxAge: 60*60*1000
  })
  res.cookie('email','shovon@gmail.com',{
    secure:true,
    sameSite:"none",
    maxAge: 60*60*1000
  })
  res.cookie('pass','1234',{
    secure:true,
    sameSite:"none",
    maxAge: 60*60*1000
  })
  
  res.json({ message: "Hello World!" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
