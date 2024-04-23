import React, {} from "react";
//아이콘
import Icon from '@mdi/react';
import { mdiBullhornOutline } from '@mdi/js';
//스위치
import { 
  AppBar, 
  Toolbar, 
  Typography, 
} from '@mui/material';
import "../../App.css"

type HeaderProps = {
    isdarkTheme: boolean;  
  onChangeTheme : () => void; 
};

class Header extends React.Component<HeaderProps,{}>{
    render(): React.ReactNode {
        return(
          <AppBar
            position="static"
            color="default"
            elevation={0} 
            sx={{
              width: '100vw',
              height: '10vh',
              paddingTop: '15px',
              bgcolor: (theme) => theme.palette.mode === 'dark' ? '#1e1e1e' : '#ffc519',
              borderBottom: '3px solid',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'fixed',
              top: 0,
              left: 0, 
              display: 'flex',
           }}
          >
            <Toolbar>
              <Icon path={mdiBullhornOutline}
                title="noticeIcon"
                size={2}
                horizontal
                vertical
                rotate={180}                  
              />
              <Typography variant="h4" color="inherit" noWrap sx={{ flexGrow: 1, marginLeft: 2}}>
                공지사항
              </Typography>
              <div onClick={this.props.onChangeTheme}>
                <Icon path={mdiBullhornOutline}
                  title="noticeIcon"
                  size={2}
                  horizontal
                  vertical
                  rotate={180} 
                />
              </div>                
            </Toolbar>                
          </AppBar>
        )
    }
}
export default Header;