import csv
import io
from django import forms
from django.core.validators import FileExtensionValidator
from .models import Post
import codecs



class CSVUploadForm(forms.Form):
    file = forms.FileField(
        label='CSVファイル',
        help_text='※拡張子csvのファイルをアップロードしてください。',
        validators=[FileExtensionValidator(allowed_extensions=['csv'])]
    )

    def clean_file(self):
        file = self.cleaned_data['file']

        # csv.readerに渡すため、TextIOWrapperでテキストモードなファイルに変換
        csv_file = io.TextIOWrapper(file, encoding='utf-8')
        reader = csv.reader(csv_file)
        print("reader",reader)
        
        self.csv_file = reader
        
        for row in reader:
            print(type(row))
            print("reader row", row)
        # 各行から作った保存前のモデルインスタンスを保管するリスト
        self._instances = []
        try:
            for row in reader:
                post = Post(pk=row[0], title=row[1])
                self._instances.append(post)
        except UnicodeDecodeError:
            raise forms.ValidationError('ファイルのエンコーディングや、正しいCSVファイルか確認ください。')
        print("file:",type(file))
        #csvfile = csv.DictReader(codecs.iterdecode(file, 'utf-8'))
        print("file",file)
        print("_instances",self._instances)
        #print("csvfile",csvfile)
        print("reader reader")
        with open("temp.csv", mode="w", encoding="utf-8") as f:
            print("reader in open", reader)
            #writer = csv.writer(f, lineterminator="\n")
            #writer.writelines(row)
            
            f.writelines(row)
            #f.writelines(reader)
            #for row in reader:
                #print("reader_1",row)
                #print("test")
                #writer = csv.writer(f, lineterminator="\n") # writerオブジェクトの作成 改行記号で行を区切る
                #print("row",row[0])
                #writer.writerows(row) # csvファイルに書き込み
            print("end of reader")

        return file

    def save(self):
        Post.objects.bulk_create(self._instances, ignore_conflicts=True)
        Post.objects.bulk_update(self._instances, fields=['title'])
