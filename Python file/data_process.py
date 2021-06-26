import os
import json

def countline(file):
    with open(file, 'rt') as f:
        read = f.readlines()
    count = 0
    for line in read:
        if '>' in line:
            count+=1
    return count

def listdirs(rootdir):
    direct_list = []
    for file in os.listdir(rootdir):
        d = os.path.join(rootdir, file)
        if os.path.isdir(d):
            direct_list.append(d)
            listdirs(d)
    return direct_list

def transferJSON(file, name):
    jsoncontent = json.dumps(file)
    jsonFile = open(name, "w")
    jsonFile.write(jsoncontent)
    

info_map = {}
text_list = []
protein_name = []
protein_link = []
line_count = []
newlist= listdirs(r'C:\Users\Administrator\Desktop\IMSP-Parser-master\IMSP-Parser-master\data\protein data\host protein')
folder = r'C:\Users\Administrator\Desktop\IMSP-Parser-master\IMSP-Parser-master\data\protein data\host protein'
sub_folders = [name for name in os.listdir(folder) if os.path.isdir(os.path.join(folder, name))]

for folder in newlist:
    for root, dirs, files in os.walk(folder):
        for file in files:
            if(file.endswith(".txt")):
                protein_data = os.path.join(root,file)
                text_list.append(protein_data)


datadicts = [{} for _ in range(len(text_list))]
datalist = [[] for _ in range(len(text_list))]

for i in range(len(sub_folders)):
    datadicts[i][sub_folders[i]] = []
    
for i in range(len(text_list)):
    with open(text_list[i], 'rt') as f:
        data = f.readlines()
    for line in data:
        if '>' in line:
            datalist[i].append(line)
            

for i in datalist:
    for j in i:
        result = j[j.find('[')+1:j.find(']')]
        protein_name.append(result)
        next_result = j[j.find('>')+1:j.find(' ')]
        protein_link.append(next_result)

        
for i in range(len(text_list)):
    count = countline(text_list[i])
    line_count.append(count)
    
for j in range(len(datadicts)):
    datadicts[j][sub_folders[j]] = [{} for _ in range(line_count[j])]
    
for j in range(len(datadicts)):
    for k in range(len(datadicts[j][sub_folders[j]])):
        datadicts[j][sub_folders[j]][k][protein_name[0]] = protein_link[0]
        protein_link.pop(0)
        protein_name.pop(0)

transferJSON(datadicts, "host.json")