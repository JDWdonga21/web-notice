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
import Container from '@mui/material/Container';
//다크모드
import { createTheme, ThemeProvider } from '@mui/material/styles';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  }
});
const lightTheme = createTheme({
  palette: {
    mode: 'light',
  }
});

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
  isdarkTheme: boolean;
};

class App extends React.Component<{}, AppState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      currentScreen: 'list',
      isModalOpen: false,
      isdarkTheme: false,
    };
  }
  componentDidMount(): void {
    const newDarkModeState = this.state.isdarkTheme;
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(JSON.stringify({ isdarkTheme: newDarkModeState }));
    }
  }
  //선택한 공지의 상세보기 화면을 표시하도록 상태를 업데이트
  handleNoticeClick = (id: string) => {
    this.setState({ isModalOpen: true, currentScreen: 'detail', selectedNoticeId: id });
  };
  //목록 화면으로 돌아가도록 상태를 업데이트
  handleBackToList = () => {
    this.setState({ currentScreen: 'list', isModalOpen: false, selectedNoticeId: undefined });
  }
  // 편집 화면을 표시하도록 상태를 업데이트
  handleEditNotice = (id : string | undefined) => {
    //모달 적용
    this.setState({ isModalOpen: true,  currentScreen: 'edit', selectedNoticeId: id });
  }
  // 새 공지 작성을 위한 편집 화면을 표시하도록 상태를 업데이트
  handleAddNotice = () => {
    //모달 적용
    this.setState({ isModalOpen: true, currentScreen: 'edit', selectedNoticeId: undefined });
  };
  // 로컬 스토리지에서 공지를 삭제하고 목록 화면으로 돌아가도록 함
  handleDeleteNotice = (id: string) => {
    if(window.confirm('삭제하시겠습니까?')){
      const savedNotices = JSON.parse(localStorage.getItem('notices') || '[]');
      const updatedNotices = savedNotices.filter((notice: Notice) => notice.id !== id);
      localStorage.setItem('notices', JSON.stringify(updatedNotices));
    }   
    //삭제 후 목록 화면으로
    this.setState({currentScreen: 'list', isModalOpen: false});
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

  };

  handleThemes = () => {
    const newDarkModeState = !this.state.isdarkTheme;
    this.setState({
      isdarkTheme: newDarkModeState
    });
    // React Native로 다크 모드 상태 전송
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(JSON.stringify({ isdarkTheme: newDarkModeState }));
    }
  };

  render() {
    const { currentScreen, selectedNoticeId } = this.state;
    return (
      <ThemeProvider theme={this.state.isdarkTheme ? darkTheme : lightTheme}>
        <Container 
          maxWidth="lg" 
          sx={{
            width: '100vw',
            height: '100vh',
            alignItems: 'center',
            justifyContent: 'space-between',
            margin: '0 auto',
            padding: '0',
            backgroundColor: 'background.default',
            zIndex: 2
        }}>
          <Header 
            isdarkTheme={this.state.isdarkTheme}
            onChangeTheme={this.handleThemes}
          />        
          <Box
            position="static"
            sx={{
              position: 'fixed',
              top: '10vh',
              left: 0,
            }}
          >
            {/* 리스트 화면 */}
            {currentScreen === 'list' && (
              <div>
                <NoticeList onNoticeClick={this.handleNoticeClick} />
              </div>
            )}
            {/* 상세 화면 */}
            {currentScreen === 'detail' && selectedNoticeId && (
              <div></div>
            )}
            {/* 추가,편집 화면 */}
            {currentScreen === 'edit' && (
              <div></div>
            )}
          </Box>
          <Footer
            appCurrentScreen = {this.state.currentScreen}
            onAddNotice = {this.handleAddNotice}
            selectedNoticeId={selectedNoticeId} 
            onBackToList={this.handleBackToList}
            onEditNotice={() => this.handleEditNotice(selectedNoticeId)}
            onDelete={this.handleDeleteNotice}
            onCancel={this.handleNoticeAdded}
          />   
                  
      </Container>
      {/* NoticeEdit 모달 */}
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1}}>
            <Modal
              open={this.state.isModalOpen}
              onClose={this.handleCloseModal}
              style={{ border: 'none', overflow: 'hidden' }}
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
              // height: '80vh',
              border: '2px solid #000000',
              zIndex: 1
            }}>
              {currentScreen === 'edit' && (
                <NoticeEdit 
                  id={selectedNoticeId}
                  onNoticeAdded = {this.handleNoticeAdded}  
                  onCancel={this.handleNoticeAdded}        
                />
              )}
              {currentScreen === 'detail' && selectedNoticeId && (
                <NoticeDetail 
                  id={selectedNoticeId} 
                  onBackToList={this.handleBackToList}
                  onEditNotice={() => this.handleEditNotice(selectedNoticeId)}
                  onDelete={this.handleDeleteNotice}
                />
              )}
            </Box>
          </Modal>
        </div>
      </ThemeProvider>
    );
  }
}

export default App;