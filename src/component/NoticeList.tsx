// NoticeList.tsx
import React, {CSSProperties} from "react";

import Box from '@mui/material/Box';


type NoticeListprops = {
    onNoticeClick : (id: string) => void
}

type Notice = {
    id: string, //공지 식별자
    title: string, //공지 제목
    content: string, //공지 내용
    date: string // 날짜 문자열
    otherInfo: NoticeView, // 조회수 등 공지의 세부값
};
//조회수 등 세부값 관리
type NoticeView = {
  _id: string,
  noticeid: number, //조회수
  comments: comment[], // 댓글
};
//댓글
type comment = {
  commentId: string, //댓글 아이디
  commentTitle: string, //댓글 제목
  commentContent: string, // 댓글 내용
  commentDate: string, // 댓글 작성 날자
}
type NoticeListState = {
    notices: Notice[]; //공지 객체의 배열
}

class NoticeList extends React.Component<NoticeListprops, NoticeListState>{
    constructor(props: NoticeListprops){
        super(props)
        this.state = {
            // notices 빈 배열로 초기화
            notices: []
        }
    };
    
    componentDidMount(): void {
        // 로컬 스토리지에서 공지 데이터 가져오기
        const savedNotices = localStorage.getItem('notices');
        // 저장된 공지 값이 있으면 notices 상태를 업데이트
        if(savedNotices){
            this.setState({notices: JSON.parse(savedNotices)});
        }
    }
    //날짜 문자열을 더 읽기 쉬운 형식으로 변환
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
            <Box component="section" sx={styles.body}>
                <header>
                    
                </header>
                <main>
                    {/* **공지 표시:** `main` 섹션 내부에서 `this.state.notices` 배열을 반복 */}
                    {this.state.notices.map(notice => (
                        // `onClick` 핸들러를 설정하여 `notice.id`와 함께 `onNoticeClick` prop 함수 (부모 `App` 컴포넌트에서 전달됨)를 호출
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
            </Box>
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
        color: '#ffffff'
    },
    dateArea: {
        marginBottom: '20px',
        color: '#ffffff'
    },
}
export default NoticeList;
