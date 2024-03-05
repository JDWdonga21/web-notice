// NoticeDetail.tsx
import React, {CSSProperties} from "react";
//import parse from 'html-react-parser';
// import DOMPurify from 'dompurify';

//아이콘
import Icon from '@mdi/react';
import { mdiListBoxOutline } from '@mdi/js';
import { mdiFileEditOutline } from '@mdi/js';
import { mdiSquareEditOutline } from '@mdi/js';
import { mdiDelete } from '@mdi/js';


type Notice = {
  id: string, //공지 식별자
  title: string, //공지 제목
  content: string, //공지 내용
  date: string, // 날짜 문자열
  otherInfo: NoticeView, // 조회수 등 공지의 세부값
};
//조회수 등 세부값 관리
type NoticeView = {
  _id: string,
  noticeid: number, //조회수
  comments: comment[], //댓글
};
//댓글
type comment = {
  commentId: string, //댓글 아이디
  commentTitle: string, //댓글 제목
  commentContent: string, //댓글 내용
  commentDate: string, // 댓글 작성 날짜
}
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
  noticeid: number; //조회수
  comments: comment[]; //댓글
  //
  commentTitle: string;
  commentContent: string;
};

class NoticeDetail extends React.Component<NoticeDetailProps, NoticeDetailState> {
  constructor(props: NoticeDetailProps) {
    super(props);
    this.state = {
      title: '',
      content: '',
      date: '',
      noticeid: 0, //조회수
      comments: [], //댓글
      //
      commentTitle: '',
      commentContent: '',
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
    // const notice = savedNotices.find((notice: Notice) => notice.id === id);
    // if (notice) {       
    //   this.setState({ ...notice });
    // }
    const noticeIndex = savedNotices.findIndex((notice: Notice) => notice.id === id);
    console.log(noticeIndex)
    if (noticeIndex !== -1) {
      savedNotices[noticeIndex].otherInfo.noticeid += 1;  
      console.log("조회수 : " + savedNotices[noticeIndex].otherInfo.noticeid) 
      localStorage.setItem('notices', JSON.stringify(savedNotices));
      this.setState({ ...savedNotices[noticeIndex] });
      console.log("댓글 : " + savedNotices[noticeIndex].otherInfo)
      this.setState({ 
        noticeid: savedNotices[noticeIndex].otherInfo.noticeid, //조회수
        comments: savedNotices[noticeIndex].otherInfo.comments, //댓글
      })
    }
  }
  //날짜 문자열을 사람이 읽을 수 있는 형식으로 변환
  formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 월은 0부터 시작하므로 1을 더해줍니다.
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0')
    return `${year}.${month}.${day} ${hours}:${minutes}`;
  }
  /**
   * 
   */
  // 댓글 입력 핸들러
  // handleCommentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  //   this.setState({
  //     [e.target.name]: e.target.value,
  //   });
  // };
  handleCommentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const name = e.target.name as keyof NoticeDetailState;
    const value = e.target.value;

    this.setState(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };


  // 댓글 제출 핸들러
  handleCommentSubmit = () => {
    const { commentTitle, commentContent } = this.state;
    if (!commentTitle.trim() || !commentContent.trim()) {
      alert('댓글 제목과 내용을 입력해주세요.');
      return;
    }
    // 현재 날짜와 시간 생성
    const now = new Date();
    const formattedDate = this.formatDate(now.toISOString());

    const newComment = {
      commentId: now.toISOString(),
      commentTitle,
      commentContent,
      commentDate: formattedDate, // 포맷팅된 날짜 사용
    };
    this.handleAddComment(newComment);
    this.setState({ commentTitle: '', commentContent: '' }); // 입력 필드 초기화
  };
  // 댓글 추가 메서드
  handleAddComment = (newComment: { commentTitle: string; commentContent: string }) => {
    const { comments } = this.state;
    const savedNotices = JSON.parse(localStorage.getItem('notices') || '[]');
    const noticeIndex = savedNotices.findIndex((notice: Notice) => notice.id === this.props.id);

    if (noticeIndex !== -1) {
      // 새 댓글 객체 생성
      const commentToAdd = {
        commentId: Date.now().toString(), // 예시로 현재 시간을 ID로 사용
        commentTitle: newComment.commentTitle,
        commentContent: newComment.commentContent,
        commentDate: new Date().toISOString(), // 현재 날짜 및 시간
      };

      // 현재 공지의 댓글 배열에 새 댓글 추가
      const updatedComments = [...comments, commentToAdd];
      savedNotices[noticeIndex].otherInfo.comments = updatedComments; // localStorage의 댓글 배열 업데이트

      // localStorage 업데이트
      localStorage.setItem('notices', JSON.stringify(savedNotices));

      // 컴포넌트 상태 업데이트
      this.setState({ comments: updatedComments });
      savedNotices[noticeIndex].otherInfo.comments = updatedComments;
      localStorage.setItem('notices', JSON.stringify(savedNotices));
  }
};


