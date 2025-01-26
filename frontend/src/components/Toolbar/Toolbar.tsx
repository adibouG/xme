import React from 'react'
import './Toolbar.css'

const Toolbar = ({children, ...props}: React.PropsWithChildren) =>  {
  return (
    <div className='toolbar_wrapper'>
        <div className='toolbar' >
            {[children]}
        </div>
    </div>
  )
}

export default Toolbar