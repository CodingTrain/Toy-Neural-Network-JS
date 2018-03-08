$(document).ready(function () {
    function checkCSVFile(name) {
        return (name.slice(name.length - 4, name.length) === '.csv')
    }
    function renderCSVtoTable(data) {
        var csv_data = data.split(/\r?\n|\r/);
        var table_data = '<table class="table table-bordered table-striped">';
        for (let row_count = 0; row_count < csv_data.length; row_count++) {
            const cell_data = csv_data[row_count].split(',');
            table_data += '<tr>';
            for (let cell_count = 0; cell_count < cell_data.length; cell_count++) {
                const element = cell_data[cell_count];
                if (cell_count === 0) {
                    table_data += '<th>' + element + '</th>';
                } else {
                    table_data += '<th>' + element + '</th>';
                }
            }
            table_data += '</tr>';
        }
        table_data += '</table>';
        return table_data;
    }
    function loadHandler(event) {
        var csv = event.target.result;
        $('#data_table').html(renderCSVtoTable(csv));;
    }
    function errorHandler(evt) {
        if (evt.target.error.name == "NotReadableError") {
            alert("Canno't read file !");
        }
    }
    function getAsText(fileToRead) {
        var reader = new FileReader();
        // Read file into memory as UTF-8      
        reader.readAsText(fileToRead);
        // Handle errors load
        reader.onload = loadHandler;
        reader.onerror = errorHandler;
    }
    function handleFiles(files) {
        // Check for the various File API support.
        if (window.FileReader) {
            // FileReader are supported.
            getAsText(files[0]);
        } else {
            alert('FileReader are not supported in this browser.');
        }
    }
    // detect a change in a file input with an id of “the-file-input”
    $("#csv-upload").change(function () {
        // will log a FileList object, view gifs below
        if(checkCSVFile(this.files[0].name)) {
            $('#data_table').html(handleFiles(this.files));
        }
    });
    $('#load_data').click(function () {
        $.ajax({
            url: "train.csv",
            dataType: "text",
            success: function (data) {
                $('#data_table').html(renderCSVtoTable(data));
            }
        })
    })
})