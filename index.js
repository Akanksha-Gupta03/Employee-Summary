const fs = require('fs');
const inquirer = require('inquirer');
// Managers questions
let ques_Manager = [{
        type: "input",
        message: "What is your manager name?",
        name: "managerName"
        
    },
    {
        type: "input",
        message: "Provide your manager's email",
        name: "email"
        
    },
    {
        type: "input",
        message: "What is your manager's id?",
        name: "id"
       
    },
    {
        type: "input",
        message: "Please provide your manager's phone number:",
        name: "phone"
       
    },
    {
        type: "number",
        message: "Provide number of employee's in team?",
        name: "noOfEmployees",
       
    }
]
// Team memember questions
let ques_Team = [{
        type: "input",
        message: "Team member name?",
        name: "name",
       
    },
    {
        type: "list",
        message: "what is the role of team member?",
        name: "type",
        choices: ['engineer', 'intern']
    },
    {
        type:"input",
        message:"What school did she/he graduate from?",
        name:"school"   
    },
    {
        type: "input",
        message: "Please provide email of team member:",
        name: "email"
        
    },
    {
        type: "input",
        message: "Please provide id:",
        name: "id"
       
    }
]


// classes
class Employee {
    constructor(name, email, id) {
        this.name = name,
            this.email = email,
            this.id = id
    }
};

class Manager extends Employee {

    constructor(name, email, id, phone) {
        super(name, email, id);
        this.phone = phone;
        this.role = 'manager';
    }
};

class Intern extends Employee {
    constructor(name, email, id, school) {
        super(name, email, id);
        this.school = school;
        this.role = 'intern';
    }
};

class Engineer extends Employee {
    constructor(name, email, id) {
        super(name, email, id);
        this.role = 'engineer';
    }
};

let teamMembers = [];

async function createHTMLfile() {
    let answers = await inquirer.prompt(ques_Manager);
    let newManager = new Manager(answers.managerName, answers.email, answers.id, answers.phone);
    for (let index = 0; index < answers.noOfEmployees; index++) {
        let answers = await inquirer.prompt(ques_Team);
        if (answers.type == 'intern') {
            let newEmployee = new Intern(answers.name, answers.email, answers.id, answers.school);
            teamMembers.push(newEmployee);
        } else {
            let newEmployee = new Engineer(answers.name, answers.email, answers.id);
            teamMembers.push(newEmployee)
        }
    }

    let manager_template = fs.readFileSync('Manager.template.html', 'utf-8');
    manager_template = manager_template.replace('NAME', newManager.name).replace('PHONE', newManager.phone).replace('EMAIL', newManager.email);
    teamMembers.forEach(member => {
        let employee_template = fs.readFileSync('Employee.template.html', 'utf-8');
        employee_template = employee_template.replace('NAME', member.name).replace('ROLE', member.role).replace('EMAIL', member.email).replace('ID',member.id);
        fs.appendFileSync('template.html', employee_template);
    });

    let indexFileTmpl = fs.readFileSync('Template.index.html', 'utf-8');
    let emplFile = fs.readFileSync('template.html', 'utf-8');
    indexFileTmpl = indexFileTmpl.replace('MANAGER', manager_template).replace('EMPLOYEE', emplFile);
    fs.writeFileSync('index.html', indexFileTmpl);
}

createHTMLfile();


module.exports = {
    Employee: Employee,
    Manager: Manager,
    Intern: Intern
}