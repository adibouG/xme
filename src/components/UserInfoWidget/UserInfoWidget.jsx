import React from 'react'
import {UserInfoBox} from './UserInfoBox'


const UserInfoWidget = ({userData, ...props}) => {
  return (
    <>
        <div className='user-info-widget'>UserInfoWidget</div>
        <UserInfoBox userData={userData} />
    </>
  )
}

export default UserInfoWidget