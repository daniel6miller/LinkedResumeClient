import React from 'react';
import Header from './header/header';
import Footer from './footer/footer';
import './layout.css';

function Layout({ children }) {
    return (
      <div className="layout-container">
        <header>
          <Header />
        </header>
        <main>
          {children}
        </main>
        <footer>
          <Footer />
        </footer>
      </div>
    );
  }

export default Layout;
