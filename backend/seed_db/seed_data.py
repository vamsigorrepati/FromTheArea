import json
import pickle

def read_data():
    with open('all.json') as json_f:
        data = json.load(json_f)
    return data

def remove_dups(data):
    no_dups = []
    seen = set()
    for datum in data:
        name = datum['title'] 
        if name not in seen:
            seen.add(name)
            del datum['link']
            no_dups.append(datum)
    return no_dups

def fix_types(data):
    types = ['restaurant', 'bar', 'cafe']
    for datum in data:
        datum['type'] = datum['main_category']
        del datum['main_category']
        while datum['type'] not in types:
            print(datum['type'], datum['title'], '              ', datum['address'])
            inputted_type = input('Enter the correct type [r/b/c/(rm)]: ')
            if inputted_type == 'rm':
                del datum
                break
            for ty in types:
                if inputted_type == ty[0]:
                    datum['type'] = ty
                    break
            else:
                print('try again')
    return data




"""
data = read_data()
no_dups = remove_dups(data)
fixed_types = fix_types(no_dups)
with open('cleaned.pickle','wb') as f:
    pickle.dump(fixed_types, f)
"""

with open('cleaned.pickle','rb') as f:
    data = pickle.load(f)

for i, datum in enumerate(data):
    if not datum['price']:
        print(datum)
        #datum['price'] = '$$'

#with open('cleaned.pickle','wb') as f:
#    pickle.dump(data, f)
