document.getElementById('scrapeButton').addEventListener('click', async () => {
    try {
        console.log("User wants to parse their schedule");
        let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: parsePageContent,
        }, (results) => {
            // This is where you would handle the results of the content script
            if (chrome.runtime.lastError) {
                console.error('Script execution failed: ', chrome.runtime.lastError.message);
            } else if (results && results.length > 0) {
                const parserResults = results[0].result;
                console.log('Parsed content:', parserResults);
                // You can now do something with the parserResults
                // chrome.storage.local.get('authToken', function (data) {
                //     if (chrome.runtime.lastError) {
                //         console.log('Error getting token from chrome.storage:', chrome.runtime.lastError);
                //     } else {
                //         let token = data.authToken;
                //         createCalendarEvent(token, parserResults);
                //     }
                // });
            }
        });
    } catch (err) {
        console.error('Failed to parse:', err);
    }
});

function createCalendarEvent(authToken, event) {
    const calendarApiUrl = 'https://www.googleapis.com/calendar/v3/calendars/primary/events';

    fetch(calendarApiUrl, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(event)
    })
        .then(response => response.json())
        .then(data => {
            console.log('Event created:', data);
            // Handle the response data (event details)
        })
        .catch(error => {
            console.error('Error creating event:', error);
        });
}

function parsePageContent() {
    // Get the table with the course information
    const courseTable = document.querySelectorAll('table')[4];

    // Get the rows of the table
    const courseRows = courseTable.querySelectorAll('tr');

    // Store the courses in an array
    const courses = [];

    // Iterate through the rows of the course table
    for (let i = 1; i < courseRows.length; i++) {

        // Store the course info in an object
        let course = {};

        // Store the current row
        row = courseRows[i];

        // Get the course info from the row
        let tds = Array.from(row.querySelectorAll('td'));

        // Account for the extra column in the first course row
        if (i == 1) {
            tds.shift();
        }

        // If the format doesn't match what a course should look like, break out of the loop
        firsttdIsCourse = tds[0].textContent.trim()
        const regex = /^[A-Z]{3}\s[A-Z]{2}\d{3}\s[A-Z]\d$/;
        if (!regex.test(firsttdIsCourse)) {
            break
        }

        // set the course object's attributes
        course['code'] = tds[0].textContent.trim();
        course['title'] = tds[4].innerText.trim().split('\n')[0];
        course['instructor'] = tds[4].innerText.trim().split('\n')[1]
        course['type'] = tds[6].textContent.trim();
        course['location'] = tds[7].textContent.trim();
        course['room'] = tds[8].textContent.trim();
        course['days'] = tds[9].textContent.trim();
        course['start'] = tds[10].textContent.trim();
        course['stop'] = tds[11].textContent.trim();

        // console.log(course);
        courses.push(course)
    }
    return courses;
}

