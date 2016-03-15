var myApp = angular.module('myApp',[]);

myApp.controller('ctrlApp',function($scope){

	var range = [];
	var startFlag = false;
	$scope.insertP = function(){
		
		var myburst = $scope.burst;
		if($scope.process=="" || typeof myburst == 'undefined' || myburst == null){ //checking process and burst time input
		
		}else{
			range.push({process:$scope.process,burst:$scope.burst,arrTime:$scope.arrival});
			$scope.myArray = range;
		}
		$scope.process = "";
		$scope.burst = "";
		$scope.arrival = "";
	};
	
	$scope.clearP = function(){
		range = [];
		$scope.myArray = range;
		ctx.clearRect(0,0,900,350);
		startWidth=100;
		startFlag = false;
	}
	
	$scope.startP = function(){
		var totalBurstTime = 0;
		var percentageBurstTime = [];
		var burstTimeWidth= [];
		var zeroFlag = false;
		
		if(startFlag){
			alert("Clear!");
		}else{
			startFlag = true;
			var minValue = 0;
			for(var i=0;i<$scope.myArray.length;i++){  //calculate total burstTime
				totalBurstTime = totalBurstTime + $scope.myArray[i].burst;
				if(minValue > $scope.myArray[i].arrTime)
					minValue = $scope.myArray[i].arrTime;
				//if($scope.myArray[i].arrTime == 0)
				 //   zeroFlag = true;
			}
			for(var i=0;i<$scope.myArray.length;i++){ // calculate burstTime percentage for every process. BurstTime/TotalBT *100
				percentageBurstTime[i] = $scope.myArray[i].burst / totalBurstTime;
				burstTimeWidth[i] = percentageBurstTime[i]*700 // percentage from total width 700
			}
			
			if(zeroFlag){
				alert("Arrival Time start from 0");
				$scope.clearP();
				return;
			}
			
			ctx.textBaseline = "top";
			ctx.fillStyle = 'black';
			ctx.font = '20px Arial';
			ctx.textAlign= 'center';
			ctx.fillText(minValue,100,250);
			
			var rightNumber = sortArrivalTime($scope.myArray,minValue);
			minValue = minValue + $scope.myArray[rightNumber].burst;
			var num = 0;
			var startWidth = 100;
			var rangewidth = 0;
			
			var loop = setInterval(function(){
				
				ctx.beginPath();
				ctx.fillStyle = 'rgb('+Math.floor(255-20*(num+1))+','+Math.floor(255-40*(num+1))+','+Math.floor(255-10*(num+1))+')';
				ctx.fillRect(startWidth,150,rangewidth,100);
				
				if((startWidth*2+rangewidth)/2 > startWidth){   // text x position cant be smaller than the startWidth
					ctx.fillStyle = 'black';
					ctx.font = "30px Arial";
					ctx.textAlign = 'center';
					if(ctx.measureText($scope.myArray[rightNumber].process).width < rangewidth){
						ctx.fillText($scope.myArray[rightNumber].process,(startWidth*2+rangewidth)/2,185);
					}
				}   // height = 100, center is 50 and text size 30px , 50-15 = 35. 150 +35=185
				
				if(rangewidth >= burstTimeWidth[rightNumber]){
					$scope.myArray.splice(rightNumber,1);		// remove used elements
					burstTimeWidth.splice(rightNumber,1);		// also remove the burstTime
					startWidth = startWidth+rangewidth;			// x start position for every process shd be sum when every process is done
					ctx.font = '20px Arial';
					ctx.fillText(minValue,startWidth,250);
					if($scope.myArray.length > 0){
						rightNumber = sortArrivalTime($scope.myArray,minValue);
						minValue = minValue + $scope.myArray[rightNumber].burst;
					}
					rangewidth=0;
					num++;
					console.log(burstTimeWidth.length);
					if(burstTimeWidth.length < 1){
						clearInterval(loop);
					}
				}
				rangewidth = rangewidth + 5;
			},10);
			
		}
	}
	
});

var canvas,ctx;

function init(){
	canvas = document.getElementById('mycanvas');
	ctx = canvas.getContext('2d');
	var width=0;var height=100;
	ctx.clearRect(0,0,900,350);

}

function sortArrivalTime(myArray,minValue){  // minValue = CurrentTime, this function is to find the index of shortest time
	var number = 0;
	var temp = 9999;
	for(var i=0;i<myArray.length;i++){
		if(minValue > myArray[i].arrTime){		// look for who had arrived when the current process is running
	
			if(temp > myArray[i].burst){	// find the shortest job
				temp = myArray[i].burst;
				number = i;
			}
		}
	}
	return number;
}