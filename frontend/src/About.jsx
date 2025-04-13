import { FaLinkedin, FaGithub, FaInstagram, FaTwitter } from "react-icons/fa";
import myImage from "./assets/profile.jpeg"; // Replace with your image
import { motion } from "framer-motion";

export default function AboutUs() {
  return (
    <div className="container text-center py-5" style={{ backgroundColor: "#121212", minHeight: "100vh" }}>
      <h2 className="text-white mb-5">About</h2>

      <div className="row justify-content-center">
        {/* Shashank Card */}
        <motion.div
          className="col-md-4 mb-4"
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="card text-light" style={{ backgroundColor: "#1f1f1f" }}>
            <img
              src={myImage}
              className="card-img-top"
              alt="Shashank Tiwari"
              style={{ objectFit: "cover", height: "320px" }}
            />
            <div className="card-body">
              <h5 className="card-title">Shashank Tiwari</h5>
              <p className="card-text mb-3">
                Pre-Final Year @Graphic Era University <br />
                Competitive Programmer | Web Dev | AI Enthusiast
              </p>
              <div className="d-flex justify-content-center gap-3 mb-3">
                <a href="https://www.linkedin.com/in/shashank-tiwari-6a140124b/" target="_blank" rel="noreferrer">
                  <FaLinkedin size={22} color="#0A66C2" />
                </a>
                <a href="https://github.com/your-username" target="_blank" rel="noreferrer">
                  <FaGithub size={22} color="#f5f5f5" />
                </a>
                <a href="https://instagram.com/your-instagram" target="_blank" rel="noreferrer">
                  <FaInstagram size={22} color="#E1306C" />
                </a>
                <a href="https://twitter.com/your-twitter" target="_blank" rel="noreferrer">
                  <FaTwitter size={22} color="#1DA1F2" />
                </a>
              </div>
              <a
                href="https://www.linkedin.com/in/shashank-tiwari-6a140124b/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-info"
              >
                🔗 Connect on LinkedIn
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
