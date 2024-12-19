import { open, readdir, readFile, rm } from 'node:fs/promises';
import http from 'node:http';
import mime from 'mime-types';
import { createWriteStream, Stats } from 'node:fs';

const server=http.createServer(async(req,res)=>{

    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Methods","*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    const URL=req.url;
    console.log(URL);
    if(req.method=='GET')
    {
        if(URL=='/favicon.ico')
            {
                res.end('Not Found.');
            }
            else
            {
        
                let fileUrl="./storage";
        
                const [actualUrl,option]=decodeURIComponent(URL).split('?');
                fileUrl+=actualUrl;
                // console.log(actualUrl,option);
        
                const queryParams={};
                option?.split('&').forEach((pair)=>{
                    const [key,value]=pair.split('=');
                    queryParams[key]=value;
                })
        
                console.log(queryParams);
        
        
                try{
                    const fileHandle= await open(`${fileUrl}`);
                    const fileStat= await fileHandle.stat();
        
                    
        
                    if(fileStat.isDirectory())
                    {
                        const itemList=await readdir(`${fileUrl}`);
                        // let dynamicHtml="";
        
                        // itemList.forEach((item)=>{
                        //     const fileOrNot= item.split('.');
                        //     console.log(fileOrNot)
                            
                        //     const anchorUrl=actualUrl+(actualUrl=='/' ? "" : '/') +item;
                        //     dynamicHtml+=`
                        //     <div style="display: flex; align-items: center;">
                        //         <div>
                        //             <p style="margin-right: 30px;">${item}</p>
                        //         </div>
                        //         <div>
                        //             <a href="${anchorUrl}?action=open">Open</a>
                        //             <a href="${anchorUrl}?action=download">${fileOrNot.length>=2 ? 'Download' : ''}</a>
                        //         </div>
                        //     </div>`
                        // })
        
                        // const htmlBoilerPlate=await readFile("./boilerplate.html",'utf-8');
                        // res.end(htmlBoilerPlate.replace("dynamicHTML", dynamicHtml));
                        res.setHeader("Content-Type","application/json");
                        res.end(JSON.stringify(itemList));
                    }
                    else
                    {
                        const urlLevel=actualUrl.split('/');
                        const actualFile=urlLevel[urlLevel.length-1];
                        res.setHeader("Content-Type",mime.contentType(actualFile));
                        res.setHeader("Content-Length",`${fileStat.size}`);
                        if(queryParams.action=='download')
                        {
                               res.setHeader("Content-Disposition",`attachment;filename=${actualFile}`)
                        }
                        const readStrem=fileHandle.createReadStream();
                        readStrem.pipe(res);
                    }
                }
                catch{
                    res.end('Not Found.');
                }
                
            }
    }
    else if(req.method=='OPTIONS')
        res.end('OK');
    else if(req.method=='POST')
    {
        const writeStream= createWriteStream(`./storage${URL == '/' ? "" : URL}/${req.headers.filename}`);

        // console.log('post ashche');
        // let count = 0;
        // req.on("data", (chunk) => {
        // count++;
        // writeStream.write(chunk);
        // });

         req.pipe(writeStream);
        req.on('end',()=>{
            res.end("File uploaded on the server");
        })
    }
    else if(req.method === 'DELETE')
    {
        req.on('data',async(chunk)=>{
            try{
                const fileName = chunk.toString();
                await rm(`./storage${URL == '/' ? "" : URL}/${fileName}`)
                res.end("File deleted successfully");
            }
            catch(err){
                res.end(err.message);
            }
        })
    }

    
});

server.listen(80,'0.0.0.0',()=>{
    console.log('Server Started...');
})