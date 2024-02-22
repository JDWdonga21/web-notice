// NoticeEdit.tsx
import React from 'react';

type Notice = {
    id: string,
    title: string,
    content: string,
    date: string
};

type NoticeEditProps = {
    onNoticeAdded: () => void,
  id?: string; // 수정 시에는 id가 제공됩니다.
};

type NoticeEditState = {
  title: string;
  content: string;
  date: string;
};

class NoticeEdit extends React.Component<NoticeEditProps, NoticeEditState> {
  constructor(props: NoticeEditProps) {
    super(props);
    this.state = {
      title: '',
      content: '',
      date: ''
    };
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

  

  handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    const { title, content, date } = this.state;
    const { id } = this.props;

    const newNotice = { title, content, date : date || new Date().toISOString() };
  
    // 수정인 경우와 추가인 경우를 분리하여 처리합니다.
    const savedNotices = JSON.parse(localStorage.getItem('notices') || '[]');
    if (this.props.id) {
      // 수정 로직
        const updatedNotices = savedNotices.map((notice: Notice) => {
            if(notice.id === id){
                return { id: this.props.id, title, content, date};
            }
            return notice;
        });
      localStorage.setItem('notices', JSON.stringify(updatedNotices));
    } else {
      // 추가 로직
      const newId = Date.now().toString(); // 임시 ID 생성
      const noticeToAdd = { ...newNotice, id: newId };
      const updatedNotices = [...savedNotices, noticeToAdd];
      localStorage.setItem('notices', JSON.stringify(updatedNotices));
    }
  
    this.props.onNoticeAdded();
  };

  render() {
    return (
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
          <textarea
            value={this.state.content}
            onChange={e => this.setState({ content: e.target.value })}
          />
        </label>
        <button type="submit">저장</button>
      </form>
    );
  }
}

export default NoticeEdit;