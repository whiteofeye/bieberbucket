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
    
		// init bucket obj
        var bucket = $("#bucket");
        bucket.width( stage.width() * 0.5 );
        bucket.css({
	        'left' : ( ( stage.width() - bucket.width() ) * 0.5 ) + "px",
	        'top' : ( ( stage.height() - bucket.height() ) * 1.3 ) + "px"
        });
        
        // make star obj
        function star( obj ) {
       		var star = obj;
	        star.width( stage.width() * 0.5726 );
	        star.css({
		       'left' : ( stage.width() * .2 ) + "px",
		       'top' : ( stage.height() * 0.05 ) + "px"
	        });
	        
	        // declare methods
	        this.bounce = bounce;
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
	        	console.log( "getDongPos: star width = " + star.width() + ", getX = " + getX());
		        return {
			        'x' : ( star.width() * 0.5 ) + getX(),
			        'y' : ( star.height() * 0.7 ) + getY()
		        };
	        }
	        
	        // make star bounce
	        function bounce() {
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
	    }
	    
	    // init pop star obj
        var myStar = new star( $("#star") );
        myStar.bounce();
	    
	    // start accelerometer checker
	    var accelCheckInt = 200;
	    var watchID = navigator.accelerometer.watchAcceleration(accelGo, accelOnError, { frequency: accelCheckInt });
		
		// onError: Failed to get the acceleration
		//
		function accelOnError() {
		    alert('Accelerometer Error!');
		    navigator.accelerometer.clearWatch(watchID);
		}
		
		// init accelator bucket control
		function accelGo( a ) {
			var bucketX = parseFloat( bucket.css("left").replace("px","") );
			var bucketY = parseFloat( bucket.css("top").replace("px","") );
			
			var bucketNewX = bucketX + ( a.x * Math.cos( stageAngle ) * 30 );
			var bucketNewY = bucketY + ( a.x * Math.sin( stageAngle ) * 30 );
			
			bucket.css({
				"left" : bucketNewX + "px",
				"top" : bucketNewY + "px",
			});
			//console.log( "accelGo: a.x = " + a.x );
		}
		
		// init drops
		var dropsInt = setInterval( drop, 200 );
		
		var dropCount = 0;
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
				//console.log('remove me');
				$(this).remove();
			});
		}

    }
}