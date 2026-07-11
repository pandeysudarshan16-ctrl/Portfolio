import { PropsWithChildren } from "react";
import "./styles/Landing.css";

const Landing = ({ children }: PropsWithChildren) => {
  return (
    <>
      <div className="landing-section" id="landingDiv">
        <div className="landing-container">
          <div className="landing-intro">
            <div className="landing-profile-container">
              <img
                src="/images/mypic.jpeg"
                alt="Sudarshan Pandey – Computer Science & Data Analytics Student at IIT Patna"
                className="landing-profile-photo"
              />
              <div className="landing-intro-text">
                <p className="landing-hello">Hello! I'm</p>
                <h1>
                  SUDARSHAN
                  <br />
                  <span>PANDEY</span>
                </h1>
              </div>
            </div>
          </div>
          <div className="landing-info">
            <h2 className="landing-info-subtitle">AI & Data Engineering</h2>
            <h2 className="landing-info-h2">
              <div className="landing-h2-1">Building</div>
              <div className="landing-h2-2">AI • Data • Cloud </div>
            </h2>
            <h2>
              <div className="landing-h2-info">Intelligent Systems</div>
              <div className="landing-h2-info-1">Execution Focused</div>
            </h2>
          </div>
        </div>
        {children}
      </div>
    </>
  );
};

export default Landing;
