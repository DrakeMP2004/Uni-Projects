// Function to add a new student row
//Taken from https://www.w3schools.com/jsreF/tryit.asp?filename=tryjsref_table_insertrow
//and https://code.mu/en/javascript/book/prime/dom/practice/table-rows-cols-adding/
function addRowStudents() 
{
    var table = document.getElementById("marksTable");
    var addedRow = table.insertRow(table.rows.length);
    // Loop through each cell of the new row and set properties accordingly
    for (var i = 0; i < table.rows[0].cells.length; i++) 
    {
        var addedCell = addedRow.insertCell(i);
        
        // Enable content editing for Student Name and ID cells, mark others as unsubmitted
        if (i === 0 || i === 1) 
        {
            addedCell.contentEditable = true;
        } 
        else if (i === table.rows[0].cells.length - 1) 
        {
            addedCell.innerHTML = "-";
        } 
        else 
        {
            addedCell.contentEditable = true;
            addedCell.classList.add("unsubmitted");
        }
    }
    // Update the table after adding the new row
    updateTable();
}

// Function to add a new assignment column
// Taken from https://www.redips.net/javascript/adding-table-rows-and-columns/
function addColumnAssignments() 
{
    var table = document.getElementById("marksTable");
    // Determine the assignment number and get the new assignment title from input
    var assignmentNum = table.rows[0].cells.length - 2; // Excluding Name and ID columns
    var newAssignment = document.getElementById("newAssignmentTitle").value;
    // Check if a title for the new assignment column is provided
    if (newAssignment.trim() === "") 
    {
        alert("Please enter a title for the new assignment column.");
        return;
    }
    // Insert new header cell for the assignment
    var headerRow = table.rows[0];
    var newHeaderCell = document.createElement("th");
    newHeaderCell.textContent = newAssignment;
    headerRow.insertBefore(newHeaderCell, headerRow.cells[headerRow.cells.length - 1]);
    
    // Iterate through each row and add a new cell for the assignment
    for (var i = 1; i < table.rows.length; i++) 
    {
        var addedRowCell = table.rows[i].insertCell(table.rows[i].cells.length - 1);
        addedRowCell.innerHTML = "-";
        addedRowCell.contentEditable = true;
        addedRowCell.classList.add("unsubmitted");
    }
    // Update the table after adding the new column
    updateTable();
}


// Function to toggle between different grade representations
// Toggling function taken from https://www.w3schools.com/howto/howto_js_toggle_class.asp
function switchGradeConversions()
{
    var table = document.getElementById("marksTable");
    var cells = document.querySelectorAll("#marksTable tr td:last-child");
    // Iterate through each cell in the "Average %" column
    cells.forEach(function(cell) 
    {
        // Remove "%" and get the numeric percent value
        var percent = parseInt(cell.innerHTML.replace('%', ''));
        // Get letter grade and American 4.0 grade equivalent
        var letterGrade = getLetterGrade(percent);
        var fourPointGrade = getFourPointGrade(percent);
        // Toggle between percent representation and letter/4.0 grade representation
        if (cell.dataset.gradeRepresentation === "percent") 
        {
            cell.innerHTML = letterGrade + " / " + fourPointGrade;
            cell.dataset.gradeRepresentation = "grade";
        } 
        else 
        {
            cell.innerHTML = percent + "%";
            cell.dataset.gradeRepresentation = "percent";
        }
    });
}

// Logic function to get American 4.0 grade from percent
function getFourPointGrade(percent) 
{
    // Determine the corresponding American 4.0 grade based on percent
    // and return the result
    if (percent >= 93) return "4.0";
    else if (percent >= 90) return "3.7";
    else if (percent >= 87) return "3.3";
    else if (percent >= 83) return "3.0";
    else if (percent >= 80) return "2.7";
    else if (percent >= 77) return "2.3";
    else if (percent >= 73) return "2.0";
    else if (percent >= 70) return "1.7";
    else if (percent >= 67) return "1.3";
    else if (percent >= 63) return "1.0";
    else if (percent >= 60) return "0.7";
    else return "0.0";
}