  // 댓글 입력 폼 렌더링
  renderCommentForm() {
    return (
      <div style={styles.commentForm}>
        <input
          style={styles.input}
          type="text"
          name="commentTitle"
          placeholder="댓글 제목"
          value={this.state.commentTitle}
          onChange={this.handleCommentChange}
        />
        <textarea
          style={styles.textarea}
          name="commentContent"
          placeholder="댓글 내용"
          value={this.state.commentContent}
          onChange={this.handleCommentChange}
        />
        <button style={styles.submitButton} onClick={this.handleCommentSubmit}>
          댓글 달기
        </button>
      </div>
    );
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
    const {title, content, date, noticeid, comments} = this.state;
    return (
      <div style={styles.body}>
        <header style={styles.header}>
          <div style={styles.titleArea}>
            <text style={styles.titleText}>{title}</text>
          </div>
          <div>
            <text>{this.formatDate(date)} 조회수: {noticeid}</text>
          </div>
        </header>    
        <main style={styles.mainArea}>
          <article style={styles.articleText} dangerouslySetInnerHTML={{ __html : content }} />
        </main>
        {/* 코맨트 코드 */}
        {/* <footer style={styles.footer}>
          {comments.map(comment => (
            <div style={styles.commentItem} key={comment.commentId}>
              <div style={styles.commentTitle}>
                <text>{comment.commentTitle}</text>
              </div>
              <div style={styles.commentContent}>
                <text>{comment.commentContent}</text>
              </div>
              <div style={styles.commentDate}>
                <text>{this.formatDate(comment.commentDate)}</text>
              </div>
            </div>
          ))}
          {this.renderCommentForm()}
        </footer> */}
        {/* 하단 버튼 모음 */}
        <footer style={styles.footer}>
          <div style={styles.detailBtns}>
            <div onClick={this.props.onBackToList}>
              <div style={styles.btnContainer}>
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
              <div style={styles.btnContainer}>
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
            <div onClick={() => this.props.id && this.props.onDelete(this.props.id)}>
              <div style={styles.btnContainer}>
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
        </footer>
      </div>
    );
  }
}
const styles: {[key in string]: CSSProperties}= {
  body: {    
    display: "flex",
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    // minHeight: '80vh', // 뷰포트의 높이에 맞게 조정
    // paddingBottom: '20px', // 하단에 여유 공간 추가
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: '10px',
    marginLeft: '5%',
    marginRight: '5%',
    width: '94vw',        
    borderBottom: '2px solid #121417',
    height: '10%',
  },
  titleArea: {
    marginBottom: '10px'
  },
  titleText: {
      fontWeight: 'bold',
      fontSize: 24,
      marginTop: '10px',
      marginBottom: '10px'
  },
  mainArea: {
    display: 'flex',
    flex: '1',
    overflowY: 'auto', // 내용이 넘칠 경우 스크롤 가능
    flexDirection: 'column',
    height: '80%',
    // height: 'calc(50vh - 80px)',
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
  footer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTop: '2px solid #7e848f',
    padding: '5px',
    marginLeft: '5%',
    marginRight: '5%',
    width: '94vw', 
    height: '10%',
  },
  detailBtns: {
    display: 'flex',
        width: '94vw',
        margin: '4px',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
  },
  btnContainer : {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  // commentForm: {
  //   display: 'flex',
  //   flexDirection: 'column',
  //   gap: '10px',
  //   marginBottom: '20px',
  // },
  // input: {
  //   padding: '10px',
  //   borderRadius: '4px',
  //   border: '1px solid #ccc',
  // },
  // textarea: {
  //   padding: '10px',
  //   borderRadius: '4px',
  //   border: '1px solid #ccc',
  //   minHeight: '100px',
  // },
  // submitButton: {
  //   padding: '10px 20px',
  //   background: '#007bff',
  //   color: 'white',
  //   border: 'none',
  //   borderRadius: '4px',
  //   cursor: 'pointer',
  // },
  // commentItem: {
  //   background: '#f8f9fa', // 댓글 배경색
  //   border: '1px solid #dee2e6', // 댓글 테두리
  //   borderRadius: '8px', // 둥근 모서리
  //   padding: '10px', // 내부 여백
  //   marginBottom: '10px', // 댓글 간 간격
  // },
  // commentTitle: {
  //   fontWeight: 'bold', // 댓글 제목 굵기
  //   fontSize: '16px', // 폰트 크기
  //   marginBottom: '5px', // 제목과 내용 사이의 간격
  // },
  // commentContent: {
  //   fontSize: '14px', // 내용 폰트 크기
  //   marginBottom: '5px', // 내용과 날짜 사이의 간격
  // },
  // commentDate: {
  //   fontSize: '12px', // 날짜 폰트 크기
  //   color: '#6c757d', // 날짜 폰트 색상
  // },
}
export default NoticeDetail;