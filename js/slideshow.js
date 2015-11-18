$(function(){

	$("#images").children(".image").children("img").first().one('load',function(){
		$(this).parent().addClass("show");
		$(this).parent().fadeTo("slow",1);
		//var caption = $(".show").attr("alt").replace("|","<br/>");
		//$("#caption").html(caption);
		slideshow = setInterval(nextimage,2000);
	});
	$("#images").click(nextimage);
	
	$("#images img").hover(function(){
		clearInterval(slideshow);
	},function(){
		clearInterval(slideshow);
		slideshow = setInterval(nextimage,2000);
	});
	
});
$(window).load(function(){
	$("img").trigger("load");
});
function nextimage(){
	var parent = $("#images");
	parent.children(".image").css("opacity",0);
	var currentslide = parent.children(".show");
	var nextslide = parent.children(".show").next();
	if (nextslide.length == 0){
		var nextslide = parent.children(".image").first();
	}
	currentslide.removeClass("show").addClass("hidden");
	nextslide.removeClass("hidden").addClass("show");
	$(".show").css("opacity",1);
	//var caption = $(".show").attr("alt").replace("|","<br/>");
	//$("#caption").html(caption);	
}