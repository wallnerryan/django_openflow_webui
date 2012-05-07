/************************************************************
Purposes for LiveView into OpenFlow Network @ Marist 
v1.0
By: Ryan Wallner
*************************************************************/
 
$(document).ready(function(){
	renderEnvText();
	}); 
 
 window.setInterval(function(){
 		renderEnvText();
 	}, 8000 );
 
 function renderEnvText(){
	$.ajax({
		url: '/params/',
		dataType: 'json',
		success: function(data){
			var sw_id_dict = [];
			var sw_manu_dict = [];
			var sw_softw_dict = [];
			var sw_hardw_dict = [];
			var topo_links_dict = [];
			for (var key in data) {
				console.log((key.toString()+" -> "+data[key]));
				//Separate out (hardware, id, manufacturer,software etc)
				if (key.toString().substring(2,4) == "_i")
					{
						sw_id_dict.push(data[key]);
					}
				else if (key.toString().substring(2,4) == "_h")
					{
						sw_hardw_dict.push(data[key]);
					}
				else if (key.toString().substring(2,4) == "_m")
					{
						sw_manu_dict.push(data[key]);
					}
				else if (key.toString().substring(2,4) == "_s")
					{
						sw_softw_dict.push(data[key]);
					}
				else if(key.toString().substring(0,3) == "lnk")
					{
						topo_links_dict.push(data[key]);
					}
				else if(key.toString().substring(0,8) == "switches" )
					{
						numswitches = data[key];
					}
				else if(key.toString().substring(0,7) == "devices")
					{
						numdevices = data[key];
					}
				else
					{
						console.log('no matches found, dictionary entry or entries may be wrong');
					}
			} 
			//only for development purposes log stufffs
			console.log(sw_manu_dict.length);
			console.log(sw_hardw_dict.length);
			console.log(sw_softw_dict.length);
			console.log(sw_id_dict.length);
			console.log(topo_links_dict.length);
			console.log("number of switches: "+numswitches);
			console.log("number of devices: "+numdevices);
			
			//send to text implementation
			renderTextBasedInfo(numswitches,numdevices,sw_id_dict,sw_manu_dict,sw_softw_dict,sw_hardw_dict,topo_links_dict);
			//send to canvas implementation
			renderCanvasTopo(numswitches,sw_id_dict,topo_links_dict);
		}
	});
};

function renderTextBasedInfo(sw_num,device_num,sw_ids,sw_manus,sw_softw,sw_hardw,sw_links){
			//Add switch count to view
			//check if it has any count already
			if ( $('#switch_count').children().length <= 0 )
			{
				//if not add it
				$('#switch_count').append('<p>There are currently: '+sw_num+' OpenFlow switches in the network</p>');
			}
			//if it does have a count element ... replace it
			if ( $('#switch_count').children().length > 0 )
			$('#switch_count').children().replaceWith('<p>There are currently: '+sw_num+' OpenFlow switches in the network</p>');
			
			var switches;
			//check for switches &
			//Add specific switch details to view
			if (sw_ids.length > 0)
		 	{
		 		$('#notice').children().empty();
		 		$('#notice').append('<h4>Current OpenFlow switch activity</h4>');
		 		switches = true;
		 	}
		 	else 
			{
				console.log('nada');
				//remove all children and add a notice
				$('#notice').children().empty();
				$('#notice').append('<h4>No current OpenFlow switch activity</h4>');
				switches = false;
			}
			//if there are no children in the switch div, ok, then check if there are switches and fill div if true
		 	if  ($('#liveview_switches').children().length <=0)
		 	{
		 		//if there are current switches
		 		if (switches)
		 		{
		 			for (i = 0; i< sw_ids.length; i++)
		 				{
		 					//add a div element per switch with id as the switch-id
		 					$('#liveview_switches').append('<div id=sw_'+sw_ids[i]+'> Switch '+sw_ids[i]+'</div>');
						}
				}
			}
			//redraw switch stats if already drawn in div
		 	if ($('#liveview_switches').children().length > 0)
		 			{
		 				//remove existing switches but not header is current activity is true
		 				$('#liveview_switches').empty();
		 				for (i = 0; i< sw_ids.length; i++)
		 				{
		 				//refill a div element per switch with id as the switch-id
		 				$('#liveview_switches').append('<div id=sw_'+sw_ids[i]+'> Switch '+sw_ids[i]+'</div>');
		 				}
		 			}
}

function renderCanvasTopo(sw_num,sw_ids,links){
	}
