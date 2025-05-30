import { Outlet, Link } from "react-router-dom";
import { useEffect, useState } from "react";

const Layout = () => {
  document.body.style.background="rgb(220,220,220)";
  localStorage.setItem("opener","none");

  const [shown,setS] = useState("block");
  const [open,setO] = useState("0");

  useEffect(()=>{
    if(localStorage.getItem("userName")== null) {window.location.replace("/Login");}
  },[])
  const log_out = ()=>{
    localStorage.removeItem("userName");
    localStorage.removeItem("name");
    localStorage.removeItem("birth_date");
    localStorage.removeItem("faculty");
    localStorage.removeItem("status");
    localStorage.removeItem("group");
    localStorage.removeItem("picture");
    window.location.replace("/login");
  }
  const x = window.matchMedia("(max-width: 900px)");
  x.addEventListener("change",()=>{
    if (!x.matches) {
      setS("block");
    }
    else {
      setS("none");
    }
  })
  return (
    <div className="cont">
      <nav style={{display:shown}}> 
        <div className="cent">
            <img src={localStorage.getItem("picture")} className="us_icon"/>
            <h4>{localStorage.getItem("status")}</h4>
            <h4>{localStorage.getItem("name")}</h4>
            <h4>{localStorage.getItem("group")}</h4>
        </div>
        <ul className="Sidebar">
          <li>
            <Link to="/">Главная</Link>
          </li>
          <li>
            <Link to="/Personal">Профиль</Link>
          </li>
          <li>
            <Link to="/News">Новости</Link>
          </li>
          <li>
            <Link to="/Graph">Расписание</Link>
          </li>
          <li>
            <Link to="/Materials">Учебные материалы</Link>
          </li>
          <li>
            <a href="/" className="red" onClick={log_out}>Выйти</a>
          </li>
        </ul>
      </nav>
      <button className="opener" onClick={(e)=>{
        if (shown == "block") {
          e.target.style.left=open;
          e.target.style.left = "0";
          setS("none");
        } else {
          e.target.style.left=open;
          e.target.style.left = "14rem";
          setS("block");
        }
      }}></button>
      <Outlet />
    </div>
    
  )
};

export default Layout;