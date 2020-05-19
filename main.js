let tableData = [];

let init = () => {
    // Do an api call to get ajax data
    let config = {
            url: 'https://restcountries.eu/rest/v2/all',
            method: 'GET',
            async: true
        },
        headerConfig = {
            column1: 'Name',
            column2: 'Capital',
            column3: 'Population',
            column4: 'Region',
            column5: 'Sub Region'
        },
        dataValue = {
            Name: 'name',
            Capital: 'capital',
            Population: 'population',
            Region: 'region',
            'Sub Region': 'subregion'
        }

    let tableConfig = Object.assign({}, headerConfig, dataValue);

    localStorage.setItem('tableConfig',  JSON.stringify(tableConfig));
    tableInit(config, tableConfig);

}

let tableInit = (config, tableConfig) => {
    let request = {};

    request = getTableData(config)
    request.addEventListener('readystatechange', function() {
        if(this.readyState == 4 && this.status == 200) {
            let jsonData = JSON.parse(this.responseText);
            // Generate Table with new data
            tableData = jsonData;
            createTable(jsonData, tableConfig);
            document.getElementById('lastDataNum').innerHTML = jsonData.length;
            document.getElementById('totalDataCount').innerHTML = jsonData.length;
        }
    });
}

let getTableData = ( options = {} ) => {
    let xhr = new XMLHttpRequest();

    xhr.open(options.method, options.url, options.async);
    xhr.send();

    return xhr;
}

let createTable = (data, options) => {
    let _htmlStr = '',
        tableElem = document.getElementById('table1');

    _htmlStr = `
        <thead>
            <tr>
                <th>
                    <button onclick="sortTable(0)">
                        ${options.column1} <i class="fas fa-sort"></i>
                    </button>
                </th>
                <th>
                    <button onclick="sortTable(1)">
                        ${options.column2} <i class="fas fa-sort"></i>
                    </button>
                </th>
                <th>
                    <button onclick="sortTable(2)">
                        ${options.column3} <i class="fas fa-sort"></i>
                    </button>
                </th>
                <th>
                    <button onclick="sortTable(3)">
                        ${options.column4} <i class="fas fa-sort"></i>
                    </button>
                </th>
                <th>
                    <button onclick="sortTable(4)">
                        ${options.column5} <i class="fas fa-sort"></i>
                    </button>
                </th>
            </tr>
            <tr>
                <th> <input type="text" class="tableRowSearch" onkeyup="tableRowSearch(event, 0)" placeholder="All" title="Type a value"> </th>
                <th> <input type="text" class="tableRowSearch" onkeyup="tableRowSearch(event, 1)" placeholder="All" title="Type a value"> </th>
                <th> <input type="text" class="tableRowSearch" onkeyup="tableRowSearch(event, 2)" placeholder="All" title="Type a value"> </th>
                <th> <input type="text" class="tableRowSearch" onkeyup="tableRowSearch(event, 3)" placeholder="All" title="Type a value"> </th>
                <th> <input type="text" class="tableRowSearch" onkeyup="tableRowSearch(event, 4)" placeholder="All" title="Type a value"> </th>
            </tr>
        </thead>
    `;

    _htmlStr += `<tbody>`
    for(let i= 0; i < data.length; i++) {
        _htmlStr += `
            <tr>
                <td>${data[i][options[options.column1]]} </td>
                <td>${data[i][options[options.column2]]} </td>
                <td>${data[i][options[options.column3]]} </td>
                <td>${data[i][options[options.column4]]} </td>
                <td>${data[i][options[options.column5]]} </td>
            </tr>
        `
    }

    
    _htmlStr += `</tbody>`
    tableElem.innerHTML = _htmlStr;
}

let tableRowSearch = (e, tagIndex) => {
    var input, filter, table, tr, td, i, txtValue;

    input = e.target.value;
    filter = input.toUpperCase();
    table = document.getElementById("table1");
    tr = table.getElementsByTagName("tr");

    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td")[tagIndex];
      if (td) {
        txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }       
    }
  }


let tableSearch = () => {
    // What to search in global level table

}

// Sorting Columns
let sortTable = (n) => {
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("table1");
    switching = true;
    //Set the sorting direction to ascending:
    dir = "asc"; 

    while (switching) {
      //start by saying: no switching is done:
      switching = false;
      rows = table.rows;

      for (i = 2; i < (rows.length - 1); i++) {
        shouldSwitch = false;
        /*Get the two elements you want to compare,
        one from current row and one from the next:*/
        x = rows[i].getElementsByTagName("td")[n];
        y = rows[i + 1].getElementsByTagName("td")[n];

        if (dir == "asc") {
          if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
            shouldSwitch= true;
            break;
          }
        } else if (dir == "desc") {
          if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
            shouldSwitch = true;
            break;
          }
        }
      }
      if (shouldSwitch) {
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
        //Each time a switch is done, increase this count by 1:
        switchcount ++;      
      } else {
        if (switchcount == 0 && dir == "asc") {
          dir = "desc";
          switching = true;
        }
      }
    }
}

let showTableData = () => {
    let selectElem = document.getElementById("data"),
        value = selectElem.value,
        tempData = tableData;

    let tableConfig = localStorage.getItem('tableConfig');
    
    createTable(tempData.slice(0, value || tableData.length), JSON.parse(tableConfig));
    document.getElementById('lastDataNum').innerHTML = value;
}

// callback for window onload event
window.onload = init();
