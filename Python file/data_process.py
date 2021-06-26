import os
import json

# Separate the line from the data with useful information
# @para file that wish to check on
# @return the number of line that contains the useful information

def countline(file):
    with open(file, 'rt') as f:
        read = f.readlines()
    count = 0
    for line in read:
        if '>' in line:
            count+=1
    return count

# get a list of subdirectories of the rootdir
# @para dir the original directory
# @return a list that contains information of all subdirectories

def listdirs(rootdir):
    direct_list = []
    for file in os.listdir(rootdir):
        d = os.path.join(rootdir, file)
        if os.path.isdir(d):
            direct_list.append(d)
            listdirs(d)
    return direct_list

# Transfer the output to json
# @para file || text that wished to be output in the format of json
# @para name, the name of the json

def transferJSON(file, name):
    jsoncontent = json.dumps(file)
    jsonFile = open(name, "w")
    jsonFile.write(jsoncontent)
    
# process the data and output to a json format
# @para file, the root directory
# @para name, the final name of the output json

def datatransfer(file, name):
    text_list = []  
    protein_name = []       #the key of the dictionary later be used
    protein_link = []           #the value of the dictionary later be used
    line_count = []                #the number of useful lines in each txt file
    newlist= listdirs(file)             #execute listdirs function 
    sub_folders = [name for name in os.listdir(file) if os.path.isdir(os.path.join(file, name))]    #put sub directories in a list

    for folder in newlist:
        for root, dirs, files in os.walk(folder):
            for file in files:
                if(file.endswith(".txt")):
                    protein_data = os.path.join(root,file)
                    text_list.append(protein_data)          #append the name end with txt files to the text list


    datadicts = [{} for _ in range(len(text_list))]
    datalist = [[] for _ in range(len(text_list))]

    for i in range(len(sub_folders)):
        datadicts[i][sub_folders[i]] = []               #first establish dictionary that is "key" : [] 
        
    for i in range(len(text_list)):
        with open(text_list[i], 'rt') as f:
            data = f.readlines()
        for line in data:
            if '>' in line:
                datalist[i].append(line)                #append the line starts with ">" to the list
                

    for i in datalist:
        for j in i:
            result = j[j.find('[')+1:j.find(']')]               #get the name of the protein and append it to the list
            protein_name.append(result)
            next_result = j[j.find('>')+1:j.find(' ')]          #get the corresponding ID of the protein and append it to the list
            protein_link.append(next_result)

            
    for i in range(len(text_list)):
        count = countline(text_list[i])
        line_count.append(count)
        
    for j in range(len(datadicts)):
        datadicts[j][sub_folders[j]] = [{} for _ in range(line_count[j])]           #establish a number of dictionaries that are the same number as the data in linecount list
    #at this point the key of the dictionary is the name of the folder
        
    for j in range(len(datadicts)):
        for k in range(len(datadicts[j][sub_folders[j]])):
            datadicts[j][sub_folders[j]][k][protein_name[0]] = protein_link[0]
            protein_link.pop(0)                 #each time when the data is added to the dictionary, pop the element
            protein_name.pop(0)

    transferJSON(datadicts, name)
    
hostfile= r'C:\Users\Administrator\Desktop\IMSP-Parser-master\IMSP-Parser-master\data\protein data\host protein'
datatransfer(hostfile, "host.json")

virusfile= r'C:\Users\Administrator\Desktop\IMSP-Parser-master\IMSP-Parser-master\data\protein data\virus protein'
datatransfer(virusfile, "virus.json")