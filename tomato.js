var timer; // it is for the timer
var current_timer = "pomodoro";

$(document).ready(function(){

	// detect paragraph text change
	//change the time type between pomodoro and break
	//when the pomodoro time reach 0,change to break type, when the break time change to 0,change to pomodoro type
	$(document).on("DOMSubtreeModified", "#wholetime", function () {
	    var time = $("#wholetime").text();
	    if(time === "0" && Number($("#B_set").text())!==0 && current_timer === "pomodoro"){
			clearInterval(timer);
			var seconds = Number($("#B_set").text())*60;
			//change the time color
			$("#wholetime").attr("class","timebreak");

			$("#wholetime").text(secondsToFormal(seconds));
			current_timer = "break";

			//checkbox, if checked,continue the timer,
			if($("#timecontinue").prop("checked") == true){
				timer = setInterval(cutTime,1000);
			}	
			else{
				$('#starticon').attr('class','glyphicon glyphicon-play');
				disableBtn();  //时间没有走起来，就可以+ 或 -
			}

			//notice 
			if($("#notice").prop("checked") == true){
				alert("You've finished!");
			}	
		}
		else if (time === "0" && current_timer === "break")
		{
			clearInterval(timer);
			var seconds = Number($("#P_set").text())*60;

			//change the time color
			$("#wholetime").attr("class","timestart");

			$("#wholetime").text(secondsToFormal(seconds));	
			current_timer = "pomodoro";

			//checkbox
			if($("#timecontinue").prop("checked") == true){
				timer = setInterval(cutTime,1000);

			}
			else{
				$('#starticon').attr('class','glyphicon glyphicon-play');
				disableBtn();
			}

			//notice 
			if($("#notice").prop("checked") == true){
				alert("The break is done!");
			}	
		}
	});

	//start button
	$('#startBtn').click(function(){
		if($('#starticon').attr('class') === 'glyphicon glyphicon-pause'){
			//停止时间
			clearInterval(timer);
			//把对应的标志变成 start
			$('#starticon').attr('class','glyphicon glyphicon-play');
			//时间没有走起来，就可以+ 或 -
			disableBtn();
		}
		else{
			//时间走起来
			timer = setInterval(cutTime,1000);	
			//并且把对应的标志变成 pause
			$("#starticon").attr('class','glyphicon glyphicon-pause');
			//时间走起来，就不能随意+ 或 -
			$("#addP").prop('disabled', true);
			$("#minusP").prop('disabled', true);
			$("#addB").prop('disabled', true);
			$("#minusB").prop('disabled', true);
		}
	});

	//refresh button
	$("#refreshBtn").click(function(){
		var newP = Number($("#P_set").text());

		$("#wholetime").text(secondsToFormal(newP*60)); 
		if(current_timer === "break"){
			$("#wholetime").attr("class","timestart");
			current_timer = "pomodoro";
		}
		clearInterval(timer);//停止计时器
		$('#starticon').attr('class','glyphicon glyphicon-play');//把对应的标志变成 start

		//把progress bar 清空
		$("#progress1").attr('class','original_progress');

		disableBtn()
	});

	//pomodoro length add part，这里的时间是minutes
 	$("#addP").click(function(){
		//先把P_set的值变了
		var newP = Number($("#P_set").text());
		newP = newP + 1;  //得到的是minutes
		$("#P_set").text(newP);

		//把pomodoro的时间以正规的形式显示在 time div中
		if(current_timer === "pomodoro"){
			$("#wholetime").text(secondsToFormal(newP*60)); //把minutes转化成秒，然后用secondsToFormal把值显示成正规
		}  
	});

	//pomodoro length minus part,
	$("#minusP").click(function(){
		var newP = Number($("#P_set").text());
		newP = newP - 1;
		if(newP>=1){
			$("#P_set").text(newP);
			if(current_timer === "pomodoro"){
				$("#wholetime").text(secondsToFormal(newP*60)); 
			}
		}
	});

	//break length add part
	$("#addB").click(function(){
		var newB = Number($("#B_set").text());
		newB = newB + 1;
		$("#B_set").text(newB); 
	});

	//break length minus part
	$("#minusB").click(function(){
		var newB = Number($("#B_set").text());
		newB = newB-1;
		if(newB>=0){
			$("#B_set").text(newB);
		}	
	});

});

