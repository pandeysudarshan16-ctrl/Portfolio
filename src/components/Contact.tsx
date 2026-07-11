import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MdArrowOutward, MdCopyright } from "react-icons/md";
import "./styles/Contact.css";

const Contact = () => {
  useEffect(() => {
    ScrollTrigger.refresh();
  }, []);

  return (
    <div className="contact-section section-container" id="contact">
      <div className="contact-container">
        <h2>Contact</h2>
        <div className="contact-flex">
          <div className="contact-box">
           <h3>Let’s Connect</h3>
            <p>
              Open to collaborations, projects, and building impactful systems.
            </p>
            <p>
              <a
                href="https://www.linkedin.com/in/sudarshan-pandey-a4247037a"
                target="_blank"
                rel="noreferrer"
                data-cursor="disable"
              >
                LinkedIn — Sudarshan Pandey
              </a>
            </p>
            <h3>Education</h3>
            <p>
             Computer Science & Data Analytics, IIT Patna – Pursuing
            </p>
          </div>
          <div className="contact-box">
            <h3>Social</h3>
            <a
              href="https://github.com/pandeysudarshan16-ctrl"
              target="_blank"
              rel="noreferrer"
              data-cursor="disable"
              className="contact-social"
            >
              GitHub <MdArrowOutward />
            </a>
            <a
              href="https://www.linkedin.com/in/sudarshan-pandey-a4247037a"
              target="_blank"
              rel="noreferrer"
              data-cursor="disable"
              className="contact-social"
            >
              LinkedIn <MdArrowOutward />
            </a>
            <a
              href="https://www.instagram.com/sp___2130?igsh=ZjkzcWt3d2JtMWpt"
              target="_blank"
              rel="noreferrer"
              data-cursor="disable"
              className="contact-social"
            >
              Instagram <MdArrowOutward />
            </a>
          </div>
          <div className="contact-box">
            <p className="contact-designer">
              Designed and Developed <br /> by <span>Sudarshan Pandey</span>
            </p>
            <p className="contact-copyright">
              <MdCopyright /> 2026
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
