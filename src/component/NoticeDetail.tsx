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
  onBackToList: () => void; // 공지 목록으로 돌아가는 콜백 함수
  onEditNotice: () => void; //편집 뷰로 이동하는 콜백 함수
  onDelete: (id : string) => void; //공지 삭제 콜백 함수
};

type NoticeDetailState = {
  title: string; //공지 제목
  content: string; //공지 내용
  date: string; //공지 날짜 문자열
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

  /**
   * **데이터 로딩:**
        - `id` prop을 가져옵니다.
        - `localStorage`에서 공지 데이터를 로드합니다.
        - 일치하는 `id`를 가진 공지를 찾습니다.
        - 일치하는 공지가 있으면 컴포넌트 상태 (`title`, `content`, `date`)를 업데이트합니다.
   */
  componentDidMount() {
    // ID에 해당하는 공지사항 정보를 로딩합니다.
    const { id } = this.props;
    const savedNotices = JSON.parse(localStorage.getItem('notices') || '[]');
    const notice = savedNotices.find((notice: Notice) => notice.id === id);
    if (notice) {
        this.setState({ ...notice });
    }
  }
  //날짜 문자열을 사람이 읽을 수 있는 형식으로 변환
  formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 월은 0부터 시작하므로 1을 더해줍니다.
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');

        return `${year}.${month}.${day} ${hours}:${minutes}`;
    }

  /**
   *  **구조:** 헤더, 본문 내용, (잠재적으로) 바닥글 섹션을 가진 `div`를 렌더링합니다. 스타일링은 `styles` 객체에서 정의됩니다.
    - **헤더:** 공지 제목과 형식화된 날짜를 표시합니다.
    - **본문 내용:**
        - `dangerouslySetInnerHTML`을 사용하여 공지의 HTML 내용을 직접 렌더링합니다. **주의 사항:** `dangerouslySetInnerHTML`을 사용하면 보안 위험 (XSS 취약점)이 발생할 수 있습니다. 프로덕션 애플리케이션에서는 `DOMPurify`와 같은 라이브러리를 사용하여 렌더링 전에 HTML 내용을 정제하는 것을 고려하십시오.
    - **바닥글:** 잠재적인 버튼 또는 액션을 위한 공간 (이 예시에서는 구현되지 않음).
    - `NoticeDetail` 컴포넌트는 ID를 기반으로 특정 공지의 세부 정보를 동적으로 가져와 표시합니다.
    - `onBackToList`, `onEditNotice`, `onDelete`와 같은 제공된 콜백 props를 사용하여 부모 `App` 컴포넌트와 통신합니다.
    **보안 참고:** `dangerouslySetInnerHTML`을 정제 없이 사용하는 것은 위험할 수 있습니다. 프로덕션 환경에서는 안전한 HTML 렌더링 라이브러리를 사용하거나 자체 정제 로직을 구현하는 것을 고려하십시오.
   */
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