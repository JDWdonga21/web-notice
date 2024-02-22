// NoticeList.tsx
import React from "react";


type NoticeListprops = {
    onNoticeClick : (id: string) => void
}

type Notice = {
    id: string,
    title: string,
    content: string,
    date: string
};

type NoticeListState = {
    notices: Notice[];
}

class NoticeList extends React.Component<NoticeListprops, NoticeListState>{
    constructor(props: NoticeListprops){
        super(props)
        this.state = {
            notices: []
        }
    };
    
    componentDidMount(): void {
        // 데이터 가져오기
        const savedNotices = localStorage.getItem('notices');
        if(savedNotices){
            this.setState({notices: JSON.parse(savedNotices)});
        }
    }
    render(): React.ReactNode {
        return(
            <div className="NoticeLists">
                <header>
                    
                </header>
                <main>
                    {this.state.notices.map(notice => (
                        <div className="NoticeList" key={notice.id} onClick={() => this.props.onNoticeClick(notice.id)}>
                            <h2>{notice.title}</h2>
                            <text>{notice.date}</text>
                        </div>
                    ))}
                </main>
                <footer>

                </footer>
            </div>
        )
    }
}

export default NoticeList;
