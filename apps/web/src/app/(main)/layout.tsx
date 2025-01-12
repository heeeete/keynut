import Footer from './_components/Footer';
import BottomNav from './_components/BottomNav/BottomNav';
import Nav from './_components/Nav';
import { ModalProvider } from './_components/ModalProvider';
import { RecentViewProvider } from './_components/RecentViewComponent/RecentViewContext';
import RightBar from './_components/RightBar';
import { ModelViewerProvider } from './_components/ModelViewerComponent/ModelViewerContext';
import { ReactNode } from 'react';
import dynamic from 'next/dynamic';
const Modal = dynamic(() => import('./_components/Modal'), {
  ssr: false, // 서버사이드 렌더링 비활성화 (Modal은 클라이언트에서만 렌더링)
});
// import Modal from './_components/Modal';

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <ModalProvider>
      <Nav />
      <ModelViewerProvider>
        <RecentViewProvider>
          <div className="relative main-1280 max-[960px]:pt-0">{children}</div>
          <RightBar />
        </RecentViewProvider>
      </ModelViewerProvider>
      <Footer />
      <BottomNav />
      <Modal />
    </ModalProvider>
  );
}
