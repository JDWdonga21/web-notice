// App.tsx
import React from 'react';
import NoticeList from './component/NoticeList';
import NoticeDetail from './component/NoticeDetail';
import NoticeEdit from './component/NoticeEdit';
import "./App.css";
import Header from './component/header/Header';
import Footer from './component/footer/Footer';
//모달 기능
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

type Notice = {
  id: string, //공지 식별자
  title: string, //공지 제목
  content: string, //공지 내용
  date: string, //날짜 문자열
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
  commentDate: string, // 댓글 작성 날자
}

type AppState = {
  // 현재 표시되는 화면 추적
  currentScreen: 'list' | 'detail' | 'edit';
  // 조회 중이거나 편집 중인 공지의 ID 저장
  selectedNoticeId?: string;
  // 모달 상태
  isModalOpen: boolean;
};

class App extends React.Component<{}, AppState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      currentScreen: 'list',
      isModalOpen: false,
    };
  }
  //선택한 공지의 상세보기 화면을 표시하도록 상태를 업데이트
  handleNoticeClick = (id: string) => {
    this.setState({ currentScreen: 'detail', selectedNoticeId: id });
  };
  //목록 화면으로 돌아가도록 상태를 업데이트
  handleBackToList = () => {
    this.setState({ currentScreen: 'list', selectedNoticeId: undefined });
  }
  // 편집 화면을 표시하도록 상태를 업데이트
  handleEditNotice = (id : string | undefined) => {
    //this.setState({currentScreen: 'edit', selectedNoticeId: id });
    //모달 적용
    this.setState({ isModalOpen: true, selectedNoticeId: id });
  }
  // 새 공지 작성을 위한 편집 화면을 표시하도록 상태를 업데이트
  handleAddNotice = () => {
    //모달 적용전
    //this.setState({ currentScreen: 'edit', selectedNoticeId: undefined });
    //모달 적용
    this.setState({ isModalOpen: true, selectedNoticeId: undefined });
  };
  // 로컬 스토리지에서 공지를 삭제하고 목록 화면으로 돌아가도록 함
  handleDeleteNotice = (id: string) => {
    if(window.confirm('삭제하시겠습니까?')){
      const savedNotices = JSON.parse(localStorage.getItem('notices') || '[]');
      const updatedNotices = savedNotices.filter((notice: Notice) => notice.id !== id);
      localStorage.setItem('notices', JSON.stringify(updatedNotices));
    }   

    //삭제 후 목록 화면으로
    this.setState({currentScreen: 'list'});
  }
  //공지가 추가되거나 편집된 후 목록 화면으로 돌아가도록 상태를 업데이트
  handleNoticeAdded = () => {
    this.setState({ isModalOpen: false, currentScreen : 'list' });
  }
  // 모달 열고 닫는 메서드
  handleOpenModal = () => {
    this.setState({ isModalOpen: true });
  };

  handleCloseModal = () => {
    this.setState({ isModalOpen: false, currentScreen: 'list' });
  };


  render() {
    const { currentScreen, selectedNoticeId } = this.state;

    return (
      <div className='App'>
        <Header />        
        <main className='Mains'>
          {/* 리스트 화면 */}
          {currentScreen === 'list' && (
            <div>
              <NoticeList onNoticeClick={this.handleNoticeClick} />
              {/* <button onClick={this.handleAddNotice}>공지사항 추가</button> */}
            </div>
          )}
          {/* 상세 화면 */}
          {currentScreen === 'detail' && selectedNoticeId && (
            <NoticeDetail 
              id={selectedNoticeId} 
              onBackToList={this.handleBackToList}
              onEditNotice={() => this.handleEditNotice(selectedNoticeId)}
              onDelete={this.handleDeleteNotice}
            />
          )}
          {/* 추가,편집 화면 */}
          {currentScreen === 'edit' && (
            <NoticeEdit 
              id={selectedNoticeId}
              onNoticeAdded = {this.handleNoticeAdded}  
              onCancel={this.handleNoticeAdded}        
            />
          )}
        </main>
        <Footer
          appCurrentScreen = {this.state.currentScreen}
          onAddNotice = {this.handleAddNotice}
          selectedNoticeId={selectedNoticeId} 
          onBackToList={this.handleBackToList}
          onEditNotice={() => this.handleEditNotice(selectedNoticeId)}
          onDelete={this.handleDeleteNotice}
          onCancel={this.handleNoticeAdded}
        />   
        {/* NoticeEdit 모달 */}
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'red'}}>
          <Modal
            open={this.state.isModalOpen}
            onClose={this.handleCloseModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
          <Box sx={{ 
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#ffffff',
            height: '80vh',
            border: '2px solid #000000'
            // width: '90vw',
          }}>
            <NoticeEdit
              id={selectedNoticeId}
              onNoticeAdded={this.handleNoticeAdded}
              onCancel={this.handleCloseModal}
            />
          </Box>
        </Modal>
        </div>        
      </div>
    );
  }
}

export default App;