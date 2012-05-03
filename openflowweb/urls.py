from django.conf.urls import patterns, include, url
from openflow.views import welcome
from openflow.views import liveview
from openflow.views import forums
from openflow.views import docs
from openflow.views import getOpenFlowParams


# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'openflowweb.views.home', name='home'),
    # url(r'^openflowweb/', include('openflowweb.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    # url(r'^admin/', include(admin.site.urls)),

#OPENFLOWWEB URLS START HERE, ABOVE IS DEFAULT VALUES

#Site Root
	(r'^$', welcome),

#For the Welcome Page (*Redundant from above site root b/c site root not 
#implemented gives good debug when debug = true)
	(r'^welcome/$', welcome),

#For the liveview page
	(r'^liveview/$', liveview),
	
#Forums
	(r"^forums/$", forums),
	
#Docs
	(r'^docs/$', docs),
	
#JSON DICT of PARAMS
	(r'^params/$', getOpenFlowParams),
)