// Logic function to get letter grade from percent
function getLetterGrade(percent) 
{
    // Determine the corresponding letter grade based on percent
    // and return the result
    if (percent >= 93) return "A";
    else if (percent >= 90) return "A-";
    else if (percent >= 87) return "B+";
    else if (percent >= 83) return "B";
    else if (percent >= 80) return "B-";
    else if (percent >= 77) return "C+";
    else if (percent >= 73) return "C";
    else if (percent >= 70) return "C-";
    else if (percent >= 67) return "D+";
    else if (percent >= 63) return "D";
    else if (percent >= 60) return "D-";
    else return "F";
}

// Function to calculate average, count unsubmitted, and update table
// Taken from https://www.htmlgoodies.com/html5/updating-html-table-content-using-javascript/
function updateTable() 
{
    // Retrieve the marks table
    var table = document.getElementById("marksTable");
    // Initialize a variable to count unsubmitted assignments
    var unsubmittedCount = 0;
    
    // Iterate through each row of the table
    for (var i = 1; i < table.rows.length; i++) 
    {
        // Initialize variables to calculate total marks and number of assignments
        var totalGrades = 0;
        var numAssignments = 0;
        
        // Iterate through each cell of the row (excluding Student Name and ID cells)
        for (var j = 2; j < table.rows[i].cells.length - 1; j++) 
        {
            var cell = table.rows[i].cells[j];
            // Convert cell content to integer
            var value = parseInt(cell.innerHTML);
            // Check if the value is a number]
            // Change row cells based from https://www.youtube.com/watch?v=gcLgVVJNFB8 and https://stackoverflow.com/questions/15510708/color-row-based-on-cell-value
            if (!isNaN(value)) 
            {
                totalGrades += value;
                numAssignments++;
                // Remove unsubmitted class and add submitted class to cell
                cell.classList.remove("unsubmitted");
                cell.classList.add("submitted");
                // Change background color to white and text alignment to right
                cell.style.backgroundColor = "white";
                cell.style.textAlign = "right";
            } 
            else 
            {
                // If the value is not a number (e.g., empty or "-"), mark as unsubmitted
                cell.innerHTML = "-";
                cell.classList.add("unsubmitted");
                // Change background color to yellow and text alignment to center
                cell.style.backgroundColor = "yellow";
                cell.style.textAlign = "center";
                unsubmittedCount++;
            }
        }
        
        // Calculating average as similarly shown from https://stackoverflow.com/questions/40494760/average-of-html-table-content-column-and-row-in-javascript
        // Calculate average percent for the row
        var averagepercent = numAssignments > 0 ? Math.round(totalGrades / numAssignments) : "-";
        // Update the last cell of the row with the average percent
        table.rows[i].cells[table.rows[i].cells.length - 1].innerHTML = averagepercent + "%";

        // Style below-60 grades
        if (averagepercent !== "-" && averagepercent < 60) 
        {
            table.rows[i].cells[table.rows[i].cells.length - 1].classList.add("below-60");
        } 
        else 
        {
            table.rows[i].cells[table.rows[i].cells.length - 1].classList.remove("below-60");
        }
    }

    // Update unsubmitted info display
    var unsubmittedInfo = document.getElementById("unsubmittedInfo");
    unsubmittedInfo.innerHTML = "Unsubmitted Assignments: " + unsubmittedCount;
}

// Call the function to update table when the page loads
updateTable();

// Event listener to automatically update table on cell content change
document.getElementById("marksTable").addEventListener("input", function(event) 
{
    updateTable();
});

// Event listener to toggle grade representation
document.querySelector("#marksTable th:last-child button").addEventListener("click", function(event) 
{
    switchGradeConversions();
});

// Event listener to automatically update table and style cells on cell content change
document.getElementById("marksTable").addEventListener("input", function(event) 
{
    updateTable();
});
