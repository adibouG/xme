import React from 'react'
import './UserInfoBox.css'
import def from './assets/avatar_def.png'

const UserInfoBox = ({userData, isLoggedDevice, ...props}) => {
    console.log('UserInfoBox userData ', userData);
    console.log('UserInfoBox isLoggedDevice',   isLoggedDevice);
  return (
      <div className="user-info-box">

        <div className="user=status">
        </div>

        <div className="user-header"> 
            <div className="user-picture-wrapper">
                <img src={userData?.avatar || def} className='user-avatar' alt={userData.username} />
            </div>
            <div className="user-name">{userData.username}</div>
        </div>
        <div className="user-info">
            <span className="user-preference">{userData?.userData.preference.channels}</span>
            <span className="user-categories">{userData?.userData.preference.categories}</span>
        </div>

    </div>
  )
} 

export default UserInfoBox