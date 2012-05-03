/************************************************************
Purposes for LiveView into OpenFlow Network @ Marist 
v1.0
By: Ryan Wallner
*************************************************************/
 
 /**
**/
 $(document).ready(function(){
	$.ajax({
		url: '/params/',
		dataType: 'json',
		success: function(data){
			var sw_id_dict = [];
			var sw_manu_dict = [];
			var sw_softw_dict = [];
			var sw_hardw_dict = [];
			for (var key in data) {
				console.log((key.toString()+" -> "+data[key]));
				//Separate out (hardware, id, manufacturer,software etc)
				if (key.toString().substring(2,4) == "_i")
					{
						sw_id_dict.push({key: key, value: data[key]})
					}
				else if (key.toString().substring(2,4) == "_h")
					{
						sw_hardw_dict.push({key: key, value: data[key]})
					}
				else if (key.toString().substring(2,4) == "_m")
					{
						sw_manu_dict.push({key: key, value: data[key]})
					}
				else if (key.toString().substring(2,4) == "_s")
					{
						sw_softw_dict.push({key: key, value: data[key]})
					}
				else
					{
						//will be thrown on the switch count param (does not have a "_[a-z]" in it
						console.log('no matches found, dictionariess entry or entries may be wrong')
					}
			} 
			console.log(sw_manu_dict.length)
			console.log(sw_hardw_dict.length)
			console.log(sw_softw_dict.length)
			console.log(sw_id_dict.length)
			
		}
	});
});

/* Canvas manipulation to provide topology */
function renderTopology(){
}
