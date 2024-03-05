import React, {CSSProperties} from "react";
//아이콘
import Icon from '@mdi/react';
import { mdiBullhorn } from '@mdi/js';
import { mdiBullhornOutline } from '@mdi/js';

import "../../App.css"

class Header extends React.Component{
    render(): React.ReactNode {
        return(
            <div style={styles.body}>
                <div style={styles.headerLeft}>
                             
                </div>
                <div style={styles.headerCenter}>
                    <Icon path={mdiBullhornOutline}
                        title="noticeIcon"
                        size={2}
                        horizontal
                        vertical
                        rotate={180}
                        color="#ffffff"
                        // spin
                    />
                    <h1 style={{color:'#ffffff'}}>공지사항</h1>                    
                </div>
                <div style={styles.headerRight}>
                    
                </div>
            </div>
        )
    }
}
const styles: {[key in string]: CSSProperties}= {
    body: {
        width: '100%',
        paddingTop: '15px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        // backgroundColor: '#ffc519',
        backgroundColor: '#1e1e1e',
        borderBottom: '3px solid #ffffff'
    },
    headerLeft : {

    },
    headerCenter : {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',        
    },
    headerRight : {

    },
}
export default Header;