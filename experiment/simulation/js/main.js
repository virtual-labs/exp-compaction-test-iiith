'use strict';

document.addEventListener('DOMContentLoaded', function(){

	const restartButton = document.getElementById('restart');
	const instrMsg = document.getElementById('procedure-message');

	restartButton.addEventListener('click', function() {restart();});

	function randomNumber(min, max) {
		return (Math.random() * (max - min + 1) + min).toFixed(2);
	};

	function logic(tableData)
	{
		const soilWater = { 'Silt': randomNumber(22.5, 27.5), 'Sand': randomNumber(12, 16), 'Clay': randomNumber(30, 50) }, soilDensity = { 'Silt': 1.46, 'Sand': 1.43, 'Clay': 1.39 };
		tableData.forEach(function(row, index) {
			const waterContent = soilWater[row['Soil Type']], ans = soilDensity[row['Soil Type']];
			row['Wet Soil Mass(g)'] = (ans * (1 + waterContent / 100) * 800).toFixed(2);
			row["Wet Density (g/cm^3)"] = (ans * (1 + waterContent / 100)).toFixed(2);
			row['Water Content(%)'] = Number(waterContent);
			row["Dry Density (g/cm^3)"] = Number(ans);
		});
	};

	function cutting()
	{
		if(translate[1] < 0 && objs['rammer'].pos[1] <= 0)
		{
			translate[1] *= -1;
		}

		updatePos(objs['rammer'], translate);

		if(objs['rammer'].pos[1] + objs['rammer'].height === objs['collar'].pos[1])
		{
			if(extras['soilPart'].pos[1] + extras['soilPart'].height <= objs['mould'].pos[1] + objs['mould'].height - translate[1])
			{
				extras['soilPart'].adding(translate[1]);
			}

			updatePos(objs['collar'], translate);
			updatePos(objs['mould'], translate);
			step = limCheck(objs['mould'], translate, lim, step);
			translate[1] *= -1;
			if(step === 9)
			{
				cutStep = false;
			}
		}
	};

	function limCheck(obj, translate, lim, step)
	{
		if(obj.pos[0] === lim[0])
		{
			translate[0] = 0;
		}

		if(obj.pos[1] === lim[1])
		{
			translate[1] = 0;
		}

		if(translate[0] === 0 && translate[1] === 0)
		{
			if(step === 2)
			{
				document.getElementById("output1").innerHTML = "Mass of mould = " + String(10) + " g";
			}

			else if(step === enabled.length - 2)
			{
				document.getElementById("output2").innerHTML = "Volume of soil = 800 cm" + "3".sup();
				logic(tableData);
				generateTableHead(table, Object.keys(tableData[0]));
				generateTable(table, tableData);

				document.getElementById("apparatus").style.display = 'none';
				document.getElementById("observations").style.width = '40%';
				if(small)
				{
					document.getElementById("observations").style.width = '85%';
				}
			}
			return step + 1;
		}

		return step;
	};

	function updatePos(obj, translate)
	{
		obj.pos[0] += translate[0];
		obj.pos[1] += translate[1];
	};

	class soilPart{
		constructor(height, width, x, y) {
			this.height = height;
			this.width = width;
			this.pos = [x, y];
			this.img = new Image();
			this.img.src = './images/soil-sample.png';
			this.img.onload = () => {ctx.drawImage(this.img, this.pos[0], this.pos[1], this.width, this.height);}; 
		};

		draw(ctx) {
			ctx.drawImage(extras['soilPart'].img, extras['soilPart'].pos[0], extras['soilPart'].pos[1], extras['soilPart'].width, extras['soilPart'].height);
		};

		adding(unit) {
			this.height += unit;
		};
	};

	class unevenSoil{
		constructor(height, width, x, y) {
			this.height = height;
			this.width = width;
			this.pos = [x, y];
			this.img = new Image();
			this.img.src = './images/uneven-soil.png';
			this.img.onload = () => {ctx.drawImage(this.img, this.pos[0], this.pos[1], this.width, this.height);}; 
		};

		draw(ctx) {
			ctx.drawImage(objs['soil'].img, objs['soil'].pos[0], objs['soil'].pos[1], objs['soil'].width, objs['soil'].height);
		}
	};

	class mould{
		constructor(height, width, x, y) {
			this.height = height;
			this.width = width;
			this.pos = [x, y];
			this.img = new Image();
			this.img.src = './images/mould.png';
			this.img.onload = () => {ctx.drawImage(this.img, this.pos[0], this.pos[1], this.width, this.height);}; 
		};

		draw(ctx) {
			ctx.drawImage(objs['mould'].img, objs['mould'].pos[0], objs['mould'].pos[1], objs['mould'].width, objs['mould'].height);
		}
	};

	class water {
		constructor(height, width, radius, x, y) {
			this.height = height;
			this.width = width;
			this.radius = radius;
			this.pos = [x, y];
		};

		draw(ctx) {
			ctx.fillStyle = "white";
			ctx.lineWidth = 3;

			if(this.width < 2 * this.radius)
			{
				this.radius = this.width / 2;
			}

			if(this.height < 2 * this.radius)
			{
				this.radius = this.height / 2;
			}

			ctx.beginPath();
			ctx.moveTo(this.pos[0] + this.radius, this.pos[1]);
			ctx.arcTo(this.pos[0] + this.width, this.pos[1], this.pos[0] + this.width, this.pos[1] + this.height, this.radius);
			ctx.arcTo(this.pos[0] + this.width, this.pos[1] + this.height, this.pos[0], this.pos[1] + this.height, this.radius);
			ctx.arcTo(this.pos[0], this.pos[1] + this.height, this.pos[0], this.pos[1], this.radius);
			ctx.arcTo(this.pos[0], this.pos[1], this.pos[0] + this.width, this.pos[1], this.radius);
			ctx.closePath();
			ctx.fill();
			ctx.stroke();

			const e1 = [this.pos[0] + this.width, this.pos[1]], e2 = [...this.pos];
			const gradX = (e1[0] - e2[0]) / -4, gradY = 10;

			ctx.beginPath();
			ctx.moveTo(e2[0], e2[1]);
			curvedArea(ctx, e2, -1 * gradX, -1 * gradY);
			curvedArea(ctx, e1, gradX, gradY);
			ctx.closePath();
			ctx.fill();
			ctx.stroke();
		};
	};

	class collar{
		constructor(height, width, x, y) {
			this.height = height;
			this.width = width;
			this.pos = [x, y];
			this.img = new Image();
			this.img.src = './images/collar.png';
			this.img.onload = () => {ctx.drawImage(this.img, this.pos[0], this.pos[1], this.width, this.height);}; 
		};

		draw(ctx) {
			ctx.drawImage(objs['collar'].img, objs['collar'].pos[0], objs['collar'].pos[1], objs['collar'].width, objs['collar'].height);
		}
	};

	class rammer{
		constructor(height, width, x, y) {
			this.height = height;
			this.width = width;
			this.pos = [x, y];
			this.img = new Image();
			this.img.src = './images/rammer.png';
			this.img.onload = () => {ctx.drawImage(this.img, this.pos[0], this.pos[1], this.width, this.height);}; 
		};

		draw(ctx) {
			ctx.drawImage(objs['rammer'].img, objs['rammer'].pos[0], objs['rammer'].pos[1], objs['rammer'].width, objs['rammer'].height);
		}
	};

	class evenSoil{
		constructor(height, width, x, y) {
			this.height = height;
			this.width = width;
			this.pos = [x, y];
			this.img = new Image();
			this.img.src = './images/even-soil.png';
			this.img.onload = () => {ctx.drawImage(this.img, this.pos[0], this.pos[1], this.width, this.height);}; 
		};

		draw(ctx) {
			ctx.drawImage(objs['soil'].img, objs['soil'].pos[0], objs['soil'].pos[1], objs['soil'].width, objs['soil'].height);
		}
	};

	class weight{
		constructor(height, width, x, y) {
			this.height = height;
			this.width = width;
			this.pos = [x, y];
			this.img = new Image();
			this.img.src = './images/weighing-machine.png';
			this.img.onload = () => {ctx.drawImage(this.img, this.pos[0], this.pos[1], this.width, this.height);}; 
		};

		draw(ctx) {
			ctx.drawImage(objs['weight'].img, objs['weight'].pos[0], objs['weight'].pos[1], objs['weight'].width, objs['weight'].height);
		}
	};

	function init()
	{
		cutStep = false;
		document.getElementById("output1").innerHTML = "Mass of mould = ____ g";
		document.getElementById("output2").innerHTML = "Volume of soil = ____ cm" + "3".sup();

		objs = {
			"weight": new weight(270, 240, 90, 190),
			"soil": new unevenSoil(150, 300, 90, 240),
			"rammer": new rammer(60, 50, 505, 0),
			"collar": new collar(50, 180, 460, 65),
			"mould": new mould(120, 180, 570, 270),
			"water": new water(100, 50, 110, 20)
		};
		keys = [];

		extras = {
			"soilPart": new soilPart(0, 110, 475, 255),
		};
		extrasKeys = [];

		enabled = [["weight"], ["weight", "mould"], ["weight", "mould"], ["weight", "mould"], ["weight", "mould", "soil"], ["mould", "soil", "water"], ["mould", "soil", "collar"], ["mould", "soil", "collar", "rammer"], ["mould", "soil", "collar", "rammer", "soilPart"], ["weight", "mould", "soilPart"], []];
		step = 0;
		translate = [0, 0];
		lim = [-1, -1];
	};

	function restart() 
	{ 
		window.clearTimeout(tmHandle); 

		document.getElementById("apparatus").style.display = 'block';
		document.getElementById("observations").style.width = '';

		table.innerHTML = "";
		init();

		tmHandle = window.setTimeout(draw, 1000 / fps); 
	};

	function generateTableHead(table, data) {
		let thead = table.createTHead();
		let row = thead.insertRow();
		data.forEach(function(key, ind) {
			let th = document.createElement("th");
			let text = document.createTextNode(key);
			th.appendChild(text);
			row.appendChild(th);
		});
	};

	function generateTable(table, data) {
		data.forEach(function(rowVals, ind) {
			let row = table.insertRow();
			Object.keys(rowVals).forEach(function(key, i) {
				let cell = row.insertCell();
				let text = document.createTextNode(rowVals[key]);
				cell.appendChild(text);
			});
		});
	};

	function check(event, translate, step, flag=true)
	{ 
		if(translate[0] !== 0 || translate[1] !== 0)
		{
			return step;
		}

		const canvasPos = [(canvas.width / canvas.offsetWidth) * (event.pageX - canvas.offsetLeft), (canvas.height / canvas.offsetHeight) * (event.pageY - canvas.offsetTop)];
		const errMargin = 10;

		let hover = false, updateStep = false;
		canvas.style.cursor = "default";
		keys.forEach(function(val, ind, arr) {
			if(canvasPos[0] >= objs[val].pos[0] - errMargin && canvasPos[0] <= objs[val].pos[0] + objs[val].width + errMargin && canvasPos[1] >= objs[val].pos[1] - errMargin && canvasPos[1] <= objs[val].pos[1] + objs[val].height + errMargin)
			{
				if(step === 2 && val === "mould")
				{
					hover = true;
					translate[0] = -5;
					translate[1] = -5;
					lim[0] = 120;
					lim[1] = 150;
				}

				else if(step === 3 && val === "mould")
				{
					hover = true;
					translate[0] = 5;
					translate[1] = 5;
					lim[0] = 570;
					lim[1] = 270;

					if(flag)
					{
						keys = keys.filter(function(val, index) {
							return val !== "weight";
						});
					}
				}

				else if(step === 4 && val === "soil")
				{
					hover = true;
					if(flag)
					{
						objs['soil'] = new evenSoil(180, 300, 450, 210);
						updateStep = true;
					}
				}

				else if(step === 5 && val === "mould")
				{
					hover = true;
					translate[0] = 5;
					translate[1] = -5;
					lim[0] = 470;
					lim[1] = 105;
				}

				else if(step === 8 && val === "rammer")
				{
					hover = true;
					cutStep = true;
					translate[1] = 5;
					lim[1] = 230;
				}

				else if(step === 9 && val === "mould")
				{
					hover = true;
					translate[0] = -5;
					translate[1] = -5;
					lim[0] = 150;
					lim[1] = 115;

					if(flag)
					{
						keys = keys.filter(function(val, index) {
							return val !== "collar" && val !== "rammer";
						});
					}
				}
			}
		});

		if(!flag && hover)
		{
			canvas.style.cursor = "pointer";
			translate[0] = 0;
			translate[1] = 0;
			lim[0] = 0;
			lim[1] = 0;
		}

		if(updateStep)
		{
			return step + 1;
		}
		
		return step;
	};

	function curvedArea(ctx, e, gradX, gradY)
	{
		ctx.bezierCurveTo(e[0], e[1] += gradY, e[0] += gradX, e[1] += gradY, e[0] += gradX, e[1]);
		ctx.bezierCurveTo(e[0] += gradX, e[1], e[0] += gradX, e[1] -= gradY, e[0], e[1] -= gradY);
	};

	const canvas = document.getElementById("main");
	canvas.width = 840;
	canvas.height = 400;
	canvas.style = "border:3px solid";
	const ctx = canvas.getContext("2d");

	const fill = "#A9A9A9", border = "black", lineWidth = 1.5, fps = 150;
	const msgs = [
		"Click on 'Weighing Machine' in the apparatus menu to add a weighing machine to the workspace.", 
		"Click on 'Mould' in the apparatus menu to add a mould to the workspace.",
		"Click on the mould to move it to the weighing machine and weigh it.",
		"Click on 'Soil Sample' in the apparatus menu to add a soil sample to the workspace.",
		"Click on the soil sample to even it out.",
		"Click on the mould to move it to the soil sample for cutting.",
		"Click on 'Collar' in the apparatus menu to add a collar to the workspace.",
		"Click on 'Rammer' in the apparatus menu to add a rammer to the workspace.",
		"Click on the rammer to cut through the soil.",
		"Click on the mould with soil to weigh it. Finally, determine the water content of the soil sample. Use the following <a href=''>link</a> to learn more about water content determination.",
		"Click the restart button to perform the experiment again.",
	];

	let step, translate, lim, objs, keys, enabled, small, cutStep, extras, extrasKeys;
	init();

	const tableData = [
		{ "Soil Type": "Silt", "Wet Soil Mass(g)": "", "Water Content(%)": "" }, 
		{ "Soil Type": "Sand", "Wet Soil Mass(g)": "", "Water Content(%)": "" }, 
		{ "Soil Type": "Clay", "Wet Soil Mass(g)": "", "Water Content(%)": "" } 
	];

	const objNames = Object.keys(objs), extrasNames = Object.keys(extras);
	objNames.forEach(function(elem, ind) {
		const obj = document.getElementById(elem);
		obj.addEventListener('click', function(event) {
			if(elem === "rammer")
			{
				extrasKeys.push("soilPart");
			}
			keys.push(elem);
			step += 1;
		});
	});

	canvas.addEventListener('mousemove', function(event) {check(event, translate, step, false);});
	canvas.addEventListener('click', function(event) {
		step = check(event, translate, step);
	});

	const table = document.getElementsByClassName("table")[0];

	function responsiveTable(x) {
		if(x.matches)	// If media query matches
		{ 
			small = true;
			if(step === enabled.length - 1)
			{
				document.getElementById("observations").style.width = '85%';
			}
		} 

		else
		{
			small = false;
			if(step === enabled.length - 1)
			{
				document.getElementById("observations").style.width = '40%';
			}
		}
	};

	let x = window.matchMedia("(max-width: 1023px)");
	responsiveTable(x); // Call listener function at run time
	x.addListener(responsiveTable); // Attach listener function on state changes

	function draw()
	{
		ctx.clearRect(0, 0, canvas.width, canvas.height); 
		ctx.lineCap = "round";
		ctx.lineJoin = "round";

		let ctr = 0;
		document.getElementById("main").style.pointerEvents = 'none';

		objNames.forEach(function(name, ind) {
			document.getElementById(name).style.pointerEvents = 'auto';
			if(keys.includes(name) || !(enabled[step].includes(name)))
			{
				document.getElementById(name).style.pointerEvents = 'none';
			}

			if(keys.includes(name)) 
			{
				if(enabled[step].includes(name))
				{
					ctr += 1;
				}
				objs[name].draw(ctx);
			}
		});

		extrasNames.forEach(function(name, ind) {
			if(extrasKeys.includes(name)) 
			{
				if(enabled[step].includes(name))
				{
					ctr += 1;
				}
				extras[name].draw(ctx);
			}
		});

		if(ctr === enabled[step].length)
		{
			document.getElementById("main").style.pointerEvents = 'auto';
		}

		if(translate[0] !== 0 || translate[1] !== 0)
		{
			let temp = step;
			const soilMoves = [9], mouldMoves = [2, 3, 5, 9];

			if(mouldMoves.includes(step))
			{
				updatePos(objs['mould'], translate);
				if(step === 9)
				{
					updatePos(extras['soilPart'], translate);
				}
				temp = limCheck(objs['mould'], translate, lim, step);
			}

			step = temp;
		}

		if(cutStep)
		{
			cutting();
		}

		document.getElementById("procedure-message").innerHTML = msgs[step];
		tmHandle = window.setTimeout(draw, 1000 / fps);
	};

	let tmHandle = window.setTimeout(draw, 1000 / fps);
});
