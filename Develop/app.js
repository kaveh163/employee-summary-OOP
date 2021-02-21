const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

class EmployeeInfo {
  constructor() {
    this.employees = [];
  }
  getEmployees() {
    return this.employees;
  }
  employee() {
    this.teamMemberType = "";
    this.managerAdd = false;
    this.memberAdd = false;
    this.manageEmployees();
  }
  manageEmployees() {
    this.askManagerInfo().then(() => {
      this.employeeMembers();
    });
  }
  askManagerInfo() {
    return inquirer
      .prompt([
        {
          name: "managerName",
          type: "input",
          message: "Enter manager name",
        },
        {
          name: "managerId",
          type: "input",
          message: "Enter manager id",
        },
        {
          name: "managerEmail",
          type: "input",
          message: "Enter manager email",
        },
        {
          name: "managerofficeNumber",
          type: "input",
          message: "Enter manager office number",
        },
      ])
      .then(({ managerName, managerId, managerEmail, managerofficeNumber }) => {
        const manager = new Manager(
          managerName,
          managerId,
          managerEmail,
          managerofficeNumber
        );
        this.employees.push(manager);
      });
  }
  employeeMembers() {
    this.askMemberType().then(() => {
      if (this.teamMemberType === "Engineer") {
        this.askEngineer().then(() => {
          this.addTeamMember().then(() => {
            if (this.memberAdd) {
              this.employeeMembers();
            } else if (!this.memberAdd) {
              this.addManager().then(() => {
                if (this.managerAdd) {
                  this.employee();
                } else if (!this.managerAdd) {
                  this.quit();
                }
              });
            }
          });
        });
      } else if (this.teamMemberType === "Intern") {
        this.askIntern().then(() => {
          this.addTeamMember().then(() => {
            if (this.memberAdd) {
              this.employeeMembers();
            } else if (!this.memberAdd) {
              this.addManager().then(() => {
                if (this.managerAdd) {
                  this.employee();
                } else if (!this.managerAdd) {
                  this.quit();
                }
              });
            }
          });
        });
      }
    });
  }
  addTeamMember() {
    return inquirer
      .prompt([
        {
          name: "teamMember",
          type: "confirm",
          message: "Do want to add team member?",
        },
      ])
      .then(({ teamMember }) => {
        if (teamMember) {
          this.memberAdd = true;
        } else {
          this.memberAdd = false;
        }
      });
  }
  askMemberType() {
    return inquirer
      .prompt([
        {
          name: "memberType",
          type: "list",
          message: "Choose member type (Engineer/Intern):",
          choices: ["Engineer", "Intern"],
        },
      ])
      .then(({ memberType }) => {
        if (memberType === "Engineer") {
          this.teamMemberType = "Engineer";
        } else if (memberType === "Intern") {
          this.teamMemberType = "Intern";
        }
      });
  }
  askEngineer() {
    return inquirer
      .prompt([
        {
          name: "engineerName",
          type: "input",
          message: "Enter engineer name:",
        },
        {
          name: "engineerId",
          type: "input",
          message: "Enter engineer id:",
        },
        {
          name: "engineerEmail",
          type: "input",
          message: "Enter engineer email:",
        },
        {
          name: "engineerGithub",
          type: "input",
          message: "Enter engineer github:",
        },
      ])
      .then(({ engineerName, engineerId, engineerEmail, engineerGithub }) => {
        const engineer = new Engineer(
          engineerName,
          engineerId,
          engineerEmail,
          engineerGithub
        );
        this.employees.push(engineer);
      });
  }
  askIntern() {
    return inquirer
      .prompt([
        {
          name: "internName",
          type: "input",
          message: "Enter intern name:",
        },
        {
          name: "internId",
          type: "input",
          message: "Enter intern id:",
        },
        {
          name: "internEmail",
          type: "input",
          message: "Enter intern email:",
        },
        {
          name: "internSchool",
          type: "input",
          message: "Enter intern school:",
        },
      ])
      .then(({ internName, internId, internEmail, internSchool }) => {
        const intern = new Intern(
          internName,
          internId,
          internEmail,
          internSchool
        );
        this.employees.push(intern);
      });
  }
  addManager() {
    return inquirer
      .prompt([
        {
          name: "manager",
          type: "confirm",
          message: "Do want to add Manager?",
        },
      ])
      .then(({ manager }) => {
        if (manager) {
          this.managerAdd = true;
        } else {
          this.managerAdd = false;
        }
      });
  }
  quit() {
    console.log(this.employees);
    const HTML = render(this.getEmployees());
    //send to File team.html
    try {
      if (fs.existsSync(OUTPUT_DIR)) {
        console.log("Directory exists.");
        fs.writeFileSync(outputPath, HTML);
        // fs.appendFile(outputPath, "Hello", (err) => {
        //   if (err) throw err;
        // });
      } else {
        console.log("Directory does not exist. created the output directory");
        fs.mkdirSync(OUTPUT_DIR);
        fs.writeFileSync(outputPath, HTML);
        // fs.appendFile(outputPath, "Hello", (err) => {
        //   if (err) throw err;
        // });
      }
    } catch (e) {
      console.log("An error occurred.");
    }

    process.exit(0);
  }
}

const employeeInfo = new EmployeeInfo();
employeeInfo.employee();

// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```
