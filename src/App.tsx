// App.tsx
import React from 'react';
import NoticeList from './component/NoticeList';
import NoticeDetail from './component/NoticeDetail';
import NoticeEdit from './component/NoticeEdit';
import "./App.css";
import Header from './component/header/Header';
import Footer from './component/footer/Footer';

type Notice = {
  id: string,
  title: string,
  content: string,
  date: string
};

type AppState = {
  currentScreen: 'list' | 'detail' | 'edit';
  selectedNoticeId?: string;
};

class App extends React.Component<{}, AppState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      currentScreen: 'list'
    };
  }

  handleNoticeClick = (id: string) => {
    this.setState({ currentScreen: 'detail', selectedNoticeId: id });
  };

  handleBackToList = () => {
    this.setState({ currentScreen: 'list', selectedNoticeId: undefined });
  }

  handleEditNotice = (id : string | undefined) => {
    this.setState({currentScreen: 'edit', selectedNoticeId: id });
  }

  handleAddNotice = () => {
    this.setState({ currentScreen: 'edit', selectedNoticeId: undefined });
  };

  handleDeleteNotice = (id: string) => {
    if(window.confirm('삭제하시겠습니까?')){
      const savedNotices = JSON.parse(localStorage.getItem('notices') || '[]');
      const updatedNotices = savedNotices.filter((notice: Notice) => notice.id !== id);
      localStorage.setItem('notices', JSON.stringify(updatedNotices));
    }   

    //삭제 후 목록 화면으로
    this.setState({currentScreen: 'list'});
  }

  handleNoticeAdded = () => {
    this.setState({ currentScreen : 'list' });
  }

  render() {
    const { currentScreen, selectedNoticeId } = this.state;

    return (
      <div className='App'>
        <Header />        
        <main className='Mains'>
          {currentScreen === 'list' && (
            <div>
              <NoticeList onNoticeClick={this.handleNoticeClick} />
              {/* <button onClick={this.handleAddNotice}>공지사항 추가</button> */}
            </div>
          )}

          {currentScreen === 'detail' && selectedNoticeId && (
            <NoticeDetail 
              id={selectedNoticeId} 
              onBackToList={this.handleBackToList}
              onEditNotice={() => this.handleEditNotice(selectedNoticeId)}
              onDelete={this.handleDeleteNotice}
            />
          )}

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
      </div>
    );
  }
}

export default App;