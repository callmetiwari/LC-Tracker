const express=require("express");
const router = express.Router();
const User=require("../models/user.js");
const { signupValidation,loginValidation } = require("../middleware/AuthMiddleware.js");
const axios = require("axios");
const bcrypt = require("bcrypt");
const { error } = require("console");
const saltRounds = 10;
require("dotenv").config();

router.post("/usersignup", async (req, res) => {
  try {
    const { username, password, email } = req.body;

    // Check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    // Check if email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Create and register new user
    const newUser = new User({ email, username });
    // console.log("came till here");
    const registeredUser = await User.register(newUser, password); // Assuming passport-local-mongoose
    //  console.log("user made");
    // ✅ Send back success response
    res.status(201).json({ message: "User registered successfully", user: { username, email } });

  } catch (error) {
    // console.error("Signup error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

    // Fix: Remove `new` before `User.findOne()`

    router.post("/userlogin", loginValidation, async (req, res) => {
        const { username, password } = req.body;
        // console.log("came here");
      
        try {
          const user = await User.findOne({ username });
          if (!user) {
            return res.status(400).json({ error: "User not with the given username found" });
          }
      
          user.authenticate(password, (err, authenticatedUser, passwordError) => {
            if (err || !authenticatedUser) {
              return res.status(400).json({ error: "Incorrect password" });
            }
            return res.status(200).json({ success: "Login successful", user: authenticatedUser });
          });
      
        } catch (err) {
          return res.status(400).json({ error: "Login Failed" });
        }
      });


      router.post("/password-reset", async (req, res) => {
        const { username, email } = req.body;
      
        try {
          const user = await User.findOne({ email: email, username: username });
      
          if (!user) {
            return res.status(400).json({ error: "User with the given credentials not found" });
          }
      
          const otp = Math.floor(1000 + Math.random() * 9000); // generate 4-digit OTP
          // console.log(email);
          const apikey = process.env.BREVO_API_KEY; // Better to store this in .env
          // console.log(apikey);
          const url = 'https://api.brevo.com/v3/smtp/email';
         
          const emailData = {
            sender: {
              name: 'Shashank Tiwari',
              email: 'shashanktiwariak47@gmail.com'
            },
            to: [
              {
                email: email,
              }
            ],
            subject: 'OTP for CodeMate Account',
            htmlContent: `<html><body><p>Your OTP for password reset at CodeMate is: <strong>${otp}</strong></p></body></html>`
          };
      
          try {
            const response = await axios.post(url, emailData, {
              headers: {
                'Content-Type': 'application/json',
                'api-key': apikey
              }
            });
      
            // console.log('Email sent:', response.data);
      
            return res.status(200).json({
              message: "User found. OTP sent successfully.",
              username: user.username,
              otp // In production, store hashed version and send expiry
            });
      
          } catch (emailError) {
            // console.error("Email error:", emailError);
            return res.status(500).json({ error: "Error sending email" });
          }
      
        } catch (error) {
          // console.error("Password reset error:", error);
          return res.status(500).json({ error: "Internal server error" });
        }
      });
      

router.post("/userdata",async(req,res)=>{
    const {username}=req.body;
    console.log(`came till here ${username}`);
    const query = {
        operationName: "userProfileAndContestData",
        variables: { username },
        query: `query userProfileAndContestData($username: String!) {
          matchedUser(username: $username) {
            username
            profile {
              realName
              ranking
            }
            submitStats {
              acSubmissionNum {
                difficulty
                count
              }
            }
          }
          userContestRanking(username: $username) {
            rating
            attendedContestsCount
            globalRanking
          }
          userContestRankingHistory(username: $username) {
            attended
            trendDirection
            problemsSolved
            totalProblems
            finishTimeInSeconds
            rating
            ranking
            contest {
              title
              startTime
            }
          }
        }`
      };
      
  
      // console.log("📤 Sending request to LeetCode API...");
      
      const leetcodeResponse = await fetch("https://leetcode.com/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(query)
      });
       
      // console.log("📥 Response received from LeetCode");
  
      const leetcodeData = await leetcodeResponse.json();
      console.log("data fetched"); 
      const profile = leetcodeData.data.matchedUser;
      const contest = leetcodeData.data.userContestRanking;
      const contestHistory = leetcodeData.data.userContestRankingHistory;

      const allContests = leetcodeData.data.userContestRankingHistory || [];
      const attemptedContests = allContests.filter(contest => contest.attended);


    //   console.log("LeetCode Profile Fetched:");
    //   console.log(JSON.stringify(profile, null, 2));
  
    //   console.log("Contest Ranking:");
    //   console.log(JSON.stringify(contest, null, 2));

    //   console.log("Attempted Contests:");
    //   console.log(JSON.stringify(attemptedContests, null, 2));

  
      if (!profile) {
        return res.status(400).json({ error: "LeetCode user not found" });
      }
     console.log("data send");
      return res.status(200).json({
        message: "Signup successful",
        user: { username },
        leetcodeProfile: profile,
        userContestData: contest || null,
        attemptedContests: attemptedContests || []
      });
  
})






router.post("/contestdata", async (req, res) => {
    const query = {
      query: `
        query {
          allContests {
            title
            titleSlug
            startTime
            duration
            isVirtual
          }
        }
      `
    };
  
    try {
      const leetcodeResponse = await fetch("https://leetcode.com/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0" // required!
        },
        body: JSON.stringify(query)
      });
  
      const text = await leetcodeResponse.text(); // get raw response
  
      const leetcodeData = JSON.parse(text);

      if (leetcodeData.errors) {
        // console.error("❌ GraphQL Error:", leetcodeData.errors);
        return res.status(400).json({ error: leetcodeData.errors[0].message });
      }
  
      const allContests = leetcodeData.data.allContests;
  
      const now = Math.floor(Date.now() / 1000);
      const upcoming = allContests.filter(
        (c) => c.startTime > now && !c.isVirtual
      );
  
      return res.status(200).json({
        message: "Fetched upcoming contests",
        contests: upcoming
      });
    } catch (err) {
      // console.error("❌ Error while fetching:", err.message);
      return res.status(500).json({ error: "Failed to fetch contests" });
    }
  });
  
  router.post("/leetcode-submissions", async (req, res) => {
    const { username } = req.body;
  
    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }
  
    const query = `
      query recentSubmissionList($username: String!) {
        recentSubmissionList(username: $username) {
          title
          titleSlug
          timestamp
          statusDisplay
        }
      }
    `;
  
    try {
      const response = await axios.post(
        "https://leetcode.com/graphql",
        {
          query,
          variables: { username },
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Referer": `https://leetcode.com/${username}/`,
            "X-Requested-With": "XMLHttpRequest",
          },
        }
      );
  
      const submissions = response.data.data.recentSubmissionList || [];
  
      const now = Date.now();
      const tenDaysAgo = now - 10 * 24 * 60 * 60 * 1000;
  
      // Track first AC timestamp for each question
      const firstAcMap = new Map();
  
      submissions.forEach((sub) => {
        const ts = parseInt(sub.timestamp) * 1000;
        if (ts >= tenDaysAgo && sub.statusDisplay === "Accepted") {
          const titleSlug = sub.titleSlug;
          if (!firstAcMap.has(titleSlug) || ts < firstAcMap.get(titleSlug)) {
            firstAcMap.set(titleSlug, ts);
          }
        }
      });
  
      // Now group unique solves by their first solve date
      const dailyMap = new Map();
  
      for (const [, ts] of firstAcMap.entries()) {
        const date = new Date(ts).toISOString().split("T")[0];
        if (!dailyMap.has(date)) {
          dailyMap.set(date, 0);
        }
        dailyMap.set(date, dailyMap.get(date) + 1);
      }
  
      const result = Array.from(dailyMap.entries())
        .map(([date, count]) => ({
          date,
          Easy: count,
          Medium: 0,
          Hard: 0,
        }))
        .sort((a, b) => new Date(a.date) - new Date(b.date));
  
      res.json(result);
      // console.log(result);
    } catch (err) {
      console.error("Error fetching LeetCode submissions:", err.message);
      if (err.response) {
        console.error("Response data:", err.response.data);
      }
      res.status(500).json({
        error: "Failed to fetch submissions",
        details: err.message,
      });
    }
  });

  // router.post("/leetcode-submissions", async (req, res) => {
  //   const { username } = req.body;
  
  //   if (!username) {
  //     return res.status(400).json({ error: "Username is required" });
  //   }
  
  //   console.log("Received username:", username);
  
  //   // Updated query using submissionCalendar
  //   const query = `
  //   query recentSubmissionList($username: String!) {
  //     recentSubmissionList(username: $username) {
  //       title
  //       titleSlug
  //       timestamp
  //       statusDisplay
  //     }
  //   }
  // `;
  
  //   try {
  //     console.log("Sending to LeetCode:", {
  //       query,
  //       variables: { username },
  //     });
  
  //     const response = await axios.post(
  //       "https://leetcode.com/graphql",
  //       {
  //         query,
  //         variables: { username },
  //       },
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           "Referer": `https://leetcode.com/${username}/`,
  //           "X-Requested-With": "XMLHttpRequest",
  //         },
  //       }
  //     );
  
  //     if (!response.data.data?.matchedUser) {
  //       return res.status(404).json({ error: "User not found" });
  //     }
  
  //     // Parse the submission calendar data
  //     const submissionCalendar = JSON.parse(
  //       response.data.data.matchedUser.submissionCalendar || "{}"
  //     );
  
  //     // Convert to the format you need
  //     const submissions = Object.entries(submissionCalendar).map(([timestamp, count]) => ({
  //       timestamp,
  //       count,
  //     }));
   
  //     // Filter for last 10 days
  //     const now = Math.floor(Date.now() / 1000);
  //     const tenDaysAgo = now - 10 * 24 * 60 * 60;
      
  //     const recentSubmissions = Object.entries(submissionCalendar)
  //       .map(([timestamp, count]) => {
  //         const date = new Date(parseInt(timestamp) * 1000);
  //         return {
  //           date: date.toISOString().split("T")[0], // YYYY-MM-DD
  //           Easy: count,   // treat all as Easy or total
  //           Medium: 0,
  //           Hard: 0,
  //         };
  //       })
  //       .filter((entry) => {
  //         const ts = new Date(entry.date).getTime() / 1000;
  //         return ts >= tenDaysAgo;
  //       });
      
  //     // Sort dates in ascending order
  //     recentSubmissions.sort((a, b) => new Date(a.date) - new Date(b.date));
      
  //     // Send clean response
  //     res.json(recentSubmissions);
  //     console.log(recentSubmissions);
  //   } catch (err) {
  //     console.error("Error fetching LeetCode submissions:", err.message);
  //     if (err.response) {
  //       console.error("Response data:", err.response.data);
  //     }
  //     res.status(500).json({ 
  //       error: "Failed to fetch submissions",
  //       details: err.message 
  //     });
  //   }
  // });
 
  
  
 router.post("/newpassword", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: "User not found" });

    // Passport-local-mongoose provides setPassword()
    await user.setPassword(password);
    await user.save();

    res.status(200).json({ message: "Password updated successfully", user: { username } });
  } catch (err) {
    console.error("Password reset error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
  
module.exports = router;