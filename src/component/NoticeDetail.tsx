// NoticeDetail.tsx
import React, {CSSProperties} from "react";
import parse from 'html-react-parser';
// import DOMPurify from 'dompurify';

type Notice = {
    id: string,
    title: string,
    content: string,
    date: string
};

type NoticeDetailProps = {
  id: string;
  onBackToList: () => void;
  onEditNotice: () => void;
  onDelete: (id : string) => void;
};

type NoticeDetailState = {
  title: string;
  content: string;
  date: string;
};

class NoticeDetail extends React.Component<NoticeDetailProps, NoticeDetailState> {
  constructor(props: NoticeDetailProps) {
    super(props);
    this.state = {
      title: '',
      content: '',
      date: ''
    };
  }

  componentDidMount() {
    // ID에 해당하는 공지사항 정보를 로딩합니다.
    const { id } = this.props;
    const savedNotices = JSON.parse(localStorage.getItem('notices') || '[]');
    const notice = savedNotices.find((notice: Notice) => notice.id === id);
    if (notice) {
        this.setState({ ...notice });
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

  render() {
    const {title, content, date} = this.state;
    return (
      <div style={styles.body}>
        <header style={styles.header}>
          <div style={styles.titleArea}>
            <text style={styles.titleText}>{title}</text>
          </div>
          <div>
            <text>{this.formatDate(date)}</text>
          </div>
        </header>    
        <main style={styles.mainArea}>
          <article style={styles.articleText} dangerouslySetInnerHTML={{ __html : content }} />
        </main>
        <footer>

        </footer>
      </div>
    );
  }
}
const styles: {[key in string]: CSSProperties}= {
    body: {
        display: "flex",
        flexDirection: 'column',
        width: '90%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        padding: '10px',
        marginLeft: '5%',
        marginRight: '5%',
        marginBottom: '5px',
        width: '94vw',        
        borderBottom: '2px solid #121417',
    },
    titleArea: {
      marginBottom: '10px'
    },
    titleText: {
        fontWeight: 'bold',
        fontSize: 24,
    },
    mainArea: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      padding: '10px',
      marginLeft: '5%',
      marginRight: '5%',
      marginBottom: '5px',
      width: '94vw', 
      wordWrap: 'break-word',
      overflowWrap: 'break-word',
    },
    articleText: {
      textAlign: 'start',
      wordBreak: 'break-word',
      overflowWrap: 'break-word',
      whiteSpace: 'pre-wrap'
    },
}
export default NoticeDetail;