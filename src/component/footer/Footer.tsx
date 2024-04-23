import React, {} from "react";
//아이콘
import Icon from '@mdi/react';
import { mdiPlusCircle } from '@mdi/js';

//mui
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';


import "../../App.css"

type Footerprops = {
    appCurrentScreen: "list" | "detail" | "edit";
    onAddNotice : () => void;
    selectedNoticeId: string | undefined;
    onBackToList: () => void;
    onEditNotice: () => void;    
    onDelete: (id : string) => void;
    onCancel: () => void;
}


class Footer extends React.Component<Footerprops>{
    render(): React.ReactNode {
        return(
            <Box 
                component="section" 
                sx={{
                    width: '100vw',
                    bgcolor: (theme) => theme.palette.mode === 'dark' ? '#272727' : '#ffefc1',        
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderTop: (theme) =>
                    `1px solid ${theme.palette.mode === 'dark' ? '#ffffff' : '#000000'}`,
                    position: 'fixed',
                    paddingTop: '5px',
                    paddingBottom: '5px',
                    bottom: 0,
                    left: 0, 
                }}>                
                {this.props.appCurrentScreen === 'list' && (
                    <Button 
                        size='large' 
                        variant="contained"
                        onClick={this.props.onAddNotice}
                        sx={{
                            width: '90vw',
                            margin: 1,
                        }}
                    >
                        <Icon path={mdiPlusCircle}
                            title="noticeIcon"
                            size={1}
                            horizontal
                            vertical
                            color="white"
                        />
                        공지사항 추가
                    </Button>                
                )}
            </Box>
        )
    }
}
export default Footer;