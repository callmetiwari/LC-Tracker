import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function UpComingContest() {
  const [leetcodeContests, setLeetcodeContests] = useState([]);
  const [codeforcesContests, setCodeforcesContests] = useState([]);

  const fetchAllContests = async () => {
    try {
      // Fetch LeetCode contests from backend
      const response = await fetch("http://lc-tracker-vwrn.onrender.com/contestdata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const leetRes = await response.json();

      const leetcodeData = leetRes.contests.map(item => ({
        title: item.title,
        startTime: item.startTime,
        link: `https://leetcode.com/contest/${item.titleSlug}`,
        platform: "LeetCode",
      }));

      // Fetch Codeforces contests
      const cfResponse = await fetch("https://codeforces.com/api/contest.list");
      const cfData = await cfResponse.json();

      const upcomingCF = cfData.result
        .filter(contest => contest.phase === "BEFORE")
        .sort((a, b) => a.startTimeSeconds - b.startTimeSeconds)
        .slice(0, 3)
        .map(contest => ({
          title: contest.name,
          startTime: contest.startTimeSeconds,
          link: `https://codeforces.com/contest/${contest.id}`,
          platform: "Codeforces",
        }));

      setLeetcodeContests(leetcodeData);
      setCodeforcesContests(upcomingCF);
    } catch (err) {
      console.error("Unable to fetch contest data", err);
    }
  };

  useEffect(() => {
    fetchAllContests();
  }, []);

  const dropEffect = {
    initial: { y: -50, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { duration: 0.6, ease: "easeOut" },
  };

  return (
    <>
      {leetcodeContests.length > 0 || codeforcesContests.length > 0 ? (
        <>
          {/* LeetCode Section */}
          <h2 className="text-center my-4 text-light">Upcoming LeetCode Contests</h2>
          <div className="d-flex flex-wrap justify-content-center gap-4">
            {leetcodeContests.map((item, index) => (
              <motion.div
                key={index}
                className="card text-light bg-dark"
                style={{ width: "20rem" }}
                initial="initial"
                animate="animate"
                transition={{ ...dropEffect.transition, delay: index * 0.1 }}
                variants={dropEffect}
              >
                <div className="card-body">
                  <h5 className="card-title">{item.title}</h5>
                  <p className="card-text">
                    <strong>Platform:</strong> {item.platform}
                    <br />
                    <strong>Start:</strong>{" "}
                    {new Date(item.startTime * 1000).toLocaleString()}
                  </p>
                  <a
                    href={item.link}
                    className="btn btn-outline-info"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Contest
                  </a>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Codeforces Section */}
          <h3 className="text-center my-5 text-light">More contests you would like from diffrent platforms</h3>
          <div className="d-flex flex-wrap justify-content-center gap-4">
            {codeforcesContests.map((item, index) => (
              <motion.div
                key={index}
                className="card text-light bg-secondary"
                style={{ width: "20rem" }}
                initial="initial"
                animate="animate"
                transition={{ ...dropEffect.transition, delay: index * 0.1 }}
                variants={dropEffect}
              >
                <div className="card-body">
                  <h5 className="card-title">{item.title}</h5>
                  <p className="card-text">
                    <strong>Platform:</strong> {item.platform}
                    <br />
                    <strong>Start:</strong>{" "}
                    {new Date(item.startTime * 1000).toLocaleString()}
                  </p>
                  <a
                    href={item.link}
                    className="btn btn-outline-light"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Contest
                  </a>
                </div>
              </motion.div>
            ))}
            
          </div>
                      {/* Platform Links Section */}
            <h3 className="text-center my-5 text-light">Explore More Platforms</h3>
            <div className="d-flex flex-wrap justify-content-center gap-4 mb-5">
              {[
                {
                  name: "Codeforces",
                  link: "https://codeforces.com/contests",
                  color: "bg-primary",
                },
                {
                  name: "CodeChef",
                  link: "https://www.codechef.com/contests",
                  color: "bg-danger",
                },
                {
                  name: "AtCoder",
                  link: "https://atcoder.jp/contests/",
                  color: "bg-success",
                },
              ].map((site, index) => (
                <motion.div
                  key={index}
                  className={`card text-light ${site.color}`}
                  style={{ width: "18rem" }}
                  initial="initial"
                  animate="animate"
                  transition={{ ...dropEffect.transition, delay: index * 0.2 }}
                  variants={dropEffect}
                >
                  <div className="card-body text-center">
                    <h5 className="card-title">{site.name}</h5>
                    <p className="card-text">Visit the official contest page of {site.name}</p>
                    <a
                      href={site.link}
                      className="btn btn-light"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Go to {site.name}
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>

        </>
      ) : (
        <p className="text-center text-light">Loading...</p>
      )}
    </>
  );
}
