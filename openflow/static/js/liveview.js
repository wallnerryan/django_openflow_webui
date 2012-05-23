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
			var sw_id = [];
			var sw_manu = [];
			var sw_softw = [];
			var sw_hardw = [];
			var topo_links = [];
			var counters = [];
			for (var key in data) {
				//console.log((key.toString()+" -> "+data[key]));
				//Separate out (hardware, id, manufacturer,software etc)
				if (key.toString().substring(2,4) == "_i")
					{
						sw_id.push(data[key]);
					}
				else if (key.toString().substring(2,4) == "_h")
					{
						sw_hardw.push({key: key.toString(), value: data[key]});
					}
				else if (key.toString().substring(2,4) == "_m")
					{
						sw_manu.push({key: key.toString(), value: data[key]});
					}
				else if (key.toString().substring(2,4) == "_s")
					{
						sw_softw.push({key: key.toString(), value: data[key]});
					}
				else if(key.toString().substring(0,3) == "lnk")
					{
						topo_links.push({key: key.toString(), value: data[key]});
					}
				else if(key.toString().substring(0,8) == "switches" )
					{
						numswitches = data[key];
					}
				else if(key.toString().substring(0,6) == "pktins" )
					{
						counters.push({key: key.toString(), value: data[key]});
					}
					else if(key.toString().substring(0,8) == "flowmods" )
					{
						counters.push({key: key.toString(), value: data[key]});
					}
					else if(key.toString().substring(0,7) == "pktouts" )
					{
						counters.push({key: key.toString(), value: data[key]});
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
			/*only for development purposes log stufffs
			console.log(sw_manu.length);
			console.log(sw_hardw.length);
			console.log(sw_softw.length);
			console.log(sw_id.length);
			console.log(topo_links.length);
			console.log(counters[1].key+'  --> '+counters[1].value);
			console.log("number of switches: "+numswitches);
			console.log("number of devices: "+numdevices);
			*/
			
			//send to text implementation
			renderTextBasedInfo(numswitches,numdevices,sw_id,sw_manu,sw_softw,sw_hardw,topo_links,counters);
			//send to canvas implementation
			renderCanvasTopo(numswitches,sw_id,topo_links,numdevices);
		}
	});
};

