import React, { useEffect } from 'react'
import {TabPanel,  TabButtons } from '../Tabs/TabPanel';
import './ChatPopUpWidget.css'

const tabmessages = [
    {
        user: 'John Doe',
        messages: [ 
            {   
                type: 'sent',
                time: Date.now() - 10000,
                text: 'Hello, how are you?',
            }, 
            {
                type: 'received',
                time: Date.now() - 5000,
                text: 'I\'m doing well, thanks!',
            }
        ] 
    },
    { 
        user: 'Jane Doe',
        messages: [
            {
                type: 'received',
                time: Date.now() - 10000,
                text: 'Hello, how are you?',
            },
            {
                type: 'sent',
                time: Date.now() - 5000,
                text: 'I\'m doing well, thanks!' 
            },
        ]
    }
];
const ChatPopUpWidget = ({userData, userPopup, ...props}) => {
    const [userMessages, setUserMessages] = React.useState(tabmessages);

    useEffect(() => {
        console.log('useEffect');
        console.log('userPopup', userPopup);
        console.log('userData', userData);
        if (userPopup && userPopup.messages) {
            console.log('userPopup.messages', userPopup.messages);
            setUserMessages(userPopup.messages);            
        }
    }, [userData, userPopup])
        
    const fetchMessages = (id) => {
        
        fetch(`http://localhost:3000/api/messages/receive/${userPopup.id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'user-key': document.cookie.split(';').filter(cookie => cookie.trim().startsWith('user-key=')).at(0).replace('user-key=', '').trim()
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            setUserMessages(data);
        })
        .catch((error) => {
            console.error('Error:', error);
        })
    }
    const handleSendMessage = (input) => {
        console.log('handleSendMessage ', input);
        console.log('send to server from user: ', 
            userData);
            
        console.log('send to server to user: ',
            userPopup
        )

            // Handle sending the message
        console.log('send message to server');
        const newUserMessages = userMessages.filter(message => message.user === userPopup.username);
        console.log('newUserMessages', newUserMessages);
        if (newUserMessages.length > 0) {
            newUserMessages[0].messages.push({ type: 'sent', time: Date.now(), text: input });
        }
        else {
            userMessages.push({ user: userPopup.username, messages: [{ type: 'sent', time: Date.now(), text: input }] });
        }
        setUserMessages((messages) => ([...messages, { user: userData.username, messages: input }]))
        //userData.sendChatMessage(userPopup.id, input);
    };

    
    const handleClosePopUp = (e) => {}
    
    const handleCloseTab = (e) => {}

    // const userTabData = {
    //     id: 1,
    //     username: 'John Doe'
    // }      
    return (
    <div className="chat-popup">
        <ChatPopUpHeader  handleClose={handleClosePopUp}/>
        
        <ChatTabContainer userMessages={userMessages} 
            handleSendMessage={handleSendMessage}
            handleCloseTab={handleCloseTab}/>
                                                                                        
    </div>
  )
}

const ChatPopUpHeader = ({title, handleClose}) => { 

    return (
        <div className="chat-popup-header">
            <h3>{title}</h3>
            <button onClick={handleClose}>X</button>
        </div> 
    )
}


const ChatTabContainer = ({ 
    userMessages, handleCloseTab, handleSendMessage, ...props 
}) => { 

    const [activeTab, setActiveTab] = React.useState(0);

    const handleTabClick = (index) => {
        console.log('handleTabClick', index);
        setActiveTab(index);
    }


    const handleClose = (e) => {
        handleCloseTab(e);
    }
    
    const handleSend = (input) => {
        handleSendMessage(input);
    }

    return (
        <div className="chat-tabs-container">
            {
                userMessages &&
                //.map((usermessage, index) => {
                <>
                    {/*
                    <TabButtons list={userMessages} 
                                activeTab={activeTab}
                                setActiveTab={setActiveTab}
                    />
                    */}

                    <TabPanel tabData={userMessages} 
                        activeTab={activeTab}
                        setActiveTab={handleTabClick}
                    >
                        <ChatMessageTab
                            messages={userMessages[activeTab].messages}
                            user={userMessages[activeTab].user} 
                            handleCloseTab={handleClose}
                            handleSendMessage={handleSend}
                        />
                    </TabPanel>
                </>
                            
                }
            
        </div> 
    )
}
const ChatMessageTab = ({ messages, user, handleCloseTab, handleSendMessage ,...props }) => 
{   
    
    const handleSend = (input) => {
        
        console.log('handleSend ', input);
            // Handle sending the message
        handleSendMessage(input);
    }
    return (
        <div className="chat-container">
            <ChatPopUpHeader  user={user} handleClose={handleCloseTab} />
            <ChatMessages messages={messages} />
            <SubmitMessage handleSendMessage={handleSend}
        />
        </div>
    )       
}

const SubmitMessage  = ({handleSendMessage}) => {
    const [input, setInput] = React.useState('');
    const handleInput = (e) => {
        setInput(e.target.value);
    }
    const handleSend = () => {

        if (input) {
            handleSendMessage(input);
            setInput('');
        }
        
    }  
    return (
            <div className="message-input" >
                <input type="text"
                 placeholder="Type a message..." 
                 value={input} 
                 onChange={handleInput} 
            />
                <button onClick={handleSend}>Send</button>
            </div>
        )
}

const ChatMessages = ({messages}) => {
    
    return (
    <div className="chat-messages">
        <div className="chat-message">
            {
            messages.map((message, index) => {
       
                return <Message 
                    key={index} 
                    type={message.type}
                    text={message.text}
                    sender={message.sender}
                    time={message.time}
                />
            })
            }
        </div>
              </div>
    )
}
const Message = ({sender, text, time, type}) => 
<div className="message">

    <div className="message-type" style={{
        color: type === 'sent' ? 'blue' : 'green',
        textAlign: type === 'sent' ? 'right' : 'left'
    }}>
        <span className='message-type'>{type} :</span>
    <span className="message-sender">{sender}:</span>
    <span className="message-time">{time}</span>
    <span className="message-text">{text}</span>
    </div>
</div>
   
export default ChatPopUpWidget