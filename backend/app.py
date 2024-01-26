import flask
from flask import session, jsonify, make_response, request, redirect, make_response
from flask_cas import CAS, login, logout, login_required
from flask_restful import reqparse, Api, Resource
from database import User, Business, Like, Review, engine, Session, ProfileMetric,\
    ALL_PRICES, ALL_TYPES, ALL_RATINGS
import os
from sqlalchemy import or_, desc, func
import yalies
from flask_cors import CORS
from math import radians, sin, cos, sqrt, atan2, ceil

# create the API
parser = reqparse.RequestParser()
parser.add_argument('task')

def parse_list_arg(arg_keyword, default):
    res = flask.request.args.get(arg_keyword)
    res = res.split(',') if res else default
    return res

def get_netid():
    if not app.config['TESTING']:
        if username and username not in seen_usernames:
            seen_usernames.add(username)
            session[cas_username_session_key] = username
        net_id = session.get(cas_username_session_key)
        return net_id
    else:
        return 'ded42'


def distance_to_business(business, user_lat, user_long, miles=False):
    def spherical_coords_to_miles(business_lat, user_lat, business_lon, user_lon):
        earth_radius = 3958.8

        business_lat_rad = radians(business_lat)
        business_lon_rad = radians(business_lon)
        user_lat_rad = radians(user_lat)
        user_lon_rad = radians(user_lon)

        d_lat = user_lat_rad - business_lat_rad
        d_lon = user_lon_rad - business_lon_rad

        # Haversine formula
        a = sin(d_lat / 2)**2 + cos(business_lat_rad) * cos(user_lat_rad) \
            * sin(d_lon / 2)**2
        c = 2 * atan2(sqrt(a), sqrt(1 - a))

        return earth_radius * c

    if miles:
        return spherical_coords_to_miles(business.lat, user_lat,
                                  business.long, user_long)
    else:
        return (business.lat - user_lat)**2 \
                 + (business.long - user_long)**2

class QueryBusinesses(Resource):
    def get(self):
        net_id = get_netid()
        prices = parse_list_arg('prices', ['$', '$$', '$$$', '$$$$'])
        types = parse_list_arg('types', ['restaurant', 'bar'])

        ratings = parse_list_arg('ratings', ALL_RATINGS)
        ratings_filter = Business.rounded_avg_str.in_(ratings)

        # When no ratings are selected
        if None in ratings:
            ratings_filter = or_(Business.rounded_avg_str == None, ratings_filter)

        favorites = flask.request.args.get('favorites', 'false')
        if favorites == 'false':
            favorites = False
        elif favorites == 'true':
            favorites = True

        user_lat = float(flask.request.args.get('latitude', 41.31))
        user_long = float(flask.request.args.get('longitude', -72.93))

        with Session(bind=engine) as s:
            result = s.query(Business) \
                .filter(Business.price.in_(prices)) \
                .filter(Business.typ.in_(types)) \
                .filter(ratings_filter) \
                .filter(Business.user_likes.any(user_netid=net_id) if favorites else Business.id.isnot(None))

            for x in result:
                _sum = 0
                _count = len(x.user_reviews)
                for u in x.user_reviews:
                    _sum += u.value
                try:
                    _avg = _sum/_count
                    x.avg = _avg
                    x.rounded_avg_str = str(ceil(_avg))
                except ZeroDivisionError:
                    pass
            s.commit()

            sort_style = flask.request.args.get('sortstyle', 'Rating')
            if (sort_style == "Rating"):
                result = result.order_by(desc(Business.avg))
            elif (sort_style == "PriceAsc"):
                result = result.order_by(Business.price)
            elif (sort_style == "PriceDesc"):
                result = result.order_by(desc(Business.price))

            result = result.all()

            if (sort_style == "Distance"):
                result.sort(key=lambda b: distance_to_business(b, user_lat, user_long))

            result_dicts = [x.dict for x in result]
            for business, resdict in zip(result, result_dicts):
                resdict['distance'] = distance_to_business(business, user_lat,
                                                           user_long, miles=True)
            response = jsonify(result_dicts)
            response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000') 
            return response

class PostBusiness(Resource):
    def post(self):
        with Session(bind=engine) as s:
            data = flask.request.json
            max_id = s.query(func.max(Business.id)).scalar()
            _id = max_id + 1 if max_id is not None else 1
            business = Business(id=_id, name=data['name'], price=data['price'], typ=data['type'], address=data['address'], lat=data['lat'], long=data['long'])
            s.add(business)
            s.commit()
            return

class PostReview(Resource):
    def post(self):
        net_id = get_netid()
        with Session(bind=engine) as s:
            data = flask.request.json
            max_id = s.query(func.max(Review.id)).scalar()
            _id = max_id + 1 if max_id is not None else 1
            r = Review(id=_id, body=data['body'], value=data['value'], user_netid=net_id, business_id=data['business_id'])
            s.add(r)
            s.commit()
            return

class PostUser(Resource):
    def post(self):
        net_id = get_netid()
        with Session(bind=engine) as s:
            data = flask.request.json
            max_id = s.query(func.max(User.id)).scalar()
            _id = max_id + 1 if max_id is not None else 1
            u = User(id=_id, net_id=net_id, likes=data['likes'], reviews=data['reviews'])
            s.add(u)
            s.commit()
            return

