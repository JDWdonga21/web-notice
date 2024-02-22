// NoticeDetail.tsx
import React from 'react';

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

  render() {
    const {title, content, date} = this.state;
    return (
      <div>
        <h1>{this.state.title}</h1>
        <p>{this.state.date}</p>
        <article>{this.state.content}</article>
        <button onClick={this.props.onBackToList}>목록으로</button>
        <button onClick={this.props.onEditNotice}>수정하기</button>
        <button onClick={() => this.props.onDelete(this.props.id)}>삭제하기</button>
      </div>
    );
  }
}

export default NoticeDetail;