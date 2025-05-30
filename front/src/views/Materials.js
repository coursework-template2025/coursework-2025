import { useEffect, useState } from "react";

const Materials = ()=> {
    let admin = false;
    const [list,setL] = useState();
    if (localStorage.getItem("status") == "admin") admin = true;
    const getM = async() => {
        await fetch('http://localhost:1337/api/getMaterials')
        .then(res=>res.json())
        .then(data=>{setL(data)})
        .catch(err=>console.log(err))
    }
    useEffect(()=>{
        getM();
    },[])
    return (
        <div className="right_side">
            <h1>Учебные материалы образовательного портала</h1>
            <div className="news">
                { list ? 
                    list.map((l)=>{
                        return(
                            <div className="block">
                                <h2>Курс: {l.Course}</h2>
                                <h4>{l.text}</h4>
                                <a href="/"><img src='document.png'/><br/>{l.file_name}</a>
                            </div>
                        )
                    }) : <></>
                }
            </div>
        </div>
        
    )
}
export default Materials;