// NoticeList.tsx
import React, {CSSProperties} from "react";

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

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
            <Box sx={{ width: '100vw', height: '85vh', bgcolor: 'background.paper' }}>
                {/* **공지 표시:** `main` 섹션 내부에서 `this.state.notices` 배열을 반복 */}
                    <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
                        <List>
                            {this.state.notices.map((notice) => (
                                <ListItem 
                                    onClick={() => this.props.onNoticeClick(notice.id)} 
                                    key={notice.id} 
                                    sx={{
                                        borderBottom: (theme) =>
                                        `1px solid ${theme.palette.mode === 'dark' ? '#ffffff' : '#000000'}`,
                                    }}>
                                        <ListItemText 
                                            primary={<Typography variant="h5" sx={{ color: 'text.primary' }}>{notice.title}</Typography>} 
                                            secondary={this.formatDate(notice.date)} 
                                        />
                                </ListItem>
                            ))}
                        </List>
                    </Box>
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
