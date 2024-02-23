// NoticeEdit.tsx
import React, {
    useMemo, 
    useRef
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
        <div>
            <form onSubmit={this.handleSubmit}>
                <label>
                Title:
                <input
                    type="text"
                    value={this.state.title}
                    onChange={e => this.setState({ title: e.target.value })}
                />
                </label>
                <label>
                Content:
                {/* <textarea
                    value={this.state.content}
                    onChange={e => this.setState({ content: e.target.value })}
                /> */}
                {/* <ReactQuill
                  ref={this.quillRef}
                  theme="snow"
                  modules={modules}
                  formats={formats}
                  value={this.state.content}
                  onChange={this.handleContentChange}
                /> */}
                {/* <textarea
                  value={htmlInput}
                  onChange={this.handleHtmlInputChange}
                  placeholder="HTML 코드를 여기에 입력하세요."
                  style={{ width: '100%', height: '100px', marginBottom: '20px' }}
                />
                <button onClick={this.applyHtml} style={{ marginBottom: '20px' }}>HTML 적용</button>
                <ReactQuill
                  theme="snow"
                  value={editorHtml}
                  onChange={(value) => this.setState({ editorHtml: value })}
                /> */}
                </label>       
                {/* <button type="submit" style={{display: 'none'}}>저장</button> */}
            </form>
            <textarea
                  value={htmlInput}
                  onChange={this.handleHtmlInputChange}
                  placeholder="HTML 코드를 여기에 입력하세요."
                  style={{ width: '100%', height: '100px', marginBottom: '20px' }}
                />
                <button onClick={this.applyHtml} style={{ marginBottom: '20px' }}>HTML 적용</button>
                <ReactQuill
                  theme="snow"
                  value={editorHtml}
                  onChange={(value) => this.setState({ editorHtml: value })}
                />
            {/* <button onClick={()=> this.insertHtmlContent()}>HTML</button> */}
            <div className="Footer">
                <div className="Footer-btn">
                    <div onClick={this.saveNotice}>
                        <h3>저장하기</h3>
                    </div>
                    <div onClick={()=> this.insertHtmlContent()}>
                        <h3>HTML 입력</h3>
                    </div>
                    <div onClick={this.props.onCancel}>
                        <h3>취소하기</h3>
                    </div>     
                </div>
            </div>
        </div>      
    );
  }
}

export default NoticeEdit;