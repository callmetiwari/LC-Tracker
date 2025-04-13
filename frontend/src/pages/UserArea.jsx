import { useParams, useLocation, href,Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { handelSucess } from "../error/utils";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { PieChart } from '@mui/x-charts/PieChart';
import { BarChart } from '@mui/x-charts/BarChart';
import { Typography, Box } from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';
import { useTypewriter } from '../hooks/useTypewriter';
import { useNavigate } from "react-router-dom";
import Logo from "../assets/Logo.jpg";
import "./UserArea.css";
import { color } from "framer-motion";

export default function UserDashboard() {
  const { username } = useParams();
  const location = useLocation();
  const navigate = useNavigate();


  const [userleetcodeProfile, setleetcodeProfile] = useState();
  const [userattemptedContests, setattemptedContests] = useState([]);
  const [userContestData, setUserContestData] = useState();

const [solvedCounts, setSolvedCounts] = useState([]);
const [submissionData, setSubmissionData] = useState({
  easy: [],
  medium: [],
  hard: [],
  labels: []
});
const [loading, setLoading] = useState({
  profile: true,
  submissions: true
});

  
  const fetchUserData = async () => {
    try {
      const response = await fetch("http://lc-tracker-vwrn.onrender.com/userdata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });

      const res = await response.json();

      console.log("User data fetched 0:");
      if (res.message) handelSucess(res.message);
      // console.log(res.attemptedContests);
      setleetcodeProfile(res.leetcodeProfile);
      setattemptedContests(res.attemptedContests || []);
      setUserContestData(res.userContestData);
      console.log("User data fetched 1:", data);
  
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchSubmissions = async () => {
    try {
      setLoading(prev => ({ ...prev, submissions: true }));
  
      const res = await fetch("http://lc-tracker-vwrn.onrender.com/leetcode-submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username })
      });
  
      const fetchedData = await res.json();
      // console.log("Raw submissions data:", fetchedData);
  
      if (fetchedData?.length) {
        const processed = {
          easy: [],
          labels: []
        };
  
        fetchedData.forEach(day => {
          processed.labels.push(day.date); // Use the date as the label
          processed.easy.push(day.Easy);  // Use the Easy value for the "Easy" problems count
        });
  
        // console.log("Processed data:", processed);
        setSubmissionData(processed);
      }
    } catch (error) {
      // console.error("Error:", error);
    } finally {
      setLoading(prev => ({ ...prev, submissions: false }));
    }
  };
  
  useEffect(() => {
    if (username) {
      fetchUserData();
       fetchSubmissions();
    }
  }, [username]);



  const handleClick = () => {
    navigate("/contests"); 
};




  const ratingData = userattemptedContests.map(contest => Math.round(contest.rating));
  const labelData = userattemptedContests.map(contest => contest.contest.title);
const ratingDataset = userattemptedContests.map((contest) => ({
  date: new Date(contest.contest.startTime * 1000),
  rating: Math.round(contest.rating),
}));
const typedText = useTypewriter(['Grow', 'Track', 'Progress']);
const labels = solvedCounts.length > 0 ? solvedCounts.map((_, index) => `Day ${index + 1}`) : [];



  return (
    <div className="User">
      <div className="nav"> 
      <nav className="navbar sticky-top bg-body-tertiary">
  <div className="NavLogo">
    <h1>CodeMate <img src={Logo} alt="Logo" className="NavLogoI" /></h1>
  </div>
  <div className="NavCenters">
    <div className="contestbtn">
      <b><button onClick={handleClick}>Upcoming Contest</button></b>
    </div>
    {/* Use Link instead of <a> */}
    <Link className="navbar-brand" to="/about"><b>About Us</b></Link>
    <Link className="navbar-brand" to="#"><b>Back To Top</b></Link>
    <Link className="navbar-brand" to="mailto:shashanktiwari3101@gmail.com"><b>Contact Us</b></Link>
    <Link
      className="navbar-brand"
      to="https://www.similarity.in/contests"
      target="_blank"
      rel="noopener noreferrer"
    >
      <b>Recent Plag Reports</b>
    </Link>
  </div>
  <div className="LogOutBtns">
    <Button
      type="button"
      className="btn btn-outline-danger"
      onClick={() => {
        localStorage.removeItem("username");
        navigate("/login");
      }}
    >
      <b>Logout</b>
    </Button>
  </div>
</nav>
      </div>

   
<Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="h4">
          Welcome To CodeMate, We Help To You{' '}
          <span style={{ color: '#4CAF50', fontWeight: 'bold' }}>{typedText}</span>
        </Typography>
      </Box>


      {userleetcodeProfile ? (
        <div className="user-section" style={{ padding: '2rem' }}>
           <h1>Welcome, {userleetcodeProfile.username}!</h1> <div className="UserDetails">
          
            <p>Real Name: {userleetcodeProfile.profile?.realName ?? "N/A"}</p>
            <p>Ranking: {userleetcodeProfile.profile?.ranking ?? "N/A"}</p>
            <p>Contest Rating: {userContestData?.rating ?? "N/A"}</p>
            <p>Contests Attempted: {userattemptedContests?.length ?? 0}</p>
          </div>
        
    
          {/* Pie Chart for Submission Stats */}
          {userleetcodeProfile?.submitStats?.acSubmissionNum && (
          
           <div className="pie-container"> 
              <h1 className="SProblemTitle">Solved Problem Stats</h1> 
              <PieChart
  className="PieChart"
  series={[
    {
      arcLabel: (item) => {
        const labelMap = {
          0: 'Easy',
          1: 'Medium',
          2: 'Hard',
        };
        return `${labelMap[item.id]}: ${item.value}`;
      },
      arcLabelStyle: {
        fontSize: 18,
        fontWeight: 'bold',
        fill: '#ffffff',
      },
      data: [
        {
          id: 0,
          value: userleetcodeProfile.submitStats.acSubmissionNum[1]?.count ?? 0,
          color: '#4caf50',
        },
        {
          id: 1,
          value: userleetcodeProfile.submitStats.acSubmissionNum[2]?.count ?? 0,
          color: '#ff9800',
        },
        {
          id: 2,
          value: userleetcodeProfile.submitStats.acSubmissionNum[3]?.count ?? 0,
          color: '#f44336',
        },
      ],
     
    },
  ]}
  width={600}
  height={500}
/>

            <div className="custom-legend">
            <div><span className="legend-color" style={{ backgroundColor: '#4caf50' }}></span> Easy</div>
            <div><span className="legend-color" style={{ backgroundColor: '#ff9800' }}></span> Medium</div>
            <div><span className="legend-color" style={{ backgroundColor: '#f44336' }}></span> Hard</div>
          </div>
          </div>
          )}
      <div>
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="h4">No of Questions Made Past Few Days</Typography>
      </Box>
      <div className="daily-solutions">
  {loading.submissions ? (
    <p>Loading data...</p>
  ) : submissionData.labels.length > 0 ? (
    <div style={{ width: '100%', overflowX: 'auto' }}>
   <BarChart
  xAxis={[{
    scaleType: 'band',
    data: submissionData.labels, // This will be the dates array
    label: 'Date',
    labelStyle: { fill: '#fff' },
    tickLabelStyle: {
      fill: '#fff',
      angle: 45,
      textAnchor: 'start',
      fontSize: 12
    }
  }]}
  yAxis={[{
    label: 'Submissions Made',
    min: 0,
    labelStyle: { fill: '#fff' },
    tickLabelStyle: { fill: '#fff' }
  }]}
  series={[
    {
      data: submissionData.easy, // This will contain the count of Easy problems for each day
      label: 'Count',
      color: '#4CAF50'
    }
  ]}
  width={Math.max(700, submissionData.labels.length * 70)}
  height={400}
  margin={{ top: 20, bottom: 100, left: 70, right: 30 }}
  grid={{ vertical: true }}
  slotProps={{
    legend: {
      labelStyle: { fill: '#fff' },
      direction: 'row',
      position: { vertical: 'bottom', horizontal: 'middle' },
    }
  }}
/>

    </div>
  ) : (
    <p>No submission data available</p>
  )}
</div>
   </div>

<div >
<h1 className="Title">Your Contests Ratings</h1> 
<LineChart className="RatingGraph"
  dataset={userattemptedContests.map((c) => ({
    x: new Date(c.contest.startTime * 1000),
    y: Math.round(c.rating),
  }))}
  xAxis={[
    {
      dataKey: 'x',
      scaleType: 'time',
      label: 'Contest Date',
      labelStyle: { fill: '#ffffff', dy: 40 },
      tickLabelStyle: {
        fill: '#ffffff',
        fontSize: 12,
        transform: 'rotate(-45deg)', // or -30deg
        textAnchor: 'start', // ensures rotation works
      },
      minStep: 2, // reduces how many ticks are shown
    },
  ]}
  yAxis={[
    {
      label: 'Rating',
      labelStyle: { fill: '#ffffff', dx: -100 },
      tickLabelStyle: {
        fill: '#ffffff',
        fontSize: 14,
        
      },
    },
  ]}
  series={[
    {
      dataKey: 'y',
      label: 'Contest Rating',
      labelStyle: { color: '#4caf50' }, 
      showMark: true,
      color: '#4caf50',
    },
  ]}
  height={600}
  width={1200}
  margin={{ top: 40, bottom: 80, left: 80, right: 60 }}
  grid={{ vertical: true, horizontal: true }}
  tooltip={{ trigger: 'item' }}
  slotProps={{
    legend: {
      labelStyle: { color: '#ffffff' }, // This is the key to change legend label color
      direction: 'coloum',
      position: { vertical: 'top', horizontal: 'middle' },
    },
  }}
/>

</div>



          {/* Contest Cards */}
          <div  >
            <h1 className="Title">Your Recent Contests</h1>
           <div className="ContestCards">
                  {[...userattemptedContests]
          .sort((a, b) => b.contest.startTime - a.contest.startTime) // Sort by most recent first
          .slice(0, 10)
          .map((contest, index) => (
            <Card className="cardDetail" sx={{ maxWidth: 345, my: 2 }} key={index}>
              <CardContent>
                <Typography className="cardDetail contestTitle" gutterBottom variant="h5" component="div">
                  {contest.contest.title}
                </Typography>
                <Typography className="cardDetail" variant="body2" sx={{ color: 'text.secondary' }}>
                  Start Time: {new Date(contest.contest.startTime * 1000).toLocaleString()}
                </Typography>
                <Typography className="cardDetail" variant="body2" sx={{ color: 'text.secondary' }}>
                  Problems Solved: {contest.problemsSolved} / {contest.totalProblems}
                </Typography>
                <Typography className="cardDetail" variant="body2" sx={{ color: 'text.secondary' }}>
                  Ranking: {contest.ranking}
                </Typography>
                <Typography className="cardDetail" variant="body2" sx={{ color: 'text.secondary' }}>
                  Rating: {Math.round(contest.rating)}
                </Typography>
                <Typography variant="body2" className={contest.trendDirection === "UP" ? "trend-up" : "trend-down"}>
                  Trend: {contest.trendDirection === "UP" ? "↑ UP" : "↓ DOWN"}
               </Typography>
               <Typography className="cardDetail" variant="body2" sx={{ color: 'text.secondary' }}>
                 Your PlagStatus: Coming Soon
               </Typography>
              </CardContent>
              <CardActions>
              <Button size="small" onClick={() => {
                    let contestTitle = contest.contest.title;
                    let slug = "";
                    if (contestTitle.startsWith("Biweekly")) {
                      slug = `biweekly-contest-${contestTitle.split(" ").pop()}`;
                    } else if (contestTitle.startsWith("Weekly")) {
                      slug = `weekly-contest-${contestTitle.split(" ").pop()}`;
                    }
                    const url = `https://leetcode.com/contest/${slug}`;
                    window.open(url);
                  }}>
                  Details
                  </Button>

              </CardActions>
            </Card>
       
        ))} </div> </div>
        </div>
      ) : (
        <div className="clearfix  d-flex align-items-center justify-content-center mt-4">
        <div className="spinner-border me-3" role="status"></div>
        <h4 className="mb-0">Loading...</h4>
      </div>
      
      )}
     </div>
  );
}
