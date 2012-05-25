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
			console.log("number of devices: "+numdevices);*/
			
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
		 					$('#liveview_switches').append('<div id="sw_'+sw_ids[i]+'"'+'> Switch '+sw_ids[i]+'</div>');
		 					//console.log('sw-manu-id '+sw_manus[i].key.substring(12));
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
		 				$('#manus').empty();
		 				for (i = 0; i< sw_ids.length; i++)
		 						{
		 					//add a div element per switch with id as the switch-id
		 					$('#liveview_switches').append('<div id=sw_'+sw_ids[i]+'> Switch '+sw_ids[i]+'</div>');
		 					curr_sw = sw_ids[i];
							//console.log('looking for '+sw_manus[i].key.substring(12));
							manuCount = 0;
							while(manuCount < sw_manus.length){
							id = sw_manus[manuCount].key.substring(12);
									if(id == curr_sw){
										//console.log('true');
										$('#manus').append('<p>Switch '+curr_sw+' manufacturer: '+sw_manus[manuCount].value+'</p>');
										manuCount = manuCount + 1
										}
									else{
										//console.log('false');
										manuCount = manuCount+1
										}
									}
										//console.log('found '+found);
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
													///console.log('Flow_Mods count for '+sw_ids[i]+': '+counts[n].value);
													$('#flowmod_counts').append('<tr><td>'+sw_ids[i]+' Flow_Mods: '+counts[n].value+'</td></tr>');
												}
											}
									}
						}
		 			}
		 			//END ADD SWITCHES TO PAGE
}

function renderCanvasTopo(sw_num,sw_ids,links,dev_num){
	   var numdevices = dev_num;
		var canvas = document.getElementById("of_topo");
			if(canvas.getContext){
				//[parameters for switch canvas elements, x and y or origin or corner, they will change]
				x = 10; x2 = 10;
				y = 10; y2 = 70;
				w = 40; w2 = 40;
				h = 10;  h2 = 50;
				canvas_ctxt = canvas.getContext("2d");
				canvas_ctxt.clearRect(0,0,canvas.width,canvas.height);
				n = 0;
				d = 0;
				swOrder = [];
				while (n < sw_ids.length){
					//console.log(sw_ids[n]);
					swOrder.push(sw_ids[n],x,y);
					//fill the canvas with shapes as switches
					canvas_ctxt.fillStyle= "rgb(200,0,0)";
					canvas_ctxt.fillRect(x,y,w,h);
					/*if (n < sw_ids.length -1){
					cpx1 = x+15;
					cpy1 = y+30;
					canvas_ctxt.beginPath();
					canvas_ctxt.moveTo(x+5,y+10);
					canvas_ctxt.quadraticCurveTo(cpx1,cpy1,x+75,y+10);
					canvas_ctxt.stroke();
					}*/
					x = x + 50;
					n = n + 1;
					}
					matched = 0;
					for (i = 0; i< links.length; i++){
						curr_desig = links[i].key;
						//console.log(curr_desig);
						x = 0;
						while(x < links.length){
							if(curr_desig == 'lnk-'+x+'_srcsw'){
								//console.log('here');
								curr_sw = links[i].value;
								n = 0;
								while( n < swOrder.length){
									if(curr_sw == swOrder[n]){
									//console.log(curr_sw);
									//console.log(swOrder[n]);
									//console.log('match');
									dstkey = 'lnk-'+x+'_dstsw';
									for(n = 0; n < links.length; n++){
										if(links[n].key == dstkey){
											//console.log('found destination switch of current switch');
											//console.log('source switch: '+curr_sw);
											//console.log('destination switch: '+links[n].value);
											src_sw = curr_sw;
											dst_sw = links[n].value;
											for(x = 0; x < swOrder.length; x++){
												//console.log('src sw: '+src_sw+'current_sw_order_sw: '+swOrder[x]);
												//console.log('src sw: '+dst_sw+'current_sw_order_sw: '+swOrder[x]);
												if(src_sw == swOrder[x]){
													//console.log('yes')
														movetox = swOrder[x+1];
														movetoy = swOrder[x+2];
													}
												if(dst_sw == swOrder[x]){
													//console.log('yes')
													curvetox = swOrder[x+1];
													curvetoy = swOrder[x+2];
													}
												}
												cpx1 = movetox+15;
												cpy1 = movetoy+30;
												canvas_ctxt.beginPath();
												//console.log('x: '+movetox+' y: '+movetoy);
												//console.log('tx: '+curvetox+' ty: '+curvetoy);
												canvas_ctxt.moveTo(movetox+20,movetoy+10);
												canvas_ctxt.quadraticCurveTo(cpx1,cpy1,curvetox+20,curvetoy+10);
												canvas_ctxt.stroke();
											}
										else{
											//console.log('no destination switch');
											}
										}
									matched  = matched + 1;
									n = n+1;
										}
									else{
									//console.log('pass');
									n = n+1;
										}
								}
							x = x + 1;
							}
						 else{
						 	x = x+1;
						 	}
						}
					}
					//console.log(matched);
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
