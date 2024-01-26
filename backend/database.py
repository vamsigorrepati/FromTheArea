from sqlalchemy import create_engine, Column, Integer, String, Float, ForeignKey, Boolean, cast, select
from sqlalchemy.orm import declarative_base, relationship, Session, column_property
from sqlalchemy.ext.hybrid import hybrid_property
import os
import yalies
import pickle
import flask
import json

if os.path.exists('secret.py'):
    import secret

engine = create_engine("sqlite:///main.db", future=True, echo=False)
test_engine = create_engine("sqlite:///test.db", future=True, echo=False)
Base = declarative_base()

YALIES_SECRET_KEY = os.environ.get('YALIES_SECRET_KEY')
if YALIES_SECRET_KEY:
    yalies_api = yalies.API(YALIES_SECRET_KEY)

ALL_PRICES = ('$', '$$', '$$$', '$$$$')
ALL_TYPES = ('Bar', 'Restaurant', 'Cafe')
ALL_RATINGS = tuple(map(str, range(1,6))) + (None,)

def lookup_person(netid, testing=False):
    if YALIES_SECRET_KEY and not testing:
        return yalies_api.people(filters={'netid':netid})[0]
    else:
        person = lambda x:x # dumb hack to create obj I can add arbitrary fields to
        person.first_name = 'John'
        person.email = 'john.doe@yale.edu'
        return person

def lookup_name(netid):
    return lookup_person(netid).first_name

def to_dict(inst, cls):
    convert = dict()
    d = dict()
    for c in cls.__table__.columns:
        v = getattr(inst, c.name)
        if c.type in convert.keys() and v is not None:
            try:
                d[c.name] = convert[c.type](v)
            except:
                d[c.name] = "Error:  Failed to convert using ", str(convert[c.type])
        elif v is None:
            d[c.name] = str()
        else:
            d[c.name] = v
    return d

class Like(Base):
    __tablename__ = "business_likes"

    id = Column(Integer, primary_key=True)
    user_netid = Column(String(10), ForeignKey('users.net_id'))
    user = relationship('User', back_populates='likes')
    business_id = Column(Integer, ForeignKey('businesses.id'))
    business = relationship('Business', back_populates="user_likes")

    @property
    def dict(self):
        return to_dict(self, self.__class__)

class Review(Base):
    __tablename__ = "business_reviews"

    id = Column(Integer, primary_key=True)
    body = Column(String(200), nullable=False)
    value = Column(Integer)
    user_netid = Column(String(10), ForeignKey('users.net_id'))
    user = relationship('User', back_populates="reviews")
    business_id = Column(Integer, ForeignKey('businesses.id'))
    business = relationship("Business", back_populates="user_reviews")
    
    @property
    def dict(self):
        return to_dict(self, self.__class__)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    net_id = Column(String(10))
    likes = relationship('Like', back_populates='user')
    reviews = relationship('Review', back_populates='user')

    def dict(self, testing=False):
        user_dict = to_dict(self, self.__class__)
        reviews_dict = {'reviews':
                      [{'user_netid': r.user_netid,
                       'business_id': r.business_id,
                       'body': r.body,
                       'value': r.value,
                       } for r in self.reviews]}
        likes_dict = {'likes': 
                      [{'user_netid': l.user_netid,
                       'business_id': l.business_id,
                       } for l in self.likes]
                      }
        user_dict.update(reviews_dict)
        user_dict.update(likes_dict)
        person = lookup_person(self.net_id, testing)
        user_dict.update({'email' : person.email, 'name' : person.first_name})
        return user_dict

class Business(Base):
    __tablename__ = "businesses"

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    address = Column(String(100), nullable=False)
    lat = Column(Float, nullable=False)
    long = Column(Float, nullable=False)
    price = Column(String(100), nullable=False)
    image = Column(String(100), nullable=True)
    typ = Column(Integer)
    avg = Column(Float, nullable=True)
    rounded_avg_str = Column(String(10), nullable=True)
    phone_number = Column(String(20), nullable=True)
    website_url = Column(String(100), nullable=True)
    is_happy_hour = Column(Boolean, unique=False, default=False)
    user_likes = relationship('Like',  back_populates='business')
    user_reviews = relationship("Review", back_populates='business')

    @property
    def dict(self):
        return to_dict(self, self.__class__)

class ProfileMetric(Base):
    __tablename__ = "profilemetric"

    name = Column(String(10), primary_key=True)
    num_visits = Column(Integer)
    num_clicks = Column(Integer)

    @property
    def dict(self):
        return to_dict(self, self.__class__)

# Used for database generation
Base.metadata.create_all(engine)

if __name__ == '__main__':
    app = flask.Flask(__name__)

    with app.app_context():
            with Session(bind=engine) as session:
                r = session.query(Business).filter_by(price='$').all()
                result = [x.dict for x in r]
                result = [dict(sorted(x.dict.items())) for x in r]

