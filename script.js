const gradePoints = {
    'A*': 10,
    'A': 9,
    'B+': 8,
    'B': 7,
    'B-': 6,
    'C': 5,
    'F': 0,
};

const subjectForm = document.getElementById('addSubjectForm');
const subjectNameInput = document.getElementById('subjectName');
const gradeSelect = document.getElementById('gradeSelect');
const creditsSelect = document.getElementById('creditSelect');
const subjectTableBody = document.getElementById('subjectTableBody');
const emptyTable = document.getElementById('emptyTable');
const cgpaValue = document.getElementById('cgpaValue');
const totalCreditsEl = document.getElementById('totalCredits');
const weightedPointsEl = document.getElementById('weightedPoints');
const clearAllButton = document.getElementById('clearAllButton');

let subjects = [];

function computeSummary(){
    let totalCredits = 0;
    let weightedPoints = 0;
    for(let i=0; i<subjects.length; i++){
        const credits = Number(subjects[i].credits);
        const points = gradePoints[subjects[i].grade];
        totalCredits += credits;
        weightedPoints += points * credits;
    }

    let cgpa = 0;
    if (totalCredits > 0){
        cgpa = weightedPoints / totalCredits;
    }

    return {
        'totalCredits' : totalCredits,
        'weightedPoints' : weightedPoints,
        'cgpa' : cgpa
    };
}

function getScoreRange(cgpa){
    if(cgpa>=8) return 'score-good';
    else if(cgpa>=6) return 'score-warning';
    else return 'score-bad';
}

function addSubjectRow(subject, index){
    const points = gradePoints[subject.grade]
    return `
        <tr>
            <td> ${subject.subject} </td>
            <td> ${subject.grade} </td>
            <td> ${points} </td>
            <td> ${subject.credits} </td>
            <td> <button class="delete-subject-button" data-index="${index}">Delete</button> </td>
        </tr>
    `;
}

function renderSubjects(){
    const summary = computeSummary();
    let tableRows = '';

    if(subjects.length === 0){
        subjectTableBody.innerHTML = '';
        emptyTable.classList.add('empty-table-visible');
    }else{
        emptyTable.classList.remove('empty-table-visible');

        for(let i=0; i<subjects.length; i++){
            tableRows += addSubjectRow(subjects[i] , i);
        }

        subjectTableBody.innerHTML = tableRows;
    }

    const scoreRange = getScoreRange(summary.cgpa);
    if(summary.totalCredits > 0){
        cgpaValue.textContent = summary.cgpa.toFixed(2);
    }else{
        cgpaValue.textContent = '0.00';
    }
    cgpaValue.className = `cgpa-value ${scoreRange}`;
    totalCreditsEl.textContent = String(summary.totalCredits);
    weightedPointsEl.textContent = String(summary.weightedPoints);
}

function addSubject(event){
    event.preventDefault();
    const subject = subjectNameInput.value.trim();
    const grade = gradeSelect.value;
    const credits = Number(creditsSelect.value);

    if(!subject) return;

    subjects.push({subject , grade , credits});
    subjectForm.reset();
    gradeSelect.value = "A*";
    creditsSelect.value = 1;
    subjectNameInput.focus();
    renderSubjects();
}

function deleteSubject(index){
    subjects.splice(index , 1);
    renderSubjects();
}

function handleTableClick(event){
    const button = event.target.closest('.delete-subject-button')
    if(!button) return;
    const index = Number(button.dataset.index);
    if(!Number.isNaN(index)) deleteSubject(index);
}

function clearAllSubjects(){
    subjects = [];
    renderSubjects()
}

function startApp(){
    subjectForm.addEventListener('submit' , addSubject);
    subjectTableBody.addEventListener('click' , handleTableClick);
    clearAllButton.addEventListener('click' , clearAllSubjects);
    renderSubjects();
}

startApp();