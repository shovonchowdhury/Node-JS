function number(...digits){
    return digits.reduce((acc,curr,index)=> {
        if(curr=='a' || curr=='A')
            curr=10;
        if(curr=='b' || curr=='B')
            curr=11;
        if(curr=='c' || curr=='C')
            curr=12;
        if(curr=='d' || curr=='D')
            curr=13;
        if(curr=='e' || curr=='E')
            curr=14;
        if(curr=='f' || curr=='F')
            curr=15;
        return acc+curr*Math.pow(16,index);
    },0);
}

console.log(number('e',2,4,5,6,7));