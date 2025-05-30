import { useEffect, useState } from "react";

const News = () => {
  const [news,setNews] = useState([]);
  let admin = false;
  if (localStorage.getItem("status") == "admin") admin = true;
  useEffect(()=>{
    fetch(`http://localhost:1337/api/getNews`)
    .then(res=>{return res.json()})
    .then(data=>{setNews(data)})
    .catch(err=>console.log(err))
  },[])
  return (
    <div className="right_side">
      <h1>Новости портала:</h1>
      <div className="news" style={{height:"100%"}}>
        {news.map((a)=> {return(
          <div className="block" style={{marginBottom:"2rem"}}>
            <h2>{a.head}</h2>
            <p style={{marginBottom:"1rem"}}>{a.body}</p>
            <h5>Автор: {a.author}</h5>
            <h5>Время создания: {Math.floor((Date.now()-a.created)/1000)} seconds ago</h5>
            <h5>Прикрепленные ссылки:</h5>
            {a.links.map((l)=>{
              return (
                <a href={l}>{l}<br/></a>
              )
            })}
            {admin ? 
              <div className="flex">
                <button><a href={`http://localhost:1337/api/editNew?id=${a.id}`}>Edit</a></button>
                <button><a href={`http://localhost:1337/api/deleteNew?id=${a.id}`}>Delete</a></button>
                <button><a href="/NewsForm">AddNew</a></button>
              </div>
            : <></>}
          </div>
        )})}
      </div>
    </div>
  )
};

export default News;