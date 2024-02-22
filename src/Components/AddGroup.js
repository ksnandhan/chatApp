import React, {useState, useEffect} from 'react'

const AddGroup = () =>{

    const [users, setUsers] = useState(["pooka"]); 

    useEffect(() =>{
        fetch("https://albqy007z7.execute-api.us-east-1.amazonaws.com/dev/users", {
       header: {
         "content-type": "application/json",
         
       },
     })
       .then((resp) => {
         const data= resp.json();
         return data; 
       }).then(async (response) => {
        const responseData = JSON.parse(response.body);
        console.log(responseData); 
        
        //  responseData.users.map(
        //    (user) => {
        //     setUsers((prevPeople) => [...prevPeople, user.userName])
        //   });
        setUsers(responseData.response.users); 

       })
       .catch((error) => {
         console.log(error);
       });
    }, [])

    return(
        <div>
            
            {
               users &&  users.map((item, i) => (
                    
                    <span>{item.userName} <br/> </span>
                ))
            }
        </div>
    )

}

export default AddGroup; 