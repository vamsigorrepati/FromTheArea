# FromTheArea
CPSC 439/539 (Software Engineering) project with Kenan Collignon, Ethan Dong, Evan Gerritz, Vamsi Gorrepati, Claire Kang, Ashley Tauhert, and William Zhu

## Deployment Milestone

Our frontend is hosted on (https://fromthearea.vercel.app/, and it obtains data from a backend hosted at https://fromthearea-backend-e73b06909d2b.herokuapp.com.)

## Testing

To run frontend tests, move to the 'frontend' directory, and run the command `npm run test:coverage`
The results from our testing coverage milestone on 11/17 are below:

![Frontend Coverage](.screenshots/frontend_coverage.png?raw=true)

To run backend tests, move to the 'backend' directory, and run the command `pytest -- cov`
The results from our testing coverage milestone on 11/17 are below: 

![Backend Coverage](.screenshots/backend_coverage.png?raw=true)

### Writing your own unit test for Assignment 4 (Code Reviews)
To add a unit test called `X`, add the following snippet to `test_app.py`
```
def test_X(flask_app):
    with flask_app.test_client() as test_client:
        # TODO: your unit test here
        # e.g.: to test a get on an API endpoint:
        #     test_client.get('/api/ENDPOINT_URL?PARAMS')
        # or for a post
        #     test_client.post('/api/ENDPOINT_URL', json=DATA_DICTIONARY)
        # followed by assert SOME_CONDITION
        pass
```

## Metrics Milestone

In 'frontend/src/components/Profile/ProfileButton.js' we have implemented three different versions of the profile button with different colors. When the profile button is rendered on the index.js page, a random color is selected and displayed, and when the button is clicked, a variable in the backend is updated to count how many times each version of the button is clicked. The different versions of the button are in the frontend styles folder, and the backend function is in app.py.


## Installation and Building

### Backend

###### Backend commands:
Move to the 'backend' directory, and run the command `pip install -r requirements.txt` (doing so in a virtual environment is strongly recommended)
- To start the backend server.
    - `flask run`
- To run with debugging enabled.
    - `flask run -debug`
- To get the frontend to communicate with the local backend instead of the hosted backend, two files must have the following lines commented and uncommented:
    1. Contents of `backend/app.py:after_login`:
    ```
    with Session(bind=engine) as s:
        net_id = session.get(cas_username_session_key)
        result = s.query(User).filter(User.net_id == net_id).first()
        username = net_id
        if not result or True:
            _id = s.query(User).count() + 1
            u = User(id=_id, net_id=net_id, likes=[], reviews=[])
            s.add(u)
            s.commit()
        return redirect('http://localhost:3000')
        #return redirect('https://fromthearea.vercel.app/')
    ```

    2. Contents of `frontend/next.config.js`:
    ```
    // local backend
    const base = "http://127.0.0.1:5000";
    // hosted backend
    //const base = "https://fromthearea-backend-e73b06909d2b.herokuapp.com";
    ```

### Frontend

You will need Node.js version 18 or higher. You can install it [here](https://nodejs.org/en/).
Then, from within the `frontend` directory, run `npm install .` to download the required packages.

###### Frontend commands:
- To start the development server (runs on [http://localhost:3000](http://localhost:3000), has Fast Refresh enabled).
    - `npm run dev`
- To build the app for production.
   - `npm run build`
- To run the built app in production mode.
    - `npm start`
