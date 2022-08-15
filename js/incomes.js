
// filter table

$(document).ready(function () {
  $('#table_income thead tr')
    .clone(true)
    .addClass('filters')
    .appendTo('#table_income thead');

  var table = $('#table_income').DataTable({

    "columnDefs": [
      { "width": "7%", "targets": 4 }
    ],
    orderCellsTop: true,
    fixedHeader: true,
    initComplete: function () {
      var api = this.api();


      api
        .columns([0,1,2,3])
        .eq(0)
        .each(function (colIdx) {

          var cell = $('.filters th').eq(
            $(api.column(colIdx).header()).index()
          );
          var title = $(cell).text();
          $(cell).html('<input type="text" placeholder="' + title + '" />');
          $(
            'input',
            $('.filters th').eq($(api.column(colIdx).header()).index())
          )
            .off('keyup change')
            .on('change', function (e) {

              $(this).attr('title', $(this).val());
              var regexr = '({search})';
            
              api
                .column(colIdx)
                .search(
                  this.value != ''
                    ? regexr.replace('{search}', '(((' + this.value + ')))')
                    : '',
                  this.value != '',
                  this.value == ''
                )
                .draw();
            })
            .on('keyup', function (e) {
              e.stopPropagation();

              $(this).trigger('change');
              $(this)
                .focus()[0]
                
            });
        });

    },
    "language": {
      "processing": "Procesando...",
      "lengthMenu": "Mostrar _MENU_ registros",
      "zeroRecords": "No se encontraron resultados",
      "emptyTable": "Ningún dato disponible en esta tabla",
      "infoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
      "infoFiltered": "(filtrado de un total de _MAX_ registros)",
      "search": "Buscar:",
      "infoThousands": ",",
      "loadingRecords": "Cargando...",
      "paginate": {
        "first": "Primero",
        "last": "Último",
        "next": "Siguiente",
        "previous": "Anterior"
      },
      "info": "Mostrando _START_ a _END_ de _TOTAL_ registros"
    }

  });

});

//  -------------- Eliminar ---------------------

$(document).on('click',".btn_row_delete", function(e)
{
  var r = $(this).closest('tr').remove();
});

//  -------------- Graficas ---------------------


var options = {
  series: [{
    name: 'Egresos',
    data: [2500000, 2000000, 1950000, 3000000, 1950000, 2500000]
  }],
  chart: {
    height: 260,
    type: 'bar',
  },
  plotOptions: {
    bar: {
      borderRadius: 10,
      dataLabels: {
        position: 'top', // top, center, bottom
      },
    }
  },
  dataLabels: {
    enabled: true,
    offsetY: -14,
    style: {
      fontSize: '11px',
      colors: ["#304758"]
    }
  },

  xaxis: {
    categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    position: 'top',
    axisBorder: {
      show: false
    },
    axisTicks: {
      show: false
    },
    crosshairs: {
      fill: {
        type: 'gradient',
        gradient: {
          colorFrom: '#D8E3F0',
          colorTo: '#BED1E6',
          stops: [0, 100],
          opacityFrom: 0.4,
          opacityTo: 0.5,
        }
      }
    },
    tooltip: {
      enabled: true,
    }
  },
  yaxis: {
    axisBorder: {
      show: false
    },
    axisTicks: {
      show: false,
    },
    labels: {
      show: false,

    }

  },
  title: {
    text: 'Egresos Mensuales',
    floating: true,
    offsetY: 240,
    align: 'center',
    style: {
      color: '#444'
    }
  }
};

var chart = new ApexCharts(document.querySelector("#columnchart_material"), options);
chart.render();
