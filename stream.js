function watch(form){
	var num = form.number.value;  // Stream to join
	var phone = window.phone = PHONE({
	    number        : "Viewer" + Math.floor(Math.random()*100), // Random name
	    publish_key   : 'pub-c-1eb0a2b3-d993-4eca-bf25-88d1661fce12', // Your Pub Key
	    subscribe_key : 'sub-c-7e88837c-89a3-11e8-8b6c-9a2ed1c29e11', // Your Sub Key
	    oneway        : true	// One way streaming enabled
	});
	var ctrl = window.ctrl = CONTROLLER(phone, true);
	ctrl.ready(function(){
		ctrl.isStreaming(num, function(isOn){
			if (isOn) ctrl.joinStream(num);
			else alert("User is not streaming!");
		});
	});
	ctrl.receive(function(session){
	    session.connected(function(session){ video_out.appendChild(session.video); });
	});
	ctrl.streamPresence(function(m){ here_now.innerHTML=m.occupancy; });
	return false;  // Prevent form from submitting
}

(function(){

    var urlargs     = urlparams();
    var video_out   = document.getElementById("vid-box");
    var stream_info = document.getElementById("stream-info");
    var here_now    = document.getElementById("here-now"); 
    
    // Handle error if stream is not in urlargs.
    if (!('stream' in urlargs)) {
        handleNoStream();
        return;
    }
    
    // Get URL params
    function urlparams() {
        var params = {};
        if (location.href.indexOf('?') < 0) return params;
        PUBNUB.each(
            location.href.split('?')[1].split('&'),
            function(data) { var d = data.split('='); params[d[0]] = d[1]; }
        );
        return params;
    }
    
    function handleNoStream(){
        video_out.innerHTML="<h2>That stream no longer exists!</h2>";
        stream_info.hidden=true;
    }
    
    }())

    var phone = window.phone = PHONE({
        number        : "EmbedViewer" + Math.floor(Math.random()*100), // random viewer name
        publish_key   : 'your_pub_key', // Your Pub Key
        subscribe_key : 'your_sub_key', // Your Sub Key
        oneway        : true,
    });
    var ctrl = window.ctrl = CONTROLLER(phone);
    ctrl.ready(function(){
        ctrl.isStreaming(stream, function(isOn){
            if (isOn) ctrl.joinStream(stream);
            else handleNoStream();
        }); 
    });
    ctrl.receive(function(session){
        session.connected(function(session){ stream_info.hidden=false; video_out.appendChild(session.video); });
        session.ended(function(session){ handleNoStream(); });
    });
    ctrl.streamPresence(function(m){
        here_now.innerHTML = m.occupancy;
    });
    ctrl.unable(function(){ handleNoStream(); });