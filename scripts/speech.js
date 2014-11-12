/**
 * @author mastermalone
 */
(function($){
	$(window).load(function(){
		$('.flexslider').flexslider({
			slideshowSpeed: 7000,
			slideshow: true,  
			randomize: false,
			animation: "fade",
			touch: true,
			controlNav: false,
			directionNav: true,
			pauseOnAction: true,
			pauseOnHover: true,
			pausePlay: false,
			prevText: "Previous",
			nextText: "Next",
			//manualControls: ".custom-controls li",
			//controlsContainer: '.custom-controls',
			start: function(){
				$(".flex-prev").empty();
				$(".flex-prev").html('<img src="images/prev.png" alt="Previous"/>');
				$(".flex-next").html('<img src="images/next.png" alt="Next"/>');
				if($(".main-nav .flex-direction-nav").length > 0){
					$(".main-nav .flex-direction-nav").remove();
				}
			}
		});
		
		function initSite(){
			if($(".flex-prev").length > 0){
				//console.log("Holla");
				$(".flex-prev").html('<img src="" alt="Previous"');
			}else{
				//console.log("Not Here");
			}
			$(".flex-prev").html('<img src="" alt="Previous"');
			
			cycleThroughAndSet.navigation(".main-nav", "#cks-content");
			cycleThroughAndSet.navigation(".footer-nav", "#cks-content");
		    cycleThroughAndSet.navigation(".slides", "#cks-content");
		    SiteUtils.openNewPage(".footer-nav");
		    SiteUtils.openNewPage(".main-nav");
			$("#tabs").tabs();
			
			$("#faq-accordion").accordion({
				heightStyle: "content"
			});	
			
			$("#milestones-accordion").accordion({
				heightStyle: "content"
			});
					
			$("#form-submit").on("click", function(){
				SiteUtils.validateForm("#appointment");
			});	
			
			/*$("#dotw").on("focus", function(){				
				SiteUtils.popCalendar("dotw");
			});*/
			SiteUtils.popCalendar("dotw");
		}
		initSite();
	});
})(jQuery);


var cycleThroughAndSet = {
	"defaultTabAndPage": "home",
	"navigation": function(obj, pageContent, css, event){
		//console.log("Working", this.defaultTabAndPage);
		//Set default page to cookie value if it's there
		this.defaultTabAndPage = SiteUtils.getCookie("pageName") !== null ? this.defaultTabAndPage = SiteUtils.getCookie("pageName") : this.defaultTabAndPage = this.defaultTabAndPage;
		var targetPage = this.defaultTabAndPage;
		$("#"+this.defaultTabAndPage).addClass("active");

		$.each($(obj).children(), function(idx){
			//console.log("Number of objects: ",idx);
			//Set all page Content to display "none"
			$(pageContent).children().css({"display": "none"});
			//Add event to all LI's
			$(obj+"> li:nth-child("+((idx+1))+")").on("click", function(e){
				//console.log("Value of idx: ", idx);
				//console.log("Target: ", e.target.id);
				targetPage = $(e.target).attr("id") ? targetPage = e.target.id : targetPage = $(e.target).data("id");
				
				//console.log("Target page name: ", targetPage);
				//Remove Active state for "selected" page
				//Add "active" class to selected  nav button
				//On the last itteration, call the fadeIn method for the page content
				if($(e.target).attr("id")){
					$.each($(obj).children(), function(itr){
						$(obj+"> li:nth-child("+((itr+1))+")").removeClass();
						$(obj+"> li:nth-child("+((itr+1))+")").addClass("inactive");
						if((itr+1) === $(obj).children().size()){
							//console.log("Last one");
							//console.log($(obj).children().size(), (itr));
							$('.flexslider').flexslider(idx);
							animateElement.fadeIn(pageContent, targetPage);
							SiteUtils.checkCookie("pageName", targetPage);
							//console.log("COOKIE:", SiteUtils.getCookie("pageName"));
						}
					});
					$(e.target).removeClass();
					$(e.target).addClass("active");	
					
				}else{
					//If the footer navigation is clicked, set the correct main navigation tab to be highlighted
					$.each($(".main-nav").children(), function(itr){
						$(".main-nav > li:nth-child("+((itr+1))+")").removeClass();
						$(".main-nav > li:nth-child("+((itr+1))+")").addClass("inactive");
						if((itr+1) === $(".main-nav").children().size()){
							//console.log("Last one");
							//console.log($(obj).children().size(), (itr));
							$('.flexslider').flexslider(idx);
							animateElement.fadeIn(pageContent, targetPage);
							SiteUtils.checkCookie("pageName", targetPage);
							//console.log("COOKIE:", SiteUtils.getCookie("pageName"));
						}
					});
					$(".main-nav").children().removeClass();
					$("#"+targetPage).addClass("active");	
				}
			});				
		});		
		$("."+this.defaultTabAndPage).css({"display": "block"});
	}
};

