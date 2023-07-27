/********************************************************************************* 
* WEB700 – Assignment 04 
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part 
* of this assignment has been copied manually or electronically from any other source 
* (including 3rd party web sites) or distributed to other students. * 
* Name: Shiroan Pathmanathan Student ID: 127723229 Date: 11/07/2023 * 
* Online (Cyclic) Link: https://github.com/Shiroan05/Assignment04.gi
* ********************************************************************************/



const express = require("express");
const path = require("path");
const collegeData = require("./modules/collegeData");

const app = express();
const HTTP_PORT = process.env.PORT || 8080;

app.use(express.static("views")); 
app.use(express.urlencoded({ extended: true })); 

app.get("/students", (req, res) => {
  collegeData
    .getAllStudents()
    .then((students) => {
      if (req.query.course) {
        return collegeData.getStudentsByCourse(Number(req.query.course));
      }
      return students;
    })
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.json({ message: "no results" });
    });
});

app.use(express.static(path.join(__dirname)));

app.get("/tas", (req, res) => {
  collegeData
    .getTAs()
    .then((tas) => {
      res.json(tas);
    })
    .catch((err) => {
      res.json({ message: "no results" });
    });
});

app.get("/courses", (req, res) => {
  collegeData
    .getCourses()
    .then((courses) => {
      res.json(courses);
    })
    .catch((err) => {
      res.json({ message: "no results" });
    });
});

app.get("/student/:num", (req, res) => {
  const studentNum = parseInt(req.params.num);
  collegeData
    .getStudentByNum(studentNum)
    .then((student) => {
      res.json(student);
    })
    .catch((err) => {
      res.json({ message: "no results" });
    });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "home.html"));
});

app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "about.html"));
});

app.get("/htmlDemo", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "htmlDemo.html"));
});

app.get("/students/add", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "addStudent.html"));
});

app.post("/students/add", (req, res) => {
  collegeData
    .addStudent(req.body)
    .then(() => {
      res.redirect("/students");
    })
    .catch((err) => {
      res.status(500).send("Error adding student");
    });
});

// 404 route
app.use((req, res) => {
  res.status(404).send("Page Not Found");
});

collegeData
  .initialize()
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log("Server listening on port: " + HTTP_PORT);
    });
  })
  .catch((err) => {
    console.error("Error initializing data:", err);
  });
