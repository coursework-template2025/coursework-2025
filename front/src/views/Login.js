import { useState } from "react";
const Login = () => {
    document.body.style.background='rgb(30,30,30)';
    const [us, setUs] = useState("");
    const [pass, setPass] = useState("");
    const [check, setCheck] = useState("0")
    const func = async ()=>{
        await fetch(`http://localhost:1337/api/login?userName=${us}&password=${pass}`)
        .then(res=>{return res.json()})
        .then(data=>{
            if (data === null) {
                setCheck("1");
            } else {
                localStorage.setItem("userName",data.userame);
                localStorage.setItem("name",data.name);
                localStorage.setItem("birth_date",data.birth_date);
                localStorage.setItem("faculty",data.faculty);
                localStorage.setItem("status",data.status);
                localStorage.setItem("group",data.group);
                localStorage.setItem("picture",data.picture);
                window.location.replace("/");
            }
        })
        .catch(err => console.log(err))
    }
    return (
        <div className="cont cent" style={{flexWrap:"nowrap",flexDirection:"column"}}>
            <h2 style={{color:"white",zIndex:"1",position:"relative",top:"-2rem"}}>Страница авторизации</h2>
            <div className="form">
                <label>Имя</label><br/>
                <input placeholder="ivanovvlad1337" type="text" onChange={((e)=>{setUs(e.target.value)})}></input><br/>
                <label>Пароль</label><br/>
                <input placeholder="********" type="password" onChange={((e)=>{setPass(e.target.value)})}></input><br/>
                <label style={{color:"red",fontSize:"1.2rem",opacity:check}}>Не правильные данные</label><br/>
                <button type="button" onClick={func}>Enter</button><br/>
            </div>
        </div>
    );
};

export default Login;