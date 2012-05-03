#*********************************************
#Django Application for OpenFlow @ Marist.edu
#Author: Ryan Wallner 
#Rights Reserved By: Marist College, New York
#
#*********************************************

from django.shortcuts import render_to_response
from django.http import HttpResponse
import datetime
import urllib2
import simplejson
import json
from django.core import serializers
from django.http import HttpResponse



#Welcome
def welcome(request):
        time = datetime.datetime.now()
        return render_to_response('welcome.html', {'current_date' : time})
        
#Forums
def forums(request):
		return render_to_response('forums.html',{})

#Documents
def docs(request):
		#create model to hold docs? or serve as static/media/{files}.
		return render_to_response('docs.html',{})
		
#LiveView
def liveview(request):
	return render_to_response('liveview.html', {})

#Get Parameters 
def getOpenFlowParams(request):
			#
			#FUTURE : Have an aggregated list of controllers then iterate through
			#them do find switches connected to different controllers. Along with
			#the separate features like the TCAM flow tables and topology links
			#
			#***************************
		 	switchdata_tables = urllib2.urlopen('http://10.10.2.101:8080/wm/core/switch/all/table/json')
			switchdata_desc = urllib2.urlopen('http://10.10.2.101:8080/wm/core/switch/all/desc/json')
			switchdata_links = urllib2.urlopen('http://10.10.2.101:8080/wm/topology/links/json')
			switchdata_switches = urllib2.urlopen('http://10.10.2.101:8080/wm/core/controller/switches/json')
			#_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+
			#switchdata_pkthist = urllib2.urlopen('http://10.10.2.101:8080/wm/pktinhistory/history/json')
			#_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+
			switchdata_devices = urllib2.urlopen('http://10.10.2.101:8080/wm/devicemanager/device/all/json')
			
			#GET JSON of Switches in Network
			data_switches = json.loads(switchdata_switches.read())
			jsondata_switches = simplejson.dumps(data_switches)
			sw_data_switches = simplejson.loads(jsondata_switches) 
			
			#Get number of switches on the network and pass number to "sw_num"
			switchlist = []
		 	#Initialize django dicts
			switchnum_dict = {}
			switchids_dict = {}
			
			sw_num = 0
			while sw_num < len(sw_data_switches):
				switchid = sw_data_switches[sw_num]['dpid']
				switchlist.append(switchid)
				
				#Update dictionary with the switch-# : dpid tuple
				switchids_dict.update({"sw_id-"+str(sw_num) : switchid})
				
				sw_num = sw_num + 1
				
			#update dict after while loop finishes for final number of switches
			switchnum_dict.update({'switches': sw_num})
			
			
			#GET JSON of Description Data of Switches
			data_desc = json.loads(switchdata_desc.read())
			jsondata_desc = simplejson.dumps(data_desc)
			sw_data_desc = simplejson.loads(jsondata_desc)
			
			#Initialize dictionaries for description data
			switchdesc_dict = {}			
			
			#Get the manufacturerDescription & hardwareDescription & softwareDescription
			#by the dpid of the switch
			for switch_dpid in switchlist:
				sw_manu = sw_data_desc[switch_dpid][0]['manufacturerDescription']
				sw_softw = sw_data_desc[switch_dpid][0]['softwareDescription']
				sw_hardw = sw_data_desc[switch_dpid][0]['hardwareDescription']
				
				switchdesc_dict.update({"sw_manu_for_"+str(switch_dpid) : sw_manu, 
												"sw_softw_for_"+str(switch_dpid) : sw_softw,
												"sw_hardw_for_"+str(switch_dpid) : sw_hardw}) 
			
			
			#GET JSON of Links
			data_links = json.loads(switchdata_links.read())
			jsondata_links = simplejson.dumps(data_links)
			sw_data_links = simplejson.loads(jsondata_links)
			
			#GET JSON of Tables
			data_tables = json.loads(switchdata_tables.read())
			jsondata_tables = simplejson.dumps(data_tables)
			sw_data_tables = simplejson.loads(jsondata_tables)
			
			#GET JSON of Connected Devices
			
			
			
			#_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+
			#GET JSON of Packet In History
			#data_pkthist = json.loads(switchdata_pkthist.read())
			#jsondata_pkthist = simplejson.dumps(data_pkthist)
			#sw_data_pkthist = simplejson.loads(jsondata_pkthist)
			
			#Initialize params			
			#pktin_list = []
			#pktin_dict = {}
			
			#Get the number of PACKET_IN message sent to the controller(for stat display) from the switch
			#and tuple the switches with the PACKET_IN Messages
			#pkt_in-<dpid> -> "type" (this will be used to show per switch how many PACKET_IN's
			#_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+

			
			#Combine all dictionaries of info together for use
			combined_responsevars_dict = dict(switchnum_dict.items() +
														 switchids_dict.items() + 
														 switchdesc_dict.items())

			
			return HttpResponse(simplejson.dumps(combined_responsevars_dict), mimetype='application/javascript')
			#Keeping Below as Example
			#return render_to_response('liveview.html', {'vars' : simplejson.dumps(combined_responsevars_dict)})
				
