import { useEffect, useState } from 'react'

import './App.css'

function App() {
  const [filesFromServer,setFilesFromServer] = useState([]);
  const [progress,setProgress]=useState(0);
  const [api,setApi]=useState('http://192.168.0.5/');
  async function getFilesFromServer(url)
  {
      const response= await fetch(url);
      const data = await response.json();
      setFilesFromServer(data);
  }

  useEffect(()=>{
    getFilesFromServer(api);
  },[api]);

  function openFile(fileOrNot,item){

      const tempApi=api+item+'/';
      setApi(tempApi);

      // console.log(api);

  }

  function handleFileChange(e){
    const file=e.target.files[0];
    const xhr= new XMLHttpRequest();
    xhr.open('POST',api,true);
    xhr.setRequestHeader("filename",file.name);
    xhr.addEventListener('load',()=>{
      console.log(xhr.response);
      getFilesFromServer(api);
    })
    xhr.upload.addEventListener('progress',(e)=>{
        const totalProgress= ((e.loaded/e.total)*100).toFixed(2);
        console.log(totalProgress);
        setProgress(totalProgress);

    })

    xhr.send(file);



  }

  async function handleDelete(file){
      const response=await fetch(api,{
        method:'DELETE',
        body: file,
      })
      const data= await response.text();
      console.log(data);
      getFilesFromServer(api);
  }

  // {
  //   console.log(api);
  // }

  return (
    <div className='container mx-auto'>

      <h1 className='text-red-400 text-3xl mb-7'>My Files</h1>

      <input type="file" onChange={handleFileChange} />
      <p>Uploded: {progress}%</p>
      {
        filesFromServer.map((item,key)=>{

           const fileOrNot= item.split('.');
         return (
         <div key={key} className='space-x-7 flex'>
              <div >
                  <p>{item}</p>
              </div>
              <div className='space-x-2 text-blue-500'>
                  
                  {
                    fileOrNot.length >=2 ? 
                    <a href={`${api+item}?action=open`}>Open</a> : 
                    <button onClick={()=>openFile(fileOrNot,item)}>Open</button>
                  }
                  <a href={`http://192.168.0.2/${api+item}?action=download`}>{fileOrNot.length>=2 ? 'Download' : ''}</a>

                  <button className='text-white bg-red-600 p-1 rounded-lg' onClick={()=>handleDelete(item)}>Delete</button>
                  
               </div>
          </div>
          
            
          
        )})
      }
     
    </div>
  )
}

export default App
