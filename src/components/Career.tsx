import "./styles/Career.css";

const Career = () => {
  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
          My career <span>&</span>
          <br /> experience
        </h2>
        <div className="career-info career-info-flex">
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h3>AI & Data Engineering Enthusiast</h3>
                <h4>IIT Patna </h4>
              </div>
              <h3>Now</h3>
            </div>
            <p>
             Building intelligent systems using AI, data analytics, and cloud technologies. 
             Focused on GenAI, AI agents, and scalable architectures. Actively solving 
             real-world problems through projects, hackathons, and industry-level simulations.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h3>Hackathon Participant</h3>
                <h4>Competitive Development</h4>
              </div>
              <h3>2025-2026</h3>
            </div>
            <p>
              Participated in Hack-It-Out (IIT BHU), DroidRun (IIT Patna), and Kalinga University Hackathon. 
              Built rapid prototypes under pressure, collaborated in high-intensity environments, 
              and delivered efficient, problem-driven solutions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
