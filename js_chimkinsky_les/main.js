;(function(){

	var map = [
		"Старый камень",
		"Глубокий колодец",
		"Солнечная поляна",
		"Спящий дракон",
		"Узкая тропинка",
		"Край реки",
		"Древние ворота",
		"Одинокая деревянная скамья",
		"Старый дом в лесу"
	],
	blockedPathMessages = [
		"Этот путь слишком опасен",
		"Таинственная сила удерживает вас",
		"Заросли с шипами блокирует ваш путь",
		"Нельзя перешагнуть через дракона",
		"",
		"Река слишком глубока",
		"Засов закрыт",
		"Лес слишком густой, чтобы пройти",
		"Вы слишком напуганы, чтобы идти туда"
	],
	helpMessages = [
		"",
		"Интересно, можно ли использовать что-то,чтобы узнать, насколько глубок колодец?",
		"",
		"Может быть, если бы у вас был меч, вы могли бы убить дракона?",
		"",
		"",
		"",
		"",
		"Кажется это хорошее место для музыки"
	],
	images = ["stone", "well", "glade", "dragon", "path", "river", "gate", "bench", "cottage"],
	mapLocation = 4, playerInput = "", gameMessage = "",
	actionsKnow = ['север', 'юг','запад','восток', 'взять', 'использовать', 'выбросить', "help", "подсказка"], action = "",
	output = document.getElementById('output'),
	input = document.getElementById('input'),
	button = document.getElementsByTagName('button')[0],
	image = document.getElementsByTagName('img')[0],
	itemsKnow = ["барабан", "камень", "меч"],
	items = ["камень"], itemLocations = [6], item = "", backpack = [],
	seconds = 0 , timer = setInterval(function(){seconds++;}, 1000);


	button.addEventListener('click', clickHandler, false);
	window.addEventListener('keydown', clickHandler, false);
	render();

	function clickHandler(e){
		if (e.type === "click" || e.keyCode === 13)
			playGame();
	}

	function playGame(){
		playerInput = input.value.toLowerCase();
		gameMessage = "";
		action = "";
		item = "";
		for(i = 0; i < itemsKnow.length; i++) {
			if(playerInput.indexOf(itemsKnow[i]) !== -1) {
				item = itemsKnow[i];
				console.log("Выбранный предмет игроком - " + item);
				break;
			}
		}
		for(i = 0; i < actionsKnow.length; i++) {
			if(playerInput.indexOf(actionsKnow[i]) !== -1){
				action = actionsKnow[i];
				console.log("Вы выбрали действие - " + action);
				break;
			}
		}
		switch(action){
			case "север":
				if(mapLocation > 2) {mapLocation-=3;}
				else gameMessage = blockedPathMessages[mapLocation];
				break;
			case "юг": 
				if(mapLocation < 6) {mapLocation+=3;}
				else gameMessage = blockedPathMessages[mapLocation];
				break;
			case "восток":
				if(mapLocation % 3 !== 2) {mapLocation+=1;}
				else gameMessage = blockedPathMessages[mapLocation];
				break;
			case "запад":
				if(mapLocation % 3 !== 0) {mapLocation-=1;}
				else gameMessage = blockedPathMessages[mapLocation];
				break;
			case "взять": takeItem(); break;
			case "использовать": useItem(); break;
			case "выбросить": dropItem(); break;
			case "help":
				gameMessage += "Попробуйте одно из слов: ";
				gameMessage += "север, юг, запад, восток, взять, выбросить, использовать, камень, барабан, меч";
				break;
			case "подсказка":
				if(helpMessages[mapLocation] !== ""){
					gameMessage = helpMessages[mapLocation];
				} else {
					gameMessage = "Здесь ничего интересного";
				}
				break;
			default: gameMessage = "Я этого не понимаю";
		}
		render();
	}

	function render(){
		output.innerHTML = map[mapLocation] + "<br><em>" + gameMessage + "</em>"
		output.innerHTML += "<em>" + gameMessage + "</em>"
		image.src = "images/" + images[mapLocation] + ".jpg";

		for(i = 0;i < items.length;i++){
			if(mapLocation === itemLocations[i]){
				output.innerHTML += "<br><strong>Вы видите здесь - " + items[i] + "</strong>";
			}
		}

		if(backpack.length !== 0) {
			output.innerHTML += "<br>>Вы несете: " + backpack.join(", ");
		}

	}

	function takeItem() {
		var itemIndexNumber = items.indexOf(item);
		if(itemIndexNumber !== -1 && itemLocations[itemIndexNumber] === mapLocation) {
			gameMessage = "Вы взяли - " + item;
			backpack.push(item);
			items.splice(itemIndexNumber,1);
			itemLocations.splice(itemIndexNumber, 1);
			console.log("Предметы мира: " + items)
			console.log("Предметы в рюгзаке: " + backpack)
		} else {
			gameMessage = "Я не могу это сделать<br><em>Пример: взять меч";
		}
	}

	function dropItem() {
		if(backpack.length !== 0) {
			var backpackIndexNumber = backpack.indexOf(item);
			if(backpackIndexNumber !== -1){
				gameMessage = "Вы выбросили - " + item;
				items.push(item);
				itemLocations.push(mapLocation);
				backpack.splice(backpackIndexNumber, 1);
			} else {
				gameMessage = "Я не могу это сделать<br><em>Пример: выбросить барабан";
			}
		} else {
			gameMessage = "У меня ничего нет";
		}
	}

	function useItem() {
		var backpackIndexNumber = backpack.indexOf(item);
		if(backpackIndexNumber === -1) {
			gameMessage = "У вас этого нет<br><em>Пример: использовать камень";
		}

		if(backpack.length === 0) {
			gameMessage = "У вас ничего нет"
		}

		if(backpackIndexNumber !== -1) {
			switch(item){
				case "барабан":
					if(mapLocation === 8) {
						if(backpack.indexOf("меч") === -1){
							gameMessage = "Вы играли на барабане, маг услышал и ему понравилось, он дал вам меч";
							backpack.push("меч");
							helpMessages[mapLocation] = "Старик уже дал вам меч";
						} else
							gameMessage = helpMessages[mapLocation];
					} else {
						gameMessage = "Вы играете крисивую музыку, но ее никто не слышит";
					}
					break;
				case "камень":
					if(mapLocation === 1) {
						gameMessage = "Вы бросили камень в колодец.";
						gameMessage += " Появился волшебный барабан!";
						backpack.splice(backpackIndexNumber, 1);
						items.push("барабан");
						itemLocations.push(mapLocation);
						helpMessages[mapLocation] = "Вы уже получили волшебный барабан";
					} else {
						gameMessage = "Вы вертите камень в руках";
					}
					break;
				case "меч":
					if(mapLocation === 3) {
						gameMessage = "Вы замахиваетесь и убиваете дракона!";
						endGame();
					} else {
						gameMessage = "Вы бессмысленно размахиваете мечом."
					}
					break;
			}
		}
	}

	function endGame(){
		button.removeEventListener('click', clickHandler, false);
		window.removeEventListener('keydown', clickHandler, false);
		clearInterval(timer);
		gameMessage += "<br><strong>Вы прошли игру!<br>за " + seconds + " секунду</strong>";
	}

}());