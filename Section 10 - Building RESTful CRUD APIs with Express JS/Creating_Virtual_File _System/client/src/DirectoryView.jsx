import { useEffect, useState } from 'react'
import { Link, useParams } from "react-router-dom";
import './App.css'




function DirectoryView() {
  const BASE_URL= 'http://localhost:4000';
  // const [filesFromServer,setFilesFromServer] = useState([]);
  const [directoriesList , setDirectoriesList] = useState([]);
  const [filesList , setFilesList] = useState([]);

  const [progress,setProgress]=useState(0);
  const [renameFile,setRenameFile]=useState("");
  const [renameOption, setRenameOption]=useState("");
  const [newDirName,setNewDirName]=useState("");
  const {dirID} = useParams();
  console.log(dirID);
  //const [api,setApi]=useState('http://192.168.0.8:4000');
  async function getFilesFromServer()
  {
      const response= await fetch(`${BASE_URL}/directory/${dirID || ""}`);
      const data = await response.json();
      setDirectoriesList(data.directories);
      setFilesList(data.files);
      console.log(directoriesList)
      console.log(data);
  }

  useEffect(()=>{
    getFilesFromServer();
  },[dirID]);

  // function openFile(fileOrNot,item){

  //     const tempApi=api+item+'/';
  //     setApi(tempApi);

  //     // console.log(api);

  // }

  async function handleCreateDir() {
      const response= await fetch(`${BASE_URL}/directory/${dirID || ""}`,{
        method:'POST',
        headers:{
          dirname: newDirName
        }
      });
      const data = await response.json();
      console.log(data);
      setNewDirName("");
      getFilesFromServer();
    
  }
  function handleFileChange(e){
    const file=e.target.files[0];
    const xhr= new XMLHttpRequest();
    xhr.open('POST',`${BASE_URL}/file/${dirID || ""}`,true);  
    xhr.setRequestHeader("filename", file.name) ;  
    xhr.addEventListener('load',()=>{
      console.log(xhr.response);
      getFilesFromServer();
    })
    xhr.upload.addEventListener('progress',(e)=>{
        const totalProgress= ((e.loaded/e.total)*100).toFixed(2);
        console.log(totalProgress);
        setProgress(totalProgress);

    })

    xhr.send(file);



  }

  async function handleDelete(id){

    const confirmDelete = window.confirm('Are you sure to delete this file?');
    if(confirmDelete)
    {
      const response=await fetch(`${BASE_URL}/file/${id}`,{
        method:'DELETE',
      })
      const data= await response.json();
      console.log(data);
      if(data.OK)
      {
        alert("File deleted successfully!!");
      }
      else
      {
        alert("File not found.");
      }
    }
      
      getFilesFromServer();
  }


  async function handleDeleteDir(id){

    const confirmDelete = window.confirm('Are you sure to delete this file?');
    if(confirmDelete)
    {
      const response=await fetch(`${BASE_URL}/directory/${id}`,{
        method:'DELETE',
      })
      const data= await response.json();
      console.log(data);
      if(data.OK)
      {
        alert("File deleted successfully!!");
      }
      else
      {
        alert("File not found.");
      }
    }
      
      getFilesFromServer();
  }

  // {
  //   console.log(api);
  // }

  function handleRenameButtonClick(file){
    if(!renameOption)
    {
      setRenameOption(file);
      setRenameFile(file);
      
    }
    else
      {
        if(renameOption==file)
          setRenameOption("");
        else
        {
          setRenameOption(file);
          setRenameFile(file);
          //console.log(file);
        }
        
      }
  }

  async function saveFileName(id){

    // console.log(fileName,renameFile);
    const response = await fetch(`${BASE_URL}/file/${id}`, {
      method: "PATCH",
      body: JSON.stringify({newFilename: renameFile}),
      headers: {
        "Content-Type" : "application/json"
      }
    });
    const data = await response.text();
    console.log(data);
    setRenameFile("");
    getFilesFromServer();

  }
  return (
    <div className='container mx-auto'>

      <h1 className='text-red-400 text-3xl mb-7'>My Files</h1>

      <input type="file" onChange={handleFileChange} />
      
      <p>Uploded: {progress}%</p>

      <form action="" className='space-x-2 ' onSubmit={handleCreateDir}>
        <input type="text" onChange={(e)=> setNewDirName(e.target.value)} className='border-gray-500 border p-1 text-black rounded-md'/>
        <button type="submit" className='bg-green-500 p-1 rounded-md text-white'>Create Folder</button>
      </form>
   
      <div className='space-y-2'>
      {
        directoriesList?.map(({name,id})=>{

          return (
            <div key={id} className='space-x-7 flex'>
                <div >
                    <p>{name}</p>
                </div>
                <div className='space-x-2 text-blue-500'>
                    
                    <Link to={`/directory/${id}`} >Open</Link>          

                    <button className='text-white bg-red-600 p-1 rounded-lg' onClick={()=>handleDeleteDir(id)}>Delete</button>
                    <button className='text-white bg-blue-500 p-1 rounded-lg' onClick={()=> handleRenameButtonClick(name)}>Rename</button>

                    <input className={`border-gray-500 border p-1 text-black ${renameOption!=name && "hidden"}  rounded-md` }type="text"  value={renameFile} onChange={(e)=> {setRenameFile(e.target.value);  }}/>
                    <button disabled={!renameFile ? true : false} className={`text-white ${renameOption!=name && "hidden"} bg-green-500 ${!renameFile && "bg-green-200"} px-2 py-1  rounded-lg` } onClick={() => saveFileName(id)}>Save</button>
                    

                </div>
            </div>
          )
        })
      }
      {
          filesList?.map(({name,id})=>{

            //const fileOrNot= item.split('.');
          return (
          <div key={id} className='space-x-7 flex'>
                <div >
                    <p>{name}</p>
                </div>
                <div className='space-x-2 text-blue-500'>
                    
                    <a href={`${BASE_URL}/file/${id}`}>Open</a> 
                    
                    <a href={`${BASE_URL}/file/${id}?action=download`}>Download</a>

                    <button className='text-white bg-red-600 p-1 rounded-lg' onClick={()=>handleDelete(id)}>Delete</button>
                    <button className='text-white bg-blue-500 p-1 rounded-lg' onClick={()=> handleRenameButtonClick(name)}>Rename</button>

                    <input className={`border-gray-500 border p-1 text-black ${renameOption!=name && "hidden"}  rounded-md` }type="text"  value={renameFile} onChange={(e)=> {setRenameFile(e.target.value);  }}/>
                    <button disabled={!renameFile ? true : false} className={`text-white ${renameOption!=name && "hidden"} bg-green-500 ${!renameFile && "bg-green-200"} px-2 py-1  rounded-lg` } onClick={() => saveFileName(id)}>Save</button>
                    

                </div>
            </div>
            
              
            
          )})
      }
      </div>
     
    </div>
  )
}

export default DirectoryView;
