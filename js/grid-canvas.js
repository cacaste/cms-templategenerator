var grid = {
	framework: 'bootstrap',
	column: '<svg version="1.1" id=#ID# xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"' +
	'width="50px" height="15px" viewBox="0 0 100 35" enable-background="new 0 0 100 35" xml:space="preserve">' +
	'<rect width="100" height="35"/></svg>'
}

var configuration = {
	data: grid
}

function ConstructGrid(configuration) {

	var vm = this,
		controllerAction = {};
	vm.data = configuration.data;
	vm.grid = [];
	vm.col = 12;
	vm.row = 12;
	vm.addCell = addCell;
	vm.addRow = addRow;
	vm.addScreen = addScreen;
	vm.renderGrid = renderGrid;
	vm.changeGridContent = changeGridContent;
	vm.rowMin;
	vm.rowMax;
	vm.colMin;
	vm.colMax;

	document.addEventListener('click', controller);

	controllerAction.newPosition = newPosition;
	controllerAction.markPosition = markPosition;
	controllerAction.createPosition = createPosition;
	controllerAction.assignPosition = assignPosition;
	controllerAction.clearPosition = clearPosition;
	controllerAction.createRow = createRow;
	controllerAction.addScreen = addScreen;
	controllerAction.eraseRow = eraseRow;
	controllerAction.generateGrid = generateGrid;

	function controller() {
		var id = event.target.id,
			btnNewPosition = document.getElementById('newPosition'),
			action = '';
		if (id.indexOf('col-') >= 0  && btnNewPosition.classList.contains("display-none")) {
				action = 'markPosition';
		} else {
			if (controllerAction.hasOwnProperty(id)) {
				action = id;
			}
		}
		if (action) {
			controllerAction[action](id);
		}
	}

	function newPosition() {
		resetPosition();
		changeDom('newPosition');
	}

	function markPosition(id) {
		var name = '',
			status = 'T',
			color = 'rgba(252, 238, 139, 0.83)';
		if (calculatePosition(id)) {
			changeGridContent(name, status, color);
			renderGrid();
		}
	}

	function calculatePosition(id) {
		var resultado = true,
			position = id.split('-'),
			rowMin = parseInt(position[1]) < vm.rowMin ? parseInt(position[1]) : vm.rowMin,
			rowMax = parseInt(position[1]) > vm.rowMax ? parseInt(position[1]) : vm.rowMax,
			colMin = parseInt(position[2]) < vm.colMin ? parseInt(position[2]) : vm.colMin,
			colMax = parseInt(position[2]) > vm.colMax ? parseInt(position[2]) : vm.colMax;
		if (validatePosition(rowMin, rowMax, colMin, colMax)) {
			vm.rowMin = rowMin;
			vm.colMin = colMin;
			vm.rowMax = rowMax;
			vm.colMax = colMax;
		} else {
			resultado = false;
			alert('position full');
		}
		return resultado;
	}

	function validatePosition(rowMin, rowMax, colMin, colMax) {
		var row,
			col,
			result = true;
		for (row = rowMin; row <= rowMax; row++) {
			for (col = colMin; col <= colMax; col++) {
				if (vm.grid[row][col]['status'] === 'P') {
					result = false;
					break;
				}
			}
			if (!result) {
				break;
			}
		}
		return result;
	}

	function assignPosition() {
		var name = document.getElementById('namePosition').value,
			random = Math.floor((Math.random() * 100) + 1),
			status = 'P',
			color = 'rgba(0, 96, 255, 0.' + random + ')';
		if (name) {
			changeGridContent(name, status, color);
			markBorders();
			renderGrid();
			changeDom('assignPosition');
		}
	}

	function resetPosition() {
		vm.rowMin = 100000;
		vm.colMin = 100000;
		vm.rowMax = -1;
		vm.colMax = -1;
	}

	function addCell() {
		return [];
	}

	function addRow() {
		var i,
			newRow = [];
		for (i = vm.col; i--;) {
			newRow.push(addCell());
		}
		vm.grid.push(newRow);
	}

	function eraseRow() {
		var len = vm.grid.length;
		if (len === 12) {
			alert('no se puede')
		} else {
			vm.grid.pop();
		}
	}

	function addScreen() {
		var i;
		for (i = vm.row; i--;) {
			addRow();
		}
	}
	
	function createRow(){
		addRow();
		vm.rowMin = vm.grid.length - 1; 
		vm.rowMax = vm.grid.length - 1; 
		vm.colMin = 0;
		vm.colMax = vm.col - 1;
		vm.changeGridContent('', '', '');
		vm.renderGrid();
	}
	
	function renderGrid() {
		var i,
			b,
			columns,
			row,
			screenDivision,
			columnEmpty,
			rowContainer,
			name,
			content,
			color,
			width,
			height,
			div,
			gridRender = '',
			sizeGrid = vm.grid.length;
		for (i = 0; i < sizeGrid; i++) {
			if ((i + 1) % 12 === 0 && i !== 0) {
				screenDivision = '<div class="row screen-division yellow">#COLUMNS#</div>';
			} else {
				screenDivision = '';
			}
			row = '<div class="row">#COLUMNS#</div>';
			columns = '';
			columnEmpty = '';
			for (b = 0; b < vm.col; b++) {
				name = vm.grid[i][b]['name'] ? vm.grid[i][b]['name'] : '';
				content = vm.grid[i][b]['status'] ? vm.grid[i][b]['status'] : '';
				color = vm.grid[i][b]['color'] ? vm.grid[i][b]['color'] : '';
				div = vm.grid[i][b]['div']['ini'] ? vm.grid[i][b]['div']['ini'] : '';
				width = vm.grid[i][b]['div']['width'] ? vm.grid[i][b]['div']['width'] : '';
				height = vm.grid[i][b]['div']['height'] ? vm.grid[i][b]['div']['height'] : '';
				rowContainer = vm.grid[i][b]['row'] ? vm.grid[i][b]['row'] : '';
				columns += '<div class="square-grid" id="col-' + i + '-' + b + '" style="background-color:' + color + ';"><span>' + rowContainer + '</span><span>' + div + '</span><span>' + width + '</span><span>' + height + '</span><span>' + name + '</span></div>';
				columnEmpty += '<div class="square-grid"> SCREEN DIVISION </div>';
			}
			screenDivision = screenDivision.replace('#COLUMNS#', columnEmpty);
			row = row.replace('#COLUMNS#', columns) + screenDivision;
			gridRender += row;
		}
		document.getElementById('gridCanvas').innerHTML = gridRender;
	}

	function clearPosition() {
		var row,
			col;
		for (row = vm.rowMin; row <= vm.rowMax; row++) {
			for (col = vm.colMin; col <= vm.colMax; col++) {
				vm.grid[row][col] = { name: '', status: '', color: '' };
			}
		}
		renderGrid();
		resetPosition();
		changeDom('clearPosition');
	}

	function createPosition() {
		changeDom('createPosition');
		if (vm.rowMin === 100000 && vm.colMin === 100000 && vm.colMax === -1 && vm.rowMax === -1) {
			alert('choose a position');
			document.getElementById('createPosition').classList.remove('display-none');
			document.getElementById('containerOption').classList.add('display-none');
		} else {
			document.getElementById('createPosition').classList.add('display-none');
			document.getElementById('containerOption').classList.remove('display-none');
			document.getElementById('clearPosition').classList.add('display-none');
			//document.getElementById('addRow').classList.add('display-none');
			document.getElementById('eraseRow').classList.add('display-none');
		}
	}

	function changeGridContent(name, status, color) {
		var row,
			col;
		for (row = vm.rowMin; row <= vm.rowMax; row++) {
			for (col = vm.colMin; col <= vm.colMax; col++) {
				vm.grid[row][col] = { div: {}, name: name, status: status, color: color };
			}
		}
		createPositionNames(name);
	}

	function markBorders() {
		vm.grid[vm.rowMin][vm.colMin].div = { ini: 'ini-l', width: vm.colMax - vm.colMin + 1, height: vm.rowMax - vm.rowMin + 1 }
		vm.grid[vm.rowMin][vm.colMax].div = { ini: 'ini-r', width: vm.colMax - vm.colMin + 1, height: vm.rowMax - vm.rowMin + 1 }
		vm.grid[vm.rowMax][vm.colMin].div = { ini: 'end-l', width: vm.colMax - vm.colMin + 1, height: vm.rowMax - vm.rowMin + 1 }
		vm.grid[vm.rowMax][vm.colMax].div = { ini: 'end-r', width: vm.colMax - vm.colMin + 1, height: vm.rowMax - vm.rowMin + 1 }
	}

	function createPositionNames(name) {
		var positionButton,
			positionTextName;
		if (name !== '') {
			positionButton = document.createElement('BUTTON');
			positionButton.setAttribute('id', name);
			positionTextName = document.createTextNode(name);
			positionButton.appendChild(positionTextName);
			document.getElementById('containerNamePosition').appendChild(positionButton);
			document.getElementById('containerNamePosition').addEventListener('click', erasePosition);
		}
	}

	function erasePosition() {
		var target = event.target.id,
			i,
			j,
			positionButton;
		for (i = 0; i < vm.grid.length; i++) {
			for (j = 0; j < vm.grid[i].length; j++) {
				if (vm.grid[i][j]['name'] === target) {
					vm.grid[i][j]['name'] = '';
					vm.grid[i][j]['status'] = '';
					vm.grid[i][j]['color'] = '';
					resetPosition();
				}
			}
		}
		positionButton = document.getElementById(target);
		document.getElementById('containerNamePosition').removeChild(positionButton);
		renderGrid();
	}

	function generateGrid() {
		var row,
			col,
			rowEnd,
			colMirror;
		for (row = 0; row < vm.grid.length; row++) {
			colMirror = 0;
			while (colMirror < vm.grid[row].length) {
				for (col = colMirror; col < vm.grid[row].length; col++) {
					colMirror = col + 1;
					if (vm.grid[row][col]['div']['ini'] === 'ini-l') {
						colMirror = findColEnd(vm.grid[row], col);
						rowEnd = findRowEnd(colMirror);
						vm.grid[row][col]['row'] = colMirror - col + 1;
						vm.grid[row][rowEnd]['row'] = 'hola';
						break;
					}
				}
			}
		}
		renderGrid();
	}

	function findColEnd(eachRow, colStart) {
		var col;
		for (col = colStart; col < eachRow.length; col++) {
			if (eachRow[col]['div']['ini'] === 'ini-r') {
				if (col === eachRow.length - 1 || eachRow[col + 1]['div']['ini'] !== 'ini-l') {
					break;
				}
			}
		}
		console.log(col);
		return col;
	}
	
	function findRowEnd(colStart) {
		var row,
			col; 
		for (row = 0; row < vm.grid.length; row++) {
			for(col = colStart + 1; col--;){
				if(vm.grid[row][col]['div']['ini'] === 'end-r'){
					if(col === vm.grid[row].length - 1 || vm.grid[row][col + 1]['div']['ini'] !== 'end-l' ){
						break
					}
				}
			}
		}
		return col;
	}
	
	
	
	function changeDom(activateDom) {
		if (activateDom === 'newPosition') {
			document.getElementById('newPosition').classList.toggle('display-none');
			document.getElementById('createPosition').classList.toggle('display-none');
			document.getElementById('clearPosition').classList.remove('display-none');
			//document.getElementById('addRow').classList.add('display-none');
			document.getElementById('eraseRow').classList.add('display-none');
		}
		if (activateDom === 'clearPosition') {
			document.getElementById('createPosition').classList.add('display-none');
			document.getElementById('newPosition').classList.remove('display-none');
			document.getElementById('clearPosition').classList.add('display-none');
			//document.getElementById('addRow').classList.remove('display-none');
			document.getElementById('eraseRow').classList.remove('display-none');
		}
		if (activateDom === 'createPosition') {
			document.getElementById('newPosition').classList.add('display-none');
			document.getElementById('createPosition').classList.toggle('display-none');
			document.getElementById('namePosition').value = '';
		}
		if (activateDom === 'assignPosition' || activateDom === 'assignComponent') {
			document.getElementById('containerOption').classList.toggle('display-none');
			document.getElementById('newPosition').classList.toggle('display-none');
			document.getElementById('clearPosition').classList.add('display-none');
			//document.getElementById('addRow').classList.remove('display-none');
			document.getElementById('eraseRow').classList.remove('display-none');
		}
	}

	function getFramework(framework) {
		if (framework === 'bootstrap') {
			vm.col = 12;
			vm.row = 12;
		} else if (framework === 'foundation') {
			vm.col = 16;
			vm.row = 16;
		}
	}
	
}



var y = new ConstructGrid(configuration);
var h = y.addScreen();
y.rowMin = 0;
y.rowMax = y.row - 1;
y.colMin = 0;
y.colMax = y.col - 1;
y.changeGridContent('', '', '');
y.renderGrid();