function renderTextBasedInfo(sw_num,device_num,sw_ids,sw_manus,sw_softw,sw_hardw,sw_links,counts){
			//Add switch count to view
			//check if it has any count already
			if ( $('#switch_count').children().length <= 0 )
			{
				//if not add it
				$('#switch_count').append('<p>There are currently: '+sw_num+' OpenFlow switches in the network</p>');
				$('#device_count').append('<p>There are currently: '+device_num+' host devices seen on the network</p>');
			}
			//if it does have a count element ... replace it
			if ( $('#switch_count').children().length > 0 )
			$('#switch_count').children().replaceWith('<p>There are currently: '+sw_num+' OpenFlow switches in the network</p>');
			$('#device_count').children().replaceWith('<p>There are currently: '+device_num+' host devices seen on the network</p>');
			
			
			///ADD SWITCHES TO PAGE
			var switches;
			//check for switches &
			//Add specific switch details to view
			if (sw_ids.length > 0)
		 	{
		 		$('#notice').children().remove();
		 		$('#notice').append('<h4>Current OpenFlow switch activity</h4>');
		 		switches = true;
		 	}
		 	else 
			{
				console.log('nada');
				//remove all children and add a notice
				$('#notice').children().remove();
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
		 							for ( n = 0; n < counts.length; n++)
									{
										ind_of_undscr = counts[n].key.indexOf('_');
										//console.log(counts[n].key.toString().substring(ind_of_undscr));
										if(sw_ids[i] == counts[n].key.toString().substring(ind_of_undscr+1))
											{
												//console.log(counts[n].key+' --> '+ counts[n].value);
												//console.log(counts[n].key.toString().substring(0,ind_of_undscr))
												if( counts[n].key.toString().substring(0,ind_of_undscr) == 'pktins')
												{
													//console.log('Packet_In count for '+sw_ids[i]+': '+counts[n].value);
													$('#pktins_counts').append('<tr><td>'+sw_ids[i]+' Packet_Ins: '+counts[n].value+'</td></tr>');
												}
												if( counts[n].key.toString().substring(0,ind_of_undscr) == 'pktouts')
												{
													//console.log('Packet_Out count for '+sw_ids[i]+': '+counts[n].value);
													$('#pktouts_counts').append('<tr><td>'+sw_ids[i]+' Packet_Outs: '+counts[n].value+'</td></tr>');
												}
												if( counts[n].key.toString().substring(0,ind_of_undscr) == 'flowmods')
												{
													//console.log('Flow_Mods count for '+sw_ids[i]+': '+counts[n].value);
													$('#flowmod_counts').append('<tr><td>'+sw_ids[i]+' Flow_Mods: '+counts[n].value+'</td></tr>');
												}
											}
									}
						}
				}
			}
			//EMPTY STATS AND REDRAW (ALMOST SAME FUNCTION BUT REMOVE FROM DOM!)
			//redraw switch stats if already drawn in div
		 	if ($('#liveview_switches').children().length > 0)
		 			{
		 				//remove existing switches but not header is current activity is true
		 				$('#liveview_switches').empty();
		 				$('#pktins_counts').empty();
		 				$('#pktouts_counts').empty();
		 				$('#flowmod_counts').empty();
		 				for (i = 0; i< sw_ids.length; i++)
		 						{
		 					//add a div element per switch with id as the switch-id
		 					$('#liveview_switches').append('<div id=sw_'+sw_ids[i]+'> Switch '+sw_ids[i]+'</div>');
		 							for ( n = 0; n < counts.length; n++)
									{
										ind_of_undscr = counts[n].key.indexOf('_');
										//console.log(counts[n].key.toString().substring(ind_of_undscr));
										if(sw_ids[i] == counts[n].key.toString().substring(ind_of_undscr+1))
											{
												//console.log(counts[n].key+' --> '+ counts[n].value);
												//console.log(counts[n].key.toString().substring(0,ind_of_undscr))
												if( counts[n].key.toString().substring(0,ind_of_undscr) == 'pktins')
												{
													console.log('Packet_In count for '+sw_ids[i]+': '+counts[n].value);
													$('#pktins_counts').append('<tr><td>'+sw_ids[i]+' Packet_Ins: '+counts[n].value+'</td></tr>');
												}
												if( counts[n].key.toString().substring(0,ind_of_undscr) == 'pktouts')
												{
													console.log('Packet_Out count for '+sw_ids[i]+': '+counts[n].value);
													$('#pktouts_counts').append('<tr><td>'+sw_ids[i]+' Packet_Outs: '+counts[n].value+'</td></tr>');
												}
												if( counts[n].key.toString().substring(0,ind_of_undscr) == 'flowmods')
												{
													console.log('Flow_Mods count for '+sw_ids[i]+': '+counts[n].value);
													$('#flowmod_counts').append('<tr><td>'+sw_ids[i]+' Flow_Mods: '+counts[n].value+'</td></tr>');
												}
											}
									}
						}
		 			}
		 			//END ADD SWITCHES TO PAGE
}

function renderCanvasTopo(sw_num,sw_ids,links,dev_num){
	   var numswitches = sw_num;
	   var numdevices = dev_num;
		var canvas = document.getElementById("of_topo");
			if(canvas.getContext){
				//[parameters for switch canvas elements, x and y or origin or corner, they will change]
				x = 10; x2 = 10;
				y = 10; y2 = 40;
				w = 40; w2 = 40;
				h = 10;  h2 = 50;
				canvas_ctxt = canvas.getContext("2d");
				canvas_ctxt.clearRect(0,0,canvas.width,canvas.height);
				n = 0;
				d = 0;
				while (n < numswitches){
					//fill the canvas with shapes as switches
					canvas_ctxt.fillStyle= "rgb(200,0,0)";
					canvas_ctxt.fillRect(x,y,w,h);
					x = x + 50;
					n = n + 1;
					}
					console.log(numdevices);
				while(d < numdevices){
					canvas_ctxt.fillStyle= "rgb(0,0,200)";
					canvas_ctxt.fillRect(x2,y2,w2,h2);
					x2 = x2 + 50;
					d = d + 1;
					//console.log('here');
					}
				}
				else
				{
				console.log('something went wrong');
				}
	}