const buildingAbbreviations = {
    "AAS": "Boston University African American Studies, 138 Mountfort St, Brookline, MA 02446",
    "AGG": "Agganis Arena, 925 Commonwealth Ave, Boston, MA 02215",
    "ASC": "Elliot Cole Academic Support Center, 300 Ashford St, Boston, MA 02134",
    "BRB": "Boston University Biology Research Building, 5 Cummington Mall, Boston, MA 02215",
    "BSC": "Boston University Biological Science Center, 2 Cummington Mall, Boston, MA 02215",
    "CAS": "College of Arts and Sciences, 685–725 Commonwealth Ave, Boston, MA 02215",
    "CDS": "BU Faculty of Computing & Data Sciences, 645-665 Commonwealth Avenue, Boston, MA 02215",
    "CFA": "College of Fine Arts, 855 Commonwealth Ave, Boston, MA 02215",
    "CGS": "College of General Studies, 871 Commonwealth Ave, Boston, MA 02215",
    "CNS": "Boston University Cognitive and Neural Systems Department, 677 Beacon St, Boston, MA 02215",
    "COM": "College of Communication, 640 Commonwealth Ave, Boston, MA 02215",
    "CRW": "Boston University DeWolfe Boathouse, 619 Memorial Dr, Cambridge, MA 02139",
    "CSE": "285 Babcock St, Boston, MA 02215",
    "EGL": "English Faculty Offices, 236 Bay State Road, Boston, MA 02215",
    "EIB": "BU Editorial Institute, 143 Bay State Rd, Boston, MA 02215",
    "EMA": "Boston University Engineering Manufacturing Annex, 730 Commonwealth Ave, Boston, MA 02215",
    "EMB": "Boston University Engineering Manufacturing Building, 15 St Mary's St, Brookline, MA 02446",
    "ENG": "College of Engineering, 110–112 Cummington Mall, Boston, MA 02215",
    "EOP": "Center for English Language, 890 Commonwealth Avenue, Boston, MA 02215",
    "EPC": "Engineering Product Innovation Center, 750 Commonwealth Ave, Brookline, MA 02446",
    "ERA": "Boston University Engineering Research Annex, 48 Cummington Mall, Boston, MA 02215",
    "ERB": "Boston University Engineering Research Building, 48 Cummington Mall, Boston, MA 02215",
    "FAB": "BU Fenway Activities Building, 180 Riverway, Boston, MA 02215",
    "FCB": "Fenway Classroom Building, 25 Pilgrim Rd, Boston, MA 02215",
    "FCC": "Campus Center & Student Residence, 150 Riverway, Boston, MA 02215",
    "FLR": "Boston University Peter Fuller Building, 808 Commonwealth Ave, Brookline, MA 02446",
    "GMS": "Faculty Office Building (Alden Hall), 704 Commonwealth Avenue, Boston, MA 02215",
    "GRS": "Graduate School of Arts and Sciences, 705 Commonwealth Ave, Boston, MA 02215",
    "GSU": "George Sherman Union, 775 Commonwealth Ave, Boston, MA 02215",
    "HAR": "Boston University Rafik B. Hariri Building, 595 Commonwealth Ave, Boston, MA 02215",
    "HAW": "Hawes Building, 43 Hawes Street, Brookline, MA 02446",
    "HIS": "History and American Studies Departments, 226 Bay State Rd, Boston, MA 02215",
    "IEC": "Boston University International Programs, 888 Commonwealth Ave, Boston, MA 02215",
    "IRB": "International Relations Building, 154 Bay State Rd, Boston, MA 02215",
    "IRC": "International Relations Center, 152 Bay State Road, Boston, MA 02215",
    "JSC": "Elie Wiesel Center for Jewish Studies, 147 Bay State Road, Boston, MA 02215",
    "KCB": "Boston University Kenmore Classroom Building, 565 Commonwealth Ave, Boston, MA 02215",
    "KHC": "Kilachand Honors College, 91 Bay State Rd # 115, Boston, MA 02215",
    "LAW": "Boston University School of Law, 765 Commonwealth Ave, Boston, MA 02215",
    "LEV": "Boston University Alan and Sherry Leventhal Center, 233 Bay State Rd, Boston, MA 02215",
    "LNG": "Romance Studies/Modern Foreign Languages, 718 Commonwealth Avenue, Boston, MA 02215",
    "LSE": "Boston University Life Science and Engineering Building, 24 Cummington Mall, Boston, MA 02215",
    "MCH": "Boston University Marsh Chapel, 735 Commonwealth Ave, Boston, MA 02215",
    "MCS": "Boston University Math and Computer Science, 111 Cummington Mall, Boston, MA 02215",
    "MED": "Boston University School of Public Health, 715 Albany Street, Boston, MA 02118",
    "MET": "Boston University Metropolitan College, 1010 Commonwealth Ave, Boston, MA 02215",
    "MOR": "Alfred L. Morse Auditorium, 602 Commonwealth Ave, Boston, MA 02215",
    "MUG": "Mugar Memorial Library, Gotlieb Archival Research Center, 771 Commonwealth Ave, Boston, MA 02215",
    "PDP": "Physical Development Program, 915 Commonwealth Avenue, Boston, MA 02215",
    "PHO": "Boston University Photonics Building, 6-8 St Mary's St, Boston, MA 02215",
    "PLS": "Anthropology, Philosophy, Political Science, 232 Bay State Road, Boston, MA 02215",
    "PRB": "Boston University Physics Research Building, 3 Cummington Mall, Boston, MA 02215",
    "PSY": "Department of Psychological and Brain Sciences, 64–72–86 Cummington Mall # 149, Boston, MA 02215",
    "PTH": "Boston Playwrights' Theatre, 949 Commonwealth Ave, Boston, MA 02215",
    "REL": "CAS Religion, 145 Bay State Road, Boston, MA 02215",
    "RKC": "Rajen Kilachand Center for Integrated Life Sciences & Engineering, 610 Commonwealth Ave, Boston, MA 02215",
    "SAC": "Sargent Activities Office, 1 University Road, MA 02215",
    "SAL": "Boston University Sailing Pavilion, Dr Paul Dudley White Bike Path, Boston, MA 02215",
    "SAR": "Sargent College of Health and Rehabilitation Sciences, 635 Commonwealth Ave, Boston, MA 02215",
    "SCI": "Metcalf Center for Science and Engineering, 590-596 Commonwealth Avenue, MA 02215",
    "SDM": "Henry M. Goldman School of Dental Medicine, 100 East Newton Street, Boston, MA 02118",
    "SHA": "Boston University School of Hospitality Administration, 928 Commonwealth Ave, Boston, MA 02215",
    "SLB": "Science and Engineering Library, 30–38 Cummington Mall, MA 02215",
    "SOC": "Department of Sociology, 96-100 Cummington Mall # 260, Boston, MA 02215",
    "SPH": "Boston University School of Public Health, 715 Albany St, Boston, MA 02118",
    "SSW": "School of Social Work, 264-270 Bay State Rd, Boston, MA 02215",
    "STH": "School of Theology, 745 Commonwealth Ave, Boston, MA 02215",
    "STO": "Stone Science Building, 675 Commonwealth Ave, Boston, MA 02215",
    "THA": "Joan & Edgar Booth Theatre and College of Fine Arts Production Center, 820 Commonwealth Ave, Brookline, MA 02446",
    "TTC": "Boston University Track & Tennis Center, 100 Ashford St, Boston, MA 02215",
    "WEA": "Wheelock College of Education & Human Development Annex, 621 Commonwealth Avenue, Boston, MA 02215",
    "WED": "Wheelock College of Education & Human Development, 2 Silber Way, Boston, MA 02215",
    "YAW": "Boston University Yawkey Center for Student Services, 100 Bay State Rd, Boston, MA 02215"
};