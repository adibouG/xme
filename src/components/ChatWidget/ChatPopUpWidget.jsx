import React, { useEffect } from 'react'

const ChatPopUpWidget = ({userData, userPopup, ...props}) => {
    const [messages, setMessages] = React.useState([]);
    const [input, setInput] = React.useState('');

    useEffect(() => {
        console.log('useEffect');
        console.log('userPopup', userPopup);
        if (userPopup && userPopup.id) {
            console.log('userPopup.id', userPopup.id);
            console.log('userPopup.username', userPopup.username);
        }
        if (userPopup && userPopup.messages) {
            console.log('userPopup.messages', userPopup.messages);
            if (userPopup.messages.length) {
                setMessages(userPopup.messages);
            }
            else {
                setMessages([]);
                fetchMessages(userPopup.id);
            }
        }
    }, [])
        
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
            setMessages(data);
        })
        .catch((error) => {
            console.error('Error:', error);
        })
    }
    const handleSendMessage = (e) => {
        console.log('handleSendMessage ', input);
        console.log('send to server from user: ', 
            props.userData.id,
            props.userData.username,);
            
        console.log('send to server to user: ',
            props.userPopup.id,
            props.userPopup.username,
        )

            // Handle sending the message
    };

    const handleInputChange = (e) => {
        setInput(e.target.value);
    }
    
    const handleClosePopUp = (e) => {}
    
    const handleCloseTab = (e) => {}

    const tabmessages = [
            { sender: 'John Doe', text: 'Hello, how are you?' },
            { sender: 'Jane Doe', text: 'I\'m doing well, thanks!' },
          ];
    // const userTabData = {
    //     id: 1,
    //     username: 'John Doe'
    // }      
    return (
    <div className="chat-popup">
        <ChatPopUpHeader  handleClose={handleClosePopUp}/>
        
        <ChatTabContainer>

            <ChatMessageTab  messages={tabmessages} 
                user={userData}
                handleCloseTab={handleCloseTab} 
            />
        
        </ChatTabContainer>
    
        
        
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


const ChatTabContainer = (props) => { 

    return (
        <div className="chat-tab-container">
            {props.children}
        </div> 
    )
}
const ChatMessageTab = ({ messages, user, handleCloseTab }) => 
{
    const handleSendMessage = (e) => {}
    const handleInputChange = (e) => {}
    return (
        <div className="chat-message-tab">
            <ChatPopUpHeader  user={user} handleClose={handleCloseTab} />
            <ChatMessages user={user} messages={messages} />
            <SubmitMessage handleSendMessage={handleSendMessage} handleInputChange={handleInputChange} />
        </div>
    )       
}

const SubmitMessage  = ({handleSendMessage}) => {
    const [input, setInput] = React.useState('');
      
    return (
            <div className="message-input" >
                <input type="text" placeholder="Type a message..." value={input} onChange={setInput} />
                <button onClick={handleSendMessage}>Send</button>
            </div>
        )
}

const ChatMessages = ({user, messages}) => {
    
    return (
    <div className="chat-messages">
        <div className="chat-message">
            {messages.map((message, index) => (
                <Message key={index} message={message} />
            ))}
        </div>
              </div>
    )
}
const Message = ({sender, text}) => 
<div className="message">
            <span className="message-sender">John Doe:</span>
            <span className="message-text">Hello, how are you?</span>
        </div>
   
export default ChatPopUpWidget