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
 	}, 9000 );
 
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
						sw_id_dict.push({key: key, value: data[key]});
					}
				else if (key.toString().substring(2,4) == "_h")
					{
						sw_hardw_dict.push({key: key, value: data[key]});
					}
				else if (key.toString().substring(2,4) == "_m")
					{
						sw_manu_dict.push({key: key, value: data[key]});
					}
				else if (key.toString().substring(2,4) == "_s")
					{
						sw_softw_dict.push({key: key, value: data[key]});
					}
				else if(key.toString().substring(0,3) == "lnk")
					{
						topo_links_dict.push({key:key,value:data[key]});
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
			if ( $('#switch_count').children().length <= 0 )
			{
				$('#switch_count').append('<p>There are currently: '+sw_num+' OpenFlow switches in the network</p>');
			}
			else if ( $('#switch_count').children().length > 0 )
			$('#switch_count').children().replaceWith('<p>There are currently: '+sw_num+' OpenFlow switches in the network</p>');
			
			//Add specific switch details to view
		 	if  ($('#liveview_switches').children().length <=0)
		 	{
		 		for (i = 0; i<len(sw_ids); i++)
		 			{
		 				$('#liveview_switches').append('<div id=sw_'+sw_ids[][]+'> Switch '+sw_ids[][]+'</div>');
		 			}
		 	else if ($('#liveview_switches').children().length > 0)
		 			{
		 				console.log('already exist');
		 			}
		 	}
	}

function renderCanvasTopo(sw_num,sw_ids,links){
	}
