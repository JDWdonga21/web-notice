// NoticeEdit.tsx
import React, {
    useMemo, 
    useRef,
    CSSProperties
} from 'react';
import ReactQuill, {Quill} from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import debounce from 'lodash.debounce';
//아이콘
import Icon from '@mdi/react';
import { mdiContentSave } from '@mdi/js';
import { mdiCancel } from '@mdi/js';

//공지 객체의 구조 정의
type Notice = {
    id: string, //공지 식별자
    title: string, //공지 제목
    content: string, //공지 내용
    date: string, //날짜 문자열
    otherInfo: NoticeView, // 조회수 등 공지의 세부값
};
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
  commentDate: string, //댓글 작성 날짜
}
type NoticeEditProps = {
    onNoticeAdded: () => void, //새로 작성, 업데이트 된 공지에 대해 부모 컴포넌트에 신호를 보내는 콜백 함수
    onCancel: () => void, //저장하지 않고 공지 목록으로 돌아가는 콜백 함수
    id?: string; // 수정 시에는 id가 제공됩니다.
};

type NoticeEditState = {
  title: string;
  content: string;
  date: string;

  editorHtml: string; // 에디터에 표시될 HTML (ReactQuill)
  htmlInput: string; // 사용자가 입력한 HTML (textarea)
};

const formats = [
    'font',
  'header',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'indent',
  'link',
  'align',
  'color',
  'background',
  'size',
  'h1',
]



class NoticeEdit extends React.Component<NoticeEditProps, NoticeEditState> {
  quillRef: React.RefObject<ReactQuill>;
  //updateContentFromTextarea: any;
  htmlChangeTime = false;
  constructor(props: NoticeEditProps) {
    super(props);
    this.state = {
      title: '',
      content: '',
      date: '',
      //
      editorHtml: '', // 에디터에 표시될 HTML
      htmlInput: '', // 사용자가 입력한 HTML
    };
    this.quillRef = React.createRef();
    this.updateContentFromTextarea = debounce(this.updateContentFromTextarea, 3000);
  }
  // `id` prop이 제공된 경우 (편집 시) `localStorage`에서 기존 공지 데이터를 로드
  componentDidMount() {
    const { id } = this.props;
    if (id) {
      const savedNotices = JSON.parse(localStorage.getItem('notices') || '[]');
      const noticeToEdit = savedNotices.find((notice: Notice) => notice.id === id);
      if (noticeToEdit) {
        this.setState({ ...noticeToEdit });
        this.setState({
          title: noticeToEdit.title,
          content: noticeToEdit.content, // ReactQuill에 표시될 내용도 업데이트
          date: noticeToEdit.date,
          editorHtml: noticeToEdit.content, // 추가된 부분
          htmlInput: noticeToEdit.content, // HTML 입력란에도 이전 값 표시
        })
      }
    }
  }
  /**
   *  (ReactQuill 외부에서) 텍스트 편집기 내용이 변경될 때 `content` 상태 업데이트
      - 일반적으로 다른 방식으로 외부 콘텐츠를 추가할 때 수행 
   */
  handleContentChange = (content: string) => {
    this.setState({ content });
  };

  // ReactQuill 편집기 내용이 변경될 때 `editorHtml`과 `htmlInput` 모두 업데이트
  handleEditorChange = (content: string) => {
    this.setState({ editorHtml: content, htmlInput: content }); // ReactQuill 변경 시 htmlInput도 업데이트
  };

  // textarea 입력 변경사항을 처리하는 핸들러
  // handleHtmlInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
  //   const htmlContent = e.target.value;
  //   this.setState({ htmlInput: htmlContent, editorHtml: htmlContent }); // textarea 변경 시 editorHtml도 업데이트
  // };

  /**
   * 
    - `handleHtmlInputChange`: textarea 내용이 변경될 때 `htmlInput` 상태 업데이트
    - `updateContentFromTextarea` (debounced): `editorHtml` 내용 (ReactQuill)을 원시 HTML textarea (`htmlInput`)의 변경 사항과 동기화
   * @param htmlContent 
   */
  // 입력이 실제로 처리되는 함수
  handleHtmlInputChange = (htmlContent) => {
    this.setState({ htmlInput: htmlContent, editorHtml: htmlContent });
  };

  // textarea의 내용을 업데이트하고 ReactQuill과 동기화하는 메서드
  updateContentFromTextarea = (html: string) => {
    this.setState({ editorHtml: html, htmlInput: html });
    this.htmlChangeTime = false;
  };

  // textarea의 입력 변경 이벤트 핸들러
  //`handleHtmlInputChange`를 먼저 호출하여 상태를 업데이트한 다음 
  //`updateContentFromTextarea`를 사용하여 'debounced' 동기화를 트리거
  handleTextareaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.htmlChangeTime = true;
    const html = event.target.value;
    this.setState({ htmlInput: html });
    this.updateContentFromTextarea(html);
  };
  /**
    - 유효성 검사 수행 (빈 제목 또는 내용 확인)
    - `newNotice` 객체 생성
    - `id`가 제공된 여부에 따라 (편집 또는 새 공지) `localStorage` 업데이트
    - `onNoticeAdded` 콜백 호출하여 부모 컴포넌트에 신호
   * @returns 
   */
  saveNotice = async() => {
    const { title, editorHtml: content, date } = this.state;
    const { id, onNoticeAdded } = this.props;

    // html 변경 체크
    if(this.htmlChangeTime === true){
      alert('HTML 자동 변환 중');
      return;
    }
    
    // 제목 또는 내용이 비어 있는지 확인
    if (!title.trim() || !content.trim()) {
        alert('제목과 내용을 모두 입력해주세요.');
        return; // 함수 실행 중단
    }
    const initialOtherInfo = {
      _id: Date.now().toString(),
      noticeid: 0,
      comments: [],
    }

    const newNotice = { 
      title, 
      content, 
      date: date || new Date().toISOString(),
      otherInfo: initialOtherInfo
    };

    const savedNotices = JSON.parse(localStorage.getItem('notices') || '[]');
    if (id) {
      const updatedNotices = savedNotices.map((notice: Notice) => {
        return notice.id === id ? { ...notice, title, content, date } : notice;
      });
      localStorage.setItem('notices', JSON.stringify(updatedNotices));
    } else {
      

      const newId = Date.now().toString(); // 임시 ID 생성
      const noticeToAdd = { ...newNotice, id: newId };
      localStorage.setItem('notices', JSON.stringify([...savedNotices, noticeToAdd]));
    }
    
    await onNoticeAdded();
  };
  
  //기본 양식 제출 동작 방지
  //`saveNotice`를 호출하여 저장 논리 처리
  handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    this.saveNotice();
  };
  //사용자에게 HTML 입력을 요구
  //제공된 HTML 내용을 현재 커서 위치에 ReactQuill 편집기에 삽입
  // insertHtmlContent = () => {
  //   const htmlContent = prompt("HTML 입력");
  //   if(!htmlContent) return;

  //   const quillInstance = this.quillRef.current?.getEditor();
  //   if(quillInstance){
  //       const range = quillInstance.getSelection();
  //       if(range){
  //           quillInstance.clipboard.dangerouslyPasteHTML(range.index, htmlContent);
  //       }
  //   }
  // };
  // handleHtmlInputChange2 = (e) => {
  //   this.setState({ htmlInput: e.target.value });
  // };

  // applyHtml = () => {
  //   this.setState({ editorHtml: this.state.htmlInput });
  // };
  /**
   * **구조:** 헤더, 본문, 바닥글 섹션이 있는 `div`
    - **헤더:** 공지 제목을 위한 입력 필드가 있는 양식 포함
    - **본문:**
        - **ReactQuill 편집기:** 편집 영역 표시
        - **HTML 입력 textarea:** 직접 HTML 입력 허용
    **핵심 요약**
    - `NoticeEdit` 컴포넌트는 ReactQuill 리치 텍스트 편집기와 원시 HTML textarea를 결합하여 공지 편집 시 유연성을 제공합니다.
    - 컴포넌트는 리치 텍스트 편집기의 상태
   * @returns 
   */
  render() {
    // ReactQuill 툴바 설정
    const modules = {
      toolbar: [
        // Add other toolbar options as needed
        ['bold', 'italic', 'underline', 'strike'], // toggled buttons
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        // [{ 'script': 'sub'}, { 'script': 'super' }], // superscript/subscript
        [{ 'indent': '-1'}, { 'indent': '+1' }], // outdent/indent
        [{ 'size': ['small', false, 'large', 'huge'] }], // custom dropdown
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['clean'], // remove formatting button
        // Here is the HTML edit button
        // ['code-block'], // This button will allow users to enter HTML tags
      ],
    };
    const { editorHtml, htmlInput } = this.state;
    return (
        <div style={styles.body}>
          <header style={styles.header}>
            <form onSubmit={this.handleSubmit}>
              <text style={styles.titleText}>제목  </text>
              <label>
                <input
                  type="text"
                  value={this.state.title}
                  onChange={e => this.setState({ title: e.target.value })}
                />
              </label>
            </form>
          </header>
          <main style={styles.mainArea}>   
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center'}}>
              <div style={{display: 'flex'}}>
                <text style={styles.titleText}>내용</text>
              </div>
              <div style={{display: 'flex'}}>
                <ReactQuill
                  modules={modules}
                  theme="snow"
                  style={{display: 'flex', flexDirection: 'column', width: '90vw', height: '30vh', marginBottom: '20px' }}
                  value={editorHtml}
                  onChange={this.handleEditorChange}
                />
              </div>
            </div>   
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center'}}>
              <div style={{display: 'flex'}}>
                <text style={styles.titleText}>HTML 입력</text>
              </div>  
              <div style={{display: 'flex'}}>
                <textarea
                  value={htmlInput}
                  onChange={this.handleTextareaChange}
                  // onChange={this.handleHtmlInputChange2}
                  placeholder="HTML 코드를 여기에 입력하세요."
                  style={{display: 'flex', width: '90vw', height: '30vh', marginBottom: '20px' }}
                />
              </div> 
            </div>
            {/* <button onClick={()=> this.insertHtmlContent()}>HTML</button> */}
          </main>           
            <footer style={styles.footer}>
                <div style={styles.editBtns}>
                    <div onClick={this.saveNotice}>
                      <div style={styles.btnConteainer}>
                        <Icon path={mdiContentSave}
                          title="noticeIcon"
                          size={1}
                          horizontal
                          vertical
                          rotate={180}
                          color="black"
                          // spin
                        />
                        <h3>저장하기</h3>
                      </div>                        
                    </div>
                    {/* <div onClick={()=> this.applyHtml()}>
                        <h3>HTML 입력</h3>
                    </div> */}
                    <div onClick={this.props.onCancel}>
                      <div style={styles.btnConteainer}>
                        <Icon path={mdiCancel}
                          title="noticeIcon"
                          size={1}
                          horizontal
                          vertical
                          rotate={180}
                          color="black"
                          // spin
                        />
                        <h3>취소하기</h3>
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
      borderBottom: '1px solid #121417',
      height: '10%',
  },
  titleArea: {
    marginBottom: '10px'
  },
  titleText: {
    display: 'flex',
    textAlign: 'start',
      fontWeight: 'bold',
      fontSize: 20,
      marginTop: '10px',
      marginBottom: '10px'
  },
  mainArea: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    // justifyContent: 'space-around',
    padding: '5px',
    marginLeft: '5%',
    marginRight: '5%',
    width: '94vw', 
    height: '80%',
    overflowY: 'scroll',
  },
  articleText: {
    display: 'flex',
    textAlign: 'start',
    wordBreak: 'break-word',
    overflowWrap: 'break-word',
    whiteSpace: 'pre-wrap'
  },
  btnConteainer : {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  footer : {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTop: '2px solid #7e848f',
    padding: '5px',
    marginLeft: '5%',
    marginRight: '5%',
    width: '94vw', 
    // height: '65vh',
    height: '10%',
  },
  editBtns: {
    display: 'flex',
        width: '94vw',
        margin: '4px',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
  },
}
export default NoticeEdit;