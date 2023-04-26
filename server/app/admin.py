from django.contrib import admin
from . models import Applications

# Register your models here.

class ApplicationsAdmin(admin.ModelAdmin):
    list_display = ('app_id', 'app_name', 'app_secret', 'redirection_url')

admin.site.register(Applications, ApplicationsAdmin)
