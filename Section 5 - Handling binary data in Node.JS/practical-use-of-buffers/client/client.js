fetch("http://localhost:3000/",{
    method:"POST",
    body:'abcfd',
})
.then(res=> res.text())
.then(data=> console.log(data))