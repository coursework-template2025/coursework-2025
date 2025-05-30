import { useEffect, useState } from "react";

const Graph = () => {
  const [list,setList] = useState({});
  const [sem,setSem] = useState("1");

  useState(async ()=>{
    await fetch(`http://localhost:1337/api/getGraph?group=${localStorage.getItem("group")}&semester=${sem}`)
    .then(res=>{return res.json()})
    .then(data=>{setList(data); console.log(data)})
  },[])
  const update = async (input) => {
    await fetch(`http://localhost:1337/api/getGraph?group=${localStorage.getItem("group")}&semester=${input}`)
    .then(res=>{return res.json()})
    .then(data=>{setList(data); console.log(data)})
  }
  return (
    <div className="right_side">
      <h2>Расписание для группы: {localStorage.getItem("group")}</h2>
      <div className="row">
        <button onClick={()=>{update("1")}} style={{borderRadius:"10px"}}>1 Семестр</button>
        <button onClick={()=>{update("2")}} style={{borderRadius:"10px"}}>2 Семестр</button>
      </div>
      <div className="home">
        <div className="block" style={{minWidth:"18rem"}}>
          <h4>Понедельник</h4>
          {
            Array.isArray(list.monday)? list.monday.map((a)=>{return (<p>{a}</p>)}) : null 
          }
        </div>
        <div className="block" style={{minWidth:"18rem"}}>
          <h4>Вторник</h4>
          {
            Array.isArray(list.tuesday)? list.tuesday.map((a)=>{return (<p>{a}</p>)}) : null 
          }
        </div>
        <div className="block" style={{minWidth:"18rem"}}>
          <h4>Среда</h4>
          {
            Array.isArray(list.wednesday)? list.wednesday.map((a)=>{return (<p>{a}</p>)}) : null 
          }
        </div>
        <div className="block" style={{minWidth:"18rem"}}>
          <h4>Четверг</h4>
          {
            Array.isArray(list.thursday)? list.thursday.map((a)=>{return (<p>{a}</p>)}) : null 
          }
        </div>
        <div className="block" style={{minWidth:"18rem"}}>
          <h4>Пятница</h4>
          {
            Array.isArray(list.friday)? list.friday.map((a)=>{return (<p>{a}</p>)}) : null 
          }
        </div>
      </div>
    </div>
  );
};

export default Graph;