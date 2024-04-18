import React, { useState, useEffect } from 'react'
import { Alert, Button } from '@mui/material';
import ListItemText from '@mui/material/ListItemText';
import { TfiReload } from "react-icons/tfi";
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { PiChatsCircleFill } from "react-icons/pi";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Paper from '@mui/material/Paper';
import { connect } from 'react-redux';
import { MdGroups } from "react-icons/md";
import { IoPersonSharp } from "react-icons/io5";
import { FaUserGroup } from "react-icons/fa6";
import { IoSend } from "react-icons/io5";
import './Chats.css'
import AddGroup from '../Components/AddGroup';
import Axios from 'axios';
var socket;
var cUser = "";
var cType = "";
var thisname;
var channelClient;
var channel;
var list = [];
const Chats = () => {
    const [isConnected, setIsConnected] = useState(false);
    const [name, setName] = useState("");
    const [currentUser, setCurrentUser] = useState("");
    const [people, setPeople] = useState([]);
    const [message, setMessage] = useState("");
    const [rows, setRows] = useState([]);
    const [newRows, setNewRows] = useState([]);
    const [newGroup, setNewGroup] = useState([]);
    const [setGroup, setSetGroup] = useState(false);
    //  const [socket, setSocket] = useState(); 
    const [privateUsers, setPrivateUsers] = useState([]);
    const [groups, setGroups] = useState([]);
    const [rel, setRel] = useState(false);
    const [channels, setChannels] = useState([]);
    const [isuserIconSelected, setIsUserIconSelected] = useState(false);
    const [isgroupIconSelected, setIsGroupIconSelected] = useState(false);
    const [ischannelIconSeleccted, setIsChannelIconSelected] = useState(false);
    const [list, setList] = useState([]);
    const [isPresent, setIsPresent] = useState(false);
    var [currentChannel, setCurrentChannel] = useState('');
    const [channelMessages,setChannelMessages]=useState([]);
    const [newChannelRows,setNewChannelRows]=useState([]);
    const [userIsSended,setUserIsSended]=useState(false);
    useEffect(() => {
        fetch("https://albqy007z7.execute-api.us-east-1.amazonaws.com/dev/users", {
            header: {
                "content-type": "application/json",

            },
        })
            .then((resp) => {
                //console.log(resp);
                const data = resp.json();

                //  console.log(data);
                return data;
            }).then((response) => {
                //console.log(response.body); 
                const responseData = JSON.parse(response.body);
                // console.log(responseData);
                setPeople([]);
                setNewGroup([]);
                console.log(responseData.response);
                console.log(responseData.response.users);
                console.log(responseData.response.groups);

                responseData.response.users.map(
                    (user) => {
                        setPeople((prevPeople) => [...prevPeople, [user.userName, "private"]])
                    });

                responseData.response.groups.map(
                    (user) => {
                        var isPart = false;
                        user.userName.map((one) => {
                            if (one == thisname) isPart = true;
                        })
                        if (isPart) setNewGroup((prevPeople) => [...prevPeople, [user.groupName, "group"]])
                    });
                // console.log(usernames);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [rel])
   
    const Reload = () => {
        setRel(!rel);
        setIsUserIconSelected(true);
        setIsGroupIconSelected(false);
        setIsChannelIconSelected(false);
    };

    const goBack = () => {
        setSetGroup(false);
    }

    var props = {
        members: ["shiva", "chetan", "nidhi"],
        chatRows: [<span> Hey man, {name}</span>],
        onPublicMessage: () => { },
        onPrivateMessage: (string) => { },
        onConnect: () => { },
        onDisconnect: () => { },
    };


    const connectUser = async () => {
        var user = prompt("enter your name");
        if (user == "") { alert("username cannot be empty"); return; }


        setName(user);
        thisname = user;

        if (user == null) { alert("username cannot be empty!"); window.location.reload(); }
        socket = new WebSocket(
            `wss://vg18u726oi.execute-api.us-east-1.amazonaws.com/production/?userName=${user}`
        );

        channelClient = new WebSocket('ws://54.82.101.215:8089');

        channelClient.onopen = () => {
            console.log('ws opened on browser')
        }

        channelClient.onmessage = (message) => {
            setChannels([]);
            // console.log(message.data);
            // console.log(JSON.parse(message.data));
            var response = JSON.parse(message.data);
            var {type,message,data,channel}=response;
            // console.log(type);
            // console.log(response);
             
            if (type=='channels') {
                data.map((item) => {
                    //console.log(item);
                    setChannels((prevChannels) => [...prevChannels, item]);
                })
            }
            if(type=='private'){
                getAllChannels();
                try{
                 const resp=JSON.parse(data);
                var {user,message}=resp;
                console.log(data);
                setNewChannelRows((prevRows)=>[...prevRows,[message,channel,user]]);
                setChannelMessages((prevChannelMessages)=>[...prevChannelMessages,[message,channel,user]])
                setUserIsSended(false);
                }
                catch(error){
                    alert('sended message is not valid Json string');
                    return;
                }
                
            }

        }

        socket.addEventListener("open", async (event) => {
            console.log("WebSocket connection opened:", event);
            const userName = user; // Assuming it's directly provided in the query string

            //console.log("Connected user:", userName);
            alert("Connection opened!");
            console.log(socket)


        });

        socket.addEventListener("message", async (event) => {
            const data = JSON.parse(event.data);
            if (data.from == cUser && data.Type == "private") setNewRows((prevRows) => [...prevRows, [data.from, name, data.from + ": " + data.message]])

            if (data.to == cUser && data.Type == "group" && data.from != thisname)
                setNewRows((prevRows) => [...prevRows, [data.from, name, data.from + ": " + data.message]])

            console.log(cUser);
            console.log(data);
            //  setCurrentUser(data.from);   

        });


        setIsConnected(true);
    };

    const sendMessage = () => {

        if (currentUser == "") { alert("Please select any user to send message"); return; }

        const messageObject = {
            action: "sendmessage",
            message: message,
            to: cUser,
            from: name,
            Type: cType
        };

        const jsonMessage = JSON.stringify(messageObject);
        console.log(jsonMessage);
        console.log(socket)
        socket.send(jsonMessage);
        setNewRows((prevRows) => [...prevRows, [name, currentUser, "You: " + message]])


    }

    const createGroup = () => {

        setSetGroup(true);



    }
    const userSelected = () => {
         setNewRows([]);
        // fetch('https://albqy007z7.execute-api.us-east-1.amazonaws.com/dev/users?key=users').then((data)=>{
        //   console.log(data);
        // })
        Axios.get('https://albqy007z7.execute-api.us-east-1.amazonaws.com/dev/users', {
            params: {
                key: "users"
            }
        }).then((response) => {
            const responsedata = JSON.parse(response.data.body);
            //console.log(responsedata.users);
            setPrivateUsers([]);
            responsedata.users.map((user) => {
                setPrivateUsers((prevPrivateUsers) => [...prevPrivateUsers, [user.userName,"private"]]);
            })
            console.log(privateUsers);
            setIsUserIconSelected(true);
            setIsGroupIconSelected(false);
            setIsChannelIconSelected(false);
        })
    }
    const groupSelected = () => {
        setGroups([]);
        setNewRows([]);
       // console.log("hi");
        Axios.get('https://albqy007z7.execute-api.us-east-1.amazonaws.com/dev/users', {
            params: {
                key: "groups"
            }
        }).then((response) => {
            //console.log(response);
            const responsedata = JSON.parse(response.data.body);
            console.log(responsedata);
            responsedata.groups.map((group) => {
                setGroups((prevGroups) => [...prevGroups, [group.groupName,"group"]]);
            })
            //console.log(groups);
        })
        setIsUserIconSelected(false);
        setIsGroupIconSelected(true);
        setIsChannelIconSelected(false);
    }
    const channelSelected = async () => {
         setNewRows([]);
        await channelClient.send(JSON.stringify({
            type: "getChannels",
        }))

        console.log(channels);
        setIsUserIconSelected(false);
        setIsGroupIconSelected(false);
        setIsChannelIconSelected(true);
    }
  
    const getAllChannels = async ()=>{
        await channelClient.send(JSON.stringify({
            type: "getChannels",
        }))

        console.log(channels);
        setIsUserIconSelected(false);
        setIsGroupIconSelected(false);
        setIsChannelIconSelected(true);
    }
    const subsribeChannel = () => {

        const channel = prompt('enter channel name');
        setList((prevList) => [...prevList, channel]);
        if (channel == "") { alert("channelname cannot be empty"); return; }
        channelClient.send(JSON.stringify({
            type: "subscribe",
            channelName: channel
        }))
        console.log(channel);
    }

    const JoinChannel = () => {
        if(currentChannel==''){
            alert('channel name cannot be empty');
            return;
        }
        channelClient.send(JSON.stringify({
            type: "subscribe",
            channelName: currentChannel
        }))
        alert('joined channel successfully');
        setIsPresent(true);
        setList((prevList) => [...prevList, currentChannel]);
    }
    const publishMessage=()=>{
        const JsonData={
            user:name,
            message:message
        }
        console.log(JSON.stringify(JsonData))
        channelClient.send(JSON.stringify({
            type: "publish",
            channelName: currentChannel,
            mess:JSON.stringify(JsonData),
            sendedByUser:true
        }))

    }
    const getChannelMessages=async()=>{
        setNewChannelRows([]);
        channelMessages.map((item,i)=>{
            if(item[1]==currentChannel){
                setNewChannelRows((prevRows)=>[...prevRows,item]);
            }
        })
        //console.log(newRows);
    }
    const getMessages = () => {
        fetch("https://740ntxty9d.execute-api.us-east-1.amazonaws.com/dev/messages", {
            header: {
                "content-type": "application/json",

            },
        })
            .then((resp) => {
                const data = resp.json();
                return data;
            }).then((response) => {
                const responseData = JSON.parse(response.body);
                //console.log(responseData);
                setNewRows([]);
                responseData.messages.map(
                    (rowss) => {
                        if ((rowss.to == currentUser && rowss.from == name))
                            setNewRows((prevRows) => [...prevRows, [rowss.from, rowss.to, "You: " + rowss.message]])

                        if (rowss.to == name && rowss.from == currentUser && rowss.Type == "private")
                            setNewRows((prevRows) => [...prevRows, [rowss.from, rowss.to, rowss.from + ": " + rowss.message]])

                        if (rowss.to == cUser && rowss.Type == "group" && rowss.from != thisname)
                            setNewRows((prevRows) => [...prevRows, [rowss.from, rowss.to, rowss.from + ": " + rowss.message]])



                    });

                // console.log(responseData);

            })
            .catch((error) => {
                console.log(error);
            });



    }

    // console.log(list);
   console.log(newRows);
    const disconnectUser = () => {
        //  setName("");
        //  setIsConnected(false);
        window.location.reload();


    };


    return (
        <>
            {isConnected && setGroup &&
                <div style={{ textAlign: "center" }}> <br /> <br /> <AddGroup user={thisname} goBack={goBack} /> <br /></div>}
            {!setGroup &&
                <div
                    style={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        backgroundColor: "#f4ede3",
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    <CssBaseline />
                    <Container maxWidth="lg" style={{ height: "90%" }}>
                        <Grid container style={{ height: "100%", background: "black" }}>
                            <Grid item xs={2}
                                style={{ backgroundColor: "#008000", color: "white", }}
                            >
                                <div component="nav" style={{
                                    height: "628px", overflowY: "auto", scrollbarColor: "green",
                                    marginTop: "10px", marginRight: '0px'
                                }}>
                                    {isConnected &&
                                        <div>
                                            <button style={{ marginLeft: '5px', marginRight: '0px' }} onClick={Reload} className='button-3'>
                                                <TfiReload size={15} />
                                            </button>
                                            <button style={{ marginRight: '15px' }} onClick={userSelected} className='button-3'>
                                                <IoPersonSharp size={20} />
                                            </button>
                                            <button style={{ marginRight: '15px' }} onClick={groupSelected} className='button-3'>
                                                <MdGroups size={24} />
                                            </button>
                                            <button style={{ marginRight: '0px' }} onClick={channelSelected} className='button-3'>
                                                <PiChatsCircleFill size={20} />
                                            </button>
                                        </div>
                                    }


                                    {isuserIconSelected && isConnected && privateUsers.map((item, i) => (
                                        (item[0] != name && <ListItem key={i}
                                            style={{ background: (currentUser == item[0]) ? "#138845" : "none" }}
                                            onClick={() => {
                                                setCurrentUser(item[0]);
                                                cUser = item[0];
                                                cType = item[1];
                                                getMessages();
                                            }}

                                            button
                                        >
                                            <div ><IoPersonSharp /> <ListItemText style={{ fontWeight: 800, paddingLeft: "5px", paddingTop: "3px", display: "inline-block" }} primary={item[0]} /></div>
                                        </ListItem>
                                        )

                                    ))
                                    }

                                    {isgroupIconSelected && isConnected && groups.map((item, i) => (

                                        (<ListItem key={i}
                                            style={{ background: (currentUser == item[0]) ? "#138845" : "none" }}
                                            onClick={() => {
                                                setCurrentUser(item[0]);
                                                cUser = item[0];
                                                cType = item[1];
                                                getMessages();
                                            }}

                                            button
                                        >
                                            <div ><FaUserGroup /> <ListItemText style={{ fontWeight: 800, paddingLeft: "5px", paddingTop: "1px", display: "inline-block" }} primary={item[0]} /></div>
                                        </ListItem>
                                        )

                                    ))
                                    }
                                    {ischannelIconSeleccted && isConnected && channels.map((item, i) => (
                                        (<ListItem key={i}
                                            style={{ background: (currentUser == item) ? "#138845" : "none" }}
                                            onClick={() => {
                                                if (list.includes(item)) {
                                                    setIsPresent(true);
                                                }
                                                else {
                                                    setIsPresent(false);
                                                }
                                                setCurrentUser(item);
                                                setCurrentChannel(item);
                                                cUser = item;
                                                cType = item;
                                                //getMessages();
                                                getChannelMessages();
                                            }}

                                            button
                                        >
                                            <div ><IoPersonSharp /> <ListItemText style={{ fontWeight: 800, paddingLeft: "5px", paddingTop: "3px", display: "inline-block" }} primary={item} /></div>
                                        </ListItem>
                                        )

                                    ))
                                    }
                                    {isConnected && ischannelIconSeleccted && (
                                        <button style={{ marginLeft: '30px' }} onClick={subsribeChannel}>Create a channel</button>
                                    )
                                    }
                                </div>
                            </Grid>
                            <Grid
                                style={{ position: "relative" }}
                                item
                                container
                                direction="column"
                                xs={10}
                            >
                                <Paper style={{ flex: 1 }}>
                                    <Grid
                                        item
                                        container
                                        style={{ height: "100%" }}
                                        direction="column"
                                    >

                                        <Grid item container style={{ flex: 1 }}>
                                            <ul
                                                style={{
                                                    paddingTop: 20,
                                                    paddingLeft: 44,
                                                    listStyleType: "none",
                                                }}
                                            >
                                                {isConnected && <span style={{ fontSize: "20px", fontWeight: "bold", textAlign: "center" }}>Welcome {name}, Good to have you </span>}
                                                {!ischannelIconSeleccted && newRows.map((item, i) => (
                                                    <li key={i} style={{ paddingBottom: 9 }}>
                                                        <span className={item[0] == name ? 'bubble-right' : 'bubble'}>{item[2]}</span>
                                                    </li>
                                                ))}
                                                {ischannelIconSeleccted && newChannelRows.map((item, i) => (
                                                    
                                                    <li key={i} style={{ paddingBottom: 9 }}>
                                                        <span className={item[2]==name ? 'bubble-right':'bubble'}>{(item[2]==name)?`You:${item[0]}`:`${item[2]}:${item[0]}`}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </Grid>


                                        <Grid item style={{ margin: 10 }}>
                                            {isConnected && isgroupIconSelected && (
                                                <>
                                                    <input type="text" style={{ display: "inline-block", marginBottom: "16px" }}
                                                        onChange={e => setMessage(e.target.value)} /> <button className='button-7'
                                                            onClick={sendMessage}> <IoSend style={{ marginBottom: "3px", marginTop: "-2px", width: "30px" }} />  </button>
                                                </>
                                            )}
                                            {isConnected && isuserIconSelected && (
                                                <>
                                                    <input type="text" style={{ display: "inline-block", marginBottom: "16px" }}
                                                        onChange={e => setMessage(e.target.value)} /> <button className='button-7'
                                                            onClick={sendMessage}> <IoSend style={{ marginBottom: "3px", marginTop: "-2px", width: "30px" }} />  </button>
                                                </>
                                            )}
                                            {isConnected && ischannelIconSeleccted && isPresent && (
                                                <>
                                                    <input type="text" style={{ display: "inline-block", marginBottom: "16px" }}
                                                        onChange={e => setMessage(e.target.value)} /> <button className='button-7'
                                                            onClick={() => {
                                                                publishMessage(); 
                                                                getAllChannels(); 
                                                            }}> <IoSend style={{ marginBottom: "3px", marginTop: "-2px", width: "30px" }} />  </button>
                                                </>
                                            )}
                                            {isConnected && !isPresent && ischannelIconSeleccted && (
                                                <>
                                                    <button style={{ width: '900px', marginBottom: '10px'}} className='button-7'
                                                        onClick={JoinChannel}>Join </button>
                                                </>
                                            )}

                                            {isConnected && (
                                                <Button
                                                    style={{ marginRight: 7 }}
                                                    variant="outlined"
                                                    size="small"
                                                    disableElevation
                                                    onClick={createGroup}
                                                >
                                                    Create New Group
                                                </Button>
                                            )}
                                            {isConnected && (
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    disableElevation
                                                    onClick={disconnectUser}
                                                >
                                                    Disconnect
                                                </Button>
                                            )}
                                            {!isConnected && (
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    disableElevation
                                                    onClick={connectUser}
                                                >
                                                    Connect
                                                </Button>
                                            )}
                                        </Grid>
                                    </Grid>
                                    <div
                                        style={{
                                            position: "absolute",
                                            right: 9,
                                            top: 8,
                                            width: 12,
                                            height: 12,
                                            backgroundColor: isConnected ? "#00da00" : "#e2e2e2",
                                            borderRadius: 50,
                                        }}
                                    />
                                </Paper>
                            </Grid>
                        </Grid>
                    </Container>
                </div>
            }
        </>

    );
};

export default Chats;