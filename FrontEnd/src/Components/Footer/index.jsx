import React from "react";
import { Send, Facebook, Twitter, Github } from "lucide-react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./index.css"; // Import the external CSS file

const Footer = () => {
  return (
    <footer className="footer">
      {/* Newsletter Section */}
      <div className="newsletter">
        <div className="newsletter-container">
          <div className="newsletter-content">
            <Send className="newsletter-icon" />
            <div>
              <span className="newsletter-title">Sign up to Newsletter</span>
              <span className="newsletter-text">
                ...and receive <span className="coupon">$20 coupon</span> for first shopping.
              </span>
            </div>
          </div>
          <div className="newsletter-form">
            <input type="email" placeholder="Email address" className="newsletter-input" />
            <button className="newsletter-button">Sign Up</button>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="footer-container">
        {/* Company Info */}
        <div className="footer-section">
          <h2 className="footer-logo">
            electro<span className="dot">.</span>
          </h2>
          <div className="footer-contact">
          <span className="footer-icon">🎧</span>
          <div>
              <p className="contact-text">Got questions? Call us 24/7!</p>
              <p className="contact-number">(800) 8001-8588, (0600) 874 548</p>
            </div>
          </div>
          <p className="footer-address">17 Princess Road, London, Greater London NW1 8JR, UK</p>
          <div className="footer-social">
            <a href="#" className="social-link"><Facebook size={20} /></a>
            <a href="#" className="social-link"><Twitter size={20} /></a>
            <a href="#" className="social-link"><Github size={20} /></a>
          </div>
        </div>

        {/* Footer Links */}
        <div className="footer-section">
          <h3 className="footer-title">Find it Fast</h3>
          <ul className="footer-list">
            {["Laptops & Computers", "Cameras & Photography", "Smart Phones & Tablets", "Video Games & Consoles", "TV & Audio", "Gadgets", "Car Electronic & GPS"].map((item) => (
              <li key={item}><a href="#" className="footer-link">{item}</a></li>
            ))}
          </ul>
        </div>

        <div className="footer-section">
          <ul className="footer-list">
            {["Printers & Ink", "Software", "Office Supplies", "Computer Components", "Accessories"].map((item) => (
              <li key={item}><a href="#" className="footer-link">{item}</a></li>
            ))}
          </ul>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">Customer Care</h3>
          <ul className="footer-list">
            {["My Account", "Order Tracking", "Wish List", "Customer Service", "Returns / Exchange", "FAQs", "Product Support"].map((item) => (
              <li key={item}><a href="#" className="footer-link">{item}</a></li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <p className="footer-copyright">© Electro - All rights Reserved</p>
        <div className="footer-payment-icons">
          <i className="fa-brands fa-cc-visa payment-icon"></i>
          <i className="fa-brands fa-cc-mastercard payment-icon"></i>
          <i className="fa-brands fa-cc-discover payment-icon"></i>
          <i className="fa-brands fa-cc-paypal payment-icon"></i>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
