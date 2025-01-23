import React, { act } from "react";
import './Tab.css'


export const TabButton = ({title, index,  activeTab, setActiveTab}) => {
    console.log('title', title);
    return (
      <li className={`tabbutton`} id={index}
       onClick={() => setActiveTab(index)}
       >
          {title}
      </li>
   )
  }

export  const TabButtons = ({ list, activeTab, setActiveTab,...props }) =>{
    console.log('props', list);
    return (
      <div className="tabbuttons_wrapper">
        <ul className="tabbuttons">
          {  
        list.map((item, index) => (
            <TabButton key={index} 
            index={index}
            setActiveTab={setActiveTab} 
            title={item.user}
            activeTab={activeTab}
        />
        ))
        }
        </ul>
      </div>
    );
}

export const TabContent = ({data, children}) => {

    return (    
            <div className="tabcontent">
                {children}
            </div>
        )
    }




export const TabPanel = ({ tabData, children,...props }) =>  
{

    //const [activeTab, setActiveTab] = React.useState(-1);

    const tabHeaders = <TabButtons  list={tabData} 
                    activeTab={props.activeTab}
                    setActiveTab={props.setActiveTab} 
                    {...props}
                />;

      
      
        return (
          <div className="tabcontent">
            {tabHeaders}
            {children}
          </div>
        );
      };

