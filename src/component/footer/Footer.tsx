import React, {CSSProperties} from "react";
//아이콘
import Icon from '@mdi/react';
import { mdiPlusCircle } from '@mdi/js';
import { mdiListBoxOutline } from '@mdi/js';
import { mdiFileEditOutline } from '@mdi/js';
import { mdiSquareEditOutline } from '@mdi/js';
import { mdiDelete } from '@mdi/js';

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
            <div style={styles.body}>                
                {this.props.appCurrentScreen === 'list' && (
                    <div style={styles.listBtns} onClick={this.props.onAddNotice}>   
                        <Icon path={mdiPlusCircle}
                            title="noticeIcon"
                            size={1}
                            horizontal
                            vertical
                            // rotate={180}
                            color="black"
                            // spin
                        />                 
                        <h3>공지사항 추가</h3>
                    </div>
                )}
                {/* {this.props.appCurrentScreen === 'detail' && (
                    <div style={styles.detailBtns}>
                        <div onClick={this.props.onBackToList}>
                            <div style={styles.btnConteainer}>
                                <Icon path={mdiListBoxOutline}
                                    title="noticeIcon"
                                    size={1}
                                    horizontal
                                    vertical
                                    rotate={180}
                                    color="black"
                                    // spin
                                />
                                <h3>목록으로</h3>
                            </div>                            
                        </div>
                        <div onClick={this.props.onEditNotice}>
                            <div style={styles.btnConteainer}>
                                <Icon path={mdiSquareEditOutline}
                                    title="noticeIcon"
                                    size={1}
                                    horizontal
                                    vertical
                                    rotate={180}
                                    color="black"
                                    // spin
                                />
                                <h3>수정하기</h3>
                            </div>                            
                        </div>
                        <div onClick={() => this.props.selectedNoticeId && this.props.onDelete(this.props.selectedNoticeId)}>
                            <div style={styles.btnConteainer}>
                                <Icon path={mdiDelete}
                                    title="noticeIcon"
                                    size={1}
                                    horizontal
                                    vertical
                                    rotate={180}
                                    color="black"
                                    // spin
                                />
                                <h3>삭제하기</h3>
                            </div>                            
                        </div>
                    </div>
                )} */}
            </div>
        )
    }
}
const styles: {[key in string]: CSSProperties}= {
    body: {
        width: '100%',        
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff',
        borderTop: '2px solid #7e848f',
        position: 'fixed',
        bottom: 0,
        left: 0,        
    },
    listBtns : {
        display: 'flex',
        width: '90vw',
        margin: '4px',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    detailBtns : {
        display: 'flex',
        width: '90vw',
        margin: '4px',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    btnConteainer : {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    }
}
export default Footer;