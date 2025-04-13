import { toast } from "react-toastify";


 export  const handelSucess=(msg)=>{
       toast.success(msg,{
          position:'top-right'
       })
 }
 export  const handelErros=(msg)=>{
    toast.error(msg,{
       position:'top-right'
    })
}