const response = await fetch('http://localhost:4000',{
    credentials:"include"
});

const data = await response.json();

console.log(data);