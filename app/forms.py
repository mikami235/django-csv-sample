import csv
import io
from django import forms
from django.core.validators import FileExtensionValidator
from .models import Post
import codecs
import numpy as np
import pandas as pd

class CSVUploadForm(forms.Form):
    file = forms.FileField(
        label='CSVファイル',
        help_text='※拡張子csvのファイルをアップロードしてください。',
        validators=[FileExtensionValidator(allowed_extensions=['csv'])]
    )

    def clean_file(self):
        file = self.cleaned_data['file']

        print("file:",file)

        # csv.readerに渡すため、TextIOWrapperでテキストモードなファイルに変換
        csv_file = io.TextIOWrapper(file, encoding='utf-8')
        print("csv_file",csv_file)
        reader = csv.reader(csv_file)
        print("reader",reader)
        
        self.csv_file = reader
        
        for row in reader:
            #print("reader row", row)
            #print("line_num", reader.line_num)
            if reader.line_num == 1:
                with open("static/media/temp.csv", mode="w", encoding="utf-8") as f:
                    print("row in x before", row)
                    row = ",".join(row) 
                    row = row + "\n" 
                    print("row in x after", row)
                    f.write(row)
                print("option=x")

            else:
                with open("static/media/temp.csv", mode="a", encoding="utf-8") as f:
                    #print("row in a before", row)
                    #print(type(row))
                    row = ",".join(row) 
                    row = row + "\n" 
                    #print("row in a after", row)
                    #print(type(row))
                    
                    f.write(row)
                #print("option=a")


        # 各行から作った保存前のモデルインスタンスを保管するリスト

        self._instances = []
        
        try:
            for row in reader:
                post = Post(pk=row[0], title=row[1])
                self._instances.append(post)

        except UnicodeDecodeError:
            raise forms.ValidationError('ファイルのエンコーディングや、正しいCSVファイルか確認ください。')

        return file

    def save(self):
        Post.objects.bulk_create(self._instances, ignore_conflicts=True)
        Post.objects.bulk_update(self._instances, fields=['title'])
        print("save content in save func", Post)
