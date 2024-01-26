import pytest
import requests
import os
from database import Session, test_engine
from app import create_app, Business, Review, User, Like, app

@pytest.fixture()
def flask_app():
    myapp = create_app(testing=True)
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'

    yield myapp

def test_query_businesses(flask_app):
    with flask_app.test_client() as test_client:
        response = test_client.get('/api/queryBusinesses?prices=$')
        assert response.status_code == 200
        assert response.text == open('./test_res/test_query_businesses_2', 'r').read()

def test_post_review(flask_app):
    with flask_app.test_client() as test_client:
        review_data = {
            'body': 'I had such a great time at this test business!',
            'value': '4',
            'net_id': 'ktc28',
            'business_id': 13
        }

        response = test_client.post('/api/postReview', json=review_data)
        assert response.status_code == 200

        with flask_app.app_context():
            with Session(bind=test_engine) as session:
                business = session.query(Review).filter_by(body='I had such a great time at this test business!').first()
                assert business is not None

def test_post_user(flask_app):
    with flask_app.test_client() as test_client:
        user_data = {
            'net_id': 'test64',
            'likes': [],
            "reviews": []
        }

        response = test_client.post('/api/postUser', json=user_data)
        assert response.status_code == 200

        with flask_app.app_context():
            with Session(bind=test_engine) as session:
                business = session.query(User).filter_by(net_id='test64').first()
                assert business is not None

def test_post_like(flask_app):
    with flask_app.test_client() as test_client:
        like_data = {
            'user_netid': 'test64',
            'business_id': 13
        }

        response = test_client.post('/api/postLike', json=like_data)
        assert response.status_code == 200

        with flask_app.app_context():
            with Session(bind=test_engine) as session:
                business = session.query(Like).filter_by(user_netid='test64').first()
                print([x.user_netid for x in session.query(Like).all()])
                assert business is not None


def test_liked_business(flask_app):
    with flask_app.test_client() as test_client:
        like_data = {
            'user_netid': 'test64',
            'business_id': 13
        }

        response = test_client.post('/api/postLike', json=like_data)
        assert response.status_code == 200

        response2 = test_client.get('/api/likedBusinesses')
        with open('./test_res/test_likedbusinesses', 'w') as f:
            f.write(response2.text)

        with flask_app.app_context():
            with Session(bind=test_engine) as session:
                business = session.query(Like).filter_by(user_netid='test64').first()
                assert business is not None

def test_post_businesses(flask_app):
    with flask_app.test_client() as test_client:
        business_data = {
            'name': 'Test Business',
            'price': '$$',
            'type': 'restaurant',
            'address': '123 Test St',
            'lat': 40.7128,
            'long': -74.0060
        }

        response = test_client.post('/api/postBusiness', json=business_data)
        assert response.status_code == 200

        with flask_app.app_context():
            with Session(bind=test_engine) as session:
                business = session.query(Business).filter_by(name='Test Business').first()
                assert business is not None


def test_query_reviews(flask_app):
    with flask_app.test_client() as test_client:
        response = test_client.get('/api/queryReviews?businessid=1')
        response2 = test_client.get('/api/queryReviews')
        assert response.text == open('./test_res/test_query_reviews', 'r').read()
        assert response2.text == open('./test_res/test_query_reviews_2', 'r').read()

def test_userdata(flask_app):
    with flask_app.test_client() as test_client:
        response = test_client.get('/api/userData')
        other = open('./test_res/test_userdata', 'r').read()
        assert response.text[:1000] == other[:1000]

def test_likedbusinesses(flask_app):
    with flask_app.test_client() as test_client:
        response = test_client.get('/api/likedBusinesses')
        assert response.text == open('./test_res/test_likedbusinesses', 'r').read()

def test_afterlogin(flask_app):
    with app.test_client() as test_client:
        response = test_client.post('/after_login')
        assert response.status_code == 405 # redirect

def test_logout(flask_app):
    with app.test_client() as test_client:
        response = test_client.post('/logout')
        assert response.status_code == 200

