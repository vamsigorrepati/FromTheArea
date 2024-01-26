import pickle
from database import Business, seed_businesses

def new_seed():
    with open('seed_db/cleaned.pickle', 'rb') as f:
        data = pickle.load(f)
    def clean_address(name, addr):
        if addr.startswith(name):
            return addr[len(name)+2:]
        else:
            return addr
    businesses = [Business(id=i, name=x['title'],
                           price=x['price'],
                           typ=x['type'],
                           address=clean_address(x['title'], x['address']),
                           lat=x['lat'],
                           long=x['longitude'],
                           phone_number=x['phone_link'],
                           website_url=x['website'])
                      for i, x in enumerate(data)]
    return businesses 

seed_businesses(new_seed())
