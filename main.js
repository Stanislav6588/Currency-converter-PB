'use strict'

class Converter {
	constructor({date, changeInput, changeCurr, resultBtn, resultSelect, findInput, findCurr, type}) {
		this.date = document.querySelector(date);
		this.changeInput = document.querySelector(changeInput);
		this.changeCurr = document.querySelector(changeCurr);
		this.resultBtn = document.querySelector(resultBtn);
		this.resultSelect = document.querySelector(resultSelect);
		this.findInput = document.querySelector(findInput);
		this.findCurr = document.querySelector(findCurr);
		this.type = document.querySelector(type);
	}

	getData(){
		this.date.textContent = new Date().toISOString().slice(0, 10).split('-').reverse().join('.');
	}

	changeRate(){
		this.type.addEventListener('change', () => {
				this.type.value == 'nul' ?
				this.getJSON('https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5')
				:this.getJSON('https://api.privatbank.ua/p24api/pubinfo?exchange&json&coursid=11');
		})
	}

	getJSON(url){
		const request = new XMLHttpRequest();
		request.addEventListener('readystatechange', (event) => {
			if(request.readyState === 4 && request.status === 200){
				const data = JSON.parse(request.responseText);
				this.result(data);
			}
		})
		request.open('GET', url);
		request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		request.send();
	}

	result(data){
		this.resultBtn.addEventListener('click', () => {
			let sum = 0;
			let input = this.changeInput.value;
			if(this.changeCurr.value == this.findCurr.value){
				sum = +input;
			}
			else if(this.changeCurr.value == 'UAH' ){
				this.findCurr.value == 'USD' 
				? sum = input / data[0].sale
				: sum = input / data[1].sale;
			}
			else if(this.changeCurr.value == 'USD' ){
				this.findCurr.value == 'UAH'
				? sum = input * data[0].buy
				: sum = input / data[0].buy * data[1].sale;
			}
			else if(this.changeCurr.value == 'EUR' ){
				this.findCurr.value == 'UAH'
				? sum = input * data[1].buy
				: sum = input / data[1].buy * data[0].sale; 
			}
			this.findInput.value = sum.toFixed(2);
		})
	}

	defaultUrl(){
		this.getJSON('https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5')
	}
	
	init(){
		this.defaultUrl();
		this.getData();
		this.changeRate();
		this.getJSON();
	}
}