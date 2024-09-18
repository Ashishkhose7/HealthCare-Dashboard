let username = 'coalition';
let password = 'skills-test';
let auth = btoa(`${username}:${password}`);
let headers = {
    'Authorization': `Basic ${auth}`
}
let currUserIndex = 3; 
let userList;
let myChart;
// Fetching Users Data
const fetchData = async () => {
    const url = 'https://fedskillstest.coalitiontechnologies.workers.dev';
    
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: headers
        } );
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        userList = data
        if(data){
            renderList(data);
            userProfile(data);
            renderlabList(data);
            diagnosticList(data);
            vitalsDiagnosisHistory(data);
            chartData(data);
        }

    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

fetchData();

const changeUser = (index) => {
    currUserIndex = index;
    userProfile(userList);
    renderlabList(userList);
    diagnosticList(userList);
    vitalsDiagnosisHistory(userList);
    myChart.destroy();  
    chartData(userList)
    renderList(userList);
    
}

// Render List of users
const renderList = (userList, index) => {
    const listItems = userList.map((item,index) => `
        <li class="flex items-center justify-between mb-2 cursor-pointer ${index==currUserIndex ? 'bg-[#D8FCF7]':'hover:bg-slate-100'} py-3 px-3" onclick="changeUser(${index})">
                           <div class="patient-info1 flex items-center gap-1">
                                <img class="mr-1" src="${item.profile_picture}" alt="" style="height: 30px; width: 30px;">
                                <div style="font-size: 10px;" class=" font-semibold">${item.name}<br><span class="font-normal text-slate-500">${item.gender}, ${item.age}</span></div>
                           </div>
                           <div class="more">
                            <img src="./img//more_horiz_FILL0_wght300_GRAD0_opsz24.png" alt="" width="14">
                           </div>
                        </li>
        `).join('');
    document.querySelector('.patients-list').innerHTML = listItems;
    
}

// Render User Profile
const userProfile = (userList) =>{
    const date = new Date(userList[currUserIndex].date_of_birth);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-US', options);

    let dob = document.querySelector('.dob').innerHTML = formattedDate;

    let userprofile =  document.querySelector('.patient-info img');
    userprofile.src = userList[currUserIndex].profile_picture;

    let username = document.querySelector('.patient-info h2').innerHTML = userList[currUserIndex].name;

    let gender = document.querySelector('.gender').innerHTML = userList[currUserIndex].gender;

    let phone = document.querySelector('.contact').innerHTML = userList[currUserIndex].phone_number;

    let ephone = document.querySelector('.econtact').innerHTML = userList[currUserIndex].emergency_contact;

    let insurancepro = document.querySelector('.insurancepro').innerHTML = userList[currUserIndex].insurance_type;
}

//Render lab result 
const renderlabList = (userList, index) => {
    const listItems = userList[currUserIndex].lab_results.map(result => `
        <div class="flex justify-between p-1 mb-2 hover:bg-slate-100 cursor-pointer text-xs text-slate-500">
            <span>${result}</span>
            <span>
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 20 20">
                    <path id="download_FILL0_wght300_GRAD0_opsz24_1_" data-name="download_FILL0_wght300_GRAD0_opsz24 (1)" d="M190-765.45a1.282,1.282,0,0,1-.449-.077,1.106,1.106,0,0,1-.395-.264l-4.146-4.146a.94.94,0,0,1-.294-.7,1.025,1.025,0,0,1,.294-.709,1.019,1.019,0,0,1,.713-.321.944.944,0,0,1,.713.3L189-768.8V-779a.968.968,0,0,1,.287-.713A.968.968,0,0,1,190-780a.968.968,0,0,1,.713.287A.968.968,0,0,1,191-779v10.2l2.564-2.564a.952.952,0,0,1,.706-.294,1,1,0,0,1,.719.314,1.044,1.044,0,0,1,.3.7.932.932,0,0,1-.3.7l-4.146,4.146a1.1,1.1,0,0,1-.395.264A1.282,1.282,0,0,1,190-765.45ZM182.411-760a2.327,2.327,0,0,1-1.71-.7,2.327,2.327,0,0,1-.7-1.71v-2.615a.968.968,0,0,1,.287-.713.968.968,0,0,1,.713-.287.968.968,0,0,1,.713.287.968.968,0,0,1,.287.713v2.615a.392.392,0,0,0,.128.282.392.392,0,0,0,.282.128h15.179a.392.392,0,0,0,.282-.128.392.392,0,0,0,.128-.282v-2.615a.968.968,0,0,1,.287-.713.968.968,0,0,1,.713-.287.968.968,0,0,1,.713.287.968.968,0,0,1,.287.713v2.615a2.327,2.327,0,0,1-.7,1.71,2.327,2.327,0,0,1-1.71.7Z" transform="translate(-180.001 779.999)"/>
                    </svg>
            </span>
        </div>
        `).join('');
    document.querySelector('.lab-result-list').innerHTML = listItems;
}

