var myapp = angular.module('mainApp',[]);

myapp.controller('ctrlApp',function($scope){
	
	var range = [];
	var arrivalTime  = 0;
	$scope.insertP = function(){
		
		var myburst = $scope.burst;
		if($scope.process=="" || typeof myburst == 'undefined' || myburst == null){ //checking process and burst time input
		
		}else{
			range.push({process:$scope.process,burst:$scope.burst,arrTime:++arrivalTime});
			$scope.myArray = range;
		}
		$scope.process = "";
		$scope.burst = "";
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
		
		if(startFlag){
			alert("Clear!");
		}else{
			
			for(var i=0;i<$scope.myArray.length;i++){  //calculate total burstTime
				totalBurstTime = totalBurstTime + $scope.myArray[i].burst;
			}
			for(var i=0;i<$scope.myArray.length;i++){ // calculate burstTime percentage for every process. BurstTime/TotalBT *100
				percentageBurstTime[i] = $scope.myArray[i].burst / totalBurstTime;
				burstTimeWidth[i] = percentageBurstTime[i]*700 // percentage from total width 700
			}
			
			var num = 0;
			var rangewidth = 0;
			var time = 0;
			ctx.textBaseline = 'top';
			ctx.fillStyle = 'black';
			ctx.font = '20px Arial';
			ctx.textAlign= 'center';
			ctx.fillText("0",100,250);
			
			var loop = setInterval(function(){
				
				ctx.beginPath();
				ctx.fillStyle = 'rgb('+Math.floor(255-20*(num+1))+','+Math.floor(255-40*(num+1))+','+Math.floor(255-10*(num+1))+')';
				ctx.fillRect(startWidth,150,rangewidth,100);
				
				if((startWidth*2+rangewidth)/2 > startWidth){   // text x position cant be smaller than the startWidth
					ctx.fillStyle = 'black';
					ctx.font = "30px Arial";
					ctx.textAlign = 'center';
					if(ctx.measureText($scope.myArray[num].process).width < rangewidth){
						ctx.fillText($scope.myArray[num].process,(startWidth*2+rangewidth)/2,185);
					}
				}   // height = 100, center is 50 and text size 30px , 50-15 = 35. 150 +35=185
				
				if(rangewidth >= burstTimeWidth[num]){  // when the width for each process 達成, go to next process
					num++;
					startWidth = startWidth+rangewidth;
					rangewidth = 0;
					time = time + $scope.myArray[num-1].burst;
					ctx.font = '20px Arial';
					ctx.fillText(time,startWidth,250);
					if(num >= burstTimeWidth.length)
					    clearInterval(loop);
				}
				rangewidth = rangewidth + 5;
				
			},10);
			startFlag=true;
		}
	}
});
var canvas,ctx;
var startWidth = 100;
var startFlag = false;

function init(){
	canvas = document.getElementById('mycanvas');
	ctx = canvas.getContext('2d');
	var width=0;var height=100;
	ctx.clearRect(0,0,900,350);

}
