var users = [
    {
        name:      "Sahak",
        surname:   "Babayan",
        age:       "25",
        position : "Junior software developer"
    }, {
        name:      "Luiza",
        surname:   "Kharatyan",
        age:       "24",
        position : "Senior software developer"
    }, {
        name:      "Mary",
        surname:   "Ghazaryan",
        age:       "27",
        position : "Middle software developer"
    }, {
        name:      "Khachatur",
        surname:   "Vardanyan",
        age:       "27",
        position : "Senior software developer"
    }
];

var SortableGrid = (function(){

    var element;
    var table;
    var inputs;

    var hasError = false;

    function sortBy(field, reverse, isNumber) {

        reverse = reverse ? 1 : -1;

        var key = !isNumber ?
            function(x) {
                return x[field].toUpperCase()
            }
            :
            function(x) {
                return x[field]
            };

        return function(a, b) {
            a = key(a);
            b = key(b);
            return reverse * ((a > b) - (b > a)); // we compare each value by '>' and get 'true' or 'false' then subtract and get 0 , 1 or -1
        }
    }

    function sortUsers(e, field, reverse, isNumber) {
        resetTableSortIcons();
        var span = e.getElementsByTagName("span")[0];
        span.style.opacity = 1;

        if(e.className == "ASC") {
            users.sort(sortBy(field, true, isNumber));
            e.className = "DESC";
        } else {
            users.sort(sortBy(field, false, isNumber));
            e.className = "ASC";
        }
        clearTableBody();
        buildTableBody();
    }

    function resetTableSortIcons() {
        var icons = element.getElementsByTagName('span');
        for(var i = 0; i< icons.length; i++){
            icons[i].style.opacity = 0.2;
        }
    }

    function init(selector) {
        element = document.getElementById(selector);
        table = document.createElement('table');
        inputs = element.getElementsByClassName("userField");
        users.sort(sortBy("name", true, false)); // we sort initially by 'ASC'
        buildTableHeader();
        buildTableBody();
        resetTableSortIcons();
        if(element.getElementsByTagName('span').length > 0){
            element.getElementsByTagName('span')[0].style.opacity = 1; // make 'name' icon bold since we initially sort by 'name'
        }

    }

    function addUser() {
        hasError = false; // reset errors

        var name = document.getElementById("name");
        var surname = document.getElementById("surname");
        var age = document.getElementById("age");
        var position = document.getElementById("position");

        for(var i=0; i<inputs.length; i++) {
            inputs[i].errors = {};
            validateField(inputs[i], inputs[i].getAttribute("validation"));
        }

        if(!hasError) {
            var newUser = {name : name.value,surname : surname.value,age : age.value,position : position.value};
            users.push(newUser);
            clearTableBody();
            buildTableBody();
            name.value = "";
            surname.value = "";
            age.value = "";
            position.value = "";
            removeErrorMessages();
        } else {
            removeErrorMessages();
            createErrorMessages();
        }

    }

    function removeErrorMessages() {
        var errorContainers = document.getElementsByClassName("errorMessage");
        while(errorContainers.length > 0){
            errorContainers[0].remove();
        }
    }

    function createErrorMessages() {
        for(var j=0; j<inputs.length; j++) {
            var errorContainer = document.createElement("p");
            errorContainer.className = "errorMessage";
            for(var error in inputs[j].errors) {
                if(inputs[j].errors.hasOwnProperty(error)){
                    var text = document.createTextNode(inputs[j].errors[error]);
                    errorContainer.appendChild(text);
                }
            }
            insertAfter(errorContainer, inputs[j]);
        }
    }

    function insertAfter(newNode, referenceNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }

    function validateField(element, validationRules) {
        var rules = validationRules.split(", ");
        required :
        for(var i = 0; i < rules.length; i++){
            switch (rules[i]){
                case "required" :
                    if(element.value == "") {
                        element.errors.required = "Please fill this field ";
                        hasError = true;
                        break required;
                    }
                    break;
                case "min-5" :
                    if(element.value.length < 5) {
                        element.errors.min5 = "More then 5 characters ";
                        hasError = true;
                    }
                    break;
                case "max-12" :
                    if(element.value.length > 12) {
                        element.errors.max12 = "Less then 12 characters ";
                        hasError = true;
                    }
                    break;
                case "number" :
                    var numbers = /^[0-9]+$/;
                    if(!element.value.match(numbers)){
                        element.errors.number = "Only numbers ";
                        hasError = true;
                    }
                    break;
            }
        }
    }

    function firstToUpperCase( str ) {
        return str.substr(0, 1).toUpperCase() + str.substr(1);
    }

    function buildTableHeader() {
        var thead = document.createElement('thead');
        var tr = document.createElement('tr');

        for(var index in users[0]) {
            if (users[0].hasOwnProperty(index)) {
                var th_ = document.createElement('th');
                var th_text = document.createTextNode(firstToUpperCase(index));
                var th_sort_icon = document.createElement("span");
                th_.appendChild(th_text);
                th_.appendChild(th_sort_icon);
                !isNaN(users[0][index]) ?
                    th_.setAttribute("onclick", "SortableGrid.sortUsers(this, '"+index+"', false, true)")
                    :
                    th_.setAttribute("onclick", "SortableGrid.sortUsers(this, '"+index+"', false, false)");
                th_.setAttribute("class", "DESC");
                tr.appendChild(th_);
            }
        }

        thead.appendChild(tr);
        table.appendChild(thead);
    }

    function buildTableBody() {
        var tbody = document.createElement('tbody');

        for (var i = 0; i < users.length; i++){
            var tr = document.createElement('tr');

            var td_name = document.createElement('td');
            var td_surname = document.createElement('td');
            var td_age = document.createElement('td');
            var td_position = document.createElement('td');

            var name = document.createTextNode(users[i].name);
            var surname = document.createTextNode(users[i].surname);
            var age = document.createTextNode(users[i].age);
            var position = document.createTextNode(users[i].position);

            td_name.appendChild(name);
            td_surname.appendChild(surname);
            td_age.appendChild(age);
            td_position.appendChild(position);

            tr.appendChild(td_name);
            tr.appendChild(td_surname);
            tr.appendChild(td_age);
            tr.appendChild(td_position);

            tbody.appendChild(tr);
        }

        table.appendChild(tbody);
        element.appendChild(table);
    }

    function clearTableBody() {
        var tableBody = element.getElementsByTagName("tbody")[0];
        tableBody.remove();
    }

    return{
        init : init,
        sortUsers : sortUsers,
        addUser : addUser
    }
})();

window.onload = function(){SortableGrid.init("main")};
