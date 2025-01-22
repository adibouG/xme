import React from 'react'
import './UserInfoBox.css'
import './assets/avatar_def.png'

const UserInfoBox = ({userData, isLoggedDevice, ...props}) => {
    console.log('UserInfoBox userData ', userData);
    console.log('UserInfoBox isLoggedDevice',   isLoggedDevice);
  return (
      <div className="user-info-box">

        <div className="user=status">
        </div>

        <div className="user-header"> 
            <div className="user-picture-wrapper">
                <img src={userData?.picture} className='user-avatar' alt={userData.username} />
            </div>
            <div className="user-name">{userData.username}</div>
        </div>
        <div className="user-info">
            <span className="user-preference">{userData?.preference}</span>
            <span className="user-categories">{userData?.categories}</span>
        </div>

    </div>
  )
} 

export default UserInfoBox