// Render diagnostic_list
const diagnosticList = (userList) => {
    const listItems = userList[currUserIndex].diagnostic_list.map(result => `
         <tr>
            <td>${result.name}</td>
            <td>${result.description}</td>
            <td><span class="status under-observation">${result.status}</span></td>
        </tr>
        `).join('');
    document.querySelector('.tablebody').innerHTML = listItems;
}

// Render vitals diagnosis_history
const vitalsDiagnosisHistory = (userList) => {
    const vitals = userList[currUserIndex].diagnosis_history[0]

    document.querySelector('.resrate').innerHTML =  `${vitals.respiratory_rate.value} bpm`;
    document.querySelector('.reslevel').innerHTML =  vitals.respiratory_rate.levels;
    document.querySelector('.temp').innerHTML =   `${vitals.temperature.value}°F`;
    document.querySelector('.templevel').innerHTML =  vitals.temperature.levels;
    document.querySelector('.heartrate').innerHTML =  `${vitals.heart_rate.value} bpm`;
    document.querySelector('.heartlevel').innerHTML =  vitals.heart_rate.levels;
    document.querySelector('.sysvalue').innerHTML =  vitals.blood_pressure.systolic.value;
    document.querySelector('.diavalue').innerHTML =  vitals.blood_pressure.diastolic.value;
    document.querySelector('.syslevel').innerHTML =  vitals.blood_pressure.systolic.levels;
    document.querySelector('.dialevel').innerHTML =  vitals.blood_pressure.diastolic.levels;
    
}

// Month and year conversion
const chartData = (userList) => {
    let dataObjects = [];
    let systoliclevels = [];
    let diastoliclevels = [];

    let history = userList[currUserIndex].diagnosis_history
    

    for (const key in history) {
        const obj = { month: history[key].month.slice(0,3), year: history[key].year }
        dataObjects.push(obj);
        systoliclevels.push(history[key].blood_pressure.systolic.value);
        diastoliclevels.push(history[key].blood_pressure.diastolic.value);
    }
    
    chart(dataObjects.slice(0,6).reverse(), systoliclevels.slice(0,6).reverse(), diastoliclevels.slice(0,6).reverse());
    
}


// Render Chart Data
const chart = (dataObjects, systoliclevels, diastoliclevels, isdistroy) => {
    
    const ctx = document.getElementById('myChart').getContext('2d');  
    const labels = dataObjects.map(obj => `${obj.month} ${obj.year}`);

         myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels:labels,
                datasets: [
                    {
                        data: systoliclevels,
                        borderColor: 'rgb(236 72 153)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        fill: false,
                        tension: 0.4,
                        borderWidth: 1.5,
                        pointBackgroundColor: 'rgb(236 72 153)',
                    },
                    {
                        data: diastoliclevels,
                        borderColor: 'rgba(153, 102, 255, 1)',
                        backgroundColor: 'rgba(153, 102, 255, 0.2)',
                        fill: false,
                        tension: 0.4,
                        borderWidth: 1.5,
                        pointBackgroundColor: 'rgba(153, 102, 255, 1)',

                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false 
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                        font: {
                            size: 10
                        }
                    }
                    },
                    x: {
                        ticks: {
                        font: {
                            size: 10
                        }
                }
            }
                }
            }
        });

}