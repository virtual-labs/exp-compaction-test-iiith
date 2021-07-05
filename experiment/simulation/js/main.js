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

		if(objs['rammer'].pos[1] + objs['rammer'].height === objs['dolly'].pos[1])
		{
			if(extras['soilPart'].pos[1] + extras['soilPart'].height <= objs['cutter'].pos[1] + objs['cutter'].height - translate[1])
			{
				extras['soilPart'].adding(translate[1]);
			}

			updatePos(objs['dolly'], translate);
			updatePos(objs['cutter'], translate);
			step = limCheck(objs['cutter'], translate, lim, step);
			translate[1] *= -1;
			if(step === 9)
			{
				objs['soil'] = new cutSoil(180, 300, 450, 210);
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
				document.getElementById("output1").innerHTML = "Mass of cutter = " + String(10) + " g";
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

	class cutSoil{
		constructor(height, width, x, y) {
			this.height = height;
			this.width = width;
			this.pos = [x, y];
			this.img = new Image();
			this.img.src = './images/cut-soil.png';
			this.img.onload = () => {ctx.drawImage(this.img, this.pos[0], this.pos[1], this.width, this.height);}; 
		};

		draw(ctx) {
			ctx.drawImage(objs['soil'].img, objs['soil'].pos[0], objs['soil'].pos[1], objs['soil'].width, objs['soil'].height);
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

	class cutter{
		constructor(height, width, x, y) {
			this.height = height;
			this.width = width;
			this.pos = [x, y];
			this.img = new Image();
			this.img.src = './images/cutter.png';
			this.img.onload = () => {ctx.drawImage(this.img, this.pos[0], this.pos[1], this.width, this.height);}; 
		};

		draw(ctx) {
			ctx.drawImage(objs['cutter'].img, objs['cutter'].pos[0], objs['cutter'].pos[1], objs['cutter'].width, objs['cutter'].height);
		}
	};

	class dolly{
		constructor(height, width, x, y) {
			this.height = height;
			this.width = width;
			this.pos = [x, y];
			this.img = new Image();
			this.img.src = './images/dolly.png';
			this.img.onload = () => {ctx.drawImage(this.img, this.pos[0], this.pos[1], this.width, this.height);}; 
		};

		draw(ctx) {
			ctx.drawImage(objs['dolly'].img, objs['dolly'].pos[0], objs['dolly'].pos[1], objs['dolly'].width, objs['dolly'].height);
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
		document.getElementById("output1").innerHTML = "Mass of cutter = ____ g";
		document.getElementById("output2").innerHTML = "Volume of soil = ____ cm" + "3".sup();

		objs = {
			"weight": new weight(270, 240, 90, 190),
			"soil": new unevenSoil(150, 300, 450, 240),
			"rammer": new rammer(60, 50, 505, 0),
			"dolly": new dolly(50, 140, 460, 65),
			"cutter": new cutter(150, 120, 630, 240),
		};
		keys = [];

		extras = {
			"soilPart": new soilPart(0, 110, 475, 255),
		};
		extrasKeys = [];

		enabled = [["weight"], ["weight", "cutter"], ["weight", "cutter"], ["weight", "cutter", "soil"], ["weight", "cutter", "soil"], ["cutter", "soil"], ["cutter", "soil", "dolly"], ["cutter", "soil", "dolly", "rammer"], ["cutter", "soil", "dolly", "rammer", "soilPart"], ["weight", "cutter", "soilPart"], []];
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
		if(translate[0] != 0 || translate[1] != 0)
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
				if(step === 2 && val === "cutter")
				{
					hover = true;
					translate[0] = -5;
					translate[1] = -5;
					lim[0] = 150;
					lim[1] = 115;
				}

				if(step === 4 && val === "soil")
				{
					hover = true;
					if(flag)
					{
						objs['soil'] = new evenSoil(180, 300, 450, 210);
						updateStep = true;
					}
				}

				if(step === 5 && val === "cutter")
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

				else if(step === 9 && val === "cutter")
				{
					hover = true;
					translate[0] = -5;
					translate[1] = -5;
					lim[0] = 150;
					lim[1] = 115;

					if(flag)
					{
						keys = keys.filter(function(val, index) {
							return val != "dolly" && val != "rammer";
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

	const canvas = document.getElementById("main");
	canvas.width = 840;
	canvas.height = 400;
	canvas.style = "border:3px solid";
	const ctx = canvas.getContext("2d");

	const fill = "#A9A9A9", border = "black", lineWidth = 1.5, fps = 150;
	const msgs = [
		"Click on 'Weighing Machine' in the apparatus menu to add a weighing machine to the workspace.", 
		"Click on 'Cutter' in the apparatus menu to add a cutter to the workspace.",
		"Click on the cutter to move it to the weighing machine and weigh it.",
		"Click on 'Soil Sample' in the apparatus menu to add a soil sample to the workspace.",
		"Click on the soil sample to even it out.",
		"Click on the cutter to move it to the soil sample for cutting.",
		"Click on 'Dolly' in the apparatus menu to add a dolly to the workspace.",
		"Click on 'Rammer' in the apparatus menu to add a rammer to the workspace.",
		"Click on the rammer to cut through the soil.",
		"Click on the cutter with soil to weigh it. Finally, determine the water content of the soil sample. Use the following <a href=''>link</a> to learn more about water content determination.",
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

		if(translate[0] != 0 || translate[1] != 0)
		{
			let temp = step;
			const soilMoves = [9], cutterMoves = [2, 5, 9];

			if(cutterMoves.includes(step))
			{
				updatePos(objs['cutter'], translate);
				if(step === 9)
				{
					updatePos(extras['soilPart'], translate);
				}
				temp = limCheck(objs['cutter'], translate, lim, step);
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
