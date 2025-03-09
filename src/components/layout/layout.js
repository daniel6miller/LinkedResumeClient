import React from 'react';
import Header from './header/header';
import Footer from './footer/footer';
import './layout.css';

function Layout({ children }) {
  return (
      <>
          <header>
              <Header />
          </header>
          <main>
              {children}
          </main>
          <footer>
              <Footer />
          </footer>
      </>
  );
}

export default Layout;
