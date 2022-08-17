const BACKEND_URL = 'https://surance-db.herokuapp.com'
const userId = localStorage.getItem('userId')
const tableDiv = document.querySelector('#tbody_expense')
let chart
headTable()
createGraphic()
loadData()

//#region LOGOUT SECTION
if (!userId) {
	logOut()
}

document.querySelector('#btnLogout').addEventListener('click', logOut)

function logOut() {
	localStorage.clear()
	alert('Se cerrará tu sesión')
	location.replace('index.html')
}
//#endregion


async function loadData() {
	expensesBack = await getExpenses()

	expensesBack.forEach((formExpense) => {
		insertGoal(formExpense)
	})
	loadTable()
	chart.updateOptions(await getGraphicData())
}

// filter table

function headTable() {
	$(document).ready(function () {
		$('#table_expense thead tr')
			.clone(true)
			.addClass('filters')
			.appendTo('#table_expense thead');
	});
}


function loadTable() {
	$(document).ready(function () {
		$('#table_expense thead tr')

		var table = $('#table_expense').DataTable({
			"columnDefs": [
				{ "width": "7%", "targets": 4 }
			],
			orderCellsTop: true,
			responsive: true,
			fixedHeader: true,

			initComplete: function () {
				var api = this.api();


				api
					.columns([0, 1, 2, 3])
					.eq(0)
					.each(function (colIdx) {


						/* Getting the header of the column. */
						var cell = $('.filters th').eq(
							$(api.column(colIdx).header()).index()
						);
						/* Creating a filter for each column. */
						var title = $(cell).text();
						$(cell).html('<input type="text" placeholder="' + title + '" />');
						$(
							'input',
							$('.filters th').eq($(api.column(colIdx).header()).index())
						)
							/* A function that is called when the input changes. */
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
							/* A function that is called when the input changes. */
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

}
function destroyTable() {
	var table = $('#table_expense').DataTable();
	table.clear()
	table.destroy();
}


//  -------------- Graficas ---------------------
async function createGraphic(){
	chart = new ApexCharts(document.querySelector("#columnchart_material"), await getGraphicData());
	chart.render();
}

async function getGraphicData(){

	const lblMonths = ['', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
	'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
   
	let monthlyExpenses = await getMonthlyExpenses()

	let totalExpenses = []
	let months = []

	monthlyExpenses.map(i => {
		totalExpenses.push(i.total)
		months.push(lblMonths[i.month])
	})

	var options = {
		series: [{
			name: 'Egresos',
			data: totalExpenses
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
			categories: months,
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
	
	return options
}


// conexion ---------------------------------------------------------------
// conexion ---------------------------------------------------------------
// conexion ---------------------------------------------------------------


document.querySelector('#form_register').addEventListener('submit', async (event) => {
	event.preventDefault();

	const formExpense = {
		user: userId,
		value: +document.querySelector('#register_value').value,
		date: document.querySelector('#register_date').value,
		category: document.querySelector('#register_category').value,
		description: document.querySelector('#register_description').value,
	}

	await sendJSON(formExpense)

	event.target.reset()
	destroyTable()
	loadData()

})

async function sendJSON(formExpense) {
	try {
		await fetch(`${BACKEND_URL}/expenses/`, {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(formExpense)
		})
	} catch (error) {
		console.error(error)
	}
}

function insertGoal(formExpense) {
	let tbody = document.createElement('tr')
	tbody.innerHTML = `        
		<td>${formExpense.value}</td>
		<td>${formExpense.date}</td>
		<td>${formExpense.category}</td>
		<td>${formExpense.description}</td>
		<td><button class="btn_row_delete" id="btn_delete" type="submit" onclick="deleteExpense(${formExpense.id})">Eliminar</button></td>               
	`
	tableDiv.appendChild(tbody)
}

async function getExpenses() {
	try {
		const response = await fetch(`${BACKEND_URL}/expenses/${userId}`)
		const expensesBack = await response.json()
		return expensesBack
	} catch (error) {
		console.error(error)
	}
}

async function getMonthlyExpenses() {
	try {
		const response = await fetch(`${BACKEND_URL}/expenses/monthly/${userId}`)
		const monthlyExpenses = await response.json()
		return monthlyExpenses.slice(0, 6).reverse()
	} catch (error) {
		console.error(error)
	}

}

//  -------------- delete ---------------------

async function deleteExpense(expenseId) {
	try {
		await fetch(`${BACKEND_URL}/expenses/`, {
			method: 'DELETE',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ user: userId, id: expenseId })
		}).then(res => {
			if (res.status == 204) {
				alert('Egreso eliminado exitosamente.')
				destroyTable()
				loadData()
			}
		})
	} catch (error) {
		console.error(error)
	}
}

