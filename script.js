
var nailApp = {}

//when the user hits submit, run the init

nailApp.init = function() {
	nailApp.getNailInfo();
	nailApp.loading();
	nailApp.buttonScroll();


}

//get data from the makeup api

nailApp.getNailInfo = function(){
	$.ajax({
		url: 'http://proxy.hackeryou.com',
		method: 'GET',
		datatype: 'json',
		data: {
			reqUrl: 'http://makeup-api.herokuapp.com/api/v1/products.json',
		},
		useCache: true
	})
	.then(function(res){
		var essie = res.filter(function(product) {
			return product.brand === 'essie'
		});
		nailApp.essie = essie;

//sort the nail polish by ID number
		var colorCodes = [];

		essie.forEach(function(item){
			var onlyNums = item.product_colors.map(function(color){
				var ogColour = color.colour_name;
				var colorNum = ogColour.match(/\d+/g);
				if(colorNum !== null) {
					colorCodes.push(colorNum[0]);
				}
			});
		});
		var colorCodesSorted = colorCodes.sort();
		nailApp.onSubmitOfNails(colorCodesSorted);
	});
};

//grab the nail polish colors that apply to their choices

nailApp.onSubmitOfNails = function(array) {
	$(".nailForm").on("submit", function(e){
		e.preventDefault();

		var dateActivityChoices = $("input[name=activity]:checked").val();

		let colorsArray = [];

		if (dateActivityChoices === "outdoorsy") {
		  	var outdoorsyColors = array.filter(function(a){
		  		return a <= "300";
		  	});
		  	colorsArray.push(outdoorsyColors);

	  	} else if (dateActivityChoices === "casual"){
		  	casualColors = array.filter(function(a){
		  		return a > "300" && a <= "500"; 
	  		});
	  		colorsArray.push(casualColors);

	  	} else if (dateActivityChoices === "playful"){
		  	playfulColors = array.filter(function(a){
		  		return a > "500" && a <= "730"; 
		  	});
		  	colorsArray.push(playfulColors);

		} else {
		  	romanticColors = array.filter(function(a){
		  		return a > "730";
		  	});
		  	colorsArray.push(romanticColors);
	  	};  	
	  	nailApp.chooseRandomColor(colorsArray);

	  	//finger color slider

	  	$("#finger").css("background-color", "#ffdbac");

		$("#slider").slider({
		  	value: 100,
		    min:0,
		    max: 500, 
		   	step: 5,
		  	slide: function (event, ui) {
				slider = ui.value;
				if  (slider >= 0 && slider < 100) {
					$("#finger").css("background-color", "#ffdbac");
				}
				else if (slider >= 100 && slider < 200) {
					$("#finger").css("background-color", "#f1c27d");
				}
				else if (slider >= 200 && slider < 300) {
					$("#finger").css("background-color", "#e0ac69");
				}
				else if (slider >= 300 && slider < 400) {
					$("#finger").css("background-color", "#c68642");
				}
				else if (slider > 400) {
					$("#finger").css("background-color", "#8d5524");
				};
			}
		});
		$(".sliderInfo").text(`Slide me to change skin tones!`);
	});
};

//Choose a random color out of the qualifying colors

nailApp.chooseRandomColor = function(colorsArray) {
	var newArray = colorsArray[0];
	var randomColor = Math.floor(Math.random() * newArray.length);
	var finalColor = newArray[randomColor];
	nailApp.getHex(finalColor);
	return finalColor;
};

//pull that color from the original API and get associated hex color

nailApp.getHex = function(finalColor){

// finalColor //THIS is my random color

	var essie = nailApp.essie
	essie.forEach(function(item){
		var onlyNums = item.product_colors.map(function(color){
			var ogColour = color.colour_name;
			var colorNum = ogColour.match(/\d+/g);

			if (colorNum !== null) {
				var newColorObj = {
					colorName: ogColour,
					colorCode: colorNum,
					hex: color.hex_value
				};

				if (newColorObj.colorCode[0] === finalColor) {
					var finalHex = newColorObj.hex;
					var finalName = newColorObj.colorName;
					$(".results").html(`<p>Your colour is <span class="colorStyling">${finalName}</span></p>`);
					$(".resultsContainer").addClass("resultsColor").css('background-color', finalHex);
				};
			};
		});
	});

// this choice determines the top coat

	var dateNumberChoice = $("input[name=dateNumber]:checked").val() 
		if (dateNumberChoice === '1'){
			$(".topcoatResult").html(`<p>with a <span class="colorStyling">glossy</span> topcoat!</p>`);
		} else if (dateNumberChoice === '2') {
			$(".topcoatResult").html(`<p>with a <span class="colorStyling">glittery</span> topcoat!</p>`);
		} else if (dateNumberChoice === '3') {
			$(".topcoatResult").html(`<p>with a <span class="colorStyling">metallic</span> topcoat!</p>`);
		} else {
			$(".topcoatResult").html(`<p>with a <span class="colorStyling">matte</span> topcoat!</p>`);
		};
};

//loading screen while waiting for ajax data

nailApp.loading = function() {
	$(document).ajaxStart(function(){
    	$('#loading').show();
 	}).ajaxStop(function(){
    	$('#loading').hide();
 	});
}



//smoothscroll 

nailApp.buttonScroll = function () {
    $('.button').on('click', function() {
    $('html, body').animate({
        scrollTop: $('.button').offset().top
    }, 1000);
  });
}


//only call the init, Name spacing.

$(function(){
	nailApp.init();
});





