from django.db import models
#from .forms import CSVUploadForm


class Post(models.Model):

    title = models.CharField('タイトル', max_length=50)
    #csv_file_db = CSVUploadForm.csv_file

    def __str__(self):
        #print(csv_file_db)
        return self.title
