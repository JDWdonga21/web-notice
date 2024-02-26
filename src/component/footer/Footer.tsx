import React from "react";
//아이콘

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
            <div className="Footer">                
                {this.props.appCurrentScreen === 'list' && (
                    <div className="Footer-btn" onClick={this.props.onAddNotice}>                    
                        <h3>공지사항 추가</h3>
                    </div>
                )}
                {this.props.appCurrentScreen === 'detail' && (
                    <div className="Footer-btn">
                        <div onClick={this.props.onBackToList}>
                            <h3>목록으로</h3>
                        </div>
                        <div onClick={this.props.onEditNotice}>
                            <h3>수정하기</h3>
                        </div>
                        <div onClick={() => this.props.selectedNoticeId && this.props.onDelete(this.props.selectedNoticeId)}>
                            <h3>삭제하기</h3>
                        </div>
                    </div>
                )}
            </div>
        )
    }
}
export default Footer;