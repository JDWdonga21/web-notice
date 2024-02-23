// NoticeEdit.tsx
import React, {
    useMemo, 
    useRef,
    CSSProperties
} from 'react';
import ReactQuill, {Quill} from 'react-quill';
import 'react-quill/dist/quill.snow.css';

type Notice = {
    id: string,
    title: string,
    content: string,
    date: string
};

type NoticeEditProps = {
    onNoticeAdded: () => void,
    onCancel: () => void,
    id?: string; // 수정 시에는 id가 제공됩니다.
};

type NoticeEditState = {
  title: string;
  content: string;
  date: string;

  editorHtml: string; // 에디터에 표시될 HTML
  htmlInput: string; // 사용자가 입력한 HTML
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
  }

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
  handleContentChange = (content: string) => {
    this.setState({ content });
  };

  saveNotice = () => {
    // const { title, content, date } = this.state;
    const { title, editorHtml: content, date } = this.state;
    const { id, onNoticeAdded } = this.props;

    const newNotice = { title, content, date: date || new Date().toISOString() };

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
    
    onNoticeAdded();
  };
  

  handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    this.saveNotice();
    // const { title, content, date } = this.state;
    // const { id } = this.props;

    // const newNotice = { title, content, date : date || new Date().toISOString() };
  
    // // 수정인 경우와 추가인 경우를 분리하여 처리합니다.
    // const savedNotices = JSON.parse(localStorage.getItem('notices') || '[]');
    // if (this.props.id) {
    //   // 수정 로직
    //     const updatedNotices = savedNotices.map((notice: Notice) => {
    //         if(notice.id === id){
    //             return { id: this.props.id, title, content, date};
    //         }
    //         return notice;
    //     });
    //   localStorage.setItem('notices', JSON.stringify(updatedNotices));
    // } else {
    //   // 추가 로직
    //   const newId = Date.now().toString(); // 임시 ID 생성
    //   const noticeToAdd = { ...newNotice, id: newId };
    //   const updatedNotices = [...savedNotices, noticeToAdd];
    //   localStorage.setItem('notices', JSON.stringify(updatedNotices));
    // }
  
    // this.props.onNoticeAdded();
  };

  insertHtmlContent = () => {
    const htmlContent = prompt("HTML 입력");
    if(!htmlContent) return;

    const quillInstance = this.quillRef.current?.getEditor();
    if(quillInstance){
        const range = quillInstance.getSelection();
        if(range){
            quillInstance.clipboard.dangerouslyPasteHTML(range.index, htmlContent);
        }
    }
  };
  handleHtmlInputChange = (e) => {
    this.setState({ htmlInput: e.target.value });
  };

  applyHtml = () => {
    this.setState({ editorHtml: this.state.htmlInput });
  };

  render() {
    // ReactQuill 툴바 설정
    const modules = {
      toolbar: [
        // Add other toolbar options as needed
        ['bold', 'italic', 'underline', 'strike'], // toggled buttons
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'script': 'sub'}, { 'script': 'super' }], // superscript/subscript
        [{ 'indent': '-1'}, { 'indent': '+1' }], // outdent/indent
        [{ 'size': ['small', false, 'large', 'huge'] }], // custom dropdown
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        
        ['clean'], // remove formatting button

        // Here is the HTML edit button
        ['code-block'], // This button will allow users to enter HTML tags
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
              <text style={styles.titleText}>내용</text>
              <ReactQuill
                theme="snow"
                style={{ width: '90vw', height: '25vh', marginBottom: '20px' }}
                value={editorHtml}
                onChange={(value) => this.setState({ editorHtml: value })}
              />
            </div>   
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center'}}>
              <text style={styles.titleText}>HTML 입력</text>
              <textarea
                value={htmlInput}
                onChange={this.handleHtmlInputChange}
                placeholder="HTML 코드를 여기에 입력하세요."
                style={{ width: '90vw', height: '25vh', marginBottom: '20px' }}
              />
            </div>
            {/* <button onClick={()=> this.insertHtmlContent()}>HTML</button> */}
          </main>           
            
            <footer className="Footer">
                <div className="Footer-btn">
                    <div onClick={this.saveNotice}>
                        <h3>저장하기</h3>
                    </div>
                    <div onClick={()=> this.applyHtml()}>
                        <h3>HTML 입력</h3>
                    </div>
                    {/* <div onClick={()=> this.insertHtmlContent()}>
                        <h3>HTML 입력</h3>
                    </div> */}
                    <div onClick={this.props.onCancel}>
                        <h3>취소하기</h3>
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
        borderBottom: '1px solid #121417',
    },
    titleArea: {
      marginBottom: '10px'
    },
    titleText: {
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
      justifyContent: 'space-around',
      padding: '5px',
      marginLeft: '5%',
      marginRight: '5%',
      width: '94vw', 
      height: '80vh',
      overflowY: 'scroll',
    },
    articleText: {
      textAlign: 'start',
      wordBreak: 'break-word',
      overflowWrap: 'break-word',
      whiteSpace: 'pre-wrap'
    },
}
export default NoticeEdit;