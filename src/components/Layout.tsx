import { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
  isDarkPage?: boolean;
}

const Layout = ({ children, isDarkPage = false }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isDarkPageProp={isDarkPage} />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout; 