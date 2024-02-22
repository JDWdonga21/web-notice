import React from "react";
//아이콘

import "../../App.css"

class Header extends React.Component{
    render(): React.ReactNode {
        return(
            <div className="Header">
                <div className="header-left">
                             
                </div>
                <div className="header-center">
                    <h1>공지사항</h1>                    
                </div>
                <div className="header-right">
                    
                </div>
            </div>
        )
    }
}
export default Header;