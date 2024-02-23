import React, {useState, useEffect} from 'react'
import './Chats.css'
import { MdDelete } from "react-icons/md";


const AddGroup = (props) =>{

    const [users, setUsers] = useState([]); 
    const [selectedUsers, setSelectedUsers] = useState([props.user]); 
    const [groupName, setGroupName] = useState(""); 

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

    const createGroup = () =>{

      

        const data = {
           groupName: groupName, 
           users: selectedUsers
        }

        const finalData = JSON.stringify(data); 

        console.log(finalData); 

        fetch('https://hib4xytkv8.execute-api.us-east-1.amazonaws.com/dev/group', {
          method: "PUT",
          header: {
            'Content-Type': 'application/json', 
          }, 
          body: finalData
        })
        .then((response) =>{
           if(response.ok){
             console.log("Resource updated successfully"); 
             alert("Group is Created successfully"); 
             props.goBack(); 
           }
           else {
            console.log("error updating resource", response.statusText);
           }
        }).catch(error => {
          console.log(error); 
        })

        
    }    

    

    const selectUser = (user) =>{

      var isThere = false; 

      selectedUsers.map((item) =>{
        if(item == user) {
          
          isThere = true; 
          // return; 
        }
    })

        if(isThere) {alert("User is already selected! "); }
        if(!isThere) setSelectedUsers((prevUsers) => [...prevUsers, user]); 
    }

    const deselectUser = (user) =>{

      setSelectedUsers((current) =>
      current.filter((fruit) => fruit !== user)
    );

    }

    return(
      <div>
        <div >
        <div style = {{display: "flex"}}>
          <div className='users'>
            <h1> Users </h1>
            {
              users &&  users.map((item, i) => (
                
                <span  onClick = {() => {selectUser(item.userName)}}>
                     <p className = 'userName'>{item.userName}</p>  
                    <br/><br/> </span>
                ))
              }
            </div>
            <div className='users'>
              <h1> Selected Users </h1>
            
              {
              selectedUsers &&  selectedUsers.map((item, i) => (
                
                <span >
                     <p className = 'userName' >{item}</p> 
                     {item!= props.user &&  <button style = {{background: "none", border: "none", cursor: "pointer", }} onClick = {() => {deselectUser(item)}}> <MdDelete size={20}/> </button>}
                    <br/><br/> </span>
                ))
              }
            <br/> 
            </div>
              
            <div style = {{marginLeft: "120px", marginTop: "60px"}}>
         <span >   <p style = {{marginLeft: "120px"}}>Group Name: </p> <input style = {{width: "300px"}}  onChange = { e => setGroupName(e.target.value)}/> </span> 

            <br/> <br/>
         <button style = {{marginLeft: "110px"}} className = 'button-6' onClick={createGroup}> Submit </button>
         <button style = {{marginLeft: "110px"}} className = 'button-6' onClick={props.goBack}> Go Back </button>
            <br/> 
            </div>

            </div>
            </div>
        
        </div>
    )

}

export default AddGroup; 