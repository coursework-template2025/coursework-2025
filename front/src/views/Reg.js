import { useState } from "react";
const Login = () => {
    document.body.style.background='rgb(30,30,30)'
    return (
        <div className="cont mid_align">
            <div className="form">
                <h2>Registration Form</h2>
                <laber for="name">Name</laber><br/>
                <input placeholder="name" type="text" name="name"/><br/>
                <laber for="password">Password</laber><br/>
                <input placeholder="password" type="password" name="password"/><br/>
                <laber for="password">Email</laber><br/>
                <input placeholder="@mail.com" type="text" name="email"/><br/>
                <h2></h2>
                <button>Register</button>
            </div>
        </div>    
    );
};

export default Login;