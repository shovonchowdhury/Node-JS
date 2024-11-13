import fs from 'node:fs/promises';
const path=process.argv[2];
const inputWord=process.argv[3]?.toLowerCase();


const content=await fs.readFile(`./${path}`,'utf-8');


const contentArray=content.split(/[^\w]/i).filter(word=> word);
// console.log(contentArray)

const wordsCount={};
contentArray.forEach(word => {

    const case_Insensitive_word=word.toLowerCase();
    
    if(wordsCount[case_Insensitive_word])
        wordsCount[case_Insensitive_word]++;
    else
        wordsCount[case_Insensitive_word]=1;
});

inputWord ? console.log(`${inputWord} : ${wordsCount[inputWord]}`) : console.log(wordsCount);