//减少时间的函数
function cutTime(){
	var time = $("#wholetime").text();
	//取出来的time 是 string类型，我们先把时间转化成秒
	var seconds = timetoSeconds(time);
	if(seconds > 0){
		seconds = seconds - 1;
		//change the 秒 to 2：00 formal
		$("#wholetime").text(secondsToFormal(seconds));
	}
	//fill the div background color
	progressbar();
}

//把所有的时间转化成秒，这一部分得到的值都是Number的
function timetoSeconds(time){
	var arr = time.split(":");  //["1",25", "00"]  1:25:00    ["25","00"] 25:00   ["59"] 纯粹59秒 
	var hours, minutes, seconds;

	if(time.indexOf(":")>-1){
		if(arr.length === 3){       // ["1",25", "00"]  1:25:00   
			hours = Number(arr[0]);
			minutes = Number(arr[1]);
			seconds = Number(arr[2]);
			seconds = hours * 3600 + minutes * 60 + seconds;
			return seconds;
		}
		else if(arr.length === 2) {   //["25","00"] 25:00
			minutes = Number(arr[0]);
			seconds = Number(arr[1]);
			seconds = minutes * 60 + seconds;
			return seconds;
		}
	}
	//59,纯粹59秒,hours 和 minutes都没有值
	else{
		seconds = Number(time);
		return seconds;
	}
}

//把上述的所有秒的时间，转换成Fromal的形式，这一部分得到的值是string类型
function secondsToFormal(seconds){
	var h = Math.floor(seconds / 3600);         //hours;
	var s = Math.floor((seconds - h*3600)%60);  //second;
	var m = Math.floor((seconds-h*3600-s)/60);         //minutes
 
	//return type h:mm:ss,mm:ss, s
	if(h===0 && m===0){ //纯粹只有秒 s
		return s;
	}

	if(h===0 && m>0 && s<10){  //9:08
		return m + ":0" + s;
	}

	if(h===0 && m>0 && s>=10){  //9:10
		return m + ":" + s;
	}

	if(m>=10 && s<10){   //1:10:08
		return h + ":" + m + ":0" + s;   
	}

	if(m>=10 && s>=10){   //1:10:10
		return  h + ":"+ m +":"+ s;   
	}

	if(m<10 && s<10){   //1:08:08
		return h + ":0" + m + ":0" + s;  
	}
	if(m<10 && s>=10){   //1:08:10
		return h + ":0" + m + ":" + s;  
	}
}

function disableBtn(){
	//时间没有走起来，用户可以+ 或 - 更改时间
	$("#addP").prop('disabled', false);
	$("#minusP").prop('disabled', false);
	$("#addB").prop('disabled', false);
	$("#minusB").prop('disabled', false);
}

//fill the div based on the time progress
function progressbar(){
	var time = $("#wholetime").text();
	var seconds = timetoSeconds(time);

	var startPSeconds = Number($("#P_set").text())*60;
	var startBSeconds = Number($("#B_set").text())*60;

	if(current_timer === "pomodoro"){
		var progress = (1-(seconds / startPSeconds).toFixed(4)); //保留4位
		$('#progress1').attr('class',"P_progress"); //change the background color to pomodoro style
	}
	else if(current_timer === "break"){
		var progress = (1-(seconds / startBSeconds).toFixed(4)); //保留4位
		$('#progress1').attr('class',"B_progress");  //change the background color to break style
	}
	var progressbar1 = {'width': progress*100+"%" };
	$('#progress1').animate(progressbar1,1000);
}




