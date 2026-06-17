import React, { use } from "react";
import Tarjeta from "../componentes/tarjeta/tarjeta";
import { useNavigate } from "react-router";

function Login(){

const navigate = useNavigate()

    function  onLogin(){
        navigate('/mesas')
    }
    return<>
    <Tarjeta  onLogin={onLogin}/>
    </>
}

export default Login