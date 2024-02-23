// NoticeList.tsx
import React, {CSSProperties} from "react";


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

    formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 월은 0부터 시작하므로 1을 더해줍니다.
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');

        return `${year}.${month}.${day} ${hours}:${minutes}`;
    }

    render(): React.ReactNode {
        return(
            <div style={styles.body}>
                <header>
                    
                </header>
                <main>
                    {this.state.notices.map(notice => (
                        <div style={styles.noticeList} key={notice.id} onClick={() => this.props.onNoticeClick(notice.id)}>
                            <div style={styles.titleArea}>
                                <text style={styles.titleText}>{notice.title}</text>
                            </div>                            
                            <div style={styles.dateArea}>
                                <text>{this.formatDate(notice.date)}</text>
                            </div>                            
                        </div>
                    ))}
                </main>
                <footer>

                </footer>
            </div>
        )
    }
}
const styles: {[key in string]: CSSProperties}= {
    body: {
        display: "flex",
        width: '90%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    noticeList: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        padding: '5px',
        marginLeft: '5%',
        marginRight: '5%',
        marginBottom: '5px',
        width: '94vw',
        // borderRight: '2px solid #282c34',
        borderBottom: '1px solid #7b879e',
        // backgroundColor: 'azure',
    },
    titleArea: {
        marginTop: '20px'
    },
    titleText: {
        fontWeight: 'bold',
        fontSize: 24,
    },
    dateArea: {
        marginBottom: '20px' 
    },
}
export default NoticeList;
