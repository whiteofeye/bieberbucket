var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() { app.bieberBucket() },
    
    bieberBucket: function() {
    	// needed for webkit browsers to wait until images have loaded
    	if (document.readyState != "complete") {
			setTimeout( arguments.callee, 100 );
			return;
		}
		
		// init vars
		var level = 0;
		var score = 0;
		var time = 10;
		var timerInt;
		var levelObj = $('#level');
		var scoreObj = $('#score');
		var timeObj = $('#time');
    
    	// init stage
    	var stage = $("#stage");
    	var bgImg = $("#bgImg");
    	//console.log("bgImg height = " + bgImg.height());
    	stage.height( stage.width() * bgImg.height() / bgImg.width() );
    	
    	// center stage vertically
    	stage.css({
	    	'margin-top' : ( ($(document).height() - stage.height()) * 0.5 ) + "px"
    	});
    	
		var stageAngle = 0.2; // angle of path bucket runs along
		
        // bucket obj
        function bucket( obj ) {
	    	var bucket = obj;
	    	var myWidth = stage.width() * 0.5;
	    	var myHeight;
	    	
	    	this.getX = getX;
	    	this.getY = getY;
	    	this.getHitCoords = getHitCoords;
	    	this.reset = reset;
	    	this.updatePosFromAccel = updatePosFromAccel;
	    	
	    	// get x position
	    	function getX() {
		    	return parseFloat( bucket.css("left").replace("px","") );
	    	}
	    	// get y position
	    	function getY() {
		    	return parseFloat( bucket.css("top").replace("px","") );
	    	}
	    	// get position relative to stage of where current bucket hit area is
	    	function getHitCoords() {
		    	return {
			    	"top" : getY() + (myHeight * 0.6),
			    	"right" : getX() + (myWidth * 0.9),
			    	"bottom" : getY() + (myHeight * 0.9),
			    	"left" : getX() + (myWidth * 0.1),
		    	}
	    	}
	    	// reset bucket to original position
	    	function reset() {
			    bucket.width( myWidth );
		        bucket.css({
			        'left' : ( ( stage.width() - bucket.width() ) * 0.5 ) + "px",
			        'top' : ( ( stage.height() - bucket.height() ) * 1.3 ) + "px"
		        });
		        if (!myHeight) {
			    	myHeight = bucket.height();  
		        }
	    	}
	    	// set new bucket position from accelerometer reading
			function updatePosFromAccel( a ) {
				var bucketNewX = getX() + ( a.x * Math.cos( stageAngle ) * 30 );
				var bucketNewY = getY() + ( a.x * Math.sin( stageAngle ) * 30 );
				
				bucket.css({
					"left" : bucketNewX + "px",
					"top" : bucketNewY + "px",
				});
				//console.log( "updatePosFromAccel: a.x = " + a.x );
			}
        }
    
		// init bucket obj
        var myBucket = new bucket( $("#bucket") );
        myBucket.reset();
        
        // make star obj
        function star( obj ) {
        	var star = obj;
       		var stopBouncingNow = false;
       		
	        star.width( stage.width() * 0.5726 );
	        star.css({
		       'left' : ( stage.width() * .2 ) + "px",
		       'top' : ( stage.height() * 0.05 ) + "px"
	        });
	        
	        // declare methods
	        this.bounce = bounce;
	        this.stop = stop;
	        this.getX = getX;
	        this.getY = getY;
	        this.getDongPos = getDongPos;
	        
	        // return coordinates
	        function getX() {
	        	// account for jump effect
	        	if ( star.parent(".ui-effects-wrapper").length > 0 ) {
		        	var targetObj = star.parent(".ui-effects-wrapper");
	        	} else {
		        	var targetObj = star;
	        	}
		        return parseFloat( targetObj.css("left").replace("px","") );
	        }
	        function getY() {
		        return parseFloat( star.css("top").replace("px","") );
	        }
	        
	        // return starting point (on stage) of pee origin
	        function getDongPos() {
	        	//console.log( "getDongPos: star height = " + star.height() + ", getY = " + getY());
	        	//console.log( "getDongPos: star width = " + star.width() + ", getX = " + getX());
		        return {
			        'x' : ( star.width() * 0.5 ) + getX(),
			        'y' : ( star.height() * 0.7 ) + getY()
		        };
	        }
	        
	        // make star bounce
	        function bounce() {
	        	if (stopBouncingNow) {
		        	stopBouncingNow = false;
		        	return;
	        	}
				var a = ( Math.random() - 0.5 ) * 40;
	        
	        	var starX = parseFloat( star.css("left").replace("px","") );
				var starY = parseFloat( star.css("top").replace("px","") );
				
				var starNewX = starX + ( a * Math.cos( stageAngle ) );
				var starNewY = starY + ( a * Math.sin( stageAngle ) );
				
				star
				.effect(
					"bounce",
					{
						"distance" : 20,
						"times" : 1
					}
				)
				.animate({
					'left' : starNewX + "px",
					'top' : starNewY + "px"
				}, 500, "swing", arguments.callee)
				;
	        }
	        
	        function stop() {
		        stopBouncingNow = true;
	        }
	    }
	    
	    // init pop star obj
        var myStar = new star( $("#star") );
        myStar.bounce();
	    
	    // start accelerometer checker
	    var accelCheckInt = 200;
	    var watchID = navigator.accelerometer.watchAcceleration(accelGo, accelOnError, { frequency: accelCheckInt });
		
		// onError: Failed to get the acceleration
		function accelOnError() {
		    alert('Accelerometer Error!');
		    navigator.accelerometer.clearWatch(watchID);
		}
		
		// 
		function accelGo( a ) {
			myBucket.updatePosFromAccel( a );
		}
		
		// init drops
		var dropCount = 0;
		var dropsInt = setInterval( drop, 200 );
		function drop() {
			var dongPos = myStar.getDongPos();
			
			// make drop
			var dropObj = $("<div class='drop' id='drop" + dropCount + "' />");
			dropObj.css({
				'left' : dongPos.x + "px",
				'top' : dongPos.y + "px",
				'height' : ( stage.width() * 0.01 ) + "px",
				'width' : ( stage.width() * 0.01 ) + "px"
			});
			$("#stage").append(dropObj);
			
			dropCount++;
			
			dropObj.animate({
				'top' : stage.height() + "px"
			}, 1000,'easeInCubic', function() {
				updateScore(-10);
				$(this).remove();
			});
		}
		/* dropsArr = []... */
		
		// score and remove drops in bucket hit zone
		function scoreDropsInBucket() {
			console.log( "scoreDropsInBucket: bucket hit zone = ");
			console.dir( myBucket.getHitCoords() );
		}
		
		// update score variable and display
		function updateScore(n) {
			score += n;
			scoreObj.text( score );
		}
		
		// init timer - timer checks for object interactions
		initTimer();
		
		function initTimer() {
			time = 5;
			level++;
			timerInt = setInterval( tick, 1000 );
			timeObj.text(time);
		}
		function tick() {
			time--;
			scoreDropsInBucket();
			if (time <= 0 ) {
				levelEnd();
			} else if (time <= 5) {
				timeObj.addClass('alert');
			} else {
				timeObj.removeClass('alert');
			}
			timeObj.text(time);
		}
		function levelEnd() {
			myStar.stop();
			clearInterval(timerInt);
		}

    }
}