const{num}=loadModule('./math.js');



function loadModule(path){
    const fs=require('fs');
    const fileContent=fs.readFileSync(path).toString();
    //  console.log(fileContent);

    return (function (send){
        eval(fileContent);
        return send;
    })({})
}