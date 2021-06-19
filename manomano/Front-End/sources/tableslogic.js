$(document).ready(function() {
    $('#example').DataTable({
            scrollY: "300px",
            scrollX: true,
            scrollCollapse: true,
            paging: false,
            columnDefs: [{
                width: '20%',
                targets: 0,
                "defaultContent": "-",
                "targets": "_all"
            }],
            fixedColumns: true,
            responsive: true,
            dom: 'Bfrtip',
            buttons: [
                'copy', 'csv', 'excel', 'pdf', 'print'
            ],
        }

    )
});