var animateElement = {
	"fadeIn": function(obj, targetPage){
		$.each($(obj).children(), function(idx){
			//console.log("Value from ID:", idx);
			//console.log("Target Page to animate: ",targetPage);
			$(obj).children().css({"opacity": "0", "display": "none" });
		});
		//console.log("Value of targetPage:", targetPage);
		$("."+targetPage).css("display","block");
		$("."+targetPage).animate({"opacity": "1" }, 1000);
	}
};

var SiteUtils = {
	"defaultCookieExp": 1,
	"setCookie": function(cName, cValue, exp){
		if(!exp){
			exp = this.defaultCookieExp;
		}
		//console.log("Working in cookie", exp);
		var dt = new Date();
		dt.setTime(dt.getTime()+(exp*24*60*60*1000));
		var expires = "expires="+dt.toGMTString();	
		document.cookie = cName + "=" + cValue + ";" + expires+";";
		//console.log("Working in cookie", document.cookie, expires);
	},
	"getCookie": function getCookie(cName){
		var name = cName + "=";
		var ca = document.cookie.split(';');
		for(var i=0; i<ca.length; i++){
		 	var c = ca[i].trim();
		 	//console.log("In loop for getCookie:", c);
		  	if (c.indexOf(name)==0) return c.substring(name.length,c.length);
		}
		return null;
	},
	"checkCookie": function(cName, cValue, targetPage){
		var pageName = SiteUtils.getCookie(cName);
		if(pageName !=="" || pageName !== null){
			//console.log("Cookie is here, setting", pageName);
			SiteUtils.setCookie(cName, cValue, targetPage);
			return pageName;
		}else{
			//console.log("Cookie is not here", pageName);
		}
	},
	"validateForm": function(obj){
		var requiredFieldsReady = false;
		$("#error-msg").empty();
		var input;
		$(obj+" input").each(function(idx){
			input = $(this);
			errorField = input;
			console.log("Value from new form:", input.val());
			if(input.val() === ""){
				SiteUtils.setInputError(input, "<span>"+"Please complete the \""+input.data("input")+"\" field</span>");
				requiredFieldsReady = false;
				return false;
			}else{
				//console.log("Ready!");
				//requiredFieldsReady = true;
				if($(this).attr("id")=== "phone"){
					//console.log("Hit phone");
					if(!$.isNumeric($("#phone").val())){
						//console.log("Not a number", $("#phone").val());
						requiredFieldsReady = false;
						SiteUtils.setInputError(input, "<span>"+"The \""+input.data("input")+"\" field must be numeric, no special characters allowed.</span>");
					}else{
						requiredFieldsReady = true;
					}
				}
			}
		});
		if(requiredFieldsReady === true){
			//console.log("All fields ready!");
			var first_name = $("input[name=fname]").val();
			var last_name = $("input[name=lname]").val();
			var user_email = $("input[name=email]").val();
			var user_phone = $("input[name=phone]").val();
			var pref_date = $("input[name=dotw]").val();
			var best_time = $("select#bestTime option:selected").val();
			var user_comment = $("#comments").val();
			
			var post_data = {
				"firstName": first_name, 
				"lastName": last_name, 
				"userEmail": user_email, 
				"userPhone": user_phone, 
				"prefDate": pref_date, 
				"bestTime": best_time, 
				"userComment": user_comment
			};
			$.post("scripts/serverside/speech-contact.php", post_data, function(response){
				if(response.type === "error"){
					//console.log("in error");
					SiteUtils.setInputError(input, "<span>"+response.text+"</span>");
				}else{
					//console.log("in success");
					$("#error-msg").empty();
					$("#error-msg").append("<span>"+response.text+"</span>");
					$("#error-msg").css("display", "block");
				}	
			}, "json");
		}
	},
	"popCalendar": function(obj){
		//$.datepicker.formatDate("DD");
		//var dayNames = $(obj).datepicker("option", "dayNames");
		//$("#"+obj).datepicker("option", "dayNames", ["Sunday", "Monday", "Tuesday",	"Wednesday", "Thursday","Friday","Saturday"]);
		$("#"+obj).datepicker();
		//$("#"+obj).multiDatesPicker();
	},
	"setInputError": function(field, message){
		//console.log("Working in utils");
		$("#error-msg").empty();
		$("#error-msg").append(message);
		$("#error-msg").css("display", "block");
		field.css("background-color", "#e5da7f");
		field.off("focus");
		field.on("focus", function(){
			field.css("background-color", "#ffffff");
			$("#error-msg").empty();
			SiteUtils.popCalendar("dotw");
		});
	},
	"openNewPage": function(obj){		
		$.each($(obj).children(), function(idx){
			if($(obj+"> li:nth-child("+((idx+1))+")").data("href")){
				$(obj+"> li:nth-child("+((idx+1))+")").on("click", function(e){
					window.open($(this).data("href"), "_blank");
				});
			}else{
				return;
			}			
		});
	}
};
