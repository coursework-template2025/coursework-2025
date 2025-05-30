import { useState, useEffect } from "react";

function Time() {
    const [timez,setTimez] = useState("00:00");
    useEffect(()=>{
        setInterval(()=>{
            let date = new Date();
            let hour = `${date.getHours()}`;
            let minute = `${date.getMinutes()}`;
            let second = `${date.getSeconds()}`;
            if (date.getHours() < 10) hour = "0"+date.getHours();
            if (date.getMinutes() < 10) minute = "0"+date.getMinutes();
            if (date.getSeconds() < 10) second = "0"+date.getSeconds();
            setTimez(hour+':'+minute)
        },1000)
    },[])

    return (
        <div className="Time">
            <h2 align="center">Время</h2>
            <h3 align="center"> {timez}</h3>
        </div>
    );
}

export default Time;