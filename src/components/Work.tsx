import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./styles/Work.css";

const projects = [
  {
    title: "AI Recruiter: Candidate Recommendation System",
    category: "Machine Learning",
    tools: "python • scikit-learn • pandas • numpy",
    description:
      "Made an app to recommend most suitable candidates for job positions using machine learning algorithms.",
    link: "https://github.com/pandeysudarshan16-ctrl/AI-RECRUITER",
  },
  {
    title: "Custom Ecommerce Website",
    category: "Web Development",
    tools: "React • Node.js • MongoDB • Express",
    description:
      "Built a responsive ecommerce website for managing and displaying products.",
    link: "https://hariom-enterprises.vercel.app/",
  },
  {
    title: "Edunest AI: Intelligent study companion",
    category: "AI & Automation",
    tools: "AI",
    description:
      "An AI-powered study companion that provides personalized learning experiences, helping students grasp complex concepts and excel academically.",
    link: "https://edunest-nine.vercel.app/",
  },
  {
    title: "Hackathon Project: AI-SOC-LITE",
    category: "cybersecurity • hackathon",
    tools: "APIs • Problem Solving • Team Collaboration",
    description:
      "Built a working prototype under time constraints with focus on efficiency and usability.",
    link: "https://github.com/pandeysudarshan16-ctrl/AI-SOC-LITE",
  },
];

const Work = () => {
  useEffect(() => {
    ScrollTrigger.refresh();
  }, []);

  return (
    <div className="work-section" id="work">
      <div className="work-container section-container">
        <h2>
          Selected <span>Projects</span>
        </h2>

        <div className="project-list">
          {projects.map((project, index) => (
            <div className="project-card" key={index}>
              
              <div className="project-number">
                {String(index + 1).padStart(2, "0")}
              </div>

              <div className="project-content">
                <h3>
                  <a href={project.link} target="_blank" rel="noreferrer">
                    {project.title}
                  </a>
                </h3>

                <p className="project-category">{project.category}</p>

                <p className="project-description">
                  {project.description}
                </p>

                <div className="project-tools">
                  {project.tools}
                </div>

                <a
                  href={project.link}
                  target="_blank"
                  rel="noreferrer"
                  className="project-btn"
                >
                  View Project →
                </a>
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Work;