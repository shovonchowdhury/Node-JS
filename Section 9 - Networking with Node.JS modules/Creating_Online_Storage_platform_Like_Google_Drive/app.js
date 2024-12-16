import { open, readdir, readFile } from 'node:fs/promises';
import http from 'node:http';
import mime from 'mime-types';
import { Stats } from 'node:fs';

const server=http.createServer(async(req,res)=>{

    const URL=req.url;

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
                let dynamicHtml="";

                itemList.forEach((item)=>{
                    const fileOrNot= item.split('.');
                    console.log(fileOrNot)
                    
                    const anchorUrl=actualUrl+(actualUrl=='/' ? "" : '/') +item;
                    dynamicHtml+=`
                    <div style="display: flex; align-items: center;">
                        <div>
                            <p style="margin-right: 30px;">${item}</p>
                        </div>
                        <div>
                            <a href="${anchorUrl}?action=open">Open</a>
                            <a href="${anchorUrl}?action=download">${fileOrNot.length>=2 ? 'Download' : ''}</a>
                        </div>
                    </div>`
                })

                const htmlBoilerPlate=await readFile("./boilerplate.html",'utf-8');
                res.end(htmlBoilerPlate.replace("dynamicHTML", dynamicHtml));
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
});

server.listen(80,'0.0.0.0',()=>{
    console.log('Server Started...');
})