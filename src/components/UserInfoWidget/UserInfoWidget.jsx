import React from 'react'
import UserInfoBox from './UserInfoBox'
import ChatPopUpWidget from '../ChatWidget/ChatPopUpWidget.jsx';


const UserInfoWidget = ({userData, ...props}) => {
  return (
            <div className='user-info-widget'>

        <UserInfoBox userData={userData} />
        <ChatPopUpWidget userData={userData}
         userPopup={userData}/>
         </div>
    
  )
}

export default UserInfoWidget