class PostFriend(Resource):
    def post(self):
        with Session(bind=engine) as s:
            data = flask.request.json
            net_id = get_netid()
            user = s.query(User).filter_by(net_id=net_id)
            if user and data:
                user.friends.append(data['friend_net_id'])
                s.commit()

class PostLike(Resource):
    def post(self):
        with Session(bind=engine) as s:
            data = flask.request.json
            max_id = s.query(func.max(Like.id)).scalar()
            _id = max_id + 1 if max_id is not None else 1
            net_id = get_netid()
            l = Like(id=_id, user_netid=net_id, business_id=data['business_id'])
            s.add(l)
            s.commit()
            return
        
    def delete(self):
        with Session(bind=engine) as s:
            data = flask.request.json
            net_id = get_netid()
            like_to_delete = s.query(Like).filter_by(user_netid=net_id, business_id=data['business_id']).first()
            if like_to_delete:
                s.delete(like_to_delete)
                s.commit()
                return {'message': 'Like deleted successfully'}, 200
            else:
                return {'message': 'Like not found'}, 404


class UserData(Resource):
    def get(self):
        net_id = get_netid()

        if not net_id:
            return {"error": "Unauthorized"}, 401

        with Session(bind=engine) as s:
            user = s.query(User).filter(User.net_id == net_id).first()
            response = jsonify(user.dict(app.config['TESTING']))
            response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000') 
            return response

class QueryReviews(Resource):
    def get(self):
        business_id = flask.request.args.get('businessid', None)
        if business_id is None:
            return
        business_id = int(business_id)
        with Session(bind=engine) as s:
            result = s.query(Review) \
                .filter(Review.business_id == business_id)
            response = jsonify([x.dict for x in result])
            response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000') 
            return response

class LikedBusinesses(Resource):
    def get(self):
        net_id = get_netid()
        with Session(bind=engine) as s:
            user = s.query(User).filter(User.net_id == net_id).first()
            response = jsonify([x.dict for x in user.likes])
            response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
            return response


class Metrics(Resource):
    def post(self):
        with Session(bind=engine) as s:
            data = flask.request.json
            profile = data.get("profile")
            click_or_visit = data.get("type")
            p = s.query(ProfileMetric).filter(ProfileMetric.name == profile).first()
            if p:
                if click_or_visit == 'click':
                    p.num_clicks += 1
                    message = {'message': 'Click counted successfully'}, 
                elif click_or_visit == 'visit':
                    p.num_visits += 1
                    message = {'message': 'Visit counted successfully'}, 
                status = 200
                s.commit()
            elif profile in ('profile1', 'profile2', 'profile3'):
                prof_metric = ProfileMetric( name=profile, num_clicks=0, num_visits=1)
                s.add(prof_metric)
                s.commit()
                message = {'message': 'Added new profile metric'}
                status = 200
            else:
                message = {'message': 'Invalid value received'}
                status = 400
            response = make_response(jsonify(message, status), status)
            response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000') 
            return response

    def get(self):
        with Session(bind=engine) as s:
            response = jsonify([m.dict for m in s.query(ProfileMetric).all()])
            response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000') 
            return response

def create_app(testing=False):
    app = flask.Flask(__name__)
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY') or 'dev_key'

    #flag for test_app know where to get user information
    app.config['TESTING'] = testing

    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///main.db'

    app.config['CAS_SERVER'] = 'https://secure.its.yale.edu'
    app.config['CAS_AFTER_LOGIN'] = 'after_login'
    app.config['CAS_LOGIN_ROUTE'] = '/cas/login'

    # api setup
    api = Api(app)
    api.add_resource(QueryBusinesses, '/api/queryBusinesses')
    api.add_resource(LikedBusinesses, '/api/likedBusinesses')
    api.add_resource(PostBusiness, '/api/postBusiness')
    api.add_resource(PostReview, '/api/postReview')
    api.add_resource(PostUser, '/api/postUser')
    api.add_resource(PostFriend, '/api/postFriend')
    api.add_resource(PostLike, '/api/postLike')
    api.add_resource(UserData, '/api/userData')
    api.add_resource(QueryReviews, '/api/queryReviews')
    api.add_resource(Metrics, '/api/metrics')

    return app

app = create_app()
cas = CAS(app)
CORS(app, supports_credentials=True, origin="http://127.0.0.1:3000")

cas_username_session_key = app.config['CAS_USERNAME_SESSION_KEY']

username = None
seen_usernames = set()

@app.route('/')
def home():
    return "Welcome to our Backend! It's a little lonely here.."

@app.route("/after_login")
def after_login():
    global username
    global seen_usernames
    with Session(bind=engine) as s:
        net_id = session.get(cas_username_session_key)
        result = s.query(User).filter(User.net_id == net_id).first()
        username = net_id
        if not result or True:
            _id = s.query(User).count() + 1
            u = User(id=_id, net_id=net_id, likes=[], reviews=[])
            s.add(u)
            s.commit()
        # return redirect('http://localhost:3000')
        return redirect('https://fromthearea.vercel.app/')

@app.route("/logout", methods=["POST"])
def logout_user():

    cas_username_session_key = app.config['CAS_USERNAME_SESSION_KEY']
    cas_attributes_session_key = app.config['CAS_ATTRIBUTES_SESSION_KEY']

    if cas_username_session_key in session:
        del session[cas_username_session_key]

    if cas_attributes_session_key in session:
        del session[cas_attributes_session_key]

    return jsonify({"message": "Logged out successfully"}), 200

if __name__ == '__main__':
    app.run(debug